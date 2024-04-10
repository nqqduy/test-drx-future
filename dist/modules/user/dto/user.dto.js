"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExistsUserDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ExistsUserDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: '0x9d22c4c254674c748e338a0fd5a7c15c4dbde2b4',
    }),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], ExistsUserDto.prototype, "address", void 0);
exports.ExistsUserDto = ExistsUserDto;
//# sourceMappingURL=user.dto.js.map