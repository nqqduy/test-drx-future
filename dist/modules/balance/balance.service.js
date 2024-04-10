"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const position_service_1 = require("../position/position.service");
const order_service_1 = require("../order/order.service");
const balance_const_1 = require("./balance.const");
const bignumber_js_1 = require("bignumber.js");
const account_service_1 = require("../account/account.service");
const transaction_enum_1 = require("../../shares/enums/transaction.enum");
const node_fetch_1 = require("node-fetch");
const account_repository_1 = require("../../models/repositories/account.repository");
const typeorm_1 = require("@nestjs/typeorm");
const account_entity_1 = require("../../models/entities/account.entity");
const position_repository_1 = require("../../models/repositories/position.repository");
const user_repository_1 = require("../../models/repositories/user.repository");
const exceptions_1 = require("../../shares/exceptions");
const order_enum_1 = require("../../shares/enums/order.enum");
const index_service_1 = require("../index/index.service");
const instrument_repository_1 = require("../../models/repositories/instrument.repository");
const transaction_const_1 = require("../transaction/transaction.const");
const order_repository_1 = require("../../models/repositories/order.repository");
const typeorm_2 = require("typeorm");
let BalanceService = class BalanceService {
    constructor(indexService, positionService, positionRepoReport, userRepoReport, orderRepoReport, instrumentRepoReport, orderService, accountService, accountRepoReport, accountRepoMaster) {
        this.indexService = indexService;
        this.positionService = positionService;
        this.positionRepoReport = positionRepoReport;
        this.userRepoReport = userRepoReport;
        this.orderRepoReport = orderRepoReport;
        this.instrumentRepoReport = instrumentRepoReport;
        this.orderService = orderService;
        this.accountService = accountService;
        this.accountRepoReport = accountRepoReport;
        this.accountRepoMaster = accountRepoMaster;
    }
    async getUserBalance(userId) {
        return await this.accountRepoMaster.find({ where: { userId } });
    }
    async getAssets(userId) {
        const prices = await node_fetch_1.default(`${process.env.SPOT_URL_API}/api/v1/prices`, {
            method: 'get',
        });
        const resp = await prices.json();
        const account = await this.accountRepoReport.find({ where: { userId } });
        const listPriceFilter = {};
        for (const [key, value] of Object.entries(resp.data)) {
            if (key.includes('usd_') || key.includes('btc_')) {
                listPriceFilter[`${key}`] = value;
            }
        }
        const assets = [];
        let totalEstimateUSD = new bignumber_js_1.default(0);
        account.map((a) => {
            var _a, _b, _c, _d;
            const priceOfCoins = Object.values(listPriceFilter).filter((p) => a.asset.toLowerCase() === p.coin);
            const newAsset = {
                asset: a.asset,
                balance: a.balance,
                estimateBTC: '0',
                estimateUSD: '0',
            };
            if (a.asset.toLowerCase() === 'usd') {
                newAsset['estimateBTC'] =
                    ((_a = Object.values(listPriceFilter).find((p) => p.coin === 'usdt' && p.currency === transaction_enum_1.AssetType.BTC.toLowerCase())) === null || _a === void 0 ? void 0 : _a.price) || '0';
                newAsset['estimateUSD'] =
                    ((_b = Object.values(listPriceFilter).find((p) => p.coin === 'usdt' && p.currency === transaction_enum_1.AssetType.USD.toLowerCase())) === null || _b === void 0 ? void 0 : _b.price) || '0';
            }
            if (priceOfCoins.length) {
                newAsset['estimateBTC'] =
                    ((_c = priceOfCoins.find((poc) => poc.currency === transaction_enum_1.AssetType.BTC.toLowerCase())) === null || _c === void 0 ? void 0 : _c.price) || '0';
                newAsset['estimateUSD'] =
                    ((_d = priceOfCoins.find((poc) => poc.currency === transaction_enum_1.AssetType.USD.toLowerCase())) === null || _d === void 0 ? void 0 : _d.price) || '0';
            }
            if (newAsset['estimateUSD']) {
                assets.push(newAsset);
                totalEstimateUSD = totalEstimateUSD.plus(newAsset['estimateUSD']);
            }
        });
        return {
            assets,
            totalWalletBalance: totalEstimateUSD.toString(),
        };
    }
    async formatAccountBeforeResponse(account) {
        const [usdtAsset, usdAsset] = await Promise.all([
            await this.calAvailableBalance(account.usdtBalance, account.id, balance_const_1.USDT),
            await this.calAvailableBalance(account.usdBalance, account.id, balance_const_1.USD),
        ]);
        account.usdtAvailableBalance = usdtAsset.availableBalance;
        account.usdAvailableBalance = usdAsset.availableBalance;
        account.orderMargin = usdtAsset.orderMargin;
        account.positionMarginIsolate = usdtAsset.positionMarginIsolate;
        account.positionMarginCross = usdtAsset.positionMarginCross;
        account.unrealizedPNL = usdtAsset.unrealizedPNL;
        account.positionMargin = usdtAsset.positionMargin;
        return account;
    }
    async calAvailableBalance(walletBalance, accountId, asset) {
        const position = await this.positionService.calPositionMarginForAcc(accountId, asset);
        const orderMargin = await this.orderService.calOrderMargin(accountId, asset);
        const availableBalance = new bignumber_js_1.default(walletBalance)
            .minus(position.positionMargin)
            .minus(orderMargin)
            .plus(position.unrealizedPNL)
            .toString();
        return {
            availableBalance,
            orderMargin,
            positionMargin: position.positionMargin,
            unrealizedPNL: position.unrealizedPNL,
            positionMarginCross: position.positionMarginCross,
            positionMarginIsolate: position.positionMarginIsIsolate,
        };
    }
    async convertTokenToUSd() { }
    async convertTokenToBTC() { }
    async getInforBalance(userId, asset) {
        const user = await this.userRepoReport.findOne({ where: { id: userId } });
        const response = {};
        if (!user) {
            throw new common_1.HttpException(exceptions_1.httpErrors.USER_NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
        }
        if (asset) {
            if (![...transaction_const_1.LIST_COINM, 'USDT', 'USD'].includes(asset)) {
                throw new common_1.HttpException(exceptions_1.httpErrors.SYMBOL_DOES_NOT_EXIST, common_1.HttpStatus.BAD_REQUEST);
            }
            const result = await this.getInforBalanceBySymbol(userId, asset);
            response[`${asset}`] = result;
        }
        else {
            const listAsset = [...transaction_const_1.LIST_COINM, 'USDT', 'USD'];
            for (const itemAsset of listAsset) {
                const result = await this.getInforBalanceBySymbol(userId, itemAsset);
                response[`${itemAsset}`] = result;
            }
        }
        return response;
    }
    async getInforBalanceBySymbol(userId, asset) {
        const symbols = this.getSymbolOfAsset(asset);
        const account = await this.accountRepoReport.findOne({ where: { asset, userId } });
        if (!account) {
            return null;
        }
        const resultAsset = {};
        let unrealizedPnlOfCross = '0';
        const totalCost = await this.calOrderMargin(userId, symbols);
        let totalPositionMargin = '0';
        let totalPnlOfAsset = '0';
        let unrealizedPNL = '0';
        let positionMargin = '0';
        let totalAllocated = '0';
        for (const symbol of symbols) {
            const [oraclePrice, position, instrument, indexPrice] = await Promise.all([
                this.indexService.getOraclePrices([symbol]),
                this.positionRepoReport.findOne({ where: { symbol, userId, currentQty: typeorm_2.Not('0') } }),
                this.instrumentRepoReport.findOne({ where: { symbol } }),
                this.indexService.getIndexPrices([symbol]),
            ]);
            if (!position) {
                continue;
            }
            let allocatedMargin = '0';
            const sideValue = +position.currentQty > 0 ? 1 : -1;
            switch (position.contractType) {
                case order_enum_1.ContractType.COIN_M:
                    if (position.isCross) {
                        positionMargin = new bignumber_js_1.default((Math.abs(+position.currentQty) * +instrument.multiplier) / (+position.leverage * +oraclePrice[0])).toString();
                        allocatedMargin = positionMargin;
                        totalAllocated = new bignumber_js_1.default(totalAllocated).plus(new bignumber_js_1.default(allocatedMargin)).toString();
                    }
                    else {
                        positionMargin = new bignumber_js_1.default(+position.positionMargin).toString();
                        allocatedMargin = new bignumber_js_1.default(position.positionMargin).plus(position.adjustMargin).toString();
                        totalAllocated = new bignumber_js_1.default(totalAllocated).plus(new bignumber_js_1.default(allocatedMargin)).toString();
                    }
                    console.log({ allocatedMargin, position, indexPrice, oraclePrice, resultAsset });
                    unrealizedPNL = new bignumber_js_1.default(Math.abs(+position.currentQty) *
                        +instrument.multiplier *
                        (1 / +position.entryPrice - 1 / +oraclePrice[0]) *
                        sideValue).toString();
                    break;
                case order_enum_1.ContractType.USD_M:
                    if (position.isCross) {
                        positionMargin = new bignumber_js_1.default((Math.abs(+position.currentQty) * +oraclePrice[0]) / +position.leverage).toString();
                        allocatedMargin = positionMargin;
                        totalAllocated = new bignumber_js_1.default(totalAllocated).plus(new bignumber_js_1.default(allocatedMargin)).toString();
                    }
                    else {
                        positionMargin = new bignumber_js_1.default(+position.positionMargin).toString();
                        allocatedMargin = new bignumber_js_1.default(position.positionMargin).plus(position.adjustMargin).toString();
                        totalAllocated = new bignumber_js_1.default(totalAllocated).plus(new bignumber_js_1.default(allocatedMargin)).toString();
                    }
                    unrealizedPNL = new bignumber_js_1.default(Math.abs(+position.currentQty) * (+oraclePrice[0] - +position.entryPrice) * sideValue).toString();
                    break;
                default:
                    break;
            }
            const unrealizedPNLAdd = position.isCross ? unrealizedPNL : 0;
            unrealizedPnlOfCross = new bignumber_js_1.default(unrealizedPnlOfCross).plus(new bignumber_js_1.default(unrealizedPNLAdd)).toString();
            totalPositionMargin = new bignumber_js_1.default(totalPositionMargin).plus(new bignumber_js_1.default(positionMargin)).toString();
            totalPnlOfAsset = new bignumber_js_1.default(totalPnlOfAsset).plus(new bignumber_js_1.default(unrealizedPNL)).toString();
        }
        console.log('check available', { totalAllocated, totalCost, unrealizedPnlOfCross });
        const availableBalance = new bignumber_js_1.default(+account.balance)
            .minus(new bignumber_js_1.default(totalAllocated))
            .minus(totalCost)
            .plus(unrealizedPnlOfCross)
            .toString();
        resultAsset['availableBalance'] = availableBalance;
        resultAsset['totalPnlOfAsset'] = totalPnlOfAsset;
        resultAsset['totalBalance'] = account.balance;
        resultAsset['positionMargin'] = totalAllocated.toString();
        return resultAsset;
    }
    getSymbolOfAsset(asset) {
        const listSymbol = [...transaction_const_1.LIST_SYMBOL_COINM, ...transaction_const_1.LIST_SYMBOL_USDM];
        if (asset === 'USDT') {
            return listSymbol.filter((symbol) => symbol.includes('USDT'));
        }
        else if (asset === 'USD') {
            return listSymbol.filter((symbol) => !symbol.includes('USDM') && !symbol.includes('USDT'));
        }
        else {
            return listSymbol.filter((symbol) => symbol.includes(`${asset}USDM`));
        }
    }
    async calOrderMargin(userId, symbols) {
        try {
            const result = await this.orderRepoReport
                .createQueryBuilder('o')
                .where('o.symbol In (:symbols)', { symbols })
                .andWhere('o.userId = :userId', { userId })
                .andWhere('o.status IN (:status)', {
                status: [order_enum_1.OrderStatus.ACTIVE, order_enum_1.OrderStatus.UNTRIGGERED],
            })
                .select('SUM(o.cost) as totalCost')
                .getRawOne();
            return result.totalCost ? result.totalCost : 0;
        }
        catch (error) {
            console.log(error);
            throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async getTotalUserBalances() {
        const [instruments] = await Promise.all([
            this.instrumentRepoReport.find({ select: ['symbol'] }),
        ]);
        const lstCoinSupport = [
            ...new Set(instruments
                .map((instrument) => instrument.symbol)
                .map((symbol) => {
                if (symbol.includes('USDM')) {
                    return symbol.split('USDM')[0];
                }
                else if (symbol.includes('USDT')) {
                    return 'USDT';
                }
                else {
                    return 'USD';
                }
            })),
        ];
        return await this.accountRepoReport
            .createQueryBuilder('a')
            .select([
            'a.asset as asset',
            'sum(a.balance) as totalBalance'
        ])
            .where({
            asset: typeorm_2.In(lstCoinSupport)
        })
            .groupBy('a.asset').getRawMany();
    }
};
BalanceService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(2, typeorm_1.InjectRepository(position_repository_1.PositionRepository, 'report')),
    tslib_1.__param(3, typeorm_1.InjectRepository(user_repository_1.UserRepository, 'report')),
    tslib_1.__param(4, typeorm_1.InjectRepository(order_repository_1.OrderRepository, 'report')),
    tslib_1.__param(5, typeorm_1.InjectRepository(instrument_repository_1.InstrumentRepository, 'report')),
    tslib_1.__param(8, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'report')),
    tslib_1.__param(9, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'master')),
    tslib_1.__metadata("design:paramtypes", [index_service_1.IndexService,
        position_service_1.PositionService,
        position_repository_1.PositionRepository,
        user_repository_1.UserRepository,
        order_repository_1.OrderRepository,
        instrument_repository_1.InstrumentRepository,
        order_service_1.OrderService,
        account_service_1.AccountService,
        account_repository_1.AccountRepository,
        account_repository_1.AccountRepository])
], BalanceService);
exports.BalanceService = BalanceService;
//# sourceMappingURL=balance.service.js.map