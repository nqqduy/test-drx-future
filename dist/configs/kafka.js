"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kafka = exports.KAFKA_CONFIG = void 0;
const kafkajs_1 = require("kafkajs");
const index_1 = require("./index");
exports.KAFKA_CONFIG = {
    brokers: index_1.getConfig().get('kafka.brokers'),
};
exports.kafka = new kafkajs_1.Kafka({
    clientId: 'sota-dex',
    brokers: exports.KAFKA_CONFIG.brokers.split(','),
});
//# sourceMappingURL=kafka.js.map