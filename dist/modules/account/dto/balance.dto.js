"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const account_entity_1 = require("../../../models/entities/account.entity");
class BalanceDto extends swagger_1.PartialType(account_entity_1.AccountEntity) {
}
exports.BalanceDto = BalanceDto;
//# sourceMappingURL=balance.dto.js.map