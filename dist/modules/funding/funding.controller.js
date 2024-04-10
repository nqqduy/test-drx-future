"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundingController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const funding_entity_1 = require("../../models/entities/funding.entity");
const account_service_1 = require("../account/account.service");
const funding_service_1 = require("./funding.service");
const from_to_dto_1 = require("../../shares/dtos/from-to.dto");
const response_dto_1 = require("../../shares/dtos/response.dto");
let FundingController = class FundingController {
    constructor(fundingService, accountService) {
        this.fundingService = fundingService;
        this.accountService = accountService;
    }
    async getFundingHistoryByAccountId(symbol) {
        return await this.fundingService.getFundingHistoryByAccountId(symbol);
    }
    async getFundingRatesFromTo(symbol, fromTo) {
        const fundingRates = await this.fundingService.getFundingRatesFromTo(symbol, fromTo);
        return {
            data: fundingRates,
        };
    }
};
tslib_1.__decorate([
    common_1.Get('/history'),
    swagger_1.ApiQuery({
        name: 'symbol',
        example: 'BTCUSD',
        required: false,
    }),
    tslib_1.__param(0, common_1.Query('symbol')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], FundingController.prototype, "getFundingHistoryByAccountId", null);
tslib_1.__decorate([
    common_1.Get('/rate/:symbol'),
    swagger_1.ApiParam({
        name: 'symbol',
        example: 'BTCUSD',
        required: true,
    }),
    tslib_1.__param(0, common_1.Param('symbol')),
    tslib_1.__param(1, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, from_to_dto_1.FromToDto]),
    tslib_1.__metadata("design:returntype", Promise)
], FundingController.prototype, "getFundingRatesFromTo", null);
FundingController = tslib_1.__decorate([
    common_1.Controller('funding'),
    swagger_1.ApiTags('Funding'),
    swagger_1.ApiBearerAuth(),
    tslib_1.__metadata("design:paramtypes", [funding_service_1.FundingService, account_service_1.AccountService])
], FundingController);
exports.FundingController = FundingController;
//# sourceMappingURL=funding.controller.js.map