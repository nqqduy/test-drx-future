"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetsController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const order_enum_1 = require("../../shares/enums/order.enum");
const assets_service_1 = require("./assets.service");
let AssetsController = class AssetsController {
    constructor(assetsService) {
        this.assetsService = assetsService;
    }
    async getAllAssets(contractType) {
        return await this.assetsService.findAllAssets(contractType);
    }
};
tslib_1.__decorate([
    common_1.Get('/'),
    tslib_1.__param(0, common_1.Query('contractType')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AssetsController.prototype, "getAllAssets", null);
AssetsController = tslib_1.__decorate([
    common_1.Controller('assets'),
    swagger_1.ApiTags('Assets'),
    tslib_1.__metadata("design:paramtypes", [assets_service_1.AssetsService])
], AssetsController);
exports.AssetsController = AssetsController;
//# sourceMappingURL=assets.controller.js.map