"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXPIRED = exports.API_METHOD = exports.API_KEY_PERMISSION = exports.SotaDexHeader = exports.AUTH_CACHE_PREFIX = exports.jwtConstants = void 0;
const config = require("config");
exports.jwtConstants = {
    accessTokenSecret: config.get('app.jwt_access_token_secret'),
    accessTokenExpiry: parseInt(config.get('app.jwt_access_token_expiration_time')),
    refreshTokenExpiry: parseInt(config.get('app.jwt_refresh_token_expiration_time')),
};
exports.AUTH_CACHE_PREFIX = 'AUTH_CACHE_PREFIX_';
var SotaDexHeader;
(function (SotaDexHeader) {
    SotaDexHeader["ADDRESS"] = "sotadex-address";
    SotaDexHeader["SIGNATURE"] = "sotadex-signature";
    SotaDexHeader["APIKEY"] = "sotadex-api-key";
    SotaDexHeader["TIMESTAMP"] = "sotadex-timestamp";
})(SotaDexHeader = exports.SotaDexHeader || (exports.SotaDexHeader = {}));
exports.API_KEY_PERMISSION = {
    ID: '4',
    NAME: 'FUTURE_TRADING',
};
exports.API_METHOD = ['POST', 'PUT', 'DELETE'];
exports.EXPIRED = 60;
//# sourceMappingURL=auth.constants.js.map