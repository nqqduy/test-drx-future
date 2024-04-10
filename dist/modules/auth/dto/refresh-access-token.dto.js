"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshAccessTokenDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class RefreshAccessTokenDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty({
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], RefreshAccessTokenDto.prototype, "accessToken", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty({
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], RefreshAccessTokenDto.prototype, "refreshToken", void 0);
exports.RefreshAccessTokenDto = RefreshAccessTokenDto;
//# sourceMappingURL=refresh-access-token.dto.js.map