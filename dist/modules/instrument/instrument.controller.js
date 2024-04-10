"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstrumentController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const instrument_entity_1 = require("../../models/entities/instrument.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_instrument_dto_1 = require("./dto/create-instrument.dto");
const update_instrument_dto_1 = require("./dto/update-instrument.dto");
const instrument_service_1 = require("./instrument.service");
const roles_decorator_1 = require("../../shares/decorators/roles.decorator");
const response_dto_1 = require("../../shares/dtos/response.dto");
const get_instrument_dto_1 = require("./dto/get-instrument.dto");
const create_market_free_dto_1 = require("./dto/create-market-free.dto");
const market_fee_entity_1 = require("../../models/entities/market_fee.entity");
const update_market_fee_dto_1 = require("./dto/update-market-fee.dto");
const jwt_admin_guard_1 = require("../auth/guards/jwt.admin.guard");
let InstrumentController = class InstrumentController {
    constructor(instrumentService) {
        this.instrumentService = instrumentService;
    }
    async getAllInstruments(query) {
        return {
            data: await this.instrumentService.getAllInstruments(query),
        };
    }
    async getInstrumentsBySymbol(symbol) {
        return {
            data: await this.instrumentService.getInstrumentsBySymbol(symbol),
        };
    }
    async createInstrument(contractDto) {
        return await this.instrumentService.createInstrument(contractDto);
    }
    async getContractList(input) {
        return {
            data: await this.instrumentService.getContractList(input),
        };
    }
    async detailContract(underlyingSymbol) {
        return {
            data: await this.instrumentService.detailContract(underlyingSymbol),
        };
    }
    async updateContract(updateContractDto) {
        return {
            data: await this.instrumentService.updateContract(updateContractDto),
        };
    }
    async getInstrumentsById(id) {
        return {
            data: await this.instrumentService.getInstrumentsById(id),
        };
    }
    async updateInstrument(instrumentId, updateInstrumentDto) {
        return {
            data: await this.instrumentService.updateInstrument(instrumentId, updateInstrumentDto),
        };
    }
    async createMarketFeeByInstrument(createMarketFeeDto) {
        return {
            data: await this.instrumentService.createMarketFeeByInstrument(createMarketFeeDto),
        };
    }
    async updateMarketFeeByInstrument(updateMarketFeeDto) {
        return {
            data: await this.instrumentService.updateMarketFeeByInstrument(updateMarketFeeDto),
        };
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__param(0, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [get_instrument_dto_1.GetInstrumentDto]),
    tslib_1.__metadata("design:returntype", Promise)
], InstrumentController.prototype, "getAllInstruments", null);
tslib_1.__decorate([
    common_1.Get('/symbol/:symbol'),
    tslib_1.__param(0, common_1.Param('symbol')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], InstrumentController.prototype, "getInstrumentsBySymbol", null);
tslib_1.__decorate([
    common_1.Post(),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_admin_guard_1.JwtAdminGuard),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [create_instrument_dto_1.ContractDto]),
    tslib_1.__metadata("design:returntype", Promise)
], InstrumentController.prototype, "createInstrument", null);
tslib_1.__decorate([
    common_1.Get('list-contract'),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_admin_guard_1.JwtAdminGuard),
    tslib_1.__param(0, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [create_instrument_dto_1.ContractListDto]),
    tslib_1.__metadata("design:returntype", Promise)
], InstrumentController.prototype, "getContractList", null);
tslib_1.__decorate([
    common_1.Get('detail-contract'),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_admin_guard_1.JwtAdminGuard),
    tslib_1.__param(0, common_1.Query('underlyingSymbol')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], InstrumentController.prototype, "detailContract", null);
tslib_1.__decorate([
    common_1.Put('update-contract'),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_admin_guard_1.JwtAdminGuard),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [create_instrument_dto_1.UpdateContractDto]),
    tslib_1.__metadata("design:returntype", Promise)
], InstrumentController.prototype, "updateContract", null);
tslib_1.__decorate([
    common_1.Get('/:instrumentId'),
    tslib_1.__param(0, common_1.Param('instrumentId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], InstrumentController.prototype, "getInstrumentsById", null);
tslib_1.__decorate([
    common_1.Patch('/:instrumentId'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_decorator_1.AdminAndSuperAdmin),
    tslib_1.__param(0, common_1.Param('instrumentId')),
    tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, update_instrument_dto_1.UpdateInstrumentDto]),
    tslib_1.__metadata("design:returntype", Promise)
], InstrumentController.prototype, "updateInstrument", null);
tslib_1.__decorate([
    common_1.Post('create-market-fee'),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_decorator_1.AdminAndSuperAdmin),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [create_market_free_dto_1.CreateMarketFeeDto]),
    tslib_1.__metadata("design:returntype", Promise)
], InstrumentController.prototype, "createMarketFeeByInstrument", null);
tslib_1.__decorate([
    common_1.Post('update-market-fee'),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_decorator_1.AdminAndSuperAdmin),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [update_market_fee_dto_1.UpdateMarketFeeDto]),
    tslib_1.__metadata("design:returntype", Promise)
], InstrumentController.prototype, "updateMarketFeeByInstrument", null);
InstrumentController = tslib_1.__decorate([
    common_1.Controller('instruments'),
    swagger_1.ApiTags('Instrument'),
    tslib_1.__metadata("design:paramtypes", [instrument_service_1.InstrumentService])
], InstrumentController);
exports.InstrumentController = InstrumentController;
//# sourceMappingURL=instrument.controller.js.map