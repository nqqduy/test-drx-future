"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DexService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const bignumber_js_1 = require("bignumber.js");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ethers_1 = require("ethers");
const config = require("config");
const dex_constant_1 = require("../dex.constant");
const utils_1 = require("../../../shares/helpers/utils");
const dex_config_1 = require("../../../configs/dex.config");
const margin_history_repository_1 = require("../../../models/repositories/margin-history.repository");
const transaction_repository_1 = require("../../../models/repositories/transaction.repository");
const matching_engine_const_1 = require("../../matching-engine/matching-engine.const");
const dex_action_repository_1 = require("../../../models/repositories/dex-action.repository");
const ethers_2 = require("ethers");
const instrument_repository_1 = require("../../../models/repositories/instrument.repository");
const account_repository_1 = require("../../../models/repositories/account.repository");
const transaction_enum_1 = require("../../../shares/enums/transaction.enum");
const dex_action_transaction_repository_1 = require("../../../models/repositories/dex-action-transaction.repository");
const latest_block_service_1 = require("../../latest-block/latest-block.service");
const dex_action_history_repository_1 = require("../../../models/repositories/dex-action-history-repository");
const funding_history_repository_1 = require("../../../models/repositories/funding-history.repository");
const { defaultScale, blockTimeInMs, dexContract, chainId, matcherWallet, provider, collateralDecimal, actionBatchSize, } = dex_config_1.Dex;
const BLOCK_CONFIRM = Number(config.get('dex.block_confirm'));
const DEX_START_BLOCK = Number(config.get('dex.start_block'));
const TOLERANCE_AMOUNT = new bignumber_js_1.BigNumber(0.000015);
const DEX_MAX_IN_PROGRESS_ACTION = Number(config.get('dex.max_in_progress_action'));
let DexService = class DexService {
    constructor(logger, latestBlockService, masterConnection, reportMarginHistoryRepo, transactionRepoMaster, reportTransactionRepo, reportInstrumentRepo, dexActionRepo, reportDexActionRepo, dexActionTransactionRepo, reportDexActionTransactionRepo, dexActionHistoryRepo, reportDexActionHistoryRepo, reportAccountRepo, reportFundingHistoryRepo) {
        this.logger = logger;
        this.latestBlockService = latestBlockService;
        this.masterConnection = masterConnection;
        this.reportMarginHistoryRepo = reportMarginHistoryRepo;
        this.transactionRepoMaster = transactionRepoMaster;
        this.reportTransactionRepo = reportTransactionRepo;
        this.reportInstrumentRepo = reportInstrumentRepo;
        this.dexActionRepo = dexActionRepo;
        this.reportDexActionRepo = reportDexActionRepo;
        this.dexActionTransactionRepo = dexActionTransactionRepo;
        this.reportDexActionTransactionRepo = reportDexActionTransactionRepo;
        this.dexActionHistoryRepo = dexActionHistoryRepo;
        this.reportDexActionHistoryRepo = reportDexActionHistoryRepo;
        this.reportAccountRepo = reportAccountRepo;
        this.reportFundingHistoryRepo = reportFundingHistoryRepo;
        this.instrumentIds = new Map();
        this.accountIdsToAddresses = new Map();
        this.accountAddressesToIds = new Map();
        this.accountIdsToUserIds = new Map();
    }
    async saveDexActions(offset, commands) {
        const dexActions = [];
        for (const command of commands) {
            if (command.code === matching_engine_const_1.CommandCode.WITHDRAW && command.data.status === transaction_enum_1.TransactionStatus.APPROVED) {
                dexActions.push(await this._withdrawalToDexAction(offset, command.data));
                continue;
            }
            if (command.code === matching_engine_const_1.CommandCode.PAY_FUNDING && command.fundingHistories) {
                dexActions.push(...(await this._fundingsToDexActions(offset, command.fundingHistories)));
                continue;
            }
            if (command.trades && command.trades.length) {
                dexActions.push(...(await this._tradesToDexActions(offset, command.trades)));
            }
        }
        if (dexActions) {
            return this.dexActionRepo.insertIgnore(dexActions);
        }
        return null;
    }
    async _fundingsToDexActions(offset, fundingHistories) {
        const dexActions = [];
        for (const fundingHistory of fundingHistories) {
            const dexParameter = {
                id: fundingHistory.id,
                operationId: fundingHistory.operationId,
                user: await this._getAccountAddress(fundingHistory.accountId),
                amount: ethers_2.utils.parseUnits(fundingHistory.amount.toString(), defaultScale).toString(),
            };
            dexActions.push({
                action: dex_constant_1.ActionType.FUNDING,
                actionId: fundingHistory.id,
                kafkaOffset: offset,
                rawParameter: fundingHistory,
                dexParameter,
            });
        }
        return dexActions;
    }
    async _withdrawalToDexAction(offset, data) {
        const dexParameter = {
            id: data.id,
            operationId: data.operationId,
            user: await this._getAccountAddress(data.accountId),
            amount: ethers_2.utils.parseUnits(data.amount.toString(), collateralDecimal).toString(),
            fee: ethers_2.utils.parseUnits((data.fee || 0).toString(), collateralDecimal).toString(),
        };
        return {
            action: dex_constant_1.ActionType.WITHDRAW,
            actionId: data.id,
            kafkaOffset: offset,
            rawParameter: data,
            dexParameter,
        };
    }
    async _tradesToDexActions(offset, trades) {
        const dexActions = [];
        for (const trade of trades) {
            const instrumentId = await this._getInstrumentId(trade.symbol);
            let liquidationSide = dex_constant_1.DexLiquidationSide.NONE;
            let bankruptPrice = ethers_2.utils.parseUnits('0', defaultScale);
            let bankruptFee = ethers_2.utils.parseUnits('0', defaultScale);
            if (trade.buyOrder.note === 'LIQUIDATION') {
                liquidationSide = dex_constant_1.DexLiquidationSide.BUY;
                bankruptPrice = ethers_2.utils.parseUnits(trade.buyOrder.price, defaultScale);
                bankruptFee = ethers_2.utils.parseUnits(new bignumber_js_1.BigNumber(trade.buyOrder.price)
                    .times(trade.quantity)
                    .times(trade.buyFeeRate)
                    .toFixed(defaultScale, bignumber_js_1.BigNumber.ROUND_DOWN), defaultScale);
            }
            else if (trade.sellOrder.note === 'LIQUIDATION') {
                liquidationSide = dex_constant_1.DexLiquidationSide.SELL;
                bankruptPrice = ethers_2.utils.parseUnits(trade.sellOrder.price, defaultScale);
                bankruptFee = ethers_2.utils.parseUnits(new bignumber_js_1.BigNumber(trade.sellOrder.price)
                    .times(trade.quantity)
                    .times(trade.sellFeeRate)
                    .toFixed(defaultScale, bignumber_js_1.BigNumber.ROUND_DOWN), defaultScale);
            }
            const dexParameter = {
                id: trade.id,
                operationId: trade.operationId,
                buyer: await this._getAccountAddress(trade.buyAccountId),
                seller: await this._getAccountAddress(trade.sellAccountId),
                quantity: ethers_2.utils.parseUnits(trade.quantity.toString(), defaultScale).toString(),
                price: ethers_2.utils.parseUnits(trade.price.toString(), defaultScale).toString(),
                bankruptPrice: bankruptPrice.toString(),
                liquidationSide,
                buyerFee: ethers_2.utils.parseUnits(trade.buyFee.toString(), defaultScale).toString(),
                sellerFee: ethers_2.utils.parseUnits(trade.sellFee.toString(), defaultScale).toString(),
                bankruptFee: bankruptFee.toString(),
                instrumentId,
            };
            dexActions.push({
                action: dex_constant_1.ActionType.TRADE,
                actionId: trade.id,
                kafkaOffset: offset,
                rawParameter: trade,
                dexParameter,
            });
        }
        return dexActions;
    }
    async handlePickDexActions() {
        let nonce = await provider.getTransactionCount(matcherWallet.address);
        this.logger.log(`Trade start, matcher nonce=${nonce}`);
        while (true) {
            const revertRecord = await this.reportDexActionTransactionRepo.findOne({
                select: ['id'],
                where: { status: dex_constant_1.DexTransactionStatus.REVERT },
            });
            if (revertRecord) {
                throw new Error(`${revertRecord.id} is reverted, need manual check`);
            }
            const sentRecords = await this.dexActionTransactionRepo.find({
                select: ['id'],
                where: { status: typeorm_2.In([dex_constant_1.DexTransactionStatus.PENDING, dex_constant_1.DexTransactionStatus.SENT]) },
                skip: DEX_MAX_IN_PROGRESS_ACTION - 1,
                take: 1,
            });
            if (sentRecords.length) {
                this.logger.log(`DEX_MAX_IN_PROGRESS_ACTION=${DEX_MAX_IN_PROGRESS_ACTION}, wait`);
                await utils_1.sleep(blockTimeInMs);
                continue;
            }
            const dexActions = await this.dexActionRepo.find({
                where: { dexActionTransactionId: 0 },
                take: actionBatchSize,
                order: { id: 'ASC' },
                select: ['id', 'action', 'actionId', 'dexParameter'],
            });
            if (dexActions.length === 0) {
                this.logger.log('No actions found');
                await utils_1.sleep(blockTimeInMs);
                continue;
            }
            const abiArray = [];
            for (const dexAction of dexActions) {
                if (dexAction.action === dex_constant_1.ActionType.TRADE) {
                    abiArray.push(dexContract.interface.encodeFunctionData('trade', [[dexAction.dexParameter]]));
                }
                else if (dexAction.action === dex_constant_1.ActionType.WITHDRAW) {
                    abiArray.push(dexContract.interface.encodeFunctionData('withdraw', [[dexAction.dexParameter]]));
                }
                else if (dexAction.action === dex_constant_1.ActionType.FUNDING) {
                    abiArray.push(dexContract.interface.encodeFunctionData('funding', [[dexAction.dexParameter]]));
                }
            }
            const txData = await dexContract.populateTransaction.multicall(abiArray);
            const gasLimit = await dexContract.estimateGas.multicall(abiArray);
            const tx = Object.assign({ chainId, gasPrice: ethers_1.BigNumber.from(5000000000), gasLimit, nonce: ethers_1.BigNumber.from(nonce) }, txData);
            const signedTx = await matcherWallet.signTransaction(tx);
            const txid = ethers_2.utils.keccak256(signedTx);
            await this.masterConnection.transaction(async (manager) => {
                const transactionDexActionTransactionRepo = await manager.getCustomRepository(dex_action_transaction_repository_1.DexActionTransactionRepository);
                const transactionDexActionRepo = await manager.getCustomRepository(dex_action_repository_1.DexActionRepository);
                const actionTx = await transactionDexActionTransactionRepo.insert({
                    txid,
                    matcherAddress: matcherWallet.address,
                    nonce: nonce.toString(),
                    rawTx: signedTx,
                });
                await transactionDexActionRepo.update({ id: typeorm_2.In(dexActions.map((a) => a.id)) }, { dexActionTransactionId: actionTx.identifiers[0].id });
            });
            nonce++;
        }
    }
    async handleSendDexActions() {
        await this._retrySentDexTxs();
        let loopTimes = 0;
        while (true) {
            if (++loopTimes === 10) {
                await this._retrySentDexTxs();
                loopTimes = 0;
            }
            const revertRecord = await this.reportDexActionTransactionRepo.findOne({
                select: ['id'],
                where: { status: dex_constant_1.DexTransactionStatus.REVERT },
            });
            if (revertRecord) {
                throw new Error(`${revertRecord.id} is reverted, need manual check`);
            }
            const dexActionTransactions = await this.reportDexActionTransactionRepo.find({
                where: { status: dex_constant_1.DexTransactionStatus.PENDING },
                take: DEX_MAX_IN_PROGRESS_ACTION,
                order: { id: 'ASC' },
                select: ['id', 'rawTx'],
            });
            if (dexActionTransactions.length === 0) {
                this.logger.log('No actions found');
                await utils_1.sleep(blockTimeInMs);
                continue;
            }
            await this.dexActionTransactionRepo.update({ id: typeorm_2.In(dexActionTransactions.map((tx) => tx.id)) }, { status: dex_constant_1.DexTransactionStatus.SENT });
            try {
                await Promise.all(dexActionTransactions.map((tx) => provider.sendTransaction(tx.rawTx)));
            }
            catch (err) {
                await this._retrySentDexTxs();
                throw err;
            }
        }
    }
    async _retrySentDexTxs() {
        this.logger.log('_retrySentDexTxs');
        const sentTxs = await this.reportDexActionTransactionRepo.find({
            where: { status: dex_constant_1.DexTransactionStatus.SENT },
            select: ['id', 'rawTx'],
        });
        if (sentTxs.length) {
            try {
                await Promise.all(sentTxs.map((tx) => provider.sendTransaction(tx.rawTx)));
            }
            catch (_a) { }
        }
    }
    async handleVerifyDexActions() {
        while (true) {
            const sentRecords = await this.reportDexActionTransactionRepo.find({
                where: { status: dex_constant_1.DexTransactionStatus.SENT },
                take: 10,
                select: ['id', 'txid'],
            });
            if (sentRecords.length === 0) {
                this.logger.log('No actions found');
                await utils_1.sleep(blockTimeInMs);
                continue;
            }
            const receipts = await Promise.all(sentRecords.map(async (record) => ({ id: record.id, data: await provider.getTransactionReceipt(record.txid) })));
            const successIds = [];
            const revertIds = [];
            for (const receipt of receipts) {
                if (!receipt.data) {
                    continue;
                }
                if (receipt.data.status === 0) {
                    revertIds.push(receipt.id);
                }
                else if (receipt.data.status === 1) {
                    successIds.push(receipt.id);
                }
            }
            if (revertIds.length) {
                await this.dexActionTransactionRepo.update({ id: typeorm_2.In(revertIds) }, { status: dex_constant_1.DexTransactionStatus.REVERT });
            }
            if (successIds.length) {
                await this.dexActionTransactionRepo.update({ id: typeorm_2.In(successIds) }, { status: dex_constant_1.DexTransactionStatus.SUCCESS });
            }
        }
    }
    async handleHistoryDexActions() {
        const maxBlockPerLoop = 50;
        const queryTopics = [ethers_2.utils.id('UpdateMargin(uint8,uint64,uint64,address,int128,int128)')];
        const commandName = 'dex-action-history';
        const latestBlockInDatabase = await this.latestBlockService.getLatestBlock(commandName);
        const latestBlock = Number((latestBlockInDatabase === null || latestBlockInDatabase === void 0 ? void 0 : latestBlockInDatabase.blockNumber) || 0);
        let from = Math.max(latestBlock, DEX_START_BLOCK);
        const innerFunc = async () => {
            const safeLatestBlockOnChain = (await provider.getBlockNumber()) - BLOCK_CONFIRM;
            const to = Math.min(from + maxBlockPerLoop, safeLatestBlockOnChain);
            if (to <= from) {
                this.logger.log(`wait`);
                return;
            }
            const events = await dexContract.queryFilter({
                address: dexContract.address,
                topics: queryTopics,
            }, from, to);
            if (events.length === 0) {
                this.logger.log(`No events found from ${from} to ${to}`);
            }
            else {
                const withdrawEvents = [];
                const histories = await Promise.all(events.map(async (event) => {
                    if (event.args.actionType === 3) {
                        withdrawEvents.push(event);
                    }
                    return {
                        txid: event.transactionHash,
                        logIndex: event.logIndex,
                        address: event.args.user,
                        accountId: await this._getAccountId(event.args.user),
                        actionId: event.args.actionId.toString(),
                        action: this.dexActionTypeToString(event.args.actionType),
                        operationId: event.args.operationId.toString(),
                        oldMargin: ethers_2.utils.formatUnits(event.args.oldMargin, defaultScale).toString(),
                        newMargin: ethers_2.utils.formatUnits(event.args.newMargin, defaultScale).toString(),
                    };
                }));
                if (withdrawEvents.length) {
                }
                await this.dexActionHistoryRepo.insertIgnore(histories);
                this.logger.log(`Crawl done from ${from} to ${to}`);
            }
            from = to + 1;
            await this.latestBlockService.saveLatestBlock(commandName, to);
        };
        setInterval(innerFunc, blockTimeInMs);
        return new Promise(() => { });
    }
    async handleBalanceCheckerDexActions() {
        while (true) {
            const pendingRecords = await this.reportDexActionHistoryRepo.find({
                where: { validStatus: dex_constant_1.BalanceValidStatus.PENDING },
                take: 1,
            });
            if (pendingRecords.length === 0) {
                this.logger.log('No records found');
                await utils_1.sleep(blockTimeInMs);
                continue;
            }
            for (const pendingRecord of pendingRecords) {
                if (pendingRecord.action === dex_constant_1.MatchAction.MATCHING_BUY) {
                    const matchingBuy = await this.reportMarginHistoryRepo.findOne({
                        where: { tradeId: pendingRecord.actionId, action: dex_constant_1.MatchAction.MATCHING_BUY },
                        select: ['id', 'contractMargin', 'tradeId'],
                    });
                    if (!matchingBuy) {
                        throw new Error(`matchingBuy not found id ${pendingRecord.actionId}`);
                    }
                    const difference = new bignumber_js_1.BigNumber(matchingBuy.contractMargin).minus(pendingRecord.newMargin).abs();
                    if (difference.isGreaterThan(TOLERANCE_AMOUNT)) {
                        throw new Error(`margin not match id ${pendingRecord.id}`);
                    }
                    await this.dexActionHistoryRepo.update({ id: pendingRecord.id }, { validStatus: dex_constant_1.BalanceValidStatus.SUCCESS });
                }
                else if (pendingRecord.action === dex_constant_1.MatchAction.MATCHING_SELL) {
                    const matchingSell = await this.reportMarginHistoryRepo.findOne({
                        where: { tradeId: pendingRecord.actionId, action: dex_constant_1.MatchAction.MATCHING_SELL },
                        select: ['id', 'contractMargin', 'tradeId'],
                    });
                    if (!matchingSell) {
                        throw new Error(`matchingSell not found id ${pendingRecord.actionId}`);
                    }
                    const difference = new bignumber_js_1.BigNumber(matchingSell.contractMargin).minus(pendingRecord.newMargin).abs();
                    if (difference.isGreaterThan(TOLERANCE_AMOUNT)) {
                        throw new Error(`margin not match id ${pendingRecord.id}`);
                    }
                    await this.dexActionHistoryRepo.update({ id: pendingRecord.id }, { validStatus: dex_constant_1.BalanceValidStatus.SUCCESS });
                }
                else if (pendingRecord.action === dex_constant_1.MatchAction.WITHDRAW) {
                    const withdraw = await this.reportTransactionRepo.findOne({
                        where: { id: pendingRecord.actionId },
                        select: ['id', 'amount'],
                    });
                    if (!withdraw) {
                        throw new Error(`withdraw not found id ${pendingRecord.actionId}`);
                    }
                    if (!new bignumber_js_1.BigNumber(withdraw.amount).isEqualTo(new bignumber_js_1.BigNumber(pendingRecord.oldMargin).minus(pendingRecord.newMargin))) {
                        throw new Error(`margin not match id ${pendingRecord.id}`);
                    }
                    await this.dexActionHistoryRepo.update({ id: pendingRecord.id }, { validStatus: dex_constant_1.BalanceValidStatus.SUCCESS });
                }
                else if (pendingRecord.action === dex_constant_1.MatchAction.FUNDING) {
                    const fundingHistory = await this.reportFundingHistoryRepo.findOne({
                        where: { id: pendingRecord.actionId },
                        select: ['id', 'amount'],
                    });
                    if (!fundingHistory) {
                        throw new Error(`funding history not found id ${pendingRecord.actionId}`);
                    }
                    if (!new bignumber_js_1.BigNumber(fundingHistory.amount).isEqualTo(new bignumber_js_1.BigNumber(pendingRecord.newMargin).minus(pendingRecord.oldMargin))) {
                        throw new Error(`margin not match id ${pendingRecord.id}`);
                    }
                    await this.dexActionHistoryRepo.update({ id: pendingRecord.id }, { validStatus: dex_constant_1.BalanceValidStatus.SUCCESS });
                }
            }
        }
    }
    dexActionTypeToString(status) {
        const stringArray = [
            dex_constant_1.MatchAction.MATCHING_BUY,
            dex_constant_1.MatchAction.MATCHING_SELL,
            dex_constant_1.MatchAction.FUNDING,
            dex_constant_1.MatchAction.WITHDRAW,
        ];
        return stringArray[status];
    }
    async _getInstrumentId(symbol) {
        if (this.instrumentIds.has(symbol)) {
            return this.instrumentIds.get(symbol);
        }
        const instrument = await this.reportInstrumentRepo.findOne({ where: { symbol }, select: ['id'] });
        if (!instrument) {
            throw new Error(`not found id for instrument symbol ${symbol}`);
        }
        this.instrumentIds.set(symbol, instrument.id.toString());
        return instrument.id;
    }
    async _getAccountAddress(accountId) {
        if (this.accountIdsToAddresses.has(accountId)) {
            return this.accountIdsToAddresses.get(accountId);
        }
        const user = await this.reportAccountRepo
            .createQueryBuilder('Account')
            .innerJoin('users', 'User', 'User.id = Account.ownerId')
            .where('Account.id = :accountId')
            .setParameters({ accountId })
            .select(['User.address user_address', 'Account.ownerId account_owner_id'])
            .getRawOne();
        if (!user) {
            throw new Error(`not found address for account id ${accountId}`);
        }
        this.accountIdsToAddresses.set(accountId, user.user_address);
        this.accountIdsToUserIds.set(accountId, user.account_owner_id);
        this.accountAddressesToIds.set(user.user_address, accountId);
        return user.user_address;
    }
    async _getAccountOwnerId(accountId) {
        if (this.accountIdsToUserIds.has(accountId)) {
            return this.accountIdsToUserIds.get(accountId);
        }
        const user = await this.reportAccountRepo.findOne({ where: { id: accountId }, select: ['id'] });
        if (!user) {
            throw new Error(`not found address for account id ${accountId}`);
        }
        this.accountIdsToUserIds.set(accountId, user.id.toString());
        return user.id.toString();
    }
    async _getAccountId(address) {
        if (this.accountAddressesToIds.has(address)) {
            return this.accountAddressesToIds.get(address);
        }
        const user = await this.reportAccountRepo
            .createQueryBuilder('Account')
            .innerJoin('users', 'User', 'User.id = Account.ownerId')
            .where('User.address = :address')
            .setParameters({ address })
            .select(['Account.id account_id'])
            .getRawOne();
        if (!user) {
            throw new Error(`not found account_id for ${address}`);
        }
        this.accountAddressesToIds.set(address, user.account_id);
        this.accountIdsToAddresses.set(user.account_id, address);
        return user.account_id;
    }
};
DexService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(2, typeorm_1.InjectConnection('master')),
    tslib_1.__param(3, typeorm_1.InjectRepository(margin_history_repository_1.MarginHistoryRepository, 'report')),
    tslib_1.__param(4, typeorm_1.InjectRepository(transaction_repository_1.TransactionRepository, 'master')),
    tslib_1.__param(5, typeorm_1.InjectRepository(transaction_repository_1.TransactionRepository, 'report')),
    tslib_1.__param(6, typeorm_1.InjectRepository(instrument_repository_1.InstrumentRepository, 'report')),
    tslib_1.__param(7, typeorm_1.InjectRepository(dex_action_repository_1.DexActionRepository, 'master')),
    tslib_1.__param(8, typeorm_1.InjectRepository(dex_action_repository_1.DexActionRepository, 'report')),
    tslib_1.__param(9, typeorm_1.InjectRepository(dex_action_transaction_repository_1.DexActionTransactionRepository, 'master')),
    tslib_1.__param(10, typeorm_1.InjectRepository(dex_action_transaction_repository_1.DexActionTransactionRepository, 'report')),
    tslib_1.__param(11, typeorm_1.InjectRepository(dex_action_history_repository_1.DexActionHistoryRepository, 'master')),
    tslib_1.__param(12, typeorm_1.InjectRepository(dex_action_history_repository_1.DexActionHistoryRepository, 'report')),
    tslib_1.__param(13, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'report')),
    tslib_1.__param(14, typeorm_1.InjectRepository(funding_history_repository_1.FundingHistoryRepository, 'report')),
    tslib_1.__metadata("design:paramtypes", [common_1.Logger,
        latest_block_service_1.LatestBlockService,
        typeorm_2.Connection,
        margin_history_repository_1.MarginHistoryRepository,
        transaction_repository_1.TransactionRepository,
        transaction_repository_1.TransactionRepository,
        instrument_repository_1.InstrumentRepository,
        dex_action_repository_1.DexActionRepository,
        dex_action_repository_1.DexActionRepository,
        dex_action_transaction_repository_1.DexActionTransactionRepository,
        dex_action_transaction_repository_1.DexActionTransactionRepository,
        dex_action_history_repository_1.DexActionHistoryRepository,
        dex_action_history_repository_1.DexActionHistoryRepository,
        account_repository_1.AccountRepository,
        funding_history_repository_1.FundingHistoryRepository])
], DexService);
exports.DexService = DexService;
//# sourceMappingURL=dex.service.js.map