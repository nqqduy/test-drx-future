"use strict";
var AccountService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bignumber_js_1 = require("bignumber.js");
const class_transformer_1 = require("class-transformer");
const kafka_1 = require("../../configs/kafka");
const account_history_entity_1 = require("../../models/entities/account-history.entity");
const account_entity_1 = require("../../models/entities/account.entity");
const transaction_entity_1 = require("../../models/entities/transaction.entity");
const account_history_repository_1 = require("../../models/repositories/account-history.repository");
const account_repository_1 = require("../../models/repositories/account.repository");
const position_repository_1 = require("../../models/repositories/position.repository");
const setting_repository_1 = require("../../models/repositories/setting.repository");
const transaction_repository_1 = require("../../models/repositories/transaction.repository");
const user_repository_1 = require("../../models/repositories/user.repository");
const body_withdraw_dto_1 = require("./dto/body-withdraw.dto");
const matching_engine_const_1 = require("../matching-engine/matching-engine.const");
const from_to_dto_1 = require("../../shares/dtos/from-to.dto");
const pagination_dto_1 = require("../../shares/dtos/pagination.dto");
const response_dto_1 = require("../../shares/dtos/response.dto");
const kafka_enum_1 = require("../../shares/enums/kafka.enum");
const order_enum_1 = require("../../shares/enums/order.enum");
const transaction_enum_1 = require("../../shares/enums/transaction.enum");
const exceptions_1 = require("../../shares/exceptions");
const kafka_client_1 = require("../../shares/kafka-client/kafka-client");
const typeorm_2 = require("typeorm");
const account_const_1 = require("./account.const");
let AccountService = AccountService_1 = class AccountService {
    constructor(accountRepoReport, accountRepoMaster, transactionRepoMaster, accountHistoryRepoMaster, accountHistoryRepoReport, transactionRepoReport, settingRepoReport, kafkaClient, cacheManager, logger, positionRepositoryReport, connection, userRepoReport) {
        this.accountRepoReport = accountRepoReport;
        this.accountRepoMaster = accountRepoMaster;
        this.transactionRepoMaster = transactionRepoMaster;
        this.accountHistoryRepoMaster = accountHistoryRepoMaster;
        this.accountHistoryRepoReport = accountHistoryRepoReport;
        this.transactionRepoReport = transactionRepoReport;
        this.settingRepoReport = settingRepoReport;
        this.kafkaClient = kafkaClient;
        this.cacheManager = cacheManager;
        this.logger = logger;
        this.positionRepositoryReport = positionRepositoryReport;
        this.connection = connection;
        this.userRepoReport = userRepoReport;
    }
    async getFirstAccountByOwnerId(userId, asset) {
        const account = await this.accountRepoReport.findOne({
            where: { userId, asset },
        });
        if (!account) {
            throw new common_1.HttpException(exceptions_1.httpErrors.ACCOUNT_NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
        }
        return account;
    }
    async withdraw(userId, withdrawalDto) {
        if (new bignumber_js_1.default(withdrawalDto.amount).comparedTo(account_const_1.MIN_TRANSFER_AMOUNT) == -1) {
            throw new common_1.BadRequestException('amount larger than 0.00000001');
        }
        const account = await this.accountRepoReport.findOne({
            where: {
                userId,
                asset: withdrawalDto.assetType,
            },
        });
        if (!account) {
            throw new common_1.HttpException(exceptions_1.httpErrors.ACCOUNT_NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
        }
        const transaction = new transaction_entity_1.TransactionEntity();
        transaction.accountId = account.id;
        transaction.amount = withdrawalDto.amount;
        transaction.status = transaction_enum_1.TransactionStatus.PENDING;
        transaction.type = transaction_enum_1.TransactionType.WITHDRAWAL;
        transaction.asset = withdrawalDto.assetType.toUpperCase();
        transaction.userId = userId;
        transaction.contractType = order_enum_1.ContractType.USD_M;
        if (withdrawalDto.assetType == 'USDT' || withdrawalDto.assetType == 'USD') {
            transaction.contractType = order_enum_1.ContractType.USD_M;
        }
        else {
            transaction.contractType = order_enum_1.ContractType.COIN_M;
        }
        const result = await this.transactionRepoMaster.save(transaction);
        await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
            code: matching_engine_const_1.CommandCode.WITHDRAW,
            data: transaction,
        });
        return result;
    }
    async findBatch(fromId, count) {
        return await this.accountRepoMaster.findBatch(fromId, count);
    }
    async findBalanceFromTo(accountId, ft) {
        if (!ft.from)
            ft.from = new Date().getTime() - AccountService_1.DEFAULT_7DAY_MS;
        if (!ft.to)
            ft.to = new Date().getTime();
        const accounts = await this.accountHistoryRepoReport.find({
            accountId: accountId,
            createdAt: typeorm_2.Between(new Date(ft.from), new Date(ft.to)),
        });
        return accounts;
    }
    async saveUserDailyBalance() {
        const today = new Date();
        const allAccountHistories = await this.accountRepoReport.find();
        const todayUsersBalance = allAccountHistories.map((e) => {
            const newEntity = new account_history_entity_1.AccountHistoryEntity();
            newEntity.accountId = e.id;
            newEntity.createdAt = today;
            return newEntity;
        });
        try {
            await this.accountHistoryRepoReport.batchSave(todayUsersBalance);
        }
        catch (error) {
            this.logger.error(`Failed to update daily balance at ${today}`);
        }
    }
    async getTransferHistory(accountId, type, paging) {
        const where = {
            accountId: accountId,
        };
        if (type) {
            where['type'] = type;
        }
        const transfer = await this.transactionRepoReport.find({
            where,
            skip: (paging.page - 1) * paging.size,
            take: paging.size,
            order: {
                id: 'DESC',
            },
        });
        const count = await this.transactionRepoReport.count({
            where,
        });
        return {
            data: transfer,
            metadata: {
                totalPage: Math.ceil(count / paging.size),
            },
        };
    }
    async getBalanceV2(userId, asset = 'usdt') {
        const balance = await this.accountRepoReport.findOne({
            userId,
            asset,
        });
        return {
            balance: new bignumber_js_1.default(balance.balance).toString(),
        };
    }
    async deposit(userId, body) {
        const account = await this.accountRepoReport.findOne({
            where: {
                userId,
                asset: body.asset,
            },
        });
        if (!account) {
            throw new common_1.HttpException(exceptions_1.httpErrors.ACCOUNT_NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
        }
        const producer = kafka_1.kafka.producer();
        await producer.connect();
        const transaction = new transaction_entity_1.TransactionEntity();
        transaction.accountId = account.id;
        transaction.asset = body.asset.toUpperCase();
        transaction.amount = body.amount;
        transaction.status = transaction_enum_1.TransactionStatus.PENDING;
        transaction.type = transaction_enum_1.TransactionType.DEPOSIT;
        transaction.userId = userId;
        const transactionDb = await this.transactionRepoMaster.save(transaction);
        await this.sendTransactions(transactionDb, producer);
        await producer.disconnect();
        return { success: true };
    }
    async sendTransactions(transaction, producer) {
        const messages = { value: class_transformer_1.serialize({ code: matching_engine_const_1.CommandCode.DEPOSIT, data: transaction }) };
        await producer.send({
            topic: kafka_enum_1.KafkaTopics.matching_engine_input,
            messages: [messages],
        });
    }
    async genInsuranceAccounts() {
        const assets = order_enum_1.AssetOrder;
        for (const asset in assets) {
            const index = Object.keys(assets).indexOf(asset);
            await this.accountRepoMaster.insert({
                id: 1000 + index,
                asset: asset,
                balance: '100',
                operationId: 0,
            });
        }
    }
    async genNewAssetAccounts(asset) {
        if (!asset) {
            console.log('Asset can not be null');
            return;
        }
        const checkAccount = await this.accountRepoReport.findOne({
            where: {
                asset: asset.toUpperCase(),
            },
        });
        if (checkAccount) {
            console.log('Asset found');
            return;
        }
        const data = await this.accountRepoReport.createQueryBuilder('accounts').select('DISTINCT userId').execute();
        const userIds = data.map((e) => e.userId).filter((e) => e != '0');
        const taskInsert = [];
        const taskSendToKafka = [];
        for (const userId of userIds) {
            const account = new account_entity_1.AccountEntity();
            account.asset = asset.toUpperCase();
            account.balance = '0';
            account.userId = userId;
            taskInsert.push(this.accountRepoMaster.insert(account));
            taskSendToKafka.push(this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
                code: matching_engine_const_1.CommandCode.CREATE_ACCOUNT,
                data: account,
            }));
        }
        await Promise.all([...taskInsert, taskSendToKafka]);
    }
    async createNewAccount(userId, asset) {
        const isExistUser = await this.accountRepoReport.findOne({
            where: {
                userId: userId,
                asset: asset,
            },
        });
        if (isExistUser) {
            throw new common_1.HttpException(exceptions_1.httpErrors.ACCOUNT_EXISTED, common_1.HttpStatus.NOT_FOUND);
        }
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const account = new account_entity_1.AccountEntity();
            account.asset = asset;
            account.balance = '1000000';
            account.userId = userId;
            await queryRunner.manager.save(account_entity_1.AccountEntity, account);
            await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
                code: matching_engine_const_1.CommandCode.CREATE_ACCOUNT,
                data: account,
            });
            await queryRunner.commitTransaction();
            return account;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.log('SYNC USER FROM SPOT ' + error);
        }
        finally {
            await queryRunner.release();
        }
    }
    async syncEmail() {
        const users = await this.userRepoReport.find();
        for (const user of users) {
            await this.accountRepoMaster.update({ userId: user.id }, { userEmail: user.email });
        }
    }
    async depositUSDTBotAccount() {
        const bots = await this.userRepoReport.find({ where: { position: 'bot' } });
        const botAccounts = await this.accountRepoReport.find({
            where: { userId: typeorm_2.In(bots.map((bot) => bot.id)), asset: transaction_enum_1.AssetType.USDT },
        });
        for (const account of botAccounts) {
            const producer = kafka_1.kafka.producer();
            await producer.connect();
            const transaction = new transaction_entity_1.TransactionEntity();
            transaction.accountId = account.id;
            transaction.asset = account.asset.toUpperCase();
            transaction.amount = '10000000';
            transaction.status = transaction_enum_1.TransactionStatus.PENDING;
            transaction.type = transaction_enum_1.TransactionType.DEPOSIT;
            transaction.userId = account.userId;
            const transactionDb = await this.transactionRepoMaster.save(transaction);
            await this.sendTransactions(transactionDb, producer);
            await producer.disconnect();
        }
    }
};
AccountService.DEFAULT_7DAY_MS = 7 * 24 * 60 * 60 * 1000;
AccountService = AccountService_1 = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'report')),
    tslib_1.__param(1, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'master')),
    tslib_1.__param(2, typeorm_1.InjectRepository(transaction_repository_1.TransactionRepository, 'master')),
    tslib_1.__param(3, typeorm_1.InjectRepository(account_history_repository_1.AccountHistoryRepository, 'master')),
    tslib_1.__param(4, typeorm_1.InjectRepository(account_history_repository_1.AccountHistoryRepository, 'report')),
    tslib_1.__param(5, typeorm_1.InjectRepository(transaction_repository_1.TransactionRepository, 'report')),
    tslib_1.__param(6, typeorm_1.InjectRepository(setting_repository_1.SettingRepository, 'report')),
    tslib_1.__param(8, common_1.Inject(common_1.CACHE_MANAGER)),
    tslib_1.__param(10, typeorm_1.InjectRepository(position_repository_1.PositionRepository, 'report')),
    tslib_1.__param(11, typeorm_1.InjectConnection('report')),
    tslib_1.__param(12, typeorm_1.InjectRepository(user_repository_1.UserRepository, 'report')),
    tslib_1.__metadata("design:paramtypes", [account_repository_1.AccountRepository,
        account_repository_1.AccountRepository,
        transaction_repository_1.TransactionRepository,
        account_history_repository_1.AccountHistoryRepository,
        account_history_repository_1.AccountHistoryRepository,
        transaction_repository_1.TransactionRepository,
        setting_repository_1.SettingRepository,
        kafka_client_1.KafkaClient, Object, common_1.Logger,
        position_repository_1.PositionRepository,
        typeorm_2.Connection,
        user_repository_1.UserRepository])
], AccountService);
exports.AccountService = AccountService;
//# sourceMappingURL=account.service.js.map