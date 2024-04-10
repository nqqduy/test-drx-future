/**
 * Assumed that we have flow of data in sequence (Ordered)
 * Candle is stored by minutes
 * it has low, high, open, close, year, month, day(_in_month), hour(_in_day), min(_in_hour),
 *  Skip year, month, day(_in_month), hour(_in_day) since data is small an can be query easily not costing
 *  much of computation, we only have to index symbol and min
 *
 * Requires: Storing mass data from kafka to sql,
 *
 * Solution:
 *  - mysql design:
 *      Partition by symbol, store by minutes,
 *          => 1 yrs = 365 * 24 * 60 rows data = 525600 rows data, and ordered
 *      => Indexed by month, day, hour, min since each 1 min we insert a record - and maybe update it price
 *         therefore it should make no problem with I/O
 *  - Flow to digest data:
 *        - receive data from kafka put on redis by key = epoch rounds to minute
 *        - another async function run
 *
 *
 */
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import BigNumber from 'bignumber.js';
import { Cache } from 'cache-manager';
import { RedisService } from 'nestjs-redis';
import { kafka } from 'src/configs/kafka';
import { CandlesEntity } from 'src/models/entities/candles.entity';
import { CandlesRepository } from 'src/models/repositories/candles.repository';
import { MetadataRepository } from 'src/models/repositories/metadata.repository';
import * as CONST from 'src/modules/candle/candle.const';
import {
  Candle,
  KEY_CACHE_HEALTHCHECK_SYNC_CANDLE,
  RESOLUTION_15MINUTES,
  RESOLUTION_HOUR,
  RESOLUTION_MINUTE,
} from 'src/modules/candle/candle.const';
import { CandleData, TradeData } from 'src/modules/candle/candle.dto';
import { InstrumentService } from 'src/modules/instrument/instrument.service';
import { CommandOutput } from 'src/modules/matching-engine/matching-engine.const';
import { KafkaGroups, KafkaTopics } from 'src/shares/enums/kafka.enum';
import { Between, Connection, Equal } from 'typeorm';
import { LAST_PRICE_PREFIX } from '../index/index.const';
import { SYMBOL_CACHE } from '../instrument/instrument.const';
import { Ticker, TICKERS_KEY } from '../ticker/ticker.const';

@Injectable()
export class CandleService {
  private readonly logger = new Logger(CandleService.name);

  private resolutions = [RESOLUTION_15MINUTES, RESOLUTION_HOUR];

  constructor(
    private readonly instrumentService: InstrumentService,
    @InjectRepository(CandlesRepository, 'master') private candleRepositoryMaster: CandlesRepository,
    @InjectRepository(CandlesRepository, 'report') private candleRepositoryReport: CandlesRepository,
    @InjectRepository(MetadataRepository, 'master') private metadataRepositoryMaster: MetadataRepository,
    @InjectRepository(MetadataRepository, 'report') private metadataRepositoryReport: MetadataRepository,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    private readonly redisService: RedisService,
    @InjectConnection('master') private connection: Connection,
  ) {}

  getMinute(epoch: number): number {
    if (epoch > Math.pow(10, 10)) {
      epoch = Math.floor(epoch / 1000); // to second from milis
    }
    // Just to be more secure we throw some kind of invalid data for debug
    // Thursday, January 10, 2008 9:20:00 PM => 1200000000
    // Saturday, November 20, 2286 5:46:40 PM 10000000000
    if (epoch < 1200000000 || epoch > 10000000000) throw 'Epoch time input error!!! ' + __filename;

    return epoch - (epoch % 60);
  }

  getSecond(epoch: number): number {
    if (epoch > Math.pow(10, 10)) {
      epoch = Math.floor(epoch / 1000); // to second from milis
    }
    return epoch;
  }

  async storeCandle(symbols: string[]): Promise<void> {
    for (const symbol of symbols) {
      // get the latest minute
      console.log("===========================================");
      console.log(symbol);
      const lastCachedCandle = await this.cacheService.get<CandleData>(this.getLastCandleKey(symbol));
      let latest = lastCachedCandle?.minute || 0;
      const now = Math.floor(Date.now() / 60000) * 60;
      const twoDaysAgo = now - 86400 * 2;
      latest = Math.max(latest - (latest % 60), twoDaysAgo);
      latest = Math.min(latest, now - 60); // maybe latest candle is being updated, so we don't save it to database

      let lastCandle = await this.getLastCandleFromDatabase(symbol, RESOLUTION_MINUTE);
      const fromTime = lastCandle.minute > 0 ? lastCandle.minute + 60 : latest;
      for (let i = fromTime; i <= latest; i += 60) {
        let candleData = await this.cacheService.get<CandleData>(this.getCandleKey(symbol, i));
        if (!candleData) {
          candleData = {
            symbol: symbol,
            minute: i,
            resolution: RESOLUTION_MINUTE,
            low: lastCandle.close,
            high: lastCandle.close,
            open: lastCandle.close,
            close: lastCandle.close,
            lastTradeTime: lastCandle.lastTradeTime,
            volume: '0',
          };
        }
        lastCandle = candleData;

        await this.candleRepositoryMaster.save(candleData);
        await this.saveExtraResolutions(candleData);
      }
    }
  }

  async handleMessage(commandOutputs: CommandOutput[]): Promise<void> {
    for (const element of commandOutputs) {
      if (element.trades != undefined) {
        for (const trade of element.trades) {
          this.logger.log(`Processing trade ${JSON.stringify(trade)}`);
          // transform to needed data.
          const data = {
            price: trade.price as string,
            volume: new BigNumber(trade.price as string).times(trade.quantity as string).toString(),
            updatedAt: Math.floor((trade.updatedAt as number) / 1000),
            symbol: trade.symbol as string,
          };
          await this.handleTrade(data);
        }
      }
    }
  }

  async handleTrade(data: TradeData): Promise<void> {
    const minute = this.getMinute(Number(data.updatedAt));

    const cachedCandle = await this.cacheService.get<CandleData>(this.getCandleKey(data.symbol, minute));

    let candle: CandleData;

    if (!cachedCandle) {
      const lastCandle = await this.getLastCandle(data.symbol, RESOLUTION_MINUTE);
      candle = {
        symbol: data.symbol,
        minute: minute,
        resolution: RESOLUTION_MINUTE,
        low: BigNumber.min(data.price, lastCandle.close).toString(),
        high: BigNumber.max(data.price, lastCandle.close).toString(),
        open: lastCandle.close,
        close: data.price,
        volume: data.volume,
        lastTradeTime: data.updatedAt,
      };
    } else {
      if (cachedCandle.lastTradeTime > data.updatedAt) {
        // Skip this message  since it's been processed before
        return;
      }

      candle = {
        symbol: data.symbol,
        minute: minute,
        resolution: RESOLUTION_MINUTE,
        low: BigNumber.min(data.price, cachedCandle.low).toString(),
        high: BigNumber.max(data.price, cachedCandle.high).toString(),
        open: cachedCandle.open,
        close: data.price,
        volume: new BigNumber(cachedCandle.volume).plus(data.volume).toString(),
        lastTradeTime: data.updatedAt,
      };
    }

    this.logger.log(`Save candle ${JSON.stringify(candle)}`);

    await this.cacheService.set(this.getCandleKey(data.symbol, minute), candle, { ttl: CONST.CANDLE_TTL });
    await this.cacheService.set(this.getLastCandleKey(data.symbol), candle, {
      ttl: CONST.CANDLE_TTL,
    });
  }

  async getCandles(symbol: string, from: number, to: number, resolution: string): Promise<Candle[]> {
    const baseUnit = 60000;
    const resolutionMap = {
      '1': baseUnit,
      '3': baseUnit * 3,
      '5': baseUnit * 5,
      '15': baseUnit * 15,
      '30': baseUnit * 30,
      '60': baseUnit * 60,
      '120': baseUnit * 60 * 2,
      '240': baseUnit * 60 * 4,
      '360': baseUnit * 60 * 6,
      '480': baseUnit * 60 * 8,
      '720': baseUnit * 60 * 12,
      '1d': baseUnit * 60 * 24,
      '1D': baseUnit * 60 * 24,
      D: baseUnit * 60 * 24,
      '3D': baseUnit * 60 * 24 * 3,
      '7D': baseUnit * 60 * 24 * 7,
      '30D': baseUnit * 60 * 24 * 30,
    };
    const convertedResolution = resolutionMap[resolution];
    if (convertedResolution) {
      return await this._getCandles(
        symbol,
        this.standardizeCandleTime(from, convertedResolution),
        this.standardizeCandleTime(to, convertedResolution) + convertedResolution - 1,
        convertedResolution,
      );
    } else {
      return [];
    }
  }

  async getCandlesData(symbol: string, from: number, to: number, resolution: number): Promise<CandlesEntity[]> {
    from = this.getMinute(from);
    to = this.getMinute(to);

    const resolutionInSeconds = resolution / 1000;
    let queryResolution = RESOLUTION_MINUTE;
    for (const supportedResolution of this.resolutions) {
      if (resolutionInSeconds > supportedResolution) {
        queryResolution = supportedResolution;
      }
    }

    return await this.candleRepositoryReport.find({
      select: ['symbol', 'low', 'high', 'open', 'close', 'volume', 'minute', 'lastTradeTime', 'createdAt'],
      where: {
        symbol: Equal(symbol),
        resolution: queryResolution,
        minute: Between(from, to),
      },
      order: {
        minute: 'ASC',
      },
    });
  }

  async syncCandles(): Promise<void> {
    //const instruments = await this.instrumentService.getAllInstruments();
    //const symbols = instruments.map((instrument) => instrument.symbol);
    // loop this one
    while (true) {
      let symbols = await this.cacheService.get<string[]>(SYMBOL_CACHE);
      if (!symbols) {
        const instruments = await this.instrumentService.getAllInstruments();
        symbols = instruments.map((instrument) => instrument.symbol);
        await this.cacheService.set(SYMBOL_CACHE, symbols, { ttl: 0 });
      }

      console.log("-----------------------------------------");
      console.log(symbols);
      await this.storeCandle(symbols);
      await this.setLastUpdate();
      // ttl 2 minutes
      await this.cacheService.set(KEY_CACHE_HEALTHCHECK_SYNC_CANDLE, true, { ttl: 60 + 60 });

      await new Promise((resolve) => setTimeout(resolve, 60000));
    }
  }

  public async setLastUpdate(): Promise<void> {
    await this.redisService.getClient().set(`candle_sync_last_update`, Date.now());
  }

  public async getLastUpdate(): Promise<number | undefined> {
    const value = await this.redisService.getClient().get(`candle_sync_last_update`);
    return value ? Number(value) : 0;
  }

  async syncTrades(): Promise<void> {
    const consumer = kafka.consumer({ groupId: KafkaGroups.candles });
    await consumer.connect();
    await consumer.subscribe({ topic: KafkaTopics.matching_engine_output });
    await consumer.run({
      // consider eachBatch
      eachMessage: async ({ message }) => {
        // console.log(message.value.toString());
        let data = JSON.parse('{}');
        try {
          // console.log(message.value.toString());
          data = JSON.parse(message.value.toString());
        } catch {
          console.log('invalid data');
          return;
        }

        await this.handleMessage(data);
      },
    });

    return new Promise(() => {});
  }

  private async saveExtraResolutions(candleData: CandleData): Promise<void> {
    for (const resolution of this.resolutions) {
      await this.saveCandleInResolution(candleData, resolution);
    }
  }

  private async saveCandleInResolution(candleData: CandleData, resolution: number): Promise<void> {
    const candleTime = candleData.minute - (candleData.minute % resolution);
    const lastCandleBefore = await this.candleRepositoryReport.getLastCandleBefore(candleData.symbol, candleTime);
    const candles = await this.candleRepositoryReport.getCandlesInRange(candleData.symbol, candleTime, resolution);

    const lastCandleOfResolution = await this.candleRepositoryReport.getLastCandleOfResolution(
      candleData.symbol,
      resolution,
    );

    if (lastCandleOfResolution) {
      for (let time = lastCandleOfResolution.minute + resolution; time < candleTime; time += resolution) {
        await this.candleRepositoryMaster.save({
          symbol: candleData.symbol,
          minute: time,
          resolution: resolution,
          low: lastCandleOfResolution.close,
          high: lastCandleOfResolution.close,
          open: lastCandleOfResolution.close,
          close: lastCandleOfResolution.close,
          lastTradeTime: lastCandleOfResolution.lastTradeTime,
          volume: '0',
        });
      }
    }

    const open = this.getOpenPrice(lastCandleBefore, candles);
    const close = this.getClosePrice(lastCandleBefore, candles);
    const { low, high, volume } = this.combineCandlesData(lastCandleBefore, candles);

    if (lastCandleOfResolution?.minute === candleTime) {
      await this.candleRepositoryMaster.update(
        {
          symbol: candleData.symbol,
          minute: candleTime,
          resolution,
        },
        {
          low,
          high,
          open,
          close,
          volume,
        },
      );
    } else {
      await this.candleRepositoryMaster.save({
        symbol: candleData.symbol,
        minute: candleTime,
        resolution,
        low,
        high,
        open,
        close,
        lastTradeTime: 0,
        volume,
      });
    }
  }

  private getOpenPrice(lastCandleBefore: CandleData, candles: CandleData[]): string {
    if (lastCandleBefore) {
      return lastCandleBefore.close;
    } else {
      if (candles.length > 0) {
        return candles[0].open;
      }
    }
    return '0';
  }

  private getClosePrice(lastCandleBefore: CandleData, candles: CandleData[]): string {
    if (candles.length > 0) {
      return candles[candles.length - 1].close;
    } else {
      if (lastCandleBefore) {
        return lastCandleBefore.close;
      }
    }
    return '0';
  }

  private combineCandlesData(
    lastCandleData: CandleData,
    candles: CandleData[],
  ): { low: string; high: string; volume: string } {
    if (!lastCandleData && candles.length === 0) {
      return { low: '0', high: '0', volume: '0' };
    }

    let low = Number.MAX_SAFE_INTEGER.toString();
    let high = '0';
    let volume = '0';
    for (const candle of candles) {
      low = BigNumber.min(low, candle.low).toString();
      high = BigNumber.max(high, candle.high).toString();
      volume = new BigNumber(volume).plus(candle.volume).toString();
    }
    if (lastCandleData) {
      low = BigNumber.min(low, lastCandleData.close).toString();
      high = BigNumber.max(high, lastCandleData.close).toString();
    }
    return { low, high, volume };
  }

  private async getLastCandle(symbol: string, resolution: number): Promise<CandleData> {
    const lastCandle = await this.cacheService.get<CandleData>(this.getLastCandleKey(symbol));
    if (!lastCandle) {
      return this.getLastCandleFromDatabase(symbol, resolution);
    }

    return lastCandle;
  }

  private async getLastCandleFromDatabase(symbol: string, resolution: number): Promise<CandleData> {
    const lastCandle = await this.candleRepositoryReport.findOne({
      where: { symbol, resolution },
      order: { minute: 'DESC' },
    });

    if (lastCandle) {
      return lastCandle;
    } else {
      const [tickers] = await Promise.all([this.cacheService.get<Ticker[]>(TICKERS_KEY)]);
      const lastPriceFromIndex = await this.cacheService.get<string>(`${LAST_PRICE_PREFIX}${symbol}`);
      let lastPrice = tickers.find((item) => item.symbol == symbol)?.lastPrice || 0;
      if (lastPriceFromIndex) {
        lastPrice = lastPriceFromIndex;
      }
      const candle = {
        symbol: '',
        minute: 0,
        resolution: RESOLUTION_MINUTE,
        low: new BigNumber(lastPrice).toString(),
        high: new BigNumber(lastPrice).toString(),
        open: new BigNumber(lastPrice).toString(),
        close: new BigNumber(lastPrice).toString(),
        volume: '0',
        lastTradeTime: 0,
      };
      return { ...candle, symbol };
    }
  }

  private getCandleKey(symbol: string, minute: number): string {
    return `${CONST.PREFIX_CACHE}${symbol}${String(minute)}`;
  }

  private getLastCandleKey(symbol: string): string {
    return `${CONST.PREFIX_CACHE}${symbol}latest`;
  }

  private async _getCandles(symbol: string, from: number, to: number, resolution: number): Promise<Candle[]> {
    let rows: CandleData[] = await this.getCandlesData(symbol, from, to, resolution);

    // Candles in database maybe behind candles in cache (maximum 2 minutes)
    rows = await this.addCandlesFromCache(rows, symbol, from, to);

    let candles: Candle[] = [];

    if (rows.length > 0) {
      let currentCandle = this.getCandleFromEntity(rows.shift(), resolution);
      for (const row of rows) {
        const candleTime = this.getCandleTime(row.minute, resolution);
        if (candleTime === currentCandle.time) {
          currentCandle.low = Math.min(currentCandle.low, Number(row.low));
          currentCandle.high = Math.max(currentCandle.high, Number(row.high));
          currentCandle.close = Number(row.close);
          currentCandle.volume = currentCandle.volume + Number(row.volume);
        } else {
          candles.push(currentCandle);
          currentCandle = this.getCandleFromEntity(row, resolution);
        }
      }
      candles.push(currentCandle);
    }

    candles = await this.addMissingHeadCandles(from, to, resolution, candles, symbol);
    candles = this.addMissingTailCandles(from, to, resolution, candles);

    return candles;
  }

  private getCandleTime(minute: number, resolution: number): number {
    const timeInMilliSeconds = Number(minute) * 1000;
    return this.standardizeCandleTime(timeInMilliSeconds, resolution);
  }

  private standardizeCandleTime(time: number, resolution: number): number {
    return time - (time % resolution);
  }

  private async addCandlesFromCache(
    rows: CandleData[],
    symbol: string,
    from: number,
    to: number,
  ): Promise<CandleData[]> {
    const lastCandle = await this.cacheService.get<CandleData>(this.getLastCandleKey(symbol));
    let previousCandle;
    if (lastCandle) {
      previousCandle = await this.cacheService.get<CandleData>(this.getCandleKey(symbol, lastCandle.minute - 60));
    }

    rows = this.addCandleFromCache(rows, from, to, previousCandle);
    rows = this.addCandleFromCache(rows, from, to, lastCandle);
    return rows;
  }

  private addCandleFromCache(rows: CandleData[], from: number, to: number, cachedCandle: CandleData): CandleData[] {
    if (!cachedCandle) {
      return rows;
    }
    if (cachedCandle.minute > from / 1000 && cachedCandle.minute < to / 1000) {
      if (rows.length === 0) {
        rows.push(cachedCandle);
      } else if (cachedCandle.minute > rows[rows.length - 1].minute) {
        const lastClose = rows[rows.length - 1].close;
        const startTime = rows[rows.length - 1].minute + 60;
        for (let i = startTime; i < cachedCandle.minute; i += 60) {
          rows.push({
            symbol: '',
            open: lastClose,
            close: lastClose,
            low: lastClose,
            high: lastClose,
            volume: '0',
            minute: i,
            resolution: RESOLUTION_MINUTE,
            lastTradeTime: 0,
          });
        }
        rows.push(cachedCandle);
      }
    }
    return rows;
  }

  private getCandleFromEntity(entity: CandleData, resolution: number): Candle {
    return {
      open: parseFloat(entity.open),
      close: parseFloat(entity.close),
      low: parseFloat(entity.low),
      high: parseFloat(entity.high),
      volume: parseFloat(entity.volume),
      time: this.getCandleTime(entity.minute, resolution),
    };
  }

  private async addMissingHeadCandles(
    from: number,
    to: number,
    resolution: number,
    candles: Candle[],
    symbol?: string,
  ): Promise<Candle[]> {
    const startTime = from;
    const endTime = candles.length > 0 ? candles[0].time - resolution : to;
    const missingCandles: Candle[] = [];
    const [tickers] = await Promise.all([this.cacheService.get<Ticker[]>(TICKERS_KEY)]);
    const lastPriceFromIndex = await this.cacheService.get<string>(`${LAST_PRICE_PREFIX}${symbol}`);
    let lastPrice = tickers.find((item) => item.symbol == symbol)?.lastPrice || 0;
    if (lastPriceFromIndex) {
      lastPrice = lastPriceFromIndex;
    }
    for (let i = startTime; i <= endTime; i += resolution) {
      missingCandles.push({
        open: new BigNumber(lastPrice).toNumber(),
        close: new BigNumber(lastPrice).toNumber(),
        low: new BigNumber(lastPrice).toNumber(),
        high: new BigNumber(lastPrice).toNumber(),
        volume: 0,
        time: i,
      });
    }
    if (missingCandles.length > 0 && candles.length > 0) {
      candles[0].open = missingCandles[missingCandles.length - 1].close;
    }
    candles = missingCandles.concat(candles);
    return candles;
  }

  private addMissingTailCandles(from: number, to: number, resolution: number, candles: Candle[]): Candle[] {
    const lastClose = candles.length > 0 ? candles[candles.length - 1].close : 0;
    const startTime = candles.length > 0 ? candles[candles.length - 1].time + resolution : from;
    const endTime = to;
    const missingCandles = [];
    for (let i = startTime; i <= endTime; i += resolution) {
      missingCandles.push({
        open: lastClose,
        close: lastClose,
        low: lastClose,
        high: lastClose,
        volume: 0,
        time: i,
      });
    }
    candles = candles.concat(missingCandles);

    return candles;
  }
}
