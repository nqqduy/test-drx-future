"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_console_1 = require("nestjs-console");
const trade_entity_1 = require("../../models/entities/trade.entity");
const trade_repository_1 = require("../../models/repositories/trade.repository");
const trade_service_1 = require("./trade.service");
let TradeSeedCommand = class TradeSeedCommand {
    constructor(tradeRepository, tradeService) {
        this.tradeRepository = tradeRepository;
        this.tradeService = tradeService;
    }
    async seedTrades() {
        await this.tradeRepository
            .createQueryBuilder()
            .insert()
            .into(trade_entity_1.TradeEntity)
            .values([
            {
                symbol: 'BTCUSD',
                price: '17000',
                quantity: '1',
            },
            {
                symbol: 'BTCUSD',
                price: '17300',
                quantity: '2',
                buyerIsTaker: true,
            },
            {
                symbol: 'ETHUSD',
                price: '1200',
                quantity: '1',
                buyerIsTaker: true,
            },
            {
                symbol: 'ETHUSDT',
                price: '1210',
                quantity: '1',
                buyerIsTaker: true,
            },
            {
                symbol: 'BNBUSD',
                price: '240',
                quantity: '1',
                buyerIsTaker: true,
            },
            {
                symbol: 'BNBUSDT',
                price: '250',
                quantity: '1',
                buyerIsTaker: true,
            },
            {
                symbol: 'BTCUSD',
                price: '17350',
                quantity: '2',
                buyerIsTaker: false,
            },
            {
                symbol: 'ETHUSD',
                price: '1350',
                quantity: '1',
                buyerIsTaker: false,
            },
            {
                symbol: 'ETHUSDT',
                price: '1310',
                quantity: '1',
                buyerIsTaker: false,
            },
            {
                symbol: 'BNBUSD',
                price: '231',
                quantity: '1',
                buyerIsTaker: false,
            },
            {
                symbol: 'BNBUSDT',
                price: '260',
                quantity: '2',
                buyerIsTaker: false,
            },
        ])
            .execute();
    }
    async updateTrade() {
        await this.tradeService.updateTrade();
    }
    async updateTradeEmail() {
        await this.tradeService.updateTradeEmail();
    }
    async testUpdateTradeEmail(tradeId) {
        await this.tradeService.testUpdateTradeEmail(tradeId);
    }
};
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'seed:market-trades',
        description: 'seed market trades',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TradeSeedCommand.prototype, "seedTrades", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'seed:update-trade',
        description: 'update trade',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TradeSeedCommand.prototype, "updateTrade", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'trade:update-trade-email',
        description: 'update trade-email',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TradeSeedCommand.prototype, "updateTradeEmail", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'trade:test-update-trade-email [tradeId]',
        description: 'update trade-email',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TradeSeedCommand.prototype, "testUpdateTradeEmail", null);
TradeSeedCommand = tslib_1.__decorate([
    nestjs_console_1.Console(),
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(trade_repository_1.TradeRepository, 'master')),
    tslib_1.__metadata("design:paramtypes", [trade_repository_1.TradeRepository,
        trade_service_1.TradeService])
], TradeSeedCommand);
exports.default = TradeSeedCommand;
//# sourceMappingURL=trade.console.js.map