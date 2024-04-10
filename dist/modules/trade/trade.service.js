"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeService = void 0;
const tslib_1 = require("tslib");
const trade_const_1 = require("./trade.const");
const pagination_util_1 = require("./../../shares/pagination-util");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const trade_entity_1 = require("../../models/entities/trade.entity");
const trade_repository_1 = require("../../models/repositories/trade.repository");
const get_fills_dto_1 = require("./dto/get-fills.dto");
const pagination_dto_1 = require("../../shares/dtos/pagination.dto");
const response_dto_1 = require("../../shares/dtos/response.dto");
const moment = require("moment");
const typeorm_2 = require("typeorm");
const account_repository_1 = require("../../models/repositories/account.repository");
const account_entity_1 = require("../../models/entities/account.entity");
const transaction_const_1 = require("../transaction/transaction.const");
const user_repository_1 = require("../../models/repositories/user.repository");
let TradeService = class TradeService {
    constructor(tradeRepoMaster, tradeRepoReport, accountRepoReport, accountRepoMaster, userRepoReport) {
        this.tradeRepoMaster = tradeRepoMaster;
        this.tradeRepoReport = tradeRepoReport;
        this.accountRepoReport = accountRepoReport;
        this.accountRepoMaster = accountRepoMaster;
        this.userRepoReport = userRepoReport;
        setTimeout(() => {
            this.updateTrade();
        }, 3000);
    }
    async getFillTrade(accountId, paging, tradeHistoryDto) {
        const [fills, totalPage] = await this.tradeRepoReport.getFills(accountId, paging, tradeHistoryDto);
        return {
            data: fills,
            metadata: {
                totalPage: totalPage,
            },
        };
    }
    async getRecentTrades(symbol, paging) {
        const trades = await this.tradeRepoReport.find({
            select: ['symbol', 'price', 'quantity', 'buyerIsTaker', 'createdAt', 'id'],
            where: {
                symbol,
            },
            take: paging.size,
            order: {
                id: 'DESC',
            },
        });
        return trades;
    }
    async findYesterdayTrade(date, symbol) {
        return this.tradeRepoReport.findYesterdayTrade(date, symbol);
    }
    async findTodayTrades(date, from, count) {
        return this.tradeRepoReport.findTodayTrades(date, from, count);
    }
    async getLastTrade(symbol) {
        return this.tradeRepoMaster.getLastTrade(symbol);
    }
    async getLastTradeId() {
        return await this.tradeRepoMaster.getLastId();
    }
    async getTrades(paging, queries) {
        const startTime = moment(queries.from).format('YYYY-MM-DD 00:00:00');
        const endTime = moment(queries.to).format('YYYY-MM-DD 23:59:59');
        const commonAndConditions = {
            createdAt: typeorm_2.MoreThan(startTime),
            updatedAt: typeorm_2.LessThan(endTime),
        };
        if (queries.symbol) {
            commonAndConditions['symbol'] = typeorm_2.Like(`%${queries.symbol}%`);
        }
        const { offset, limit } = pagination_util_1.getQueryLimit(paging, trade_const_1.MAX_RESULT_COUNT);
        const query = this.tradeRepoReport
            .createQueryBuilder('tr')
            .select('tr.*')
            .where([commonAndConditions])
            .orderBy('tr.createdAt', 'DESC')
            .limit(limit)
            .offset(offset);
        const [trades, count] = await Promise.all([query.getRawMany(), query.getCount()]);
        return {
            data: trades,
            metadata: {
                total: count,
                totalPage: Math.ceil(count / paging.size),
            },
        };
    }
    async updateTrade() {
        let skip = transaction_const_1.START_CRAWL;
        const take = transaction_const_1.GET_NUMBER_RECORD;
        do {
            const listTrade = await this.tradeRepoMaster.find({
                where: [
                    {
                        buyUserId: typeorm_2.IsNull(),
                    },
                    {
                        sellUserId: typeorm_2.IsNull(),
                    },
                ],
                skip,
                take,
            });
            skip += take;
            if (listTrade.length) {
                for (const item of listTrade) {
                    const getBuyUserId = await typeorm_2.getConnection('report')
                        .getRepository(account_entity_1.AccountEntity)
                        .findOne({
                        where: {
                            id: item.buyAccountId,
                        },
                    });
                    const getSellUserId = await typeorm_2.getConnection('report')
                        .getRepository(account_entity_1.AccountEntity)
                        .findOne({
                        where: {
                            id: item.sellAccountId,
                        },
                    });
                    await this.tradeRepoMaster.update({ buyAccountId: getBuyUserId === null || getBuyUserId === void 0 ? void 0 : getBuyUserId.id }, { buyUserId: getBuyUserId === null || getBuyUserId === void 0 ? void 0 : getBuyUserId.userId });
                    await this.tradeRepoMaster.update({ sellAccountId: getSellUserId === null || getSellUserId === void 0 ? void 0 : getSellUserId.id }, { sellUserId: getSellUserId === null || getSellUserId === void 0 ? void 0 : getSellUserId.userId });
                    const asset = item.symbol.includes('USDT') ? 'USDT' : 'USD';
                    const buyAccountId = await this.accountRepoReport.findOne({
                        where: {
                            asset: asset.toLowerCase(),
                            userId: getBuyUserId === null || getBuyUserId === void 0 ? void 0 : getBuyUserId.userId,
                        },
                    });
                    const sellAccountId = await this.accountRepoReport.findOne({
                        where: {
                            asset: asset.toLowerCase(),
                            userId: getSellUserId === null || getSellUserId === void 0 ? void 0 : getSellUserId.userId,
                        },
                    });
                    await this.tradeRepoMaster.update({ buyUserId: getBuyUserId === null || getBuyUserId === void 0 ? void 0 : getBuyUserId.id }, { buyAccountId: buyAccountId === null || buyAccountId === void 0 ? void 0 : buyAccountId.id });
                    await this.tradeRepoMaster.update({ sellUserId: getSellUserId === null || getSellUserId === void 0 ? void 0 : getSellUserId.id }, { sellAccountId: sellAccountId === null || sellAccountId === void 0 ? void 0 : sellAccountId.id });
                }
            }
            else {
                break;
            }
        } while (true);
    }
    async updateTradeEmail() {
        let skip = 0;
        const take = 1000;
        do {
            const tradesUpdate = await this.tradeRepoReport.find({
                where: {
                    buyEmail: typeorm_2.IsNull(),
                    sellEmail: typeorm_2.IsNull(),
                },
                skip,
                take,
            });
            skip += take;
            if (tradesUpdate.length > 0) {
                for (const trade of tradesUpdate) {
                    const [buyUser, sellUser] = await Promise.all([
                        this.userRepoReport.findOne({ where: { id: trade.buyUserId } }),
                        this.userRepoReport.findOne({ where: { id: trade.sellUserId } }),
                    ]);
                    await this.tradeRepoMaster.update({ id: trade.id }, {
                        buyEmail: (buyUser === null || buyUser === void 0 ? void 0 : buyUser.email) ? buyUser.email : null,
                        sellEmail: (sellUser === null || sellUser === void 0 ? void 0 : sellUser.email) ? sellUser.email : null,
                        updatedAt: () => 'trades.updatedAt',
                        createdAt: () => 'trades.createdAt',
                    });
                }
            }
            else {
                break;
            }
        } while (true);
    }
    async testUpdateTradeEmail(tradeId) {
        const tradesUpdate = await this.tradeRepoReport.findOne({
            where: {
                buyEmail: typeorm_2.IsNull(),
                sellEmail: typeorm_2.IsNull(),
                id: +tradeId,
            },
        });
        const [buyUser, sellUser] = await Promise.all([
            this.userRepoReport.findOne({ where: { id: tradesUpdate.buyUserId } }),
            this.userRepoReport.findOne({ where: { id: tradesUpdate.sellUserId } }),
        ]);
        await this.tradeRepoMaster.update({ id: +tradeId }, {
            buyEmail: (buyUser === null || buyUser === void 0 ? void 0 : buyUser.email) ? buyUser.email : null,
            sellEmail: (sellUser === null || sellUser === void 0 ? void 0 : sellUser.email) ? sellUser.email : null,
            updatedAt: () => 'trades.updatedAt',
            createdAt: () => 'trades.createdAt',
        });
    }
};
TradeService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(trade_repository_1.TradeRepository, 'master')),
    tslib_1.__param(1, typeorm_1.InjectRepository(trade_repository_1.TradeRepository, 'report')),
    tslib_1.__param(2, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'report')),
    tslib_1.__param(3, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'master')),
    tslib_1.__param(4, typeorm_1.InjectRepository(user_repository_1.UserRepository, 'report')),
    tslib_1.__metadata("design:paramtypes", [trade_repository_1.TradeRepository,
        trade_repository_1.TradeRepository,
        account_repository_1.AccountRepository,
        account_repository_1.AccountRepository,
        user_repository_1.UserRepository])
], TradeService);
exports.TradeService = TradeService;
//# sourceMappingURL=trade.service.js.map