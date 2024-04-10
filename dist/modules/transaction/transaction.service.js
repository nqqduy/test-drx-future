"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const moment = require("moment");
const dex_config_1 = require("../../configs/dex.config");
const sol_dex_config_1 = require("../../configs/sol-dex.config");
const dex_action_sol_tx_entity_1 = require("../../models/entities/dex-action-sol-tx.entity");
const latest_block_entity_1 = require("../../models/entities/latest-block.entity");
const transaction_entity_1 = require("../../models/entities/transaction.entity");
const account_repository_1 = require("../../models/repositories/account.repository");
const dex_action_sol_txs_repository_1 = require("../../models/repositories/dex-action-sol-txs.repository");
const latest_block_repository_1 = require("../../models/repositories/latest-block.repository");
const latest_signature_repository_1 = require("../../models/repositories/latest-signature.repository");
const setting_repository_1 = require("../../models/repositories/setting.repository");
const transaction_repository_1 = require("../../models/repositories/transaction.repository");
const account_service_1 = require("../account/account.service");
const latest_block_const_1 = require("../latest-block/latest-block.const");
const pagination_dto_1 = require("../../shares/dtos/pagination.dto");
const instrument_enum_1 = require("../../shares/enums/instrument.enum");
const transaction_enum_1 = require("../../shares/enums/transaction.enum");
const sotadex_wrapper_1 = require("../../shares/helpers/sotadex-wrapper");
const kafka_client_1 = require("../../shares/kafka-client/kafka-client");
const transaction_const_1 = require("./transaction.const");
const { dexProgram, dexId, usdcId } = sol_dex_config_1.SolDex;
const amountScale = Math.pow(10, dex_config_1.Dex.collateralDecimal);
let TransactionService = class TransactionService {
    constructor(logger, kafkaClient, transactionRepoMaster, transactionRepoReport, settingRepoReport, reportLatestSignatureRepo, accountRepoMaster, reportDexActionSolTxRepo, accountService) {
        this.logger = logger;
        this.kafkaClient = kafkaClient;
        this.transactionRepoMaster = transactionRepoMaster;
        this.transactionRepoReport = transactionRepoReport;
        this.settingRepoReport = settingRepoReport;
        this.reportLatestSignatureRepo = reportLatestSignatureRepo;
        this.accountRepoMaster = accountRepoMaster;
        this.reportDexActionSolTxRepo = reportDexActionSolTxRepo;
        this.accountService = accountService;
        this.batchSize = 100;
        this.dexWrapper = new sotadex_wrapper_1.SotaDexWrapper(dexProgram, dexId, usdcId);
    }
    async findRecentDeposits(date, fromId, count) {
        return await this.transactionRepoMaster.findRecentDeposits(date, fromId, count);
    }
    async findPendingWithdrawals(fromId, count) {
        return await this.transactionRepoMaster.findPendingWithdrawals(fromId, count);
    }
    async transactionHistory(userId, input) {
        try {
            const startTime = moment(Number(input.startTime)).format('YYYY-MM-DD HH:mm:ss');
            const endTime = moment(Number(input.endTime)).format('YYYY-MM-DD HH:mm:ss');
            const page = Number(input.page);
            const size = Number(input.size);
            const query = this.transactionRepoReport
                .createQueryBuilder('t')
                .select([
                't.createdAt as time',
                't.type as type',
                't.amount as amount',
                't.symbol as symbol',
                't.asset as asset',
            ])
                .where('t.userId = :userId', { userId })
                .andWhere('t.createdAt >= :startTime and t.updatedAt <= :endTime ', { startTime, endTime })
                .andWhere('t.type <> ":typeIgnore"', { typeIgnore: transaction_enum_1.TransactionType.REFERRAL })
                .andWhere('t.contractType = :contractType', {
                contractType: input.contractType,
            })
                .orderBy('t.createdAt', 'DESC')
                .limit(size)
                .offset(size * (page - 1));
            if (input.type) {
                if (input.type === transaction_enum_1.TransactionType.TRANSFER) {
                    query.andWhere('(t.type = :depositType or t.type = :withDrawType) and t.status = :status', {
                        depositType: transaction_enum_1.TransactionType.DEPOSIT,
                        withDrawType: transaction_enum_1.TransactionType.WITHDRAWAL,
                        status: transaction_enum_1.TransactionStatus.APPROVED,
                    });
                }
                else {
                    query.andWhere('t.type = :type', { type: input.type });
                }
            }
            else {
                query.andWhere('t.status NOT IN (:status)', {
                    status: [transaction_enum_1.TransactionStatus.REJECTED, transaction_enum_1.TransactionStatus.PENDING],
                });
            }
            if (input.asset) {
                query.andWhere('t.asset = :asset', { asset: input.asset });
            }
            if (input.contractType) {
                query.andWhere('t.contractType = :contractType', { contractType: input.contractType });
            }
            const [list, count] = await Promise.all([query.getRawMany(), query.getCount()]);
            return { list, count };
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async updateTransactions() {
        let skip = transaction_const_1.START_CRAWL;
        const take = transaction_const_1.GET_NUMBER_RECORD;
        do {
            const data = await this.transactionRepoMaster.find({
                skip,
                take,
            });
            skip += take;
            if (data) {
                for (const item of data) {
                    item.userId = item.accountId;
                    const account = await this.accountRepoMaster.findOne({
                        where: {
                            userId: item.userId,
                            asset: item.asset.toUpperCase(),
                        },
                    });
                    if (account) {
                        item.accountId = account.id;
                    }
                    else {
                        item.accountId = null;
                    }
                    await this.transactionRepoMaster.save(item);
                }
            }
            else {
                break;
            }
        } while (true);
    }
};
TransactionService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(2, typeorm_1.InjectRepository(transaction_repository_1.TransactionRepository, 'master')),
    tslib_1.__param(3, typeorm_1.InjectRepository(transaction_repository_1.TransactionRepository, 'report')),
    tslib_1.__param(4, typeorm_1.InjectRepository(setting_repository_1.SettingRepository, 'report')),
    tslib_1.__param(5, typeorm_1.InjectRepository(latest_signature_repository_1.LatestSignatureRepository, 'report')),
    tslib_1.__param(6, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'master')),
    tslib_1.__param(7, typeorm_1.InjectRepository(dex_action_sol_txs_repository_1.DexActionSolTxRepository, 'report')),
    tslib_1.__metadata("design:paramtypes", [common_1.Logger,
        kafka_client_1.KafkaClient,
        transaction_repository_1.TransactionRepository,
        transaction_repository_1.TransactionRepository,
        setting_repository_1.SettingRepository,
        latest_signature_repository_1.LatestSignatureRepository,
        account_repository_1.AccountRepository,
        dex_action_sol_txs_repository_1.DexActionSolTxRepository,
        account_service_1.AccountService])
], TransactionService);
exports.TransactionService = TransactionService;
//# sourceMappingURL=transaction.service.js.map