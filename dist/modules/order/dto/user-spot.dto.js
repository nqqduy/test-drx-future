"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSpotDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UserSpotDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], UserSpotDto.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], UserSpotDto.prototype, "email", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], UserSpotDto.prototype, "role", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], UserSpotDto.prototype, "status", void 0);
exports.UserSpotDto = UserSpotDto;
//# sourceMappingURL=user-spot.dto.js.map