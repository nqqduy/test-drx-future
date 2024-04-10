"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarginModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const margin_controller_1 = require("./margin.controller");
const margin_service_1 = require("./margin.service");
let MarginModule = class MarginModule {
};
MarginModule = tslib_1.__decorate([
    common_1.Module({
        imports: [],
        controllers: [margin_controller_1.MarginController],
        providers: [margin_service_1.MarginService],
    })
], MarginModule);
exports.MarginModule = MarginModule;
//# sourceMappingURL=margin.module.js.map