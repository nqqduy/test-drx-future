"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetInforBalanceDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class GetInforBalanceDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({ required: false }),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], GetInforBalanceDto.prototype, "symbol", void 0);
exports.GetInforBalanceDto = GetInforBalanceDto;
//# sourceMappingURL=balance.dto.js.map