"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const candle_module_1 = require("../candle/candle.module");
const funding_module_1 = require("../funding/funding.module");
const health_console_1 = require("./health.console");
const health_controller_1 = require("./health.controller");
const health_service_1 = require("./health.service");
const index_module_1 = require("../index/index.module");
const latest_block_module_1 = require("../latest-block/latest-block.module");
const mail_module_1 = require("../mail/mail.module");
let HealthModule = class HealthModule {
};
HealthModule = tslib_1.__decorate([
    common_1.Module({
        controllers: [health_controller_1.HealthController],
        providers: [health_service_1.HealthService, health_console_1.HealthConsole, common_1.Logger],
        imports: [funding_module_1.FundingModule, index_module_1.IndexModule, latest_block_module_1.LatestBlockModule, mail_module_1.MailModule, candle_module_1.CandleModule],
    })
], HealthModule);
exports.HealthModule = HealthModule;
//# sourceMappingURL=health.module.js.map