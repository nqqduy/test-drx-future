import { Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { InstrumentEntity } from 'src/models/entities/instrument.entity';
import { OrderEntity } from 'src/models/entities/order.entity';
import { PositionEntity } from 'src/models/entities/position.entity';
import { TradeEntity } from 'src/models/entities/trade.entity';
import { TransactionEntity } from 'src/models/entities/transaction.entity';
import { MailService } from 'src/modules/mail/mail.service';
import { convertDateFields } from 'src/modules/matching-engine/helper';
import {
  CommandCode,
  CommandOutput,
  LANGUAGE,
  Notification,
  NotificationEvent,
  NotificationType,
  NOTIFICATION_MESSAGE,
  NOTIFICATION_TYPE,
} from 'src/modules/matching-engine/matching-engine.const';
import { NotificationErrorCode, OrderNote, OrderStatus, OrderTimeInForce, TpSlType } from 'src/shares/enums/order.enum';
import { TransactionStatus, TransactionType } from 'src/shares/enums/transaction.enum';
import { formatOrderEnum, formatPrice, formatQuantity, formatUSDAmount } from 'src/shares/number-formatter';
import { UserService } from '../user/users.service';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // replace escaped line breaks
};
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

interface Map<T> {
  [key: string]: T;
}

@Injectable()
export class NotificationService {
  constructor(private readonly mailService: MailService, private readonly userService: UserService) {}

  async createNotifications(command: CommandOutput, instruments: Map<InstrumentEntity>): Promise<Notification[]> {
    if (command.code === CommandCode.PLACE_ORDER || command.code === CommandCode.TRIGGER_ORDER) {
      return this.createPlaceOrderNotification(command, instruments);
    } else if (command.code === CommandCode.CANCEL_ORDER) {
      return [this.createCancelOrderNotification(command, instruments)];
    } else if (command.code === CommandCode.LIQUIDATE) {
      return this.createLiquidationNotifications(command, instruments);
    } else if (command.code === CommandCode.WITHDRAW) {
      const notification = this.createWithdrawalNotification(command);
      return notification ? [notification] : [];
    } else if (command.code === CommandCode.DEPOSIT) {
      const notification = this.createDepositNotification(command);
      return notification ? [notification] : [];
    } else if (command.code === CommandCode.ADJUST_MARGIN_POSITION) {
    }
    return [];
  }

  createPlaceOrderNotification(command: CommandOutput, instruments: Map<InstrumentEntity>): Notification[] {
    const notifications = [];
    const order = convertDateFields(new OrderEntity(), command.data);
    const instrument = instruments[order.symbol];
    if (!instrument) {
      console.log('Error save order: ', order);
      return;
    }
    const quantityString = formatQuantity(order.quantity, instrument);
    const typeString = formatOrderEnum(order.tpSLType || order.type);
    console.log('Check order: ____ ', order);
    console.log('Check instrument: ___ ', instrument);
    const isStopOrder = order.status === OrderStatus.UNTRIGGERED;
    const isFilled = new BigNumber(order.remaining).lt(order.quantity);
    if (command.code === CommandCode.PLACE_ORDER) {
      if (command.errors.length === 0 && (order.timeInForce !== OrderTimeInForce.IOC || isFilled || isStopOrder)) {
        notifications.push({
          event: NotificationEvent.OrderPlaced,
          type: NotificationType.success,
          userId: order.userId,
          title: `Order placed successfully.`,
          message: `Amount: ${quantityString} ${instrument.rootSymbol}\nType: ${typeString}`,
        });
      }
      if (command.errors.length > 0 && command.errors[0].code == NotificationErrorCode.E001) {
        notifications.push({
          event: NotificationEvent.OrderCanceled,
          type: NotificationType.error,
          userId: command.errors[0].userId,
          title: command.errors[0].code,
          message: command.errors[0].messages,
          side: order.side,
          code: command.errors[0].code,
          contractType: order.contractType,
        });
      }
    } else if (command.code === CommandCode.TRIGGER_ORDER) {
      notifications.push({
        event: NotificationEvent.OrderTriggered,
        type: NotificationType.success,
        userId: order.userId,
        title: `Order triggered.`,
        message: `Amount: ${quantityString} ${instrument.rootSymbol}\nType: ${typeString}`,
      });
      this.mailService.sendMailWhenTpSlOrderTriggered(command);
      const conditionSendNotiTrigger =
        order.isTriggered &&
        (order.tpSLType == TpSlType.TAKE_PROFIT_MARKET ||
          (order.tpSLType == TpSlType.STOP_MARKET &&
            (order.isClosePositionOrder == true || order.isTpSlOrder == true)));
      if (conditionSendNotiTrigger) {
        this.genDataNotificationFirebase(NOTIFICATION_TYPE.TP_SL_ORDER_TRIGGER, order.userId);
      }
    }

    if (command.errors.length === 0) {
      notifications.push(...this.createOrderMatchedNotifications(command, instrument));
    }

    for (const element of command.orders) {
      const order = (element as unknown) as OrderEntity;
      const isOrderClosed = [OrderStatus.FILLED, OrderStatus.CANCELED].includes(order.status);
      if (new BigNumber(order.remaining).gt(0) && isOrderClosed) {
        if (!isStopOrder && order.timeInForce === OrderTimeInForce.IOC) {
          const remainingString = formatQuantity(order.remaining, instrument);
          notifications.push({
            event: NotificationEvent.OrderCanceled,
            type: NotificationType.error,
            userId: order.userId,
            title: `Remaining IOC order canceled!`,
            message: `Amount unmatched: ${remainingString} ${instrument.rootSymbol}`,
            orderType: order.type,
            tpSlType: order.tpSLType,
            isHidden: order.isHidden,
            side: order.side,
            remaining: order.remaining,
            quantity: order.quantity,
            status: order.status,
            contractType: order.contractType,
            code: command.errors[0]?.code == NotificationErrorCode.E001 ? NotificationErrorCode.E001 : null,
          });
        }
      } else if (order.note === OrderNote.REDUCE_ONLY_CANCELED) {
        notifications.push({
          event: NotificationEvent.OrderCanceled,
          type: NotificationType.error,
          userId: order.userId,
          title: `Order canceled!`,
          message: `Reduce-Only order does not reduce size of the position`,
          orderType: order.type,
          tpSlType: order.tpSLType,
          isHidden: order.isHidden,
          side: order.side,
          contractType: order.contractType,
          code: command.errors[0]?.code == NotificationErrorCode.E001 ? NotificationErrorCode.E001 : null,
        });
      } else if (order.status === OrderStatus.CANCELED && order.id !== command.data.id) {
        notifications.push({
          event: NotificationEvent.OrderCanceled,
          type: NotificationType.error,
          userId: order.userId,
          title: `Order canceled!`,
          message: `Order canceled by system`,
          orderType: order.type,
          tpSlType: order.tpSLType,
          isHidden: order.isHidden,
          side: order.side,
          contractType: order.contractType,
          code: command.errors[0]?.code == NotificationErrorCode.E001 ? NotificationErrorCode.E001 : null,
        });
      }
    }

    return notifications;
  }

  createOrderMatchedNotifications(command: CommandOutput, instrument: InstrumentEntity): Notification[] {
    const notifications = [];
    const order = convertDateFields(new OrderEntity(), command.data);

    let filledAmount = '0';
    let filledTotal = '0';
    for (const item of command.trades) {
      const trade = (item as unknown) as TradeEntity;
      filledAmount = new BigNumber(filledAmount).plus(trade.quantity).toString();
      filledTotal = new BigNumber(trade.quantity).times(trade.price).plus(filledTotal).toString();

      const tradeQuantity = formatQuantity(trade.quantity, instrument);
      const tradePrice = formatPrice(trade.price, instrument);
      notifications.push({
        event: NotificationEvent.OrderMatched,
        type: NotificationType.success,
        userId: trade.buyerIsTaker ? trade.sellUserId : trade.buyUserId,
        title: `Order matched.`,
        message: `Amount: ${tradeQuantity} ${instrument.rootSymbol}\nAverage price: ${tradePrice}`,
      });
    }
    if (new BigNumber(filledAmount).gt(0)) {
      const tradeQuantity = formatQuantity(filledAmount, instrument);
      const tradePrice = formatPrice(new BigNumber(filledTotal).div(filledAmount).toString(), instrument);
      notifications.push({
        event: NotificationEvent.OrderMatched,
        type: NotificationType.success,
        userId: order.userId,
        title: `Order matched.`,
        message: `Amount: ${tradeQuantity} ${instrument.rootSymbol}\nAverage price: ${tradePrice}`,
      });
    }

    return notifications;
  }

  createCancelOrderNotification(command: CommandOutput, instruments: Map<InstrumentEntity>): Notification {
    const order = convertDateFields(new OrderEntity(), command.data);
    const instrument = instruments[order.symbol];
    if (!instrument) {
      console.log('Error cancelled order: ', order);
      return;
    }
    const quantityString = formatQuantity(order.quantity, instrument);
    const typeString = formatOrderEnum(order.tpSLType || order.type);

    if (command.errors.length > 0) {
      const error = command.errors[0].name as string;
      const errorMessages = {
        InsufficientBalanceException: 'Insufficient available balance',
        InsufficientQuantityException: 'FOK order is not matched completely',
        CrossLiquidationPriceException: 'Order price crosses liquidation price',
        CrossBankruptPriceException: 'Order price crosses bankrupt price',
        ExceedRiskLimitException: 'Resulting position size is higher than the current risk limit',
        ReduceOnlyException: 'Reduce-Only order does not reduce size of the position',
        PostOnlyOrderException: 'Post-Only order is matched with available orders',
        LockPriceException: 'The Order Book has no order on the opposite side',
      };
      return {
        event: NotificationEvent.OrderCanceled,
        type: NotificationType.error,
        userId: order.userId,
        title: `Order canceled!`,
        message: errorMessages[error],
        code: `${command.errors[0].code}`,
        orderType: order.type,
        tpSlType: order.tpSLType,
        isHidden: order.isHidden,
        side: order.side,
        status: order.status,
        remaining: order.remaining,
        quantity: order.quantity,
        contractType: order.contractType,
      };
    }
    return {
      event: NotificationEvent.OrderCanceled,
      type: NotificationType.error,
      userId: order.userId,
      title: `Order canceled!`,
      message: `Amount: ${quantityString} ${instrument.rootSymbol}\nType: ${typeString}`,
      orderType: order.type,
      tpSlType: order.tpSLType,
      isHidden: order.isHidden,
      side: order.side,
      status: order.status,
      remaining: order.remaining,
      quantity: order.quantity,
      contractType: order.contractType,
    };
  }

  createLiquidationNotifications(command: CommandOutput, instruments: Map<InstrumentEntity>): Notification[] {
    const notifications = [];
    const liquidatedPositions = command.liquidatedPositions;
    for (const item of liquidatedPositions) {
      const position = convertDateFields(new PositionEntity(), item);
      const instrument = instruments[position.symbol];
      if (!instrument) {
        console.log('Error create liquidation noti: ', item);
        return;
      }
      const positionDirection = new BigNumber(position.currentQty).gt(0) ? 'Long' : 'Short';
      const sizeString = formatQuantity(position.currentQty, instrument);
      notifications.push({
        event: NotificationEvent.PositionLiquidated,
        type: NotificationType.error,
        userId: position.userId,
        title: `Position liquidated!`,
        message: `Size: ${positionDirection} ${sizeString} ${instrument.rootSymbol}`,
      });

      for (const order of command.orders) {
        // ((order.tpSLType == TpSlType.STOP_MARKET && order.isTpSlOrder == true) ||
        //   order.tpSLType == TpSlType.TAKE_PROFIT_MARKET)
        if (order.status === OrderStatus.CANCELED) {
          notifications.push({
            event: NotificationEvent.OrderCanceled,
            type: NotificationType.error,
            userId: order.userId,
            title: `Order canceled!`,
            message: `Cancel order TpSl of position was liquidated`,
            orderType: order.type,
            tpSlType: order.tpSLType,
            isHidden: order.isHidden,
            side: order.side,
            status: order.status,
            remaining: order.remaining,
            quantity: order.quantity,
            contractType: order.contractType,
          });
        }
      }
      // this.mailService
      //   .sendLiquidationCall({
      //     userId: position.userId,
      //     market: instrument.symbol.split('USD')[0] + ' - USD',
      //     side: positionDirection,
      //     size: sizeString,
      //   })
      //   .then()
      //   .catch();
    }
    return notifications;
  }

  createWithdrawalNotification(command: CommandOutput): Notification {
    try {
      if (command.transactions.length > 0) {
        const transaction = (command.transactions[0] as unknown) as TransactionEntity;

        if (transaction.status === TransactionStatus.APPROVED) {
          const amountString = formatUSDAmount(transaction.amount);

          return {
            event: NotificationEvent.WithdrawSubmitted,
            type: NotificationType.success,
            userId: transaction.userId,
            title: `Withdrawal request submitted.`,
            message: `Amount: ${amountString} USDC`,
            amount: transaction.amount,
            asset: transaction.asset,
          };
        } else {
          return {
            event: NotificationEvent.WithdrawUnsuccessfully,
            type: NotificationType.error,
            userId: transaction.userId,
            title: `Withdraw unsuccessfully!`,
            message: `Insufficient available balance`,
            amount: transaction.amount,
            asset: transaction.asset,
          };
        }
      }
    } catch (error) {
      console.log('error notify transfer', error);
    }
  }

  createDepositNotification(command: CommandOutput): Notification {
    if (command.transactions.length > 0) {
      const transaction = (command.transactions[0] as unknown) as TransactionEntity;
      const typeArray = [TransactionType.REWARD, TransactionType.REFERRAL] as string[];
      if (!typeArray.includes(transaction.type)) {
        const amountString = formatUSDAmount(transaction.amount);
        return {
          event: NotificationEvent.DepositSuccessfully,
          type: NotificationType.success,
          userId: transaction.userId,
          title: `Deposit successfully.`,
          message: `Amount: ${amountString} USDC`,
          amount: transaction.amount,
        };
      }
    }
  }
  async genDataNotificationFirebase(type: NOTIFICATION_TYPE, toUserId: number) {
    const user = await this.userService.findUserById(toUserId);
    if (!user || !user?.notification_token) {
      return;
    }
    let title = '';
    switch (user.location) {
      case LANGUAGE.KOREAN.toLowerCase():
        title = NOTIFICATION_MESSAGE.get(`${type}_${LANGUAGE.KOREAN}`);
        break;
      case LANGUAGE.VIETNAMESE.toLowerCase():
        title = NOTIFICATION_MESSAGE.get(`${type}_${LANGUAGE.VIETNAMESE}`);
        break;
      default:
        title = NOTIFICATION_MESSAGE.get(`${type}_${LANGUAGE.ENGLISH}`);
        break;
    }
    return await admin.messaging().sendToDevice(user.notification_token, {
      data: {
        userId: user.id ? String(user.id) : '',
        type: type,
        detail: title,
      },
      notification: {
        title: title,
      },
    });
  }
}
