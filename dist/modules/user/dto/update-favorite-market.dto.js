"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFavoriteMarketDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateFavoriteMarketDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: 'BTCUSD',
    }),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], UpdateFavoriteMarketDto.prototype, "symbol", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: true,
    }),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateFavoriteMarketDto.prototype, "isFavorite", void 0);
exports.UpdateFavoriteMarketDto = UpdateFavoriteMarketDto;
//# sourceMappingURL=update-favorite-market.dto.js.map