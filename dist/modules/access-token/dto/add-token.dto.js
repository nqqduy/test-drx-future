"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class AccessTokenDto {
}
tslib_1.__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], AccessTokenDto.prototype, "token", void 0);
exports.AccessTokenDto = AccessTokenDto;
//# sourceMappingURL=add-token.dto.js.map