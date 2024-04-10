"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInstrumentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_instrument_dto_1 = require("./create-instrument.dto");
class UpdateInstrumentDto extends swagger_1.PartialType(create_instrument_dto_1.CreateInstrumentDto) {
}
exports.UpdateInstrumentDto = UpdateInstrumentDto;
//# sourceMappingURL=update-instrument.dto.js.map