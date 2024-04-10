"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DexModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const database_common_1 = require("../../models/database-common");
const dex_console_1 = require("./console/dex.console");
const sol_dex_console_1 = require("./console/sol-dex.console");
const dex_service_1 = require("./service/dex.service");
const sol_dex_service_1 = require("./service/sol-dex.service");
const latest_block_module_1 = require("../latest-block/latest-block.module");
let DexModule = class DexModule {
};
DexModule = tslib_1.__decorate([
    common_1.Module({
        imports: [database_common_1.DatabaseCommonModule, latest_block_module_1.LatestBlockModule],
        providers: [common_1.Logger, dex_console_1.DexConsole, sol_dex_console_1.SolDexConsole, dex_service_1.DexService, sol_dex_service_1.SolDexService],
    })
], DexModule);
exports.DexModule = DexModule;
//# sourceMappingURL=dex.module.js.map