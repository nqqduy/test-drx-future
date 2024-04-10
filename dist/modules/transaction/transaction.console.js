"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionConsole = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const nestjs_console_1 = require("nestjs-console");
const dex_config_1 = require("../../configs/dex.config");
const transaction_entity_1 = require("../../models/entities/transaction.entity");
const latest_block_service_1 = require("../latest-block/latest-block.service");
const matching_engine_const_1 = require("../matching-engine/matching-engine.const");
const transaction_service_1 = require("./transaction.service");
const kafka_enum_1 = require("../../shares/enums/kafka.enum");
const kafka_client_1 = require("../../shares/kafka-client/kafka-client");
const { provider, dexContract, blockTimeInMs } = dex_config_1.Dex;
let TransactionConsole = class TransactionConsole {
    constructor(logger, kafkaClient, latestBlockService, transactionService) {
        this.logger = logger;
        this.kafkaClient = kafkaClient;
        this.latestBlockService = latestBlockService;
        this.transactionService = transactionService;
    }
    async sendTransactions(transactions, producer) {
        if (transactions.length > 0) {
            const messages = transactions
                .filter((transaction) => transaction.accountId > 0)
                .map((transaction) => ({
                value: class_transformer_1.serialize({ code: matching_engine_const_1.CommandCode.DEPOSIT, data: transaction }),
            }));
            await producer.send({ topic: kafka_enum_1.KafkaTopics.matching_engine_input, messages });
            this.logger.log(`Sent ${transactions.length} transactions to matching engine.`);
        }
    }
    async updateTransactions() {
        await this.transactionService.updateTransactions();
    }
};
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'transactions:update-new-account',
        description: 'update new account in position',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TransactionConsole.prototype, "updateTransactions", null);
TransactionConsole = tslib_1.__decorate([
    nestjs_console_1.Console(),
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [common_1.Logger,
        kafka_client_1.KafkaClient,
        latest_block_service_1.LatestBlockService,
        transaction_service_1.TransactionService])
], TransactionConsole);
exports.TransactionConsole = TransactionConsole;
//# sourceMappingURL=transaction.console.js.map