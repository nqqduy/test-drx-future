"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const event_gateway_1 = require("./event.gateway");
const health_service_1 = require("../health/health.service");
const jwt_1 = require("@nestjs/jwt");
const auth_constants_1 = require("../auth/auth.constants");
let EventModule = class EventModule {
};
EventModule = tslib_1.__decorate([
    common_1.Module({
        providers: [event_gateway_1.EventGateway, health_service_1.HealthService, common_1.Logger],
        imports: [
            jwt_1.JwtModule.register({
                secret: auth_constants_1.jwtConstants.accessTokenSecret,
                signOptions: { expiresIn: auth_constants_1.jwtConstants.accessTokenExpiry },
            }),
        ],
    })
], EventModule);
exports.EventModule = EventModule;
//# sourceMappingURL=event.module.js.map