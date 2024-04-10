"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinInfoService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config = require("config");
const node_fetch_1 = require("node-fetch");
const coin_info_entity_1 = require("../../models/entities/coin-info.entity");
const coin_info_repository_1 = require("../../models/repositories/coin-info.repository");
const coin_info_constants_1 = require("./coin-info.constants");
const exceptions_1 = require("../../shares/exceptions");
const funding_const_1 = require("../funding/funding.const");
let CoinInfoService = class CoinInfoService {
    constructor(coinInfoRepository, cacheManager) {
        this.coinInfoRepository = coinInfoRepository;
        this.cacheManager = cacheManager;
    }
    async getInfo() {
        const coins = coin_info_constants_1.COIN_INFO_ID;
        const coingeckoUrl = config.get('coin_info.coingeckoUrl');
        for (const c in coins) {
            try {
                const response = await node_fetch_1.default(`${coingeckoUrl}/coins/${coins[c]}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`, {
                    method: 'get',
                });
                if (!response.ok) {
                    throw new Error('Error call coingeckco');
                }
                const data = await response.json();
                await this.saveData(data);
            }
            catch (err) {
                console.log(err);
            }
            await this.delay(30000);
        }
        await this.cacheManager.set(funding_const_1.KEY_CACHE_HEALTHCHECK_GET_FUNDING, true, { ttl: 60 * 60 + 5 });
    }
    async findCoin(coinId) {
        return await this.coinInfoRepository.find({
            baseId: coinId,
        });
    }
    async saveData(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const checkCoin = await this.findCoin(data.id);
        if (checkCoin.length) {
            await this.coinInfoRepository.manager
                .createQueryBuilder()
                .update(coin_info_entity_1.CoinInfoEntity)
                .set({
                fullName: (data === null || data === void 0 ? void 0 : data.name) || null,
                baseId: data.id,
                symbol: (data === null || data === void 0 ? void 0 : data.symbol) || null,
                rank: (data === null || data === void 0 ? void 0 : data.market_cap_rank) || null,
                marketCap: ((_a = data === null || data === void 0 ? void 0 : data.market_data) === null || _a === void 0 ? void 0 : _a.market_cap.usd) || null,
                cirSupply: ((_b = data === null || data === void 0 ? void 0 : data.market_data) === null || _b === void 0 ? void 0 : _b.circulating_supply) || null,
                maxSupply: ((_c = data === null || data === void 0 ? void 0 : data.market_data) === null || _c === void 0 ? void 0 : _c.max_supply) || null,
                totalSupply: ((_d = data === null || data === void 0 ? void 0 : data.market_data) === null || _d === void 0 ? void 0 : _d.total_supply) || null,
                issueDate: null,
                issuePrice: null,
                explorer: ((_e = data === null || data === void 0 ? void 0 : data.links) === null || _e === void 0 ? void 0 : _e.homepage[0]) || '',
            })
                .where('baseId = :baseId', { baseId: data.id })
                .execute();
        }
        else {
            await this.coinInfoRepository.manager
                .createQueryBuilder()
                .insert()
                .into(coin_info_entity_1.CoinInfoEntity)
                .values({
                fullName: (data === null || data === void 0 ? void 0 : data.name) || null,
                baseId: data.id,
                symbol: (data === null || data === void 0 ? void 0 : data.symbol) || null,
                rank: (data === null || data === void 0 ? void 0 : data.coingecko_rank) || null,
                marketCap: ((_f = data === null || data === void 0 ? void 0 : data.market_data) === null || _f === void 0 ? void 0 : _f.market_cap.usd) || null,
                cirSupply: ((_g = data === null || data === void 0 ? void 0 : data.market_data) === null || _g === void 0 ? void 0 : _g.circulating_supply) || null,
                maxSupply: ((_h = data === null || data === void 0 ? void 0 : data.market_data) === null || _h === void 0 ? void 0 : _h.max_supply) || null,
                totalSupply: ((_j = data === null || data === void 0 ? void 0 : data.market_data) === null || _j === void 0 ? void 0 : _j.total_supply) || null,
                issueDate: null,
                issuePrice: null,
                explorer: ((_k = data === null || data === void 0 ? void 0 : data.links) === null || _k === void 0 ? void 0 : _k.homepage[0]) || '',
            })
                .execute();
        }
    }
    async getCoinInfo(coin) {
        return await this.coinInfoRepository.findOne({
            symbol: coin,
        });
    }
    async getAllCoinInfo() {
        const coinInfoCache = (await this.cacheManager.get(coin_info_constants_1.COIN_INFO_CACHE));
        if (coinInfoCache)
            return coinInfoCache;
        const coinInfo = await this.coinInfoRepository.find();
        await this.cacheManager.set(coin_info_constants_1.COIN_INFO_CACHE, coinInfo, { ttl: coin_info_constants_1.COIN_INFO_TTL });
        return coinInfo;
    }
    async delay(milliseconds) {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    }
    async insertCoinImage() {
        const matadata = await node_fetch_1.default(`${process.env.SPOT_URL_API}/api/v1/masterdata`, {
            method: 'get',
        });
        const resp = await matadata.json();
        const coinImage = resp.data.coins;
        for (const item of coinImage) {
            const checkCoinInfo = await this.getCoinInfo(item.coin);
            const image = item.icon_image;
            if (checkCoinInfo && !checkCoinInfo.coin_image) {
                await this.coinInfoRepository.update({ symbol: item.coin }, { coin_image: image });
            }
        }
    }
    async getCurrentPriceWithBTC(symbol) {
        var _a;
        symbol = symbol.toLowerCase();
        const priceInCache = await this.cacheManager.get(`${coin_info_constants_1.CURRENT_PRICE_COIN_INFO_CACHE}_${symbol}`);
        if (priceInCache) {
            return priceInCache;
        }
        const coingeckoUrl = config.get('coin_info.coingeckoUrl');
        const response = await node_fetch_1.default(`${coingeckoUrl}/coins/markets?vs_currency=btc&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en&ids=${symbol}`, {
            method: 'get',
        });
        const data = await response.json();
        const price = (_a = data.find((d) => d.symbol === symbol)) === null || _a === void 0 ? void 0 : _a.current_price;
        if (!price) {
            throw new common_1.HttpException(exceptions_1.httpErrors.SYMBOL_DOES_NOT_EXIST, common_1.HttpStatus.NOT_FOUND);
        }
        await this.cacheManager.set(`${coin_info_constants_1.CURRENT_PRICE_COIN_INFO_CACHE}_${symbol}`, price, {
            ttl: coin_info_constants_1.CURRENT_PRICE_COIN_INFO_TTL,
        });
        return price;
    }
};
CoinInfoService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(coin_info_repository_1.CoinInfoRepository, 'master')),
    tslib_1.__param(1, common_1.Inject(common_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [coin_info_repository_1.CoinInfoRepository, Object])
], CoinInfoService);
exports.CoinInfoService = CoinInfoService;
//# sourceMappingURL=coin-info.service.js.map