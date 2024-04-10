"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const spot_console_1 = require("./spot.console");
let SpotModule = class SpotModule {
};
SpotModule = tslib_1.__decorate([
    common_1.Module({
        providers: [common_1.Logger, spot_console_1.SpotConsole],
        controllers: [],
        imports: [],
        exports: [],
    })
], SpotModule);
exports.SpotModule = SpotModule;
//# sourceMappingURL=spot.modules.js.map