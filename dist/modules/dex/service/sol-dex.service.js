"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolDexService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bytes_1 = require("@project-serum/anchor/dist/cjs/utils/bytes");
const web3_js_1 = require("@solana/web3.js");
const bignumber_js_1 = require("bignumber.js");
const config = require("config");
const ethers_1 = require("ethers");
const lodash_1 = require("lodash");
const sol_dex_config_1 = require("../../../configs/sol-dex.config");
const dex_action_entity_1 = require("../../../models/entities/dex-action-entity");
const dex_action_transaction_entity_1 = require("../../../models/entities/dex-action-transaction-entity");
const account_repository_1 = require("../../../models/repositories/account.repository");
const dex_action_history_repository_1 = require("../../../models/repositories/dex-action-history-repository");
const dex_action_sol_txs_repository_1 = require("../../../models/repositories/dex-action-sol-txs.repository");
const dex_action_transaction_repository_1 = require("../../../models/repositories/dex-action-transaction.repository");
const dex_action_repository_1 = require("../../../models/repositories/dex-action.repository");
const funding_history_repository_1 = require("../../../models/repositories/funding-history.repository");
const instrument_repository_1 = require("../../../models/repositories/instrument.repository");
const latest_signature_repository_1 = require("../../../models/repositories/latest-signature.repository");
const margin_history_repository_1 = require("../../../models/repositories/margin-history.repository");
const transaction_repository_1 = require("../../../models/repositories/transaction.repository");
const dex_constant_1 = require("../dex.constant");
const latest_block_service_1 = require("../../latest-block/latest-block.service");
const sotadex_wrapper_1 = require("../../../shares/helpers/sotadex-wrapper");
const utils_1 = require("../../../shares/helpers/utils");
const typeorm_2 = require("typeorm");
const { defaultScale, blockTimeInMs, matcherWallet, matcherKeypair, dexProgram, actionBatchSize, dexId, connection, finalizedConnection, processedConnection, usdcId, } = sol_dex_config_1.SolDex;
const TOLERANCE_AMOUNT = new bignumber_js_1.BigNumber(0.000015);
const DEX_MAX_IN_PROGRESS_ACTION = Number(config.get('dex.max_in_progress_action'));
let SolDexService = class SolDexService {
    constructor(logger, latestBlockService, masterConnection, reportMarginHistoryRepo, transactionRepoMaster, reportTransactionRepo, reportInstrumentRepo, dexActionRepo, reportDexActionRepo, dexActionTransactionRepo, reportDexActionTransactionRepo, dexActionHistoryRepo, reportDexActionHistoryRepo, reportAccountRepo, reportFundingHistoryRepo, dexActionSolTxRepo, reportDexActionSolTxRepo, latestSignatureRepo, reportLatestSignatureRepo) {
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
        this.dexActionSolTxRepo = dexActionSolTxRepo;
        this.reportDexActionSolTxRepo = reportDexActionSolTxRepo;
        this.latestSignatureRepo = latestSignatureRepo;
        this.reportLatestSignatureRepo = reportLatestSignatureRepo;
        this.instrumentIds = new Map();
        this.accountIdsToAddresses = new Map();
        this.accountAddressesToIds = new Map();
        this.accountIdsToUserIds = new Map();
        this.dexWrapper = new sotadex_wrapper_1.SotaDexWrapper(dexProgram, dexId, usdcId);
    }
    async handlePickDexActions() {
        this.logger.log(`Trade start, matcher address=${matcherWallet.publicKey.toBase58()}`);
        while (true) {
            const dexActions = await this.dexActionRepo.find({
                where: { dexActionTransactionId: 0 },
                take: actionBatchSize * DEX_MAX_IN_PROGRESS_ACTION,
                order: { id: 'ASC' },
                select: ['id', 'action', 'actionId', 'dexParameter'],
            });
            if (dexActions.length === 0) {
                this.logger.log('No actions found');
                await utils_1.sleep(1000);
                continue;
            }
            const actionChunks = lodash_1.chunk(dexActions, actionBatchSize);
            await Promise.all(actionChunks.map((chunk) => this._handlePickDexActions(chunk)));
            await utils_1.sleep(500);
        }
    }
    async handleSendDexActions() {
        while (true) {
            const dexActionTransactions = await this.dexActionTransactionRepo.find({
                where: { status: dex_constant_1.DexTransactionStatus.PENDING },
                take: DEX_MAX_IN_PROGRESS_ACTION * 2,
                order: { id: 'ASC' },
                select: ['id', 'rawTx', 'status', 'txid'],
            });
            if (dexActionTransactions.length === 0) {
                this.logger.log('No actions found');
                await utils_1.sleep(1000);
                continue;
            }
            const blockHash = (await connection.getLatestBlockhash()).blockhash;
            await Promise.all(dexActionTransactions.map((tx) => this._handleSendDexActions(tx, blockHash)));
            this.logger.log('handleSendDexActions finish');
            await utils_1.sleep(500);
        }
    }
    async handleVerifyDexActions() {
        while (true) {
            const sentRecords = await this.reportDexActionTransactionRepo.find({
                where: { status: dex_constant_1.DexTransactionStatus.SENT },
                take: DEX_MAX_IN_PROGRESS_ACTION,
                select: ['id', 'txid'],
            });
            if (sentRecords.length === 0) {
                this.logger.log('No actions found');
                await utils_1.sleep(1000);
                continue;
            }
            const receipts = await Promise.all(sentRecords.map(async (record) => ({ id: record.id, data: await connection.getTransaction(record.txid) })));
            const successIds = [];
            const revertIds = [];
            let isAnyEmpty = false;
            for (const receipt of receipts) {
                if (!receipt.data) {
                    this.logger.error(`DexActionTransaction id=${receipt.id} not found, continue to next loop`);
                    isAnyEmpty = true;
                    break;
                }
                if (receipt.data.meta.err) {
                    revertIds.push(receipt.id);
                }
                else {
                    successIds.push(receipt.id);
                }
            }
            if (isAnyEmpty) {
                await utils_1.sleep(1000);
                continue;
            }
            if (revertIds.length) {
                await this.dexActionTransactionRepo.update({ id: typeorm_2.In(revertIds) }, { status: dex_constant_1.DexTransactionStatus.REVERT });
            }
            if (successIds.length) {
                await this.dexActionTransactionRepo.update({ id: typeorm_2.In(successIds) }, { status: dex_constant_1.DexTransactionStatus.SUCCESS });
            }
            this.logger.log('Verify done');
        }
    }
    async handleCrawlSignature() {
        const service = 'handleCrawlSignature';
        const [sotadexAccount] = await this.dexWrapper.getSotadexAccount();
        this.logger.log(`handleCrawlSignature sotadexAccount=${sotadexAccount.toBase58()}`);
        const latestSignatureRecord = await this.reportLatestSignatureRepo.findOne({
            service,
        });
        let latestSignature = (latestSignatureRecord === null || latestSignatureRecord === void 0 ? void 0 : latestSignatureRecord.signature) || null;
        const _dexActionSignature = async () => {
            let reversedSignatures = [];
            let begin = undefined;
            const limit = 100;
            while (true) {
                const options = { limit };
                if (begin) {
                    options.before = begin;
                }
                const fetchedSignatures = await finalizedConnection.getSignaturesForAddress(sotadexAccount, options);
                reversedSignatures = reversedSignatures.concat(fetchedSignatures);
                this.logger.log(`Fetched ${fetchedSignatures.length} signatures, total: ${reversedSignatures.length}`);
                if (fetchedSignatures.length === limit) {
                    const signatureFound = fetchedSignatures.find((s) => s.signature === latestSignature);
                    if (signatureFound) {
                        break;
                    }
                }
                else if (fetchedSignatures.length < limit) {
                    if (latestSignature) {
                        const signatureFound = fetchedSignatures.find((s) => s.signature === latestSignature);
                        if (!signatureFound) {
                            throw new Error(`rpc endpoint does not have sufficient signature history to reach ${latestSignature}`);
                        }
                    }
                    break;
                }
                begin = reversedSignatures[reversedSignatures.length - 1].signature;
                await utils_1.sleep(500);
            }
            if (reversedSignatures.length === 0) {
                console.log('empty signatures');
                return;
            }
            const signatures = reversedSignatures.reverse();
            const fromIndex = signatures.findIndex((s) => s.signature === latestSignature);
            const insertSignatures = signatures.slice(fromIndex + 1);
            await this.saveSignatures(insertSignatures, service);
            if (insertSignatures.length > 0) {
                latestSignature = insertSignatures[insertSignatures.length - 1].signature;
            }
        };
        while (true) {
            await _dexActionSignature();
            console.log({ latestSignature });
            await utils_1.sleep(blockTimeInMs);
        }
    }
    async saveSignatures(signatures, service) {
        console.log(`Saving ${signatures.length} tx`);
        signatures = [...signatures];
        const batchSize = 10;
        while (signatures.length > 0) {
            const batch = signatures.splice(0, batchSize);
            let retryCount = 0;
            let batchWithLog;
            while (retryCount < 3) {
                retryCount++;
                try {
                    batchWithLog = await Promise.all(batch.map(async (signature) => {
                        const fetchTx = await finalizedConnection.getTransaction(signature.signature);
                        return {
                            slot: signature.slot,
                            txid: signature.signature,
                            logs: JSON.stringify(fetchTx.meta.logMessages),
                        };
                    }));
                    break;
                }
                catch (e) {
                    if (retryCount < 3) {
                        console.log(e);
                        await utils_1.sleep(2000);
                    }
                    else {
                        throw e;
                    }
                }
            }
            await this.dexActionSolTxRepo.insertIgnore(batchWithLog);
            const latestSignature = batch[batch.length - 1].signature;
            await this.latestSignatureRepo.insertOnDuplicate([{ service, signature: latestSignature }], ['signature', 'updatedAt'], ['service']);
        }
    }
    async handleHistoryDexActions() {
        const service = 'handleHistoryDexActions';
        const limit = 100;
        this.logger.log(`handleHistoryDexActions limit=${limit}`);
        const latestSignatureRecord = await this.reportLatestSignatureRepo.findOne({
            service,
        });
        let latestSignature = (latestSignatureRecord === null || latestSignatureRecord === void 0 ? void 0 : latestSignatureRecord.signature) || null;
        const _dexActionEvent = async () => {
            let findOptions = {};
            if (latestSignature) {
                const signatureRecord = await this.reportDexActionSolTxRepo.findOne({ txid: latestSignature });
                if (!signatureRecord) {
                    throw new Error(`${latestSignature} not found`);
                }
                findOptions = { id: typeorm_2.MoreThan(signatureRecord.id) };
            }
            const solanaTransactions = await this.reportDexActionSolTxRepo.find({
                where: findOptions,
                take: limit,
                order: { id: 'ASC' },
            });
            if (solanaTransactions.length === 0) {
                console.log('empty signatures');
                return;
            }
            const transformedEvents = [];
            const withdrawEvents = [];
            for (const solanaTransaction of solanaTransactions) {
                const logMessages = JSON.parse(solanaTransaction.logs);
                if (logMessages.includes('Log truncated')) {
                    throw new Error(`Log truncated ${solanaTransaction.txid}`);
                }
                const events = this.dexWrapper.extractEvents(logMessages);
                if (events.length === 0) {
                    console.log('no events');
                    continue;
                }
                for (let i = 0; i < events.length; i++) {
                    const currentEvent = events[i];
                    if (currentEvent.name !== 'UpdateMarginEvent') {
                        continue;
                    }
                    const transformedEvent = {
                        txid: solanaTransaction.txid,
                        logIndex: i,
                        address: currentEvent.data.user.toBase58(),
                        accountId: await this._getAccountId(currentEvent.data.user.toBase58()),
                        actionId: currentEvent.data.actionId.toString(),
                        action: this.dexActionTypeToString(currentEvent.data.actionType),
                        operationId: currentEvent.data.operationId.toString(),
                        oldMargin: ethers_1.utils.formatUnits(currentEvent.data.oldMargin.toString(), defaultScale).toString(),
                        newMargin: ethers_1.utils.formatUnits(currentEvent.data.newMargin.toString(), defaultScale).toString(),
                    };
                    if (transformedEvent.action === dex_constant_1.MatchAction.WITHDRAW) {
                        withdrawEvents.push(transformedEvent);
                    }
                    transformedEvents.push(transformedEvent);
                }
            }
            if (transformedEvents.length) {
                if (withdrawEvents.length) {
                }
                await this.dexActionHistoryRepo.insertIgnore(transformedEvents);
            }
            latestSignature = solanaTransactions[solanaTransactions.length - 1].txid;
            await this.latestSignatureRepo.insertOnDuplicate([{ service, signature: latestSignature }], ['signature', 'updatedAt'], ['service']);
        };
        while (true) {
            await _dexActionEvent();
            console.log({ latestSignature });
            await utils_1.sleep(blockTimeInMs);
        }
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
    async _handlePickDexActions(dexActions) {
        if (dexActions.length === 0) {
            return;
        }
        const instructions = [];
        for (const dexAction of dexActions) {
            if (dexAction.action === dex_constant_1.ActionType.TRADE) {
                instructions.push(await this.dexWrapper.getTradeInstruction(dexAction.dexParameter));
            }
            else if (dexAction.action === dex_constant_1.ActionType.WITHDRAW) {
                instructions.push(await this.dexWrapper.getWithdrawInstruction(dexAction.dexParameter));
            }
            else if (dexAction.action === dex_constant_1.ActionType.FUNDING) {
                instructions.push(await this.dexWrapper.getFundingInstruction(dexAction.dexParameter));
            }
        }
        const transaction = await this.dexWrapper.newTransaction(instructions);
        transaction.recentBlockhash = 'HJip7nKatc4DWPfAVq6VHtRvwEvXk2pVtLJrTH7JgLHe';
        transaction.sign(matcherKeypair);
        const txid = bytes_1.bs58.encode(transaction.signature);
        const serializeTx = transaction.serialize();
        const rawTx = serializeTx.toString('base64');
        console.log(`transaction size = ${serializeTx.byteLength}`);
        await this.masterConnection.transaction(async (manager) => {
            const transactionDexActionTransactionRepo = await manager.getCustomRepository(dex_action_transaction_repository_1.DexActionTransactionRepository);
            const transactionDexActionRepo = await manager.getCustomRepository(dex_action_repository_1.DexActionRepository);
            const actionTx = await transactionDexActionTransactionRepo.insert({
                txid,
                matcherAddress: matcherWallet.publicKey.toBase58(),
                nonce: dexActions[0].id,
                rawTx,
            });
            await transactionDexActionRepo.update({ id: typeorm_2.In(dexActions.map((a) => a.id)) }, { dexActionTransactionId: actionTx.identifiers[0].id });
        });
    }
    async _handleSendDexActions(dexTransaction, blockHash) {
        const transactionExist = await processedConnection.getSignatureStatus(dexTransaction.txid, {
            searchTransactionHistory: true,
        });
        if ((transactionExist === null || transactionExist === void 0 ? void 0 : transactionExist.value) && !transactionExist.value.err) {
            await this.dexActionTransactionRepo.update({ id: dexTransaction.id }, { status: dex_constant_1.DexTransactionStatus.SENT });
            return;
        }
        const rebuildTransaction = web3_js_1.Transaction.from(Buffer.from(dexTransaction.rawTx, 'base64'));
        const simulateTransaction = await processedConnection.simulateTransaction(rebuildTransaction);
        if (simulateTransaction.value.err) {
            throw new Error(JSON.stringify(simulateTransaction));
        }
        else {
        }
        rebuildTransaction.recentBlockhash = blockHash;
        rebuildTransaction.sign(matcherKeypair);
        const txid = bytes_1.bs58.encode(rebuildTransaction.signature);
        const rawTx = rebuildTransaction.serialize();
        await this.dexActionTransactionRepo.update({ id: dexTransaction.id }, { txid, rawTx: rawTx.toString('base64') });
        await processedConnection.sendRawTransaction(rawTx, {
            preflightCommitment: 'processed',
            maxRetries: 2,
        });
        await this.dexActionTransactionRepo.update({ id: dexTransaction.id }, { status: dex_constant_1.DexTransactionStatus.SENT });
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
SolDexService = tslib_1.__decorate([
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
    tslib_1.__param(15, typeorm_1.InjectRepository(dex_action_sol_txs_repository_1.DexActionSolTxRepository, 'master')),
    tslib_1.__param(16, typeorm_1.InjectRepository(dex_action_sol_txs_repository_1.DexActionSolTxRepository, 'report')),
    tslib_1.__param(17, typeorm_1.InjectRepository(latest_signature_repository_1.LatestSignatureRepository, 'master')),
    tslib_1.__param(18, typeorm_1.InjectRepository(latest_signature_repository_1.LatestSignatureRepository, 'report')),
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
        funding_history_repository_1.FundingHistoryRepository,
        dex_action_sol_txs_repository_1.DexActionSolTxRepository,
        dex_action_sol_txs_repository_1.DexActionSolTxRepository,
        latest_signature_repository_1.LatestSignatureRepository,
        latest_signature_repository_1.LatestSignatureRepository])
], SolDexService);
exports.SolDexService = SolDexService;
//# sourceMappingURL=sol-dex.service.js.map