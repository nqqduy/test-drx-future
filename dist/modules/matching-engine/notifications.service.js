"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const bignumber_js_1 = require("bignumber.js");
const instrument_entity_1 = require("../../models/entities/instrument.entity");
const order_entity_1 = require("../../models/entities/order.entity");
const position_entity_1 = require("../../models/entities/position.entity");
const trade_entity_1 = require("../../models/entities/trade.entity");
const transaction_entity_1 = require("../../models/entities/transaction.entity");
const mail_service_1 = require("../mail/mail.service");
const helper_1 = require("./helper");
const matching_engine_const_1 = require("./matching-engine.const");
const order_enum_1 = require("../../shares/enums/order.enum");
const transaction_enum_1 = require("../../shares/enums/transaction.enum");
const number_formatter_1 = require("../../shares/number-formatter");
const users_service_1 = require("../user/users.service");
const admin = require("firebase-admin");
const dotenv = require("dotenv");
dotenv.config();
const firebaseConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};
admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
});
let NotificationService = class NotificationService {
    constructor(mailService, userService) {
        this.mailService = mailService;
        this.userService = userService;
    }
    async createNotifications(command, instruments) {
        if (command.code === matching_engine_const_1.CommandCode.PLACE_ORDER || command.code === matching_engine_const_1.CommandCode.TRIGGER_ORDER) {
            return this.createPlaceOrderNotification(command, instruments);
        }
        else if (command.code === matching_engine_const_1.CommandCode.CANCEL_ORDER) {
            return [this.createCancelOrderNotification(command, instruments)];
        }
        else if (command.code === matching_engine_const_1.CommandCode.LIQUIDATE) {
            return this.createLiquidationNotifications(command, instruments);
        }
        else if (command.code === matching_engine_const_1.CommandCode.WITHDRAW) {
            const notification = this.createWithdrawalNotification(command);
            return notification ? [notification] : [];
        }
        else if (command.code === matching_engine_const_1.CommandCode.DEPOSIT) {
            const notification = this.createDepositNotification(command);
            return notification ? [notification] : [];
        }
        else if (command.code === matching_engine_const_1.CommandCode.ADJUST_MARGIN_POSITION) {
        }
        return [];
    }
    createPlaceOrderNotification(command, instruments) {
        var _a, _b, _c;
        const notifications = [];
        const order = helper_1.convertDateFields(new order_entity_1.OrderEntity(), command.data);
        const instrument = instruments[order.symbol];
        if (!instrument) {
            console.log('Error save order: ', order);
            return;
        }
        const quantityString = number_formatter_1.formatQuantity(order.quantity, instrument);
        const typeString = number_formatter_1.formatOrderEnum(order.tpSLType || order.type);
        console.log('Check order: ____ ', order);
        console.log('Check instrument: ___ ', instrument);
        const isStopOrder = order.status === order_enum_1.OrderStatus.UNTRIGGERED;
        const isFilled = new bignumber_js_1.default(order.remaining).lt(order.quantity);
        if (command.code === matching_engine_const_1.CommandCode.PLACE_ORDER) {
            if (command.errors.length === 0 && (order.timeInForce !== order_enum_1.OrderTimeInForce.IOC || isFilled || isStopOrder)) {
                notifications.push({
                    event: matching_engine_const_1.NotificationEvent.OrderPlaced,
                    type: matching_engine_const_1.NotificationType.success,
                    userId: order.userId,
                    title: `Order placed successfully.`,
                    message: `Amount: ${quantityString} ${instrument.rootSymbol}\nType: ${typeString}`,
                });
            }
            if (command.errors.length > 0 && command.errors[0].code == order_enum_1.NotificationErrorCode.E001) {
                notifications.push({
                    event: matching_engine_const_1.NotificationEvent.OrderCanceled,
                    type: matching_engine_const_1.NotificationType.error,
                    userId: command.errors[0].userId,
                    title: command.errors[0].code,
                    message: command.errors[0].messages,
                    side: order.side,
                    code: command.errors[0].code,
                    contractType: order.contractType,
                });
            }
        }
        else if (command.code === matching_engine_const_1.CommandCode.TRIGGER_ORDER) {
            notifications.push({
                event: matching_engine_const_1.NotificationEvent.OrderTriggered,
                type: matching_engine_const_1.NotificationType.success,
                userId: order.userId,
                title: `Order triggered.`,
                message: `Amount: ${quantityString} ${instrument.rootSymbol}\nType: ${typeString}`,
            });
            this.mailService.sendMailWhenTpSlOrderTriggered(command);
            const conditionSendNotiTrigger = order.isTriggered &&
                (order.tpSLType == order_enum_1.TpSlType.TAKE_PROFIT_MARKET ||
                    (order.tpSLType == order_enum_1.TpSlType.STOP_MARKET &&
                        (order.isClosePositionOrder == true || order.isTpSlOrder == true)));
            if (conditionSendNotiTrigger) {
                this.genDataNotificationFirebase(matching_engine_const_1.NOTIFICATION_TYPE.TP_SL_ORDER_TRIGGER, order.userId);
            }
        }
        if (command.errors.length === 0) {
            notifications.push(...this.createOrderMatchedNotifications(command, instrument));
        }
        for (const element of command.orders) {
            const order = element;
            const isOrderClosed = [order_enum_1.OrderStatus.FILLED, order_enum_1.OrderStatus.CANCELED].includes(order.status);
            if (new bignumber_js_1.default(order.remaining).gt(0) && isOrderClosed) {
                if (!isStopOrder && order.timeInForce === order_enum_1.OrderTimeInForce.IOC) {
                    const remainingString = number_formatter_1.formatQuantity(order.remaining, instrument);
                    notifications.push({
                        event: matching_engine_const_1.NotificationEvent.OrderCanceled,
                        type: matching_engine_const_1.NotificationType.error,
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
                        code: ((_a = command.errors[0]) === null || _a === void 0 ? void 0 : _a.code) == order_enum_1.NotificationErrorCode.E001 ? order_enum_1.NotificationErrorCode.E001 : null,
                    });
                }
            }
            else if (order.note === order_enum_1.OrderNote.REDUCE_ONLY_CANCELED) {
                notifications.push({
                    event: matching_engine_const_1.NotificationEvent.OrderCanceled,
                    type: matching_engine_const_1.NotificationType.error,
                    userId: order.userId,
                    title: `Order canceled!`,
                    message: `Reduce-Only order does not reduce size of the position`,
                    orderType: order.type,
                    tpSlType: order.tpSLType,
                    isHidden: order.isHidden,
                    side: order.side,
                    contractType: order.contractType,
                    code: ((_b = command.errors[0]) === null || _b === void 0 ? void 0 : _b.code) == order_enum_1.NotificationErrorCode.E001 ? order_enum_1.NotificationErrorCode.E001 : null,
                });
            }
            else if (order.status === order_enum_1.OrderStatus.CANCELED && order.id !== command.data.id) {
                notifications.push({
                    event: matching_engine_const_1.NotificationEvent.OrderCanceled,
                    type: matching_engine_const_1.NotificationType.error,
                    userId: order.userId,
                    title: `Order canceled!`,
                    message: `Order canceled by system`,
                    orderType: order.type,
                    tpSlType: order.tpSLType,
                    isHidden: order.isHidden,
                    side: order.side,
                    contractType: order.contractType,
                    code: ((_c = command.errors[0]) === null || _c === void 0 ? void 0 : _c.code) == order_enum_1.NotificationErrorCode.E001 ? order_enum_1.NotificationErrorCode.E001 : null,
                });
            }
        }
        return notifications;
    }
    createOrderMatchedNotifications(command, instrument) {
        const notifications = [];
        const order = helper_1.convertDateFields(new order_entity_1.OrderEntity(), command.data);
        let filledAmount = '0';
        let filledTotal = '0';
        for (const item of command.trades) {
            const trade = item;
            filledAmount = new bignumber_js_1.default(filledAmount).plus(trade.quantity).toString();
            filledTotal = new bignumber_js_1.default(trade.quantity).times(trade.price).plus(filledTotal).toString();
            const tradeQuantity = number_formatter_1.formatQuantity(trade.quantity, instrument);
            const tradePrice = number_formatter_1.formatPrice(trade.price, instrument);
            notifications.push({
                event: matching_engine_const_1.NotificationEvent.OrderMatched,
                type: matching_engine_const_1.NotificationType.success,
                userId: trade.buyerIsTaker ? trade.sellUserId : trade.buyUserId,
                title: `Order matched.`,
                message: `Amount: ${tradeQuantity} ${instrument.rootSymbol}\nAverage price: ${tradePrice}`,
            });
        }
        if (new bignumber_js_1.default(filledAmount).gt(0)) {
            const tradeQuantity = number_formatter_1.formatQuantity(filledAmount, instrument);
            const tradePrice = number_formatter_1.formatPrice(new bignumber_js_1.default(filledTotal).div(filledAmount).toString(), instrument);
            notifications.push({
                event: matching_engine_const_1.NotificationEvent.OrderMatched,
                type: matching_engine_const_1.NotificationType.success,
                userId: order.userId,
                title: `Order matched.`,
                message: `Amount: ${tradeQuantity} ${instrument.rootSymbol}\nAverage price: ${tradePrice}`,
            });
        }
        return notifications;
    }
    createCancelOrderNotification(command, instruments) {
        const order = helper_1.convertDateFields(new order_entity_1.OrderEntity(), command.data);
        const instrument = instruments[order.symbol];
        if (!instrument) {
            console.log('Error cancelled order: ', order);
            return;
        }
        const quantityString = number_formatter_1.formatQuantity(order.quantity, instrument);
        const typeString = number_formatter_1.formatOrderEnum(order.tpSLType || order.type);
        if (command.errors.length > 0) {
            const error = command.errors[0].name;
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
                event: matching_engine_const_1.NotificationEvent.OrderCanceled,
                type: matching_engine_const_1.NotificationType.error,
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
            event: matching_engine_const_1.NotificationEvent.OrderCanceled,
            type: matching_engine_const_1.NotificationType.error,
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
    createLiquidationNotifications(command, instruments) {
        const notifications = [];
        const liquidatedPositions = command.liquidatedPositions;
        for (const item of liquidatedPositions) {
            const position = helper_1.convertDateFields(new position_entity_1.PositionEntity(), item);
            const instrument = instruments[position.symbol];
            if (!instrument) {
                console.log('Error create liquidation noti: ', item);
                return;
            }
            const positionDirection = new bignumber_js_1.default(position.currentQty).gt(0) ? 'Long' : 'Short';
            const sizeString = number_formatter_1.formatQuantity(position.currentQty, instrument);
            notifications.push({
                event: matching_engine_const_1.NotificationEvent.PositionLiquidated,
                type: matching_engine_const_1.NotificationType.error,
                userId: position.userId,
                title: `Position liquidated!`,
                message: `Size: ${positionDirection} ${sizeString} ${instrument.rootSymbol}`,
            });
            for (const order of command.orders) {
                if (order.status === order_enum_1.OrderStatus.CANCELED) {
                    notifications.push({
                        event: matching_engine_const_1.NotificationEvent.OrderCanceled,
                        type: matching_engine_const_1.NotificationType.error,
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
        }
        return notifications;
    }
    createWithdrawalNotification(command) {
        try {
            if (command.transactions.length > 0) {
                const transaction = command.transactions[0];
                if (transaction.status === transaction_enum_1.TransactionStatus.APPROVED) {
                    const amountString = number_formatter_1.formatUSDAmount(transaction.amount);
                    return {
                        event: matching_engine_const_1.NotificationEvent.WithdrawSubmitted,
                        type: matching_engine_const_1.NotificationType.success,
                        userId: transaction.userId,
                        title: `Withdrawal request submitted.`,
                        message: `Amount: ${amountString} USDC`,
                        amount: transaction.amount,
                        asset: transaction.asset,
                    };
                }
                else {
                    return {
                        event: matching_engine_const_1.NotificationEvent.WithdrawUnsuccessfully,
                        type: matching_engine_const_1.NotificationType.error,
                        userId: transaction.userId,
                        title: `Withdraw unsuccessfully!`,
                        message: `Insufficient available balance`,
                        amount: transaction.amount,
                        asset: transaction.asset,
                    };
                }
            }
        }
        catch (error) {
            console.log('error notify transfer', error);
        }
    }
    createDepositNotification(command) {
        if (command.transactions.length > 0) {
            const transaction = command.transactions[0];
            const typeArray = [transaction_enum_1.TransactionType.REWARD, transaction_enum_1.TransactionType.REFERRAL];
            if (!typeArray.includes(transaction.type)) {
                const amountString = number_formatter_1.formatUSDAmount(transaction.amount);
                return {
                    event: matching_engine_const_1.NotificationEvent.DepositSuccessfully,
                    type: matching_engine_const_1.NotificationType.success,
                    userId: transaction.userId,
                    title: `Deposit successfully.`,
                    message: `Amount: ${amountString} USDC`,
                    amount: transaction.amount,
                };
            }
        }
    }
    async genDataNotificationFirebase(type, toUserId) {
        const user = await this.userService.findUserById(toUserId);
        if (!user || !(user === null || user === void 0 ? void 0 : user.notification_token)) {
            return;
        }
        let title = '';
        switch (user.location) {
            case matching_engine_const_1.LANGUAGE.KOREAN.toLowerCase():
                title = matching_engine_const_1.NOTIFICATION_MESSAGE.get(`${type}_${matching_engine_const_1.LANGUAGE.KOREAN}`);
                break;
            case matching_engine_const_1.LANGUAGE.VIETNAMESE.toLowerCase():
                title = matching_engine_const_1.NOTIFICATION_MESSAGE.get(`${type}_${matching_engine_const_1.LANGUAGE.VIETNAMESE}`);
                break;
            default:
                title = matching_engine_const_1.NOTIFICATION_MESSAGE.get(`${type}_${matching_engine_const_1.LANGUAGE.ENGLISH}`);
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
};
NotificationService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [mail_service_1.MailService, users_service_1.UserService])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notifications.service.js.map