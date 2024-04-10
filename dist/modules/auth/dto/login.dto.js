"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class LoginDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: '0x9d22c4c254674c748e338a0fd5a7c15c4dbde2b4',
    }),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], LoginDto.prototype, "address", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: '0x02dc716209618c04e606d3a13cd21a86ab05154cf5c78ce0122a9bf1da05f96f480fb2806f32c1c2d61cc3850028a5268c2fc4f952bfa17bbbf1d4993c8302d31b',
    }),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: 'Sign this message to login with address 0x9d22c4c254674c748e338a0fd5a7c15c4dbde2b4',
    }),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], LoginDto.prototype, "message", void 0);
exports.LoginDto = LoginDto;
//# sourceMappingURL=login.dto.js.map