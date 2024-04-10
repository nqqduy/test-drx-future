"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const kafka_client_1 = require("./kafka-client");
let KafkaModule = class KafkaModule {
};
KafkaModule = tslib_1.__decorate([
    common_1.Global(),
    common_1.Module({
        providers: [kafka_client_1.KafkaClient],
        exports: [kafka_client_1.KafkaClient],
    })
], KafkaModule);
exports.KafkaModule = KafkaModule;
//# sourceMappingURL=kafka-module.js.map