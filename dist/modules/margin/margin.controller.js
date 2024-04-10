"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarginController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const margin_service_1 = require("./margin.service");
let MarginController = class MarginController {
    constructor(marginService) {
        this.marginService = marginService;
    }
};
MarginController = tslib_1.__decorate([
    common_1.Controller('margin'),
    swagger_1.ApiTags('Margin'),
    swagger_1.ApiBearerAuth(),
    tslib_1.__metadata("design:paramtypes", [margin_service_1.MarginService])
], MarginController);
exports.MarginController = MarginController;
//# sourceMappingURL=margin.controller.js.map