"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseLogin = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../../models/entities/user.entity");
class ResponseLogin extends swagger_1.PartialType(user_entity_1.UserEntity) {
}
exports.ResponseLogin = ResponseLogin;
//# sourceMappingURL=response-login.dto.js.map