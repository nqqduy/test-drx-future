import { TradeEntity } from 'src/models/entities/trade.entity';
import { BaseRepository } from 'src/models/repositories/base.repository';
import { FillDto } from 'src/modules/trade/dto/get-fills.dto';
import { TradeHistoryDto } from 'src/modules/trade/dto/trade-history.dto';
import { MAX_RESULT_COUNT } from 'src/modules/trade/trade.const';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { getQueryLimit } from 'src/shares/pagination-util';
import { EntityRepository, LessThanOrEqual } from 'typeorm';
import * as moment from 'moment';
import { TradeType } from 'src/shares/enums/trade.enum';
// import { take } from 'rxjs';

@EntityRepository(TradeEntity)
export class TradeRepository extends BaseRepository<TradeEntity> {
  public async updateBatch(entities: TradeEntity[]): Promise<void> {
    const queryBuilder = this.createQueryBuilder();
    const overwriteColumns = queryBuilder.connection
      .getMetadata(TradeEntity)
      .columns.map((column) => column.propertyName);
    await queryBuilder.insert().values(entities).orUpdate(overwriteColumns, 'id').execute();
  }

  async findYesterdayTrade(date: Date, symbol: string | undefined): Promise<TradeEntity | undefined> {
    const where = {};
    if (symbol) {
      where['symbol'] = symbol;
    }
    where['createdAt'] = LessThanOrEqual(date);
    return this.findOne({
      where,
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async findTodayTrades(date: Date, from: number, count: number): Promise<TradeEntity[]> {
    return this.createQueryBuilder()
      .where('createdAt >= :createdAt', { createdAt: date })
      .orderBy('createdAt', 'ASC')
      .skip(from)
      .take(count)
      .getMany();
  }

  async getFills(
    userId: number,
    paging: PaginationDto,
    tradeHistoryDto: TradeHistoryDto,
  ): Promise<[FillDto[], number]> {
    const startTime = moment(tradeHistoryDto.startTime).format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment(tradeHistoryDto.endTime).format('YYYY-MM-DD HH:mm:ss');

    const where = `trades.createdAt > '${startTime}' and trades.updatedAt < '${endTime}'`;
    const whereContractType = `trades.contractType = '${tradeHistoryDto.contractType}'`;
    const { offset, limit } = getQueryLimit(paging, MAX_RESULT_COUNT);
    const limitInner = paging.size;
    const getBuyerQuery = `
      SELECT 
        trades.createdAt as createdAt,
        trades.id as id,
        trades.buyOrderId as orderId,
        trades.buyAccountId as accountId,
        trades.buyUserId as userId,
        trades.buyFee as fee,
        trades.quantity as quantity,
        trades.price as price,
        trades.symbol as symbol,
        trades.realizedPnlOrderBuy as realizedPnlOrderBuy,
        trades.realizedPnlOrderSell as realizedPnlOrderSell,
        IF(trades.buyerIsTaker, 'Taker', 'Maker') as liquidity,
        trades.contractType as contractType,
        'BUY' as tradeSide
      FROM trades 
      ${
        tradeHistoryDto.symbol
          ? `WHERE trades.symbol = '${tradeHistoryDto.symbol}'  AND trades.buyUserId = ${userId}`
          : `WHERE trades.buyUserId = ${userId}`
      }
      and ${where}
      and ${whereContractType}
      ORDER BY id DESC
    `;

    const getSellerQuery = `
      SELECT 
        trades.createdAt as createdAt,
        trades.id as id,
        trades.sellOrderId as orderId,
        trades.sellAccountId as accountId,
        trades.buyUserId as userId,
        trades.sellFee as fee,
        trades.quantity as quantity,
        trades.price as price,
        trades.symbol as symbol,
        trades.realizedPnlOrderBuy as realizedPnlOrderBuy,
        trades.realizedPnlOrderSell as realizedPnlOrderSell,
        IF(trades.buyerIsTaker, 'Maker', 'Taker') as liquidity,
        trades.contractType as contractType,
        'SELL' as tradeSide
      FROM trades 
      ${
        tradeHistoryDto.symbol
          ? `WHERE trades.symbol =  '${tradeHistoryDto.symbol}' AND trades.sellUserId = ${userId}`
          : `WHERE trades.sellUserId = ${userId}`
      }
      and ${where}
      and ${whereContractType}
      ORDER BY id DESC
      `;
    const getAllQuery = `
      SELECT * FROM (
        (
          ${getBuyerQuery} 
        )
      UNION ALL 
        (
          ${getSellerQuery}
      )) AS T
      ORDER BY T.id DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const countBuyerQuery = `
      SELECT count(id) as totalItem
      FROM trades 
      WHERE ${
        tradeHistoryDto.symbol
          ? `trades.symbol = '${tradeHistoryDto.symbol}' AND trades.buyUserId = ${userId}`
          : `trades.buyUserId = ${userId}`
      }
      and ${where}
      and ${whereContractType}
      limit ${limit}`;

    const countSellerQuery = `
      SELECT count(id) as totalItem
      FROM trades 
      WHERE ${
        tradeHistoryDto.symbol
          ? `trades.symbol = '${tradeHistoryDto.symbol}' AND trades.sellUserId = ${userId}`
          : `trades.sellUserId = ${userId}`
      }
      and ${where}
      and ${whereContractType}
      limit ${limit}
    `;
    let fills: any;
    let countResult: any;
    switch (tradeHistoryDto.side) {
      case TradeType.BUY:
        fills = await this.manager.query(getBuyerQuery + `LIMIT ${limitInner} OFFSET ${offset}`);
        countResult = Number((await this.manager.query(countBuyerQuery))[0].totalItem);
        break;

      case TradeType.SELL:
        fills = await this.manager.query(getSellerQuery + `LIMIT ${limitInner} OFFSET ${offset}`);
        countResult = Number((await this.manager.query(countSellerQuery))[0].totalItem);
        break;

      case null:
      case TradeType.ALL:
        fills = await this.manager.query(getAllQuery);
        const [totalSeller, totalBuyer] = await Promise.all([
          this.manager.query(countSellerQuery),
          this.manager.query(countBuyerQuery),
        ]);
        countResult = Number(totalSeller[0].totalItem) + Number(totalBuyer[0].totalItem);
        break;

      default:
        break;
    }
    const totalItem = countResult;

    return [fills, Math.ceil(totalItem / paging.size)];
  }

  async getLastTrade(symbol: string): Promise<TradeEntity[]> {
    return this.find({ where: { symbol }, order: { id: 'DESC' }, take: 1 });
  }

  async getDataTrade(userId: number, symbol: string, contract: string) {
    let queryTradeBuy: string;
    let queryTradeSell: string;
    if (contract === 'COIN_M') {
      queryTradeBuy = `
    SELECT
    t.buyOrderId as buyOrderId,
    t.sellOrderId as sellOrderId,
    t.id as idTrade,
    SUM(t.price) as price,
    SUM(t.quantity) as quantity,
    SUM(t.quantity) / SUM(t.quantity/t.price) as average
  FROM trades t
    ${symbol ? `WHERE t.symbol = '${symbol}'  AND t.buyUserId = ${userId}` : `WHERE t.buyUserId = ${userId}`}
    GROUP BY t.buyOrderId
  `;

      queryTradeSell = `
    SELECT 
      t.buyOrderId as buyOrderId,
      t.sellOrderId as sellOrderId,
      t.id as idTrade,
      SUM(t.price) as price,
      SUM(t.quantity) as quantity,
      SUM(t.quantity) / SUM(t.quantity/t.price) as average
    FROM trades t
    ${symbol ? `WHERE t.symbol = '${symbol}'  AND t.sellUserId = ${userId}` : `WHERE t.sellUserId = ${userId}`}
    GROUP BY t.sellOrderId
  `;
    } else {
      queryTradeBuy = `
    SELECT
    t.buyOrderId as buyOrderId,
    t.sellOrderId as sellOrderId,
    t.id as idTrade,
    SUM(t.price) as price,
    SUM(t.quantity) as quantity,
    SUM(t.price * t.quantity) / SUM(t.quantity) as average
  FROM trades t
    ${symbol ? `WHERE t.symbol = '${symbol}'  AND t.buyUserId = ${userId}` : `WHERE t.buyUserId = ${userId}`}
    GROUP BY t.buyOrderId
  `;

      queryTradeSell = `
    SELECT 
      t.buyOrderId as buyOrderId,
      t.sellOrderId as sellOrderId,
      t.id as idTrade,
      SUM(t.price) as price,
      SUM(t.quantity) as quantity,
      SUM(t.price * t.quantity) / SUM(t.quantity) as average
    FROM trades t
    ${symbol ? `WHERE t.symbol = '${symbol}'  AND t.sellUserId = ${userId}` : `WHERE t.sellUserId = ${userId}`}
    GROUP BY t.sellOrderId
  `;
    }

    const [tradeBuy, tradeSell] = await Promise.all([
      this.manager.query(queryTradeBuy),
      this.manager.query(queryTradeSell),
    ]);
    return { tradeBuy, tradeSell };
  }
}
