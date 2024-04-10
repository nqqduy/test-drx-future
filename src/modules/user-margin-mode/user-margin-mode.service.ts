import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InstrumentRepository } from 'src/models/repositories/instrument.repository';
import { OrderRepository } from 'src/models/repositories/order.repository';
import { PositionRepository } from 'src/models/repositories/position.repository';
import { UserMarginModeRepository } from 'src/models/repositories/user-margin-mode.repository';
import { MarginMode, OrderStatus } from 'src/shares/enums/order.enum';
import { httpErrors } from 'src/shares/exceptions';
import { In, Not } from 'typeorm';
import { AccountService } from '../account/account.service';
import { UpdateMarginModeDto } from './dto/update-user-margin-mode.dto';
import { KafkaClient } from 'src/shares/kafka-client/kafka-client';
import { KafkaTopics } from 'src/shares/enums/kafka.enum';
import { CommandCode } from '../matching-engine/matching-engine.const';
import { UserMarginModeEntity } from 'src/models/entities/user-margin-mode.entity';
import { DEFAULT_LEVERAGE, DEFAULT_MARGIN_MODE } from './user-marging-mode.const';
import { TradingRulesRepository } from 'src/models/repositories/trading-rules.repository';
import { SocketEmitter } from 'src/shares/helpers/socket-emitter';

@Injectable()
export class UserMarginModeService {
  constructor(
    @InjectRepository(UserMarginModeRepository, 'master')
    private userMarginModeMaster: UserMarginModeRepository,
    @InjectRepository(UserMarginModeRepository, 'report')
    private readonly userMarginModeReport: UserMarginModeRepository,
    @InjectRepository(PositionRepository, 'report')
    private readonly positionRepoReport: PositionRepository,
    @InjectRepository(InstrumentRepository, 'report')
    private readonly instrumentRepoReport: InstrumentRepository,
    @InjectRepository(OrderRepository, 'report')
    private readonly orderRepoReport: OrderRepository,
    @InjectRepository(TradingRulesRepository, 'report')
    private readonly tradingRuleRepoReport: TradingRulesRepository,
    private readonly accountService: AccountService,
    public readonly kafkaClient: KafkaClient,
  ) {}

  async canUpdateMarginMode(
    accountId: number,
    symbol: string,
    currentMarginMode: string,
    updateMarginMode: string,
  ): Promise<boolean> {
    if (currentMarginMode === updateMarginMode) {
      return true;
    }
    const [orders, positions] = await Promise.all([
      this.orderRepoReport.find({
        accountId,
        status: In([OrderStatus.ACTIVE, OrderStatus.UNTRIGGERED]),
        symbol,
      }),
      this.positionRepoReport.find({
        accountId,
        currentQty: Not('0'),
        symbol,
      }),
    ]);

    if (orders.length || positions.length) {
      return false;
    }
    return true;
  }

  async canUpdateLeverage(
    accountId: number,
    symbol: string,
    marginMode: string,
    currentLeverage: number,
    updateLeverage: number,
  ): Promise<boolean> {
    const [position, { maxLeverage }] = await Promise.all([
      this.positionRepoReport.findOne({
        where: {
          accountId,
          symbol,
          currentQty: Not('0'),
        },
      }),
      this.tradingRuleRepoReport.findOne({
        where: {
          symbol,
        },
      }),
    ]);
    if (+updateLeverage > +maxLeverage) {
      throw new HttpException(httpErrors.LEVERAGE_COULD_NOT_BE_CHANGE, HttpStatus.BAD_REQUEST);
    }
    if (!position) {
      return true;
    }
    switch (marginMode) {
      case MarginMode.CROSS:
        return true;
      case MarginMode.ISOLATE:
        return updateLeverage >= currentLeverage;
      default:
        break;
    }
    return true;
  }

  async updateMarginMode(userId: number, input: UpdateMarginModeDto): Promise<void> {
    const { instrumentId, marginMode, leverage } = input;
    const [{ symbol }, findMarginMode] = await Promise.all([
      this.instrumentRepoReport.findOne(instrumentId),
      this.userMarginModeReport.findOne({
        userId,
        instrumentId,
      }),
    ]);
    let asset = '';
    if (symbol.includes('USDM')) {
      asset = symbol.split('USDM')[0];
    } else if (symbol.includes('USDT')) {
      asset = 'USDT';
    } else {
      asset = 'USD';
    }
    const account = await this.accountService.getFirstAccountByOwnerId(userId, asset);

    const currentLeverage = findMarginMode ? findMarginMode.leverage : DEFAULT_LEVERAGE;
    const currentMarginMode = findMarginMode ? findMarginMode.marginMode : DEFAULT_MARGIN_MODE;
    if (!(await this.canUpdateMarginMode(account.id, symbol, currentMarginMode, marginMode))) {
      throw new HttpException(httpErrors.MARGIN_MODE_COULD_NOT_BE_CHANGE, HttpStatus.BAD_REQUEST);
    }
    if (!(await this.canUpdateLeverage(account.id, symbol, currentMarginMode, +currentLeverage, +leverage))) {
      throw new HttpException(httpErrors.LEVERAGE_COULD_NOT_BE_CHANGE, HttpStatus.BAD_REQUEST);
    }
    const position = await this.positionRepoReport.findOne({
      where: {
        symbol,
        userId,
      },
    });
    if (!position) {
      await this.userMarginModeMaster.update(
        { instrumentId, userId },
        { leverage: input.leverage, marginMode: input.marginMode },
      );
      SocketEmitter.getInstance().emitAdjustLeverage(
        {
          accountId: account.id,
          leverage: input.leverage,
          symbol: symbol,
          marginMode: input.marginMode,
          asset,
          userId,
          oldLeverage: currentLeverage,
          status: 'SUCCESS',
        },
        +userId,
      );
    } else {
      await this.kafkaClient.send(KafkaTopics.matching_engine_input, {
        code: CommandCode.ADJUST_LEVERAGE,
        data: {
          id: findMarginMode ? findMarginMode.id : null,
          accountId: account.id,
          leverage: input.leverage,
          symbol: symbol,
          marginMode: input.marginMode,
          asset,
          userId,
          oldLeverage: currentLeverage,
        },
      });
    }
  }

  async getMarginMode(userId: number, instrumentId: number): Promise<UserMarginModeEntity> {
    const findMarginMode = await this.userMarginModeMaster.findOne({
      userId,
      instrumentId,
    });
    if (!findMarginMode) {
      return await this.userMarginModeMaster.save({
        userId,
        instrumentId: instrumentId,
        marginMode: DEFAULT_MARGIN_MODE,
        leverage: DEFAULT_LEVERAGE.toString(),
      });
    }
    return findMarginMode;
  }
}
