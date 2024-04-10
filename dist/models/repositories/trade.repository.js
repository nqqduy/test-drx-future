"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeRepository = void 0;
const tslib_1 = require("tslib");
const trade_entity_1 = require("../entities/trade.entity");
const base_repository_1 = require("./base.repository");
const get_fills_dto_1 = require("../../modules/trade/dto/get-fills.dto");
const trade_history_dto_1 = require("../../modules/trade/dto/trade-history.dto");
const trade_const_1 = require("../../modules/trade/trade.const");
const pagination_dto_1 = require("../../shares/dtos/pagination.dto");
const pagination_util_1 = require("../../shares/pagination-util");
const typeorm_1 = require("typeorm");
const moment = require("moment");
const trade_enum_1 = require("../../shares/enums/trade.enum");
let TradeRepository = class TradeRepository extends base_repository_1.BaseRepository {
    async updateBatch(entities) {
        const queryBuilder = this.createQueryBuilder();
        const overwriteColumns = queryBuilder.connection
            .getMetadata(trade_entity_1.TradeEntity)
            .columns.map((column) => column.propertyName);
        await queryBuilder.insert().values(entities).orUpdate(overwriteColumns, 'id').execute();
    }
    async findYesterdayTrade(date, symbol) {
        const where = {};
        if (symbol) {
            where['symbol'] = symbol;
        }
        where['createdAt'] = typeorm_1.LessThanOrEqual(date);
        return this.findOne({
            where,
            order: {
                createdAt: 'ASC',
            },
        });
    }
    async findTodayTrades(date, from, count) {
        return this.createQueryBuilder()
            .where('createdAt >= :createdAt', { createdAt: date })
            .orderBy('createdAt', 'ASC')
            .skip(from)
            .take(count)
            .getMany();
    }
    async getFills(userId, paging, tradeHistoryDto) {
        const startTime = moment(tradeHistoryDto.startTime).format('YYYY-MM-DD HH:mm:ss');
        const endTime = moment(tradeHistoryDto.endTime).format('YYYY-MM-DD HH:mm:ss');
        const where = `trades.createdAt > '${startTime}' and trades.updatedAt < '${endTime}'`;
        const whereContractType = `trades.contractType = '${tradeHistoryDto.contractType}'`;
        const { offset, limit } = pagination_util_1.getQueryLimit(paging, trade_const_1.MAX_RESULT_COUNT);
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
      ${tradeHistoryDto.symbol
            ? `WHERE trades.symbol = '${tradeHistoryDto.symbol}'  AND trades.buyUserId = ${userId}`
            : `WHERE trades.buyUserId = ${userId}`}
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
      ${tradeHistoryDto.symbol
            ? `WHERE trades.symbol =  '${tradeHistoryDto.symbol}' AND trades.sellUserId = ${userId}`
            : `WHERE trades.sellUserId = ${userId}`}
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
      WHERE ${tradeHistoryDto.symbol
            ? `trades.symbol = '${tradeHistoryDto.symbol}' AND trades.buyUserId = ${userId}`
            : `trades.buyUserId = ${userId}`}
      and ${where}
      and ${whereContractType}
      limit ${limit}`;
        const countSellerQuery = `
      SELECT count(id) as totalItem
      FROM trades 
      WHERE ${tradeHistoryDto.symbol
            ? `trades.symbol = '${tradeHistoryDto.symbol}' AND trades.sellUserId = ${userId}`
            : `trades.sellUserId = ${userId}`}
      and ${where}
      and ${whereContractType}
      limit ${limit}
    `;
        let fills;
        let countResult;
        switch (tradeHistoryDto.side) {
            case trade_enum_1.TradeType.BUY:
                fills = await this.manager.query(getBuyerQuery + `LIMIT ${limitInner} OFFSET ${offset}`);
                countResult = Number((await this.manager.query(countBuyerQuery))[0].totalItem);
                break;
            case trade_enum_1.TradeType.SELL:
                fills = await this.manager.query(getSellerQuery + `LIMIT ${limitInner} OFFSET ${offset}`);
                countResult = Number((await this.manager.query(countSellerQuery))[0].totalItem);
                break;
            case null:
            case trade_enum_1.TradeType.ALL:
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
    async getLastTrade(symbol) {
        return this.find({ where: { symbol }, order: { id: 'DESC' }, take: 1 });
    }
    async getDataTrade(userId, symbol, contract) {
        let queryTradeBuy;
        let queryTradeSell;
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
        }
        else {
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
};
TradeRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(trade_entity_1.TradeEntity)
], TradeRepository);
exports.TradeRepository = TradeRepository;
//# sourceMappingURL=trade.repository.js.map