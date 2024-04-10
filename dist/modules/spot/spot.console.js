"use strict";
var SpotConsole_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotConsole = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_console_1 = require("nestjs-console");
const account_entity_1 = require("../../models/entities/account.entity");
const transaction_entity_1 = require("../../models/entities/transaction.entity");
const user_entity_1 = require("../../models/entities/user.entity");
const account_repository_1 = require("../../models/repositories/account.repository");
const transaction_repository_1 = require("../../models/repositories/transaction.repository");
const user_repository_1 = require("../../models/repositories/user.repository");
const kafka_enum_1 = require("../../shares/enums/kafka.enum");
const order_enum_1 = require("../../shares/enums/order.enum");
const transaction_enum_1 = require("../../shares/enums/transaction.enum");
const user_enum_1 = require("../../shares/enums/user.enum");
const kafka_client_1 = require("../../shares/kafka-client/kafka-client");
const typeorm_2 = require("typeorm");
const matching_engine_const_1 = require("../matching-engine/matching-engine.const");
const instrument_repository_1 = require("../../models/repositories/instrument.repository");
let SpotConsole = SpotConsole_1 = class SpotConsole {
    constructor(connection, kafkaClient, accountRepoReport, instrumentRepoReport, transactionRepoMaster, usersRepositoryMaster, usersRepositoryReport, accountRepoMaster) {
        this.connection = connection;
        this.kafkaClient = kafkaClient;
        this.accountRepoReport = accountRepoReport;
        this.instrumentRepoReport = instrumentRepoReport;
        this.transactionRepoMaster = transactionRepoMaster;
        this.usersRepositoryMaster = usersRepositoryMaster;
        this.usersRepositoryReport = usersRepositoryReport;
        this.accountRepoMaster = accountRepoMaster;
        this.logger = new common_1.Logger(SpotConsole_1.name);
    }
    async saveBalanceFromRewardOrReferral() {
        await this.kafkaClient.consume(kafka_enum_1.KafkaTopics.future_reward_referral, kafka_enum_1.KafkaGroups.future_reward_referral, async (data) => {
            const account = await this.accountRepoReport.findOne({
                userId: data.userId,
                asset: data.asset.toUpperCase(),
            });
            if (!account) {
                console.log('Account not found');
                return;
            }
            const transaction = new transaction_entity_1.TransactionEntity();
            transaction.accountId = account.id;
            transaction.amount = data.amount;
            transaction.status = transaction_enum_1.TransactionStatus.PENDING;
            transaction.type = data.type;
            transaction.asset = data.asset.toUpperCase();
            transaction.userId = data.userId;
            await this.transactionRepoMaster.save(transaction);
            await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
                code: matching_engine_const_1.CommandCode.DEPOSIT,
                data: transaction,
            });
        });
        return new Promise(() => { });
    }
    async futureTransfer() {
        await this.kafkaClient.consume(kafka_enum_1.KafkaTopics.future_transfer, kafka_enum_1.KafkaGroups.future_transfer, async (data) => {
            const account = await this.accountRepoReport.findOne({
                where: {
                    userId: data.userId,
                    asset: data.asset.toUpperCase(),
                },
            });
            if (!account) {
                console.log('transfer failed: ', account, data);
                return;
            }
            const transaction = new transaction_entity_1.TransactionEntity();
            transaction.accountId = account.id;
            transaction.asset = data.asset.toUpperCase();
            transaction.amount = data.amount;
            transaction.status = transaction_enum_1.TransactionStatus.PENDING;
            transaction.type = transaction_enum_1.TransactionType.DEPOSIT;
            transaction.userId = data.userId;
            transaction.contractType = order_enum_1.ContractType.USD_M;
            if (data.asset.toUpperCase() === 'USDT' || data.asset.toUpperCase() === 'USD') {
                transaction.contractType = order_enum_1.ContractType.USD_M;
            }
            else {
                transaction.contractType = order_enum_1.ContractType.COIN_M;
            }
            const transactionDb = await this.transactionRepoMaster.save(transaction);
            await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
                code: matching_engine_const_1.CommandCode.DEPOSIT,
                data: transactionDb,
            });
        });
        return new Promise(() => { });
    }
    async syncUser() {
        await this.kafkaClient.consume(kafka_enum_1.KafkaTopics.future_sync_user, kafka_enum_1.KafkaGroups.future_sync_user, async (data) => {
            const checkUser = await this.usersRepositoryReport.findOne({
                where: [{ id: data.id }, { email: data.email }],
            });
            if (checkUser) {
                return;
            }
            const queryRunner = this.connection.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                const [newUser, instruments] = await Promise.all([
                    queryRunner.manager.getRepository(user_entity_1.UserEntity).save(Object.assign(Object.assign({}, data), { status: user_enum_1.UserStatus.DEACTIVE })),
                    this.instrumentRepoReport.find({ select: ['symbol'] }),
                ]);
                const lstCoinSupport = [
                    ...new Set(instruments
                        .map((instrument) => instrument.symbol)
                        .map((symbol) => {
                        if (symbol.includes('USDM')) {
                            return symbol.split('USDM')[0];
                        }
                        else if (symbol.includes('USDT')) {
                            return 'USDT';
                        }
                        else {
                            return 'USD';
                        }
                    })),
                ];
                console.log({ lstCoinSupport });
                const accountToSave = [];
                for (const asset of lstCoinSupport) {
                    const newAccount = new account_entity_1.AccountEntity();
                    newAccount.userId = newUser.id;
                    newAccount.balance = '0';
                    newAccount.asset = asset;
                    newAccount.operationId = 0;
                    newAccount.userEmail = data.email;
                    accountToSave.push(newAccount);
                }
                const savedAccount = await queryRunner.manager.getRepository(account_entity_1.AccountEntity).save(accountToSave);
                for (const account of savedAccount) {
                    await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
                        code: matching_engine_const_1.CommandCode.CREATE_ACCOUNT,
                        data: account,
                    });
                }
                await queryRunner.commitTransaction();
            }
            catch (error) {
                await queryRunner.rollbackTransaction();
                console.log('SYNC USER FROM SPOT ' + error);
            }
            finally {
                await queryRunner.release();
            }
        });
        return new Promise(() => { });
    }
    async syncAntiPhishingCode() {
        await this.kafkaClient.consume(kafka_enum_1.KafkaTopics.future_anti_phishing_code, kafka_enum_1.KafkaGroups.future_anti_phishing_code, async (data) => {
            const user = await this.usersRepositoryReport.findOne({
                where: [{ id: data.id }],
            });
            if (!user) {
                return;
            }
            user.antiPhishingCode = data.antiPhishingCode;
            await this.usersRepositoryMaster.save(user);
        });
        return new Promise(() => { });
    }
    async syncLocaleUser() {
        await this.kafkaClient.consume(kafka_enum_1.KafkaTopics.future_locale_user, kafka_enum_1.KafkaGroups.future_locale_user, async (data) => {
            const user = await this.usersRepositoryReport.findOne({
                where: [{ id: data.id }],
            });
            if (!user) {
                return;
            }
            user.location = data.location;
            await this.usersRepositoryMaster.save(user);
        });
        return new Promise(() => { });
    }
    async syncDeviceToken() {
        await this.kafkaClient.consume(kafka_enum_1.KafkaTopics.future_device_token_user, kafka_enum_1.KafkaGroups.future_device_token_user, async (data) => {
            const user = await this.usersRepositoryReport.findOne({
                where: [{ id: data.userId }],
            });
            if (!user) {
                console.log("don't exist user", data.userId);
                return;
            }
            user.notification_token = data.deviceToken;
            await this.usersRepositoryMaster.save(user);
        });
        return new Promise(() => { });
    }
};
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'future:referral_reward',
        description: 'Save balance from spot',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SpotConsole.prototype, "saveBalanceFromRewardOrReferral", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'future:transfer',
        description: 'deposit to future',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SpotConsole.prototype, "futureTransfer", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'future:sync-user',
        description: 'sync user from spot',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SpotConsole.prototype, "syncUser", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'future:sync-anti-phishing-code',
        description: 'sync user from spot',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SpotConsole.prototype, "syncAntiPhishingCode", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'future:sync-locale-user',
        description: 'sync locale user',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SpotConsole.prototype, "syncLocaleUser", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'future:sync-device-token',
        description: 'sync device token',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SpotConsole.prototype, "syncDeviceToken", null);
SpotConsole = SpotConsole_1 = tslib_1.__decorate([
    nestjs_console_1.Console(),
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectConnection('master')),
    tslib_1.__param(2, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'report')),
    tslib_1.__param(3, typeorm_1.InjectRepository(instrument_repository_1.InstrumentRepository, 'report')),
    tslib_1.__param(4, typeorm_1.InjectRepository(transaction_repository_1.TransactionRepository, 'master')),
    tslib_1.__param(5, typeorm_1.InjectRepository(user_repository_1.UserRepository, 'master')),
    tslib_1.__param(6, typeorm_1.InjectRepository(user_repository_1.UserRepository, 'report')),
    tslib_1.__param(7, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'master')),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Connection,
        kafka_client_1.KafkaClient,
        account_repository_1.AccountRepository,
        instrument_repository_1.InstrumentRepository,
        transaction_repository_1.TransactionRepository,
        user_repository_1.UserRepository,
        user_repository_1.UserRepository,
        account_repository_1.AccountRepository])
], SpotConsole);
exports.SpotConsole = SpotConsole;
//# sourceMappingURL=spot.console.js.map