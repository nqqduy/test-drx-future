"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Health = void 0;
const config = require("config");
const rpcHost = config.get('health.rpc_host');
const namespace = config.get('health.namespace');
const insuranceAccountId = config.get('insurance.account_id');
exports.Health = {
    rpcHost,
    namespace,
    insuranceAccountId,
};
//# sourceMappingURL=health.config.js.map