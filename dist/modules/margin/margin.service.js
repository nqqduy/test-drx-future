"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarginService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const account_repository_1 = require("../../models/repositories/account.repository");
const position_repository_1 = require("../../models/repositories/position.repository");
const base_engine_service_1 = require("../matching-engine/base-engine.service");
let MarginService = class MarginService extends base_engine_service_1.BaseEngineService {
    constructor(positionRepoReport, positionRepoMaster, accountRepoReport, accountRepoMaster) {
        super();
        this.positionRepoReport = positionRepoReport;
        this.positionRepoMaster = positionRepoMaster;
        this.accountRepoReport = accountRepoReport;
        this.accountRepoMaster = accountRepoMaster;
    }
};
MarginService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(position_repository_1.PositionRepository, 'report')),
    tslib_1.__param(1, typeorm_1.InjectRepository(position_repository_1.PositionRepository, 'master')),
    tslib_1.__param(2, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'report')),
    tslib_1.__param(3, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'master')),
    tslib_1.__metadata("design:paramtypes", [position_repository_1.PositionRepository,
        position_repository_1.PositionRepository,
        account_repository_1.AccountRepository,
        account_repository_1.AccountRepository])
], MarginService);
exports.MarginService = MarginService;
//# sourceMappingURL=margin.service.js.map