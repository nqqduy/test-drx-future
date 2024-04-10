import { CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { InstrumentEntity } from 'src/models/entities/instrument.entity';
import { InstrumentRepository } from 'src/models/repositories/instrument.repository';
import { ContractDto, ContractListDto, UpdateContractDto } from 'src/modules/instrument/dto/create-instrument.dto';
import { UpdateInstrumentDto } from 'src/modules/instrument/dto/update-instrument.dto';
import { httpErrors } from 'src/shares/exceptions';
import { GetInstrumentDto } from './dto/get-instrument.dto';
import { MarketFeeRepository } from '../../models/repositories/market_fee.repository';
import { MarketFeeEntity } from '../../models/entities/market_fee.entity';
import { CreateMarketFeeDto } from './dto/create-market-free.dto';
import { UpdateMarketFeeDto } from './dto/update-market-fee.dto';
import { TradingRulesRepository } from 'src/models/repositories/trading-rules.repository';
import { LeverageMarginRepository } from 'src/models/repositories/leverage-margin.repository';
import { Connection } from 'typeorm';
import { TradingRulesEntity } from 'src/models/entities/trading_rules.entity';
import { LeverageMarginEntity } from 'src/models/entities/leverage-margin.entity';
import { Cache } from 'cache-manager';
import {
  COINM,
  INSTRUMENT_CACHE,
  INSTRUMENT_SYMBOL_CACHE,
  INSTRUMENT_SYMBOL_COIN_M_CACHE,
  USDM,
} from './instrument.const';
import { KafkaClient } from 'src/shares/kafka-client/kafka-client';
import { KafkaTopics } from 'src/shares/enums/kafka.enum';
import { CommandCode } from '../matching-engine/matching-engine.const';
import { serialize } from 'class-transformer';
import { RedisService } from 'nestjs-redis';
import { ContractType } from 'src/shares/enums/order.enum';
import { AccountRepository } from 'src/models/repositories/account.repository';
import { INSTRUMENT } from 'src/shares/enums/instrument.enum';
import { USER_ID_INSURANCE_ACCOUNT } from 'src/shares/enums/account.enum';
import { Producer } from 'kafkajs';
import { INDEX_PRICE_PREFIX, LAST_PRICE_PREFIX, ORACLE_PRICE_PREFIX } from '../index/index.const';
import { FUNDING_PREFIX } from '../funding/funding.const';
import { LEVERAGE_MARGIN_CACHE } from '../leverage-margin/leverage-margin.constants';
import { TRADING_RULES_CACHE_NO_LIMIT } from '../trading-rules/trading-rules.constants';
import { FundingService } from '../funding/funding.service';

@Injectable()
export class InstrumentService {
  constructor(
    @InjectRepository(InstrumentRepository, 'report')
    public readonly instrumentRepoReport: InstrumentRepository,
    @InjectRepository(InstrumentRepository, 'master')
    public readonly instrumentRepoMaster: InstrumentRepository,

    @InjectRepository(MarketFeeRepository, 'report')
    public readonly marketFeeRepoReport: MarketFeeRepository,
    @InjectRepository(MarketFeeRepository, 'master')
    public readonly marketFeeRepoMaster: MarketFeeRepository,

    @InjectRepository(AccountRepository, 'master')
    public readonly accountRepositoryMaster: AccountRepository,
    @InjectRepository(AccountRepository, 'report')
    public readonly accountRepositoryReport: AccountRepository,

    @InjectRepository(TradingRulesRepository, 'master')
    private tradingRulesMaster: TradingRulesRepository,
    @InjectRepository(TradingRulesRepository, 'report')
    private readonly tradingRulesReport: TradingRulesRepository,

    @InjectRepository(LeverageMarginRepository, 'report')
    public readonly leverageMarginRepoReport: LeverageMarginRepository,
    @InjectRepository(LeverageMarginRepository, 'master')
    public readonly leverageMarginRepoMaster: LeverageMarginRepository,

    // @InjectRepository(LeverageMarginRepository, 'report')
    @InjectConnection('master') private connection: Connection,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly redisService: RedisService,
    public readonly kafkaClient: KafkaClient,
    private readonly fundingService: FundingService,
  ) {}

  async getAllInstruments(query?: GetInstrumentDto): Promise<InstrumentEntity[]> {
    const queryBuilder = this.instrumentRepoReport.createQueryBuilder('instruments');

    if (query?.type) {
      queryBuilder.where(`instruments.contractType = :type`, { type: query.type });
    }
    const instruments = await queryBuilder.getMany();
    return instruments;
  }

  async getInstrumentsById(id: number): Promise<InstrumentEntity> {
    const instrument = await this.instrumentRepoReport.findOne({
      where: { id: id },
      relations: ['marketFee'],
    });
    if (!instrument) {
      throw new HttpException('Instrument not found', HttpStatus.NOT_FOUND);
    }
    return instrument;
  }

  async getInstrumentsBySymbol(symbol: string): Promise<InstrumentEntity> {
    const instrument = await this.instrumentRepoReport.findOne({ symbol });
    if (!instrument) {
      throw new HttpException(httpErrors.INSTRUMENT_DOES_NOT_EXIST, HttpStatus.NOT_FOUND);
    }
    return instrument;
  }

  async getTradingRuleBySymbol(symbol: string): Promise<TradingRulesEntity> {
    const tradingRule = await this.tradingRulesReport.findOne({ symbol });
    if (!tradingRule) {
      throw new HttpException(httpErrors.TRADING_RULES_DOES_NOT_EXIST, HttpStatus.NOT_FOUND);
    }
    return tradingRule;
  }

  async createInstrument(contractDto: ContractDto) {
    const { instrument, leverageMargin, tradingRules } = contractDto;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const instrumentDb = await this.instrumentRepoReport.findOne({
        where: {
          symbol: instrument.symbol,
        },
      });
      if (instrumentDb) {
        throw new HttpException(httpErrors.SYMBOL_ALREADY_EXIST, HttpStatus.BAD_REQUEST);
      }
      if (!instrument.multiplier) {
        instrument.multiplier = INSTRUMENT.MULTIPLIER_DEFAULT_VALUE;
      }
      const newInstrument = await queryRunner.manager.save(InstrumentEntity, {
        ...instrument,
        name: instrument.symbol,
        symbol: instrument.underlyingSymbol,
        quoteCurrency: instrument.underlyingSymbol.includes('USDT') ? 'USDT' : 'USD',
        // tmp add to work
        contractSize: '0.00000100',
        lotSize: '100.00000000',
        maxOrderQty: 1000,
      });
      const newTradingRule = await queryRunner.manager.save(TradingRulesEntity, {
        ...tradingRules,
        symbol: instrument.underlyingSymbol,
      });
      let asset = '';
      if (newInstrument.symbol.includes('USDM')) {
        asset = newInstrument.symbol.split('USDM')[0];
      } else if (newInstrument.symbol.includes('USDT')) {
        asset = 'USDT';
      } else {
        asset = 'USD';
      }
      const userIdInsuranceAccount = USER_ID_INSURANCE_ACCOUNT.DEFAULT;
      let insuranceAccount = await this.accountRepositoryReport.findOne({
        where: {
          userId: userIdInsuranceAccount,
          asset: asset,
        },
      });
      if (!insuranceAccount) {
        insuranceAccount = await this.accountRepositoryMaster.save({
          userId: userIdInsuranceAccount,
          asset,
          balance: '1000000',
        });
      }

      await this.kafkaClient.send(KafkaTopics.matching_engine_input, {
        code: CommandCode.CREATE_ACCOUNT,
        data: insuranceAccount,
      });
      const leverageMarginToSave = leverageMargin.map((lm) => ({ ...lm, symbol: instrument.underlyingSymbol }));

      const newLeverageMargin = await queryRunner.manager.save(LeverageMarginEntity, leverageMarginToSave);
      await queryRunner.commitTransaction();

      const [oraclePrice, indexPrice, fundingRate] = await Promise.all([
        this.redisService.getClient().get(`${ORACLE_PRICE_PREFIX}${newInstrument.symbol}`),
        this.redisService.getClient().get(`${INDEX_PRICE_PREFIX}${newInstrument.symbol}`),
        this.fundingService.fundingRate(newInstrument.symbol),
        // this.redisService.getClient().get(`${FUNDING_PREFIX}${newInstrument.symbol}`),
      ]);

      await Promise.all([
        this.redisService.getClient().del(`${TRADING_RULES_CACHE_NO_LIMIT}`),
        this.redisService.getClient().del(`${LEVERAGE_MARGIN_CACHE}`),
        this.redisService.getClient().del(`${INSTRUMENT_SYMBOL_CACHE}`),
        this.redisService.getClient().del(`${INSTRUMENT_SYMBOL_COIN_M_CACHE}`),
        this.cacheManager.set(`${LAST_PRICE_PREFIX}${newInstrument.symbol}`, indexPrice, {
          ttl: Number.MAX_SAFE_INTEGER,
        }),
      ]);
      await this.kafkaClient.send(KafkaTopics.matching_engine_input, {
        code: CommandCode.UPDATE_INSTRUMENT,
        data: newInstrument,
      });
      await this.kafkaClient.send(KafkaTopics.matching_engine_input, {
        code: CommandCode.UPDATE_INSTRUMENT_EXTRA,
        data: {
          symbol: newInstrument.symbol,
          oraclePrice,
          indexPrice,
          fundingRate,
        },
      });

      // const instruments = await this.instrumentRepoReport.find();
      // const data = instruments.map((instrument) => {
      //   return { data: instrument, code: CommandCode.UPDATE_INSTRUMENT };
      // });
      // await producer.send({
      //   topic: KafkaTopics.ticker_engine_preload,
      //   messages: [{ value: JSON.stringify(data) }],
      // });

      // const command = [
      //   {
      //     code: CommandCode.UPDATE_INSTRUMENT_EXTRA,
      //     data: {
      //       symbol: newInstrument.symbol,
      //       indexPrice,
      //     },
      //   },
      // ];
      // await producer.send({ topic: KafkaTopics.ticker_engine_preload, messages: [{ value: JSON.stringify(command) }] });
      // await producer.disconnect();
      return { newInstrument, newTradingRule, newLeverageMargin };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  protected async sendData(
    producer: Producer,
    topic: string,
    code: string,
    // eslint-disable-next-line
    entities: { [key: string]: any }[],
  ): Promise<void> {
    const messages = entities.map((entity) => ({
      value: serialize({ code, data: entity }),
    }));
    await producer.send({ topic, messages });
  }

  async getContractList(input: ContractListDto) {
    const page = Number(input.page);
    const size = Number(input.size);
    const query = this.instrumentRepoReport
      .createQueryBuilder('i')
      .select([
        'i.name as symbol',
        'i.id as id',
        'i.rootSymbol as collateralAsset',
        'i.underlyingSymbol as underlyingSymbol',
        'i.makerFee as makerFee',
        'i.takerFee as takerFee',
        'i.tickSize as tickSize',
        'i.maxPrice as maxPrice',
        'i.multiplier as multiplier',
        'i.minPriceMovement as minPriceMovement',
        'i.maxFiguresForSize as maxFiguresForSize',
        'i.maxFiguresForPrice as maxFiguresForPrice',
        'i.impactMarginNotional as impactMarginNotional',
        'tr.minPrice as minPrice',
        'tr.limitOrderPrice as limitOrderPrice',
        'tr.floorRatio as floorRatio',
        'tr.minOrderAmount as minOrderAmount',
        'tr.maxOrderAmount as maxOrderAmount',
        'tr.minNotional as minNotional',
        'tr.maxNotinal as maxNotinal',
        'tr.liqClearanceFee as liqClearanceFee',
        'tr.maxLeverage as maxLeverage',
      ])
      .leftJoin('trading_rules', 'tr', 'tr.symbol = i.symbol')
      .orderBy('i.createdAt', 'DESC')
      .limit(size)
      .offset(size * (page - 1));

    if (input.search) {
      query.andWhere('i.symbol LIKE :symbol', { symbol: `%${input.search}%` });
    }
    if (input.contractType && input.contractType !== ContractType.ALL) {
      query.andWhere('i.contractType = :contractType', { contractType: input.contractType });
    }
    const [list, count] = await Promise.all([query.getRawMany(), query.getCount()]);
    return { list, count };
  }

  async detailContract(underlyingSymbol: string) {
    const queryInstrumet = this.instrumentRepoReport
      .createQueryBuilder('i')
      .select([
        'i.name as symbol',
        'i.rootSymbol as collateralAsset',
        'i.underlyingSymbol as underlyingSymbol',
        'i.makerFee as makerFee',
        'i.takerFee as takerFee',
        'i.tickSize as tickSize',
        'i.maxPrice as maxPrice',
        'i.multiplier as multiplier',
        'i.minPriceMovement as minPriceMovement',
        'i.maxFiguresForSize as maxFiguresForSize',
        'i.maxFiguresForPrice as maxFiguresForPrice',
        'i.impactMarginNotional as impactMarginNotional',
        'tr.minPrice as minPrice',
        'tr.limitOrderPrice as limitOrderPrice',
        'tr.floorRatio as floorRatio',
        'tr.minOrderAmount as minOrderAmount',
        'tr.maxOrderAmount as maxOrderAmount',
        'tr.minNotional as minNotional',
        'tr.maxNotinal as maxNotinal',
        'tr.liqClearanceFee as liqClearanceFee',
        'tr.maxLeverage as maxLeverage',
      ])
      .leftJoin('trading_rules', 'tr', 'tr.symbol = i.symbol')
      .where('i.symbol = :symbol', { symbol: underlyingSymbol });

    const queryTradingTier = this.leverageMarginRepoReport
      .createQueryBuilder('lm')
      .select('lm.*')
      .where('lm.symbol = :symbol', { symbol: underlyingSymbol });

    const [instrument, tradingTier] = await Promise.all([queryInstrumet.getRawOne(), queryTradingTier.getRawMany()]);
    return { instrument, tradingTier };
  }

  async updateContract(updateContractDto: UpdateContractDto) {
    try {
      const { id, symbol } = updateContractDto;
      const findInstrumet = await this.instrumentRepoReport.findOne({ where: { id: id } });
      if (!findInstrumet) {
        throw new HttpException('Instrument not found', HttpStatus.BAD_REQUEST);
      }
      return await this.instrumentRepoReport.update({ id: id }, { name: symbol });
    } catch (error) {
      throw new HttpException('Can not update instrument', HttpStatus.BAD_REQUEST);
    }
  }

  async updateInstrument(instrumentId: number, updateInstrumentDto: UpdateInstrumentDto): Promise<InstrumentEntity> {
    let instrument = await this.instrumentRepoReport.findOne({ id: instrumentId });
    try {
      instrument = await this.instrumentRepoMaster.save({
        ...instrument,
        ...updateInstrumentDto,
      });
    } catch (error) {
      throw new HttpException('Can not update instrument', HttpStatus.BAD_REQUEST);
    }
    return instrument;
  }

  async find(): Promise<InstrumentEntity[]> {
    return this.instrumentRepoReport.find();
  }

  async findBySymbol(symbol: string): Promise<InstrumentEntity> {
    return this.instrumentRepoReport.findOne({
      symbol,
    });
  }

  async createMarketFeeByInstrument(createMarketFeeDto: CreateMarketFeeDto): Promise<MarketFeeEntity> {
    const instrument = await this.getInstrumentsById(createMarketFeeDto.instrumentId);
    if (instrument.marketFee) throw new HttpException('Instrument already exists market fee', HttpStatus.BAD_REQUEST);
    return this.marketFeeRepoMaster.save(createMarketFeeDto as MarketFeeEntity);
  }

  async updateMarketFeeByInstrument(updateMarketFeeDto: UpdateMarketFeeDto): Promise<MarketFeeEntity> {
    const instrument = await this.getInstrumentsById(updateMarketFeeDto.instrumentId);
    if (!instrument.marketFee) throw new HttpException('Instrument not exists market fee', HttpStatus.BAD_REQUEST);
    return this.marketFeeRepoMaster.save({
      ...instrument.marketFee,
      ...(updateMarketFeeDto as MarketFeeEntity),
    });
  }

  async getAllSymbolInstrument() {
    const instruments = (await this.cacheManager.get<InstrumentEntity[]>(INSTRUMENT_SYMBOL_CACHE)) || [];
    if (instruments.length) {
      return instruments;
    }
    const results: InstrumentEntity[] = await this.instrumentRepoReport.find({
      where: [{ contractType: USDM }, { contractType: COINM }],
    });
    const symbols = [];
    results.forEach((result) => {
      symbols.push(result.symbol);
    });
    await this.cacheManager.set(INSTRUMENT_SYMBOL_CACHE, symbols);
    return symbols;
  }

  async getAllTickerInstrument() {
    const instruments = (await this.cacheManager.get<InstrumentEntity[]>(INSTRUMENT_CACHE)) || [];
    if (instruments.length) {
      return instruments;
    }
    const results: InstrumentEntity[] = await this.instrumentRepoReport.find({
      where: [{ contractType: USDM }, { contractType: COINM }],
    });
    const data = [];
    results.forEach((result) => {
      data.push({ symbol: result.symbol, contractType: result.contractType, name: result.name });
    });
    await this.cacheManager.set(INSTRUMENT_CACHE, data);
    return data;
  }

  async getAllSymbolCoinMInstrument() {
    const instruments = (await this.cacheManager.get<InstrumentEntity[]>(INSTRUMENT_SYMBOL_COIN_M_CACHE)) || [];
    if (instruments.length) {
      return instruments;
    }
    const results: InstrumentEntity[] = await this.instrumentRepoReport.find({ where: { contractType: COINM } });
    const symbols = [];
    results.forEach((result) => {
      symbols.push(result.symbol);
    });
    await this.cacheManager.set(INSTRUMENT_SYMBOL_COIN_M_CACHE, symbols);
    return symbols;
  }

  public async getIndexPrices(symbols: string[]): Promise<string[]> {
    if (!symbols.length) {
      return [];
    }
    const keys = symbols.map((symbol) => `${INDEX_PRICE_PREFIX}${symbol}`);
    return await this.redisService.getClient().mget(keys);
  }

  public async getOraclePrices(symbols: string[]): Promise<string[]> {
    if (!symbols.length) {
      return [];
    }
    const keys = symbols.map((symbol) => `${ORACLE_PRICE_PREFIX}${symbol}`);
    return await this.redisService.getClient().mget(keys);
  }

  async getFundingRates(symbols: string[]): Promise<string[]> {
    if (!symbols.length) {
      return [];
    }
    const keys = symbols.map((symbol) => `${FUNDING_PREFIX}${symbol}`);
    return await this.redisService.getClient().mget(keys);
  }
}
