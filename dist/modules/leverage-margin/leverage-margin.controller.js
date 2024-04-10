"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeverageMarginController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const leverage_margin_entity_1 = require("../../models/entities/leverage-margin.entity");
const leverage_margin_service_1 = require("./leverage-margin.service");
const roles_decorator_1 = require("../../shares/decorators/roles.decorator");
const leverage_margin_dto_1 = require("./dto/leverage-margin.dto");
let LeverageMarginController = class LeverageMarginController {
    constructor(leverageMarginService) {
        this.leverageMarginService = leverageMarginService;
    }
    async getAllLeverageMargin(symbol) {
        const response = await this.leverageMarginService.findBy({
            symbol: symbol,
        });
        return response;
    }
    async upsertLeverageMargin(leverageMarginDto) {
        const response = await this.leverageMarginService.upsertLeverageMargin(leverageMarginDto);
        return response;
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__param(0, common_1.Query('symbol')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], LeverageMarginController.prototype, "getAllLeverageMargin", null);
tslib_1.__decorate([
    common_1.Post(),
    common_1.UseGuards(roles_decorator_1.AdminAndSuperAdmin),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [leverage_margin_dto_1.LeverageMarginDto]),
    tslib_1.__metadata("design:returntype", Promise)
], LeverageMarginController.prototype, "upsertLeverageMargin", null);
LeverageMarginController = tslib_1.__decorate([
    common_1.Controller('leverage-margin'),
    swagger_1.ApiTags('Leverage-margin'),
    swagger_1.ApiBearerAuth(),
    tslib_1.__metadata("design:paramtypes", [leverage_margin_service_1.LeverageMarginService])
], LeverageMarginController);
exports.LeverageMarginController = LeverageMarginController;
//# sourceMappingURL=leverage-margin.controller.js.map