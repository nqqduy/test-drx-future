"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DexConsole = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const nestjs_console_1 = require("nestjs-console");
const kafka_1 = require("../../../configs/kafka");
const dex_service_1 = require("../service/dex.service");
const matching_engine_const_1 = require("../../matching-engine/matching-engine.const");
const kafka_enum_1 = require("../../../shares/enums/kafka.enum");
const kafka_client_1 = require("../../../shares/kafka-client/kafka-client");
let DexConsole = class DexConsole {
    constructor(logger, dexService, kafkaClient) {
        this.logger = logger;
        this.dexService = dexService;
        this.kafkaClient = kafkaClient;
        this.logger.setContext('DexConsole');
    }
    async dexActions() {
        const consumer = kafka_1.kafka.consumer({ groupId: kafka_enum_1.KafkaGroups.dex_action });
        await consumer.connect();
        await consumer.subscribe({ topic: kafka_enum_1.KafkaTopics.matching_engine_output, fromBeginning: false });
        await consumer.run({
            eachMessage: async ({ topic, message }) => {
                const commands = JSON.parse(message.value.toString());
                const offset = message.offset;
                await this.dexService.saveDexActions(offset, commands);
                this.logger.log(`DexAction: offset=${offset} topic=${topic}`);
            },
        });
        return new Promise(() => { });
    }
    async dexActionsPicker() {
        await this.dexService.handlePickDexActions();
        return new Promise(() => { });
    }
    async dexActionsSender() {
        await this.dexService.handleSendDexActions();
        return new Promise(() => { });
    }
    async dexActionsVerifier() {
        await this.dexService.handleVerifyDexActions();
        return new Promise(() => { });
    }
    async dexActionsHistory() {
        await this.dexService.handleHistoryDexActions();
        return new Promise(() => { });
    }
    async dexActionsBalanceChecker() {
        await this.dexService.handleBalanceCheckerDexActions();
        return new Promise(() => { });
    }
};
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'dex:action',
        description: 'Dex Action',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], DexConsole.prototype, "dexActions", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'dex:action-picker',
        description: 'Dex Action Picker',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], DexConsole.prototype, "dexActionsPicker", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'dex:action-sender',
        description: 'Dex Action Sender',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], DexConsole.prototype, "dexActionsSender", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'dex:action-verifier',
        description: 'Dex Action Verifier',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], DexConsole.prototype, "dexActionsVerifier", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'dex:action-history',
        description: 'Dex Action History',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], DexConsole.prototype, "dexActionsHistory", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'dex:action-balance-checker',
        description: 'Dex Action History',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], DexConsole.prototype, "dexActionsBalanceChecker", null);
DexConsole = tslib_1.__decorate([
    nestjs_console_1.Console(),
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [common_1.Logger, dex_service_1.DexService, kafka_client_1.KafkaClient])
], DexConsole);
exports.DexConsole = DexConsole;
//# sourceMappingURL=dex.console.js.map