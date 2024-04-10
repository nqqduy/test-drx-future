"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LatestBlockModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const latest_block_service_1 = require("./latest-block.service");
let LatestBlockModule = class LatestBlockModule {
};
LatestBlockModule = tslib_1.__decorate([
    common_1.Module({
        providers: [latest_block_service_1.LatestBlockService, common_1.Logger],
        exports: [latest_block_service_1.LatestBlockService],
    })
], LatestBlockModule);
exports.LatestBlockModule = LatestBlockModule;
//# sourceMappingURL=latest-block.module.js.map