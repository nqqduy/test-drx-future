"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteApiKeyDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class DeleteApiKeyDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: '',
    }),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], DeleteApiKeyDto.prototype, "apiKey", void 0);
exports.DeleteApiKeyDto = DeleteApiKeyDto;
//# sourceMappingURL=api-key.dto.js.map