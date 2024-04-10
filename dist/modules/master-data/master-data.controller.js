"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterDataController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const master_data_service_1 = require("./master-data.service");
let MasterDataController = class MasterDataController {
    constructor(masterDataService) {
        this.masterDataService = masterDataService;
    }
    async getMasterData() {
        return {
            data: await this.masterDataService.getMasterData(),
        };
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MasterDataController.prototype, "getMasterData", null);
MasterDataController = tslib_1.__decorate([
    common_1.Controller('master-data'),
    swagger_1.ApiTags('master-data'),
    tslib_1.__metadata("design:paramtypes", [master_data_service_1.MasterDataService])
], MasterDataController);
exports.MasterDataController = MasterDataController;
//# sourceMappingURL=master-data.controller.js.map