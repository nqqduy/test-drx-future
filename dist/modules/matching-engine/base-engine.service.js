"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEngineService = void 0;
const class_transformer_1 = require("class-transformer");
const matching_engine_const_1 = require("./matching-engine.const");
class BaseEngineService {
    async loadData(producer, getter, code, topic) {
        let entities = [];
        let lastId = 0;
        do {
            entities = await getter(lastId, matching_engine_const_1.BATCH_SIZE);
            if (entities.length > 0) {
                await this.sendData(producer, topic, code, entities);
                lastId = entities[entities.length - 1].id;
            }
        } while (entities.length === matching_engine_const_1.BATCH_SIZE);
    }
    async sendData(producer, topic, code, entities) {
        const messages = entities.map((entity) => ({
            value: class_transformer_1.serialize({ code, data: entity }),
        }));
        await producer.send({ topic, messages });
    }
}
exports.BaseEngineService = BaseEngineService;
//# sourceMappingURL=base-engine.service.js.map