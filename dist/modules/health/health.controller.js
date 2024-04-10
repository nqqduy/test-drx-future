"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const health_service_1 = require("./health.service");
const response_dto_1 = require("../../shares/dtos/response.dto");
let HealthController = class HealthController {
    constructor(healthService) {
        this.healthService = healthService;
    }
    async getHealth() {
        return { data: await this.healthService.getHealth() };
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], HealthController.prototype, "getHealth", null);
HealthController = tslib_1.__decorate([
    swagger_1.ApiTags('health'),
    common_1.Controller('ping'),
    tslib_1.__metadata("design:paramtypes", [health_service_1.HealthService])
], HealthController);
exports.HealthController = HealthController;
//# sourceMappingURL=health.controller.js.map