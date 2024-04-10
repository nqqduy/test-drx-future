"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetInstrumentDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const instrument_enum_1 = require("../../../shares/enums/instrument.enum");
class GetInstrumentDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({ enum: instrument_enum_1.InstrumentTypes }),
    class_validator_1.IsOptional(),
    class_validator_1.IsEnum(instrument_enum_1.InstrumentTypes),
    tslib_1.__metadata("design:type", String)
], GetInstrumentDto.prototype, "type", void 0);
exports.GetInstrumentDto = GetInstrumentDto;
//# sourceMappingURL=get-instrument.dto.js.map