"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeKafka = void 0;
const kafka_1 = require("../../configs/kafka");
async function subscribeKafka(group, topic, fromBeginning = false) {
    const consumer = kafka_1.kafka.consumer({ groupId: group });
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning });
    return consumer;
}
exports.subscribeKafka = subscribeKafka;
//# sourceMappingURL=kafka.js.map