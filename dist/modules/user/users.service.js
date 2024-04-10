"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tslib_1 = require("tslib");
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const api_key_entity_1 = require("../../models/entities/api-key.entity");
const user_entity_1 = require("../../models/entities/user.entity");
const account_repository_1 = require("../../models/repositories/account.repository");
const api_key_repository_1 = require("../../models/repositories/api-key.repository");
const instrument_repository_1 = require("../../models/repositories/instrument.repository");
const user_setting_repository_1 = require("../../models/repositories/user-setting.repository");
const user_repository_1 = require("../../models/repositories/user.repository");
const matching_engine_const_1 = require("../matching-engine/matching-engine.const");
const create_user_dto_1 = require("./dto/create-user.dto");
const favorite_market_dto_1 = require("./dto/favorite-market.dto");
const kafka_enum_1 = require("../../shares/enums/kafka.enum");
const user_enum_1 = require("../../shares/enums/user.enum");
const exceptions_1 = require("../../shares/exceptions");
const kafka_client_1 = require("../../shares/kafka-client/kafka-client");
const coin_info_repository_1 = require("../../models/repositories/coin-info.repository");
const account_entity_1 = require("../../models/entities/account.entity");
const order_enum_1 = require("../../shares/enums/order.enum");
const Web3 = require('web3');
let UserService = class UserService {
    constructor(apiKeyRepository, apiKeyReportRepository, usersRepositoryMaster, usersRepositoryReport, userSettingRepository, instrumentRepoReport, accountRepoReport, accountRepoMaster, kafkaClient, mailService, coinInfoRepository) {
        this.apiKeyRepository = apiKeyRepository;
        this.apiKeyReportRepository = apiKeyReportRepository;
        this.usersRepositoryMaster = usersRepositoryMaster;
        this.usersRepositoryReport = usersRepositoryReport;
        this.userSettingRepository = userSettingRepository;
        this.instrumentRepoReport = instrumentRepoReport;
        this.accountRepoReport = accountRepoReport;
        this.accountRepoMaster = accountRepoMaster;
        this.kafkaClient = kafkaClient;
        this.mailService = mailService;
        this.coinInfoRepository = coinInfoRepository;
        this.web3 = new Web3();
    }
    async checkUserIdExisted(id) {
        const user = await this.usersRepositoryReport.findOne({
            id: id,
        });
        if (user)
            return true;
        else
            return false;
    }
    async checkUserAddressExisted(address) {
        const user = await this.usersRepositoryReport.findOne({
            where: {
                address: address,
            },
            select: ['id'],
        });
        return !!user;
    }
    async findUserById(id) {
        const user = await this.usersRepositoryReport.findOne({ id }, {
            select: [
                'id',
                'position',
                'status',
                'role',
                'isLocked',
                'userType',
                'email',
                'createdAt',
                'updatedAt',
                'notification_token',
                'location',
            ],
        });
        if (!user) {
            throw new common_1.HttpException(exceptions_1.httpErrors.ACCOUNT_NOT_FOUND, common_1.HttpStatus.BAD_REQUEST);
        }
        return user;
    }
    async updateStatusUser(userId, status) {
        await this.usersRepositoryMaster.update(userId, {
            status,
        });
    }
    async getUserByAccountId(accountId) {
        return this.usersRepositoryReport.findUserByAccountId(accountId);
    }
    async findUserByAddress(address) {
        const user = await this.usersRepositoryReport.findOne({
            select: ['id', 'status', 'role', 'isLocked', 'userType', 'createdAt', 'updatedAt'],
            where: {
                address: address,
            },
        });
        if (!user) {
            throw new common_1.HttpException(exceptions_1.httpErrors.ACCOUNT_NOT_FOUND, common_1.HttpStatus.BAD_REQUEST);
        }
        return user;
    }
    async createUser(body) {
        const [{ exist }, existId] = await Promise.all([
            this.checkEmailExist(body.email),
            this.checkUserIdExisted(body.id),
        ]);
        if (exist || existId) {
            throw new common_1.HttpException(exceptions_1.httpErrors.ACCOUNT_EXISTED, common_1.HttpStatus.FOUND);
        }
        const newUser = await this.usersRepositoryMaster.save(Object.assign(Object.assign({}, body), { status: user_enum_1.UserStatus.DEACTIVE }));
        const assets = order_enum_1.AssetOrder;
        const accountToSave = [];
        for (const asset in assets) {
            const newAccountEntity = new account_entity_1.AccountEntity();
            newAccountEntity.userId = newUser.id;
            newAccountEntity.asset = asset;
            newAccountEntity.balance = '0';
            accountToSave.push(newAccountEntity);
        }
        const savedAccount = await this.accountRepoMaster.save(accountToSave);
        for (const account of savedAccount) {
            await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
                code: matching_engine_const_1.CommandCode.CREATE_ACCOUNT,
                data: account,
            });
        }
        return newUser;
    }
    async createUserWithoutChecking(address, transactionRepositoryUser, transactionRepositoryAccount) {
        const newUser = await transactionRepositoryUser.save({
            address,
            role: user_enum_1.UserRole.USER,
            isLocked: user_enum_1.UserIsLocked.UNLOCKED,
            status: user_enum_1.UserStatus.ACTIVE,
        });
        const newAccountEntity = new account_entity_1.AccountEntity();
        newAccountEntity.userId = newUser.id;
        const savedAccount = await transactionRepositoryAccount.save(newAccountEntity);
        await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
            code: matching_engine_const_1.CommandCode.CREATE_ACCOUNT,
            data: savedAccount,
        });
        return newUser;
    }
    async getUserFavoriteMarket(userId) {
        const favoriteMarkets = await this.userSettingRepository.find({
            where: {
                userId: userId,
                key: typeorm_2.Like(`${user_setting_repository_1.UserSettingRepository.FAVORITE_MARKET}%`),
                isFavorite: true,
            },
        });
        return favoriteMarkets.map((e) => ({
            symbol: e.key.split(`${user_setting_repository_1.UserSettingRepository.FAVORITE_MARKET}_`)[1],
        }));
    }
    async updateUserFavoriteMarket(userId, symbol, isFavorite) {
        const existSymbol = await this.instrumentRepoReport.findOne({
            where: {
                symbol: symbol,
            },
        });
        if (!existSymbol)
            throw new common_1.HttpException(exceptions_1.httpErrors.INSTRUMENT_DOES_NOT_EXIST, common_1.HttpStatus.BAD_REQUEST);
        const key = `${user_setting_repository_1.UserSettingRepository.FAVORITE_MARKET}_${symbol}`;
        const checkExist = await this.userSettingRepository.findOne({
            userId: userId,
            key: key,
        });
        if (checkExist) {
            checkExist.isFavorite = isFavorite;
            await this.userSettingRepository.save(checkExist);
        }
        else {
            await this.userSettingRepository.save({
                userId: userId,
                key: key,
                isFavorite: isFavorite,
            });
        }
        return {
            symbol,
            isFavorite,
        };
    }
    async checkEmailExist(email) {
        const user = await this.usersRepositoryReport.findOne({
            where: {
                email: email,
            },
        });
        return {
            exist: user ? true : false,
        };
    }
    async getUserByApiKey(key) {
        const apiKey = await this.apiKeyReportRepository.findOne({ where: { key }, select: ['userId'] });
        if (!apiKey) {
            throw new common_1.HttpException(exceptions_1.httpErrors.ACCOUNT_NOT_FOUND, common_1.HttpStatus.BAD_REQUEST);
        }
        return { id: apiKey.userId.toString() };
    }
    async listApiKey(address) {
        const user = await this.findUserByAddress(address);
        return this.apiKeyReportRepository.find({ where: user.id.toString(), select: ['key', 'createdAt'] });
    }
    async createApiKey(address) {
        let user;
        if (!(await this.checkUserAddressExisted(address))) {
            user = await this.createUserWithoutChecking(address);
        }
        else {
            user = await this.findUserByAddress(address);
        }
        const keyPair = this.web3.eth.accounts.create();
        const key = keyPair.address.toLowerCase();
        const secret = keyPair.privateKey;
        const apiKey = { key, secret };
        await this.apiKeyRepository.insert({ key, userId: user.id.toString() });
        return {
            apiKey,
        };
    }
    async deleteApiKey(apiKey) {
        const deleteApiKey = await this.apiKeyReportRepository.findOne({ where: { key: apiKey }, select: ['userId'] });
        if (!deleteApiKey) {
            throw new common_1.HttpException(`${apiKey} not found`, common_1.HttpStatus.NOT_FOUND);
        }
        await this.apiKeyRepository.delete({ key: apiKey });
        return { apiKey };
    }
    async getAntiPhishingCode(userId) {
        const user = await this.usersRepositoryReport.findOne({ id: userId });
        if (!user) {
            throw new common_1.BadRequestException('user_not_found');
        }
        return (user === null || user === void 0 ? void 0 : user.antiPhishingCode) || null;
    }
    async getAntiPhishingCodeByEmail(email) {
        const user = await this.usersRepositoryReport.findOne({ email });
        if (!user) {
            throw new common_1.BadRequestException('user_not_found');
        }
        return (user === null || user === void 0 ? void 0 : user.antiPhishingCode) || null;
    }
};
tslib_1.__decorate([
    typeorm_2.Transaction({ connectionName: 'master' }),
    tslib_1.__param(1, typeorm_2.TransactionRepository(user_entity_1.UserEntity)),
    tslib_1.__param(2, typeorm_2.TransactionRepository(account_entity_1.AccountEntity)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeorm_2.Repository,
        typeorm_2.Repository]),
    tslib_1.__metadata("design:returntype", Promise)
], UserService.prototype, "createUserWithoutChecking", null);
UserService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(api_key_repository_1.ApiKeyRepository, 'master')),
    tslib_1.__param(1, typeorm_1.InjectRepository(api_key_repository_1.ApiKeyRepository, 'report')),
    tslib_1.__param(2, typeorm_1.InjectRepository(user_repository_1.UserRepository, 'master')),
    tslib_1.__param(3, typeorm_1.InjectRepository(user_repository_1.UserRepository, 'report')),
    tslib_1.__param(4, typeorm_1.InjectRepository(user_setting_repository_1.UserSettingRepository, 'master')),
    tslib_1.__param(5, typeorm_1.InjectRepository(instrument_repository_1.InstrumentRepository, 'report')),
    tslib_1.__param(6, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'report')),
    tslib_1.__param(7, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'master')),
    tslib_1.__param(10, typeorm_1.InjectRepository(coin_info_repository_1.CoinInfoRepository, 'master')),
    tslib_1.__metadata("design:paramtypes", [api_key_repository_1.ApiKeyRepository,
        api_key_repository_1.ApiKeyRepository,
        user_repository_1.UserRepository,
        user_repository_1.UserRepository,
        user_setting_repository_1.UserSettingRepository,
        instrument_repository_1.InstrumentRepository,
        account_repository_1.AccountRepository,
        account_repository_1.AccountRepository,
        kafka_client_1.KafkaClient,
        mailer_1.MailerService,
        coin_info_repository_1.CoinInfoRepository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=users.service.js.map