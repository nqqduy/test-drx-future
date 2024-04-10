"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloseAllPositionDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const order_enum_1 = require("../../../shares/enums/order.enum");
class CloseAllPositionDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: 'USD_M',
    }),
    class_validator_1.IsString(),
    class_validator_1.IsIn(Object.keys(order_enum_1.ContractType)),
    tslib_1.__metadata("design:type", String)
], CloseAllPositionDto.prototype, "contractType", void 0);
exports.CloseAllPositionDto = CloseAllPositionDto;
//# sourceMappingURL=close-all-position.dto.js.map