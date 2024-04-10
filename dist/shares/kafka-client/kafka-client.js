"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaClient = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const kafka_1 = require("../../configs/kafka");
const kafka_enum_1 = require("../enums/kafka.enum");
let KafkaClient = class KafkaClient {
    constructor() {
        this.producer = kafka_1.kafka.producer();
    }
    async send(topic, data) {
        await this.producer.connect();
        const result = await this.producer.send({
            topic: topic,
            messages: [
                {
                    value: class_transformer_1.serialize(data),
                },
            ],
        });
        return result;
    }
    async sendPrice(topic, data) {
        await this.producer.connect();
        const result = await this.producer.send({
            topic: topic,
            messages: [
                {
                    value: class_transformer_1.serialize(data),
                },
            ],
        });
        return result;
    }
    async consume(topic, groupId, callback, options = {}) {
        const consumer = kafka_1.kafka.consumer({
            groupId: groupId,
        });
        await consumer.connect();
        await consumer.subscribe(Object.assign({ topic: topic, fromBeginning: false }, options));
        await consumer.run({
            eachMessage: async (payload) => {
                await callback(JSON.parse(payload.message.value.toString()));
            },
        });
    }
    async getMessageAtOffset(offset, topic) {
        const consumer = kafka_1.kafka.consumer({
            groupId: kafka_enum_1.KafkaGroups.matching_engine_saver_positions,
        });
        const options = {
            topic,
            fromBeginning: true,
        };
        await consumer.connect();
        await consumer.subscribe(options);
        await consumer.run({
            autoCommit: false,
            eachMessage: async (messagePayload) => {
                const { topic, partition, message } = messagePayload;
                const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
                if (message.offset == offset) {
                    console.log(`- ${prefix} ${message.key}#${message.value}`);
                    console.log('____MEsssage: ____', message.key, '_______', message.value);
                }
            },
        });
        await consumer.seek({
            topic,
            partition: 0,
            offset: offset,
        });
    }
    async delete(topics) {
        const admin = kafka_1.kafka.admin();
        await admin.connect();
        const currentTopics = await admin.listTopics();
        const existedTopic = topics.filter((topic) => currentTopics.includes(topic));
        await admin.deleteTopics({ topics: existedTopic });
        await admin.disconnect();
    }
    async getCombinedLag(topic, groupId) {
        const admin = kafka_1.kafka.admin();
        await admin.connect();
        const currentTopics = await admin.listTopics();
        if (!currentTopics.includes(topic)) {
            return 0;
        }
        const topicOffsets = this.convertOffsetsToMap(await admin.fetchTopicOffsets(topic));
        const consumerOffsets = this.convertOffsetsToMap(await admin.fetchOffsets({ groupId, topic }));
        let combinedLag = 0;
        for (const partition in topicOffsets) {
            combinedLag += topicOffsets[partition] - consumerOffsets[partition];
        }
        await admin.disconnect();
        return combinedLag;
    }
    convertOffsetsToMap(offsets) {
        const map = {};
        for (const offset of offsets) {
            map[offset.partition] = Math.max(Number(offset.offset), 0);
        }
        return map;
    }
};
KafkaClient = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [])
], KafkaClient);
exports.KafkaClient = KafkaClient;
//# sourceMappingURL=kafka-client.js.map