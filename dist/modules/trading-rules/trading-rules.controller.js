"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradingRulesController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pagination_dto_1 = require("../../shares/dtos/pagination.dto");
const trading_rules_dto_1 = require("./dto/trading-rules.dto");
const trading_rule_service_1 = require("./trading-rule.service");
let TradingRulesController = class TradingRulesController {
    constructor(tradingRulesService) {
        this.tradingRulesService = tradingRulesService;
    }
    async updateMarginMode(input) {
        return {
            data: await this.tradingRulesService.insertOrUpdateTradingRules(input),
        };
    }
    async getTradingRuleByInstrumentId(symbol) {
        return {
            data: await this.tradingRulesService.getTradingRuleByInstrumentId(symbol),
        };
    }
    async getAllTradingRules(input) {
        return {
            data: await this.tradingRulesService.getAllTradingRules(input),
        };
    }
};
tslib_1.__decorate([
    common_1.Post(),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [trading_rules_dto_1.TradingRulesModeDto]),
    tslib_1.__metadata("design:returntype", Promise)
], TradingRulesController.prototype, "updateMarginMode", null);
tslib_1.__decorate([
    common_1.Get('symbol'),
    tslib_1.__param(0, common_1.Query('symbol')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TradingRulesController.prototype, "getTradingRuleByInstrumentId", null);
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__param(0, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    tslib_1.__metadata("design:returntype", Promise)
], TradingRulesController.prototype, "getAllTradingRules", null);
TradingRulesController = tslib_1.__decorate([
    common_1.Controller('trading-rules'),
    swagger_1.ApiTags('tradingRules'),
    tslib_1.__metadata("design:paramtypes", [trading_rule_service_1.TradingRulesService])
], TradingRulesController);
exports.TradingRulesController = TradingRulesController;
//# sourceMappingURL=trading-rules.controller.js.map