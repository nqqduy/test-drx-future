import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { serialize } from 'class-transformer';
import { Producer } from 'kafkajs';
import { InstrumentService } from 'src/modules/instrument/instrument.service';
import { BaseEngineService } from 'src/modules/matching-engine/base-engine.service';
import { BATCH_SIZE, CommandCode } from 'src/modules/matching-engine/matching-engine.const';
import { Ticker, TICKERS_KEY } from 'src/modules/ticker/ticker.const';
import { TradeService } from 'src/modules/trade/trade.service';
import { KafkaTopics } from 'src/shares/enums/kafka.enum';
import { FundingService } from '../funding/funding.service';
import { INDEX_PRICE_PREFIX, LAST_PRICE_PREFIX, ORACLE_PRICE_PREFIX } from '../index/index.const';
import { InstrumentRepository } from 'src/models/repositories/instrument.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TickerService extends BaseEngineService {
  constructor(
    @Inject(CACHE_MANAGER) public cacheManager: Cache,
    private readonly instrumentService: InstrumentService,
    private readonly tradeService: TradeService,
    @InjectRepository(InstrumentRepository, 'report')
    private readonly instrumentRepoReport: InstrumentRepository,
    private readonly fundingService: FundingService,
  ) {
    super();
  }

  async getTickers(contractType?: string, symbol?: string): Promise<Ticker[]> {
    const [tickers, nextFunding] = await Promise.all([
      this.cacheManager.get<Ticker[]>(TICKERS_KEY),
      this.fundingService.getNextFunding(symbol),
      // this.cacheManager.get<number>(`${FUNDING_PREFIX}next_funding`),
    ]);

    const instrumentSymbol = await this.instrumentService.getAllTickerInstrument();

    tickers.forEach((ticker) => {
      ticker.contractType = instrumentSymbol?.find((symbol) => symbol.symbol == ticker.symbol)?.contractType;
      ticker.nextFunding = +nextFunding;
    });

    const existingTickers = tickers || [];
    const existingTickerSymbols = new Set(existingTickers.map((item) => item.symbol));

    const newTickers = instrumentSymbol
      .filter((item) => !existingTickerSymbols.has(item.symbol))
      .map((item) => ({
        symbol: item.symbol,
        priceChange: '0',
        priceChangePercent: '0',
        lastPrice: '',
        lastPriceChange: null,
        highPrice: '',
        lowPrice: '',
        volume: '',
        quoteVolume: '',
        indexPrice: '',
        oraclePrice: '',
        fundingRate: '',
        nextFunding: +nextFunding,
        contractType: item.contractType,
        name: item.name,
      }));

    let updatedTickers = existingTickers.concat(newTickers);

    await Promise.all(
      updatedTickers.map(async (item) => {
        const [lastPrice, indexPrice, oraclePrice, fundingRate] = await Promise.all([
          this.cacheManager.get<string>(`${LAST_PRICE_PREFIX}${item.symbol}`),
          this.cacheManager.get<string>(`${INDEX_PRICE_PREFIX}${item.symbol}`),
          this.cacheManager.get<string>(`${ORACLE_PRICE_PREFIX}${item.symbol}`),
          this.fundingService.fundingRate(item.symbol),
          // this.cacheManager.get<string>(`${FUNDING_PREFIX}${item.symbol}`),
        ]);
        item.lastPrice = lastPrice ? lastPrice : item.lastPrice;
        item.indexPrice = indexPrice || '';
        item.oraclePrice = oraclePrice || '';
        item.fundingRate = fundingRate || '';
      }),
    );

    if (contractType) {
      updatedTickers = updatedTickers.filter((item) => {
        return item.contractType == contractType;
      });
    }

    if (symbol) {
      updatedTickers = updatedTickers.filter((item) => {
        return item.symbol == symbol;
      });
    }

    return updatedTickers;
  }

  public async loadInstruments(producer: Producer): Promise<void> {
    const instruments = await this.instrumentService.find();
    const data = instruments.map((instrument) => {
      return { data: instrument, code: CommandCode.UPDATE_INSTRUMENT };
    });
    await producer.send({
      topic: KafkaTopics.ticker_engine_preload,
      messages: [{ value: JSON.stringify(data) }],
    });
  }

  public async loadTrades(producer: Producer): Promise<void> {
    const yesterday = new Date(Date.now() - 86400000);
    // await this.loadYesterdayTrades(producer, yesterday);

    let trades = [];
    let index = 0;
    const instruments = await this.instrumentRepoReport.find({ select: ['symbol'] });
    let symbolsNotHaveTrade = instruments.map((e) => e.symbol);
    console.log('before: ', symbolsNotHaveTrade.length);
    do {
      trades = await this.tradeService.findTodayTrades(yesterday, index, BATCH_SIZE);
      const tradeSymbol = [...new Set(trades.map((trade) => trade.symbol))];
      symbolsNotHaveTrade = symbolsNotHaveTrade.filter((trade) => !tradeSymbol.includes(trade));
      index += trades.length;
      const command = { code: CommandCode.PLACE_ORDER, trades };
      await producer.send({
        topic: KafkaTopics.ticker_engine_preload,
        messages: [{ value: serialize([command]) }],
      });
    } while (trades.length > 0);
    console.log('after: ', symbolsNotHaveTrade.length);

    console.log({ symbolsNotHaveTrade });
    for (const symbol of symbolsNotHaveTrade) {
      const lastTrade = await this.tradeService.getLastTrade(symbol);
      console.log({ lastTrade });
      if (lastTrade) {
        const command = { code: CommandCode.PLACE_ORDER, trades: lastTrade ? lastTrade : null };
        await producer.send({
          topic: KafkaTopics.ticker_engine_preload,
          messages: [{ value: serialize([command]) }],
        });
      }
    }
  }

  // public async loadInstrument;

  public async startEngine(producer: Producer): Promise<void> {
    const command = { code: CommandCode.START_ENGINE };
    await producer.send({ topic: KafkaTopics.ticker_engine_preload, messages: [{ value: JSON.stringify([command]) }] });
  }

  private async loadYesterdayTrades(producer: Producer, date: Date): Promise<void> {
    const instruments = await this.instrumentService.getAllInstruments();
    const yesterdayTrades = [];
    for (const instrument of instruments) {
      const trade = await this.tradeService.findYesterdayTrade(date, instrument.symbol);
      if (trade) {
        yesterdayTrades.push(trade);
      }
    }

    if (yesterdayTrades.length > 0) {
      // simulate output of matching engine
      const command = { code: CommandCode.PLACE_ORDER, trades: yesterdayTrades };
      await producer.send({
        topic: KafkaTopics.ticker_engine_preload,
        messages: [{ value: serialize([command]) }],
      });
    }
  }
}
