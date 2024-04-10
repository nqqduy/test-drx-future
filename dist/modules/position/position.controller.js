"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const admin_position_dto_1 = require("./dto/admin-position.dto");
const swagger_1 = require("@nestjs/swagger");
const order_entity_1 = require("../../models/entities/order.entity");
const position_entity_1 = require("../../models/entities/position.entity");
const account_service_1 = require("../account/account.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const position_service_1 = require("./position.service");
const get_user_id_decorator_1 = require("../../shares/decorators/get-user-id.decorator");
const pagination_dto_1 = require("../../shares/dtos/pagination.dto");
const response_dto_1 = require("../../shares/dtos/response.dto");
const close_position_dto_1 = require("./dto/close-position.dto");
const RemoveTpSlDto_1 = require("./dto/RemoveTpSlDto");
const update_margin_dto_1 = require("./dto/update-margin.dto");
const update_position_dto_1 = require("./dto/update-position.dto");
const jwt_admin_guard_1 = require("../auth/guards/jwt.admin.guard");
const order_enum_1 = require("../../shares/enums/order.enum");
const close_all_position_dto_1 = require("./dto/close-all-position.dto");
const get_info_position_dto_1 = require("./dto/get-info-position.dto");
let PositionController = class PositionController {
    constructor(positionService, accountService) {
        this.positionService = positionService;
        this.accountService = accountService;
    }
    async getAllPosition(userId, paging, contractType, symbol) {
        const positions = await this.positionService.getAllPositionByUserId(userId, paging, contractType, symbol);
        return positions;
    }
    async getAllPositionWithQty(userId, contractType, symbol) {
        const positions = await this.positionService.getAllPositionWithQuantity(userId, contractType, symbol);
        return positions;
    }
    async getAllPositionAdmin(paging, queries) {
        const positions = await this.positionService.getAllPositionByAdmin(paging, queries);
        return positions;
    }
    async getAverageIndexPrice(symbol) {
        const data = await this.positionService.calculateIndexPriceAverage(symbol);
        return {
            data: data,
        };
    }
    async getInforPosition(userId, query) {
        const data = await this.positionService.getInforPositions(userId, query.symbol);
        return {
            data: data,
        };
    }
    async getPositionByAccountIdBySymbol(symbol, userId) {
        const position = await this.positionService.getPositionByUserIdBySymbol(userId, symbol);
        return {
            data: position,
        };
    }
    async updateMargin(userId, updateMarginDto) {
        const data = await this.positionService.updateMargin(userId, updateMarginDto);
        return {
            data: data,
        };
    }
    async closePosition(userId, body) {
        return {
            data: await this.positionService.closePosition(userId, body),
        };
    }
    async closeAllPosition(userId, body) {
        return {
            data: await this.positionService.closeAllPosition(userId, body.contractType),
        };
    }
    async updatePosition(userId, updatePositionDto) {
        return {
            data: await this.positionService.updatePosition(userId, updatePositionDto),
        };
    }
    async removeTpSlPosition(userId, removeTpSlDto) {
        return {
            data: await this.positionService.removeTpSlPosition(userId, removeTpSlDto),
        };
    }
    async getTpSlOrderPosition(userId, positionId) {
        return {
            data: await this.positionService.getTpSlOrderPosition(userId, positionId),
        };
    }
};
tslib_1.__decorate([
    common_1.Get('/'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiQuery({
        name: 'symbol',
        type: String,
        required: false,
    }),
    swagger_1.ApiQuery({
        name: 'contractType',
        type: String,
        required: true,
    }),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()),
    tslib_1.__param(1, common_1.Query()),
    tslib_1.__param(2, common_1.Query('contractType')),
    tslib_1.__param(3, common_1.Query('symbol')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, pagination_dto_1.PaginationDto, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PositionController.prototype, "getAllPosition", null);
tslib_1.__decorate([
    common_1.Get('/all'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiQuery({
        name: 'symbol',
        type: String,
        required: false,
    }),
    swagger_1.ApiQuery({
        name: 'contractType',
        type: String,
        required: true,
    }),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()),
    tslib_1.__param(1, common_1.Query('contractType')),
    tslib_1.__param(2, common_1.Query('symbol')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PositionController.prototype, "getAllPositionWithQty", null);
tslib_1.__decorate([
    common_1.Get('/admin'),
    common_1.UseGuards(jwt_admin_guard_1.JwtAdminGuard),
    tslib_1.__param(0, common_1.Query()),
    tslib_1.__param(1, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [pagination_dto_1.PaginationDto,
        admin_position_dto_1.AdminPositionDto]),
    tslib_1.__metadata("design:returntype", Promise)
], PositionController.prototype, "getAllPositionAdmin", null);
tslib_1.__decorate([
    common_1.Get('/get-average-index-price'),
    tslib_1.__param(0, common_1.Query('symbol')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PositionController.prototype, "getAverageIndexPrice", null);
tslib_1.__decorate([
    common_1.Get('/infor/value'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()), tslib_1.__param(1, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, get_info_position_dto_1.GetInforPositionDto]),
    tslib_1.__metadata("design:returntype", Promise)
], PositionController.prototype, "getInforPosition", null);
tslib_1.__decorate([
    common_1.Get('/:symbol'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Param('symbol')),
    tslib_1.__param(1, get_user_id_decorator_1.UserID()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], PositionController.prototype, "getPositionByAccountIdBySymbol", null);
tslib_1.__decorate([
    common_1.Put('/adjust-margin'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, update_margin_dto_1.UpdateMarginDto]),
    tslib_1.__metadata("design:returntype", Promise)
], PositionController.prototype, "updateMargin", null);
tslib_1.__decorate([
    common_1.Post('/close'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, close_position_dto_1.ClosePositionDto]),
    tslib_1.__metadata("design:returntype", Promise)
], PositionController.prototype, "closePosition", null);
tslib_1.__decorate([
    common_1.Post('/close-all-positions'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, close_all_position_dto_1.CloseAllPositionDto]),
    tslib_1.__metadata("design:returntype", Promise)
], PositionController.prototype, "closeAllPosition", null);
tslib_1.__decorate([
    common_1.Put('/update-position'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, update_position_dto_1.UpdatePositionDto]),
    tslib_1.__metadata("design:returntype", Promise)
], PositionController.prototype, "updatePosition", null);
tslib_1.__decorate([
    common_1.Delete('/update-position'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()), tslib_1.__param(1, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, RemoveTpSlDto_1.RemoveTpSlDto]),
    tslib_1.__metadata("design:returntype", Promise)
], PositionController.prototype, "removeTpSlPosition", null);
tslib_1.__decorate([
    common_1.Get('/update-position/:positionId'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()), tslib_1.__param(1, common_1.Param('positionId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], PositionController.prototype, "getTpSlOrderPosition", null);
PositionController = tslib_1.__decorate([
    common_1.Controller('positions'),
    swagger_1.ApiTags('Position'),
    swagger_1.ApiBearerAuth(),
    tslib_1.__metadata("design:paramtypes", [position_service_1.PositionService, account_service_1.AccountService])
], PositionController);
exports.PositionController = PositionController;
//# sourceMappingURL=position.controller.js.map