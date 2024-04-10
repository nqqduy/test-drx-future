"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FromToDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class FromToDto {
    constructor() {
        this.from = new Date().getTime() - 30 * 24 * 60 * 60 * 1000;
        this.to = new Date().getTime();
    }
}
tslib_1.__decorate([
    swagger_1.ApiPropertyOptional({ example: new Date().getTime() - 30 * 24 * 60 * 60 * 1000 }),
    class_transformer_1.Transform(({ value }) => Number(value)),
    class_validator_1.IsInt(),
    class_validator_1.IsPositive(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", Number)
], FromToDto.prototype, "from", void 0);
tslib_1.__decorate([
    swagger_1.ApiPropertyOptional({ example: new Date().getTime() }),
    class_transformer_1.Transform(({ value }) => Number(value)),
    class_validator_1.IsInt(),
    class_validator_1.IsPositive(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", Number)
], FromToDto.prototype, "to", void 0);
exports.FromToDto = FromToDto;
//# sourceMappingURL=from-to.dto.js.map