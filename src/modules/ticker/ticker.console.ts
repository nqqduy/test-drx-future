import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Command, Console } from 'nestjs-console';
import { kafka } from 'src/configs/kafka';
import { FundingService } from 'src/modules/funding/funding.service';
import { IndexService } from 'src/modules/index/index.service';
import { Ticker, TICKER_TTL, TICKERS_KEY } from 'src/modules/ticker/ticker.const';
import { TickerService } from 'src/modules/ticker/ticker.service';
import { KafkaGroups, KafkaTopics } from 'src/shares/enums/kafka.enum';
import { SocketEmitter } from 'src/shares/helpers/socket-emitter';
import { KafkaClient } from 'src/shares/kafka-client/kafka-client';
import { LAST_PRICE_PREFIX } from '../index/index.const';
import { LIST_SYMBOL_COINM } from '../transaction/transaction.const';
import { ContractType } from 'src/shares/enums/order.enum';

@Console()
@Injectable()
export class TickerConsole {
  constructor(
    private readonly tickerService: TickerService,
    @Inject(CACHE_MANAGER) public cacheManager: Cache,
    public readonly kafkaClient: KafkaClient,
    private readonly fundingService: FundingService,
    private readonly indexService: IndexService,
  ) {}

  @Command({
    command: 'ticker:load',
    description: 'Load data into ticker engine',
  })
  async load(): Promise<void> {
    await this.kafkaClient.delete([KafkaTopics.ticker_engine_preload]);

    const producer = kafka.producer();
    await producer.connect();
    await this.tickerService.loadInstruments(producer);
    await this.tickerService.loadTrades(producer);
    await this.tickerService.startEngine(producer);
    await producer.disconnect();
  }

  @Command({
    command: 'ticker:publish',
    description: 'Publish ticker',
  })
  async publish(): Promise<void> {
    await this.kafkaClient.consume<Ticker[]>(KafkaTopics.ticker_engine_output, KafkaGroups.ticker, async (tickers) => {
      console.log(tickers);
      console.log('============================================');
      await this.addExtraInfoToTickers(tickers);
      SocketEmitter.getInstance().emitTickers(tickers);
      await this.cacheManager.set(TICKERS_KEY, tickers, { ttl: TICKER_TTL });
    });
    return new Promise(() => {});
  }

  private async addExtraInfoToTickers(tickers: Ticker[]): Promise<void> {
    const symbols = tickers.map((ticker) => ticker.symbol);
    const [indexPrices, oraclePrices, fundingRates, nextFunding, oldTickers] = await Promise.all([
      this.indexService.getIndexPrices(symbols),
      this.indexService.getOraclePrices(symbols),
      this.fundingService.getFundingRates(symbols),
      this.fundingService.getNextFunding(symbols[0]),
      // this.cacheManager.get<number>(`${FUNDING_PREFIX}next_funding`),
      this.cacheManager.get<Ticker[]>(TICKERS_KEY),
    ]);

    for (let i = 0; i < tickers.length; i++) {
      const ticker = tickers[i];
      const cacheLastPrice = await this.cacheManager.get<string>(`${LAST_PRICE_PREFIX}${ticker.symbol}`);
      const newTicker = oldTickers?.find((item) => item.symbol == ticker.symbol) || ticker;
      const isCoinM = LIST_SYMBOL_COINM.includes(ticker.symbol);
      const contractType = isCoinM ? ContractType.COIN_M : ContractType.USD_M;
      //const isNewTickerLastPriceZero = new BigNumber(newTicker.lastPrice).isZero();

      if (cacheLastPrice) {
        ticker.priceChange = newTicker.priceChange;
        ticker.priceChangePercent = newTicker.priceChangePercent;
        ticker.lastPriceChange = cacheLastPrice ? `${+ticker.lastPrice - +cacheLastPrice}` : ticker.lastPriceChange;
        ticker.lastPrice = newTicker.lastPrice;
        ticker.highPrice = newTicker.highPrice;
        ticker.lowPrice = newTicker.lowPrice;
        ticker.volume = newTicker.volume;
        ticker.quoteVolume = newTicker.quoteVolume;
        await this.cacheManager.del(`${LAST_PRICE_PREFIX}${ticker.symbol}`);
      }

      ticker.indexPrice = indexPrices[i];
      ticker.oraclePrice = oraclePrices[i];
      ticker.fundingRate = fundingRates[i];
      ticker.nextFunding = +nextFunding;
      ticker.contractType = contractType;
    }
  }
}
