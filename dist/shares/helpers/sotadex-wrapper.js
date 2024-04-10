"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SotaDexWrapper = exports.LOG_START = exports.SOTADEX_POSITION_SEED = exports.SOTADEX_MEMBER_SEED = exports.SOTADEX_MINT_SEED = exports.SOTADEX_SEED = void 0;
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const sotadex_solana_1 = require("../../idl/sotadex_solana");
const dex_constant_1 = require("../../modules/dex/dex.constant");
exports.SOTADEX_SEED = Buffer.from('sotadex');
exports.SOTADEX_MINT_SEED = Buffer.from('sotadex-mint');
exports.SOTADEX_MEMBER_SEED = Buffer.from('sotadex-member');
exports.SOTADEX_POSITION_SEED = Buffer.from('sotadex-position');
exports.LOG_START = 'sotadex-log';
class SotaDexWrapper {
    constructor(program, dexId, usdcId) {
        this.program = program;
        this.dexId = dexId;
        this.usdcId = usdcId;
        this.existsMap = new Map();
    }
    async getSotadexAccount() {
        return web3_js_1.PublicKey.findProgramAddress([exports.SOTADEX_SEED, this.dexId.toArrayLike(Buffer, 'le', 8)], this.program.programId);
    }
    async getSotadexTokenAccount() {
        return web3_js_1.PublicKey.findProgramAddress([exports.SOTADEX_MINT_SEED, this.dexId.toArrayLike(Buffer, 'le', 8)], this.program.programId);
    }
    async getMemberAccount(address) {
        return web3_js_1.PublicKey.findProgramAddress([exports.SOTADEX_MEMBER_SEED, this.dexId.toArrayLike(Buffer, 'le', 8), address.toBuffer()], this.program.programId);
    }
    async getUsdcTokenAccount(address) {
        return spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, this.usdcId, address);
    }
    async getMemberPositionAccount(address, instructionId) {
        return web3_js_1.PublicKey.findProgramAddress([
            exports.SOTADEX_POSITION_SEED,
            this.dexId.toArrayLike(Buffer, 'le', 8),
            address.toBuffer(),
            instructionId.toArrayLike(Buffer, 'le', 2),
        ], this.program.programId);
    }
    async isAccountExist(address) {
        if (this.existsMap.get(address.toBase58())) {
            return true;
        }
        const exist = await this.program.provider.connection.getAccountInfo(address);
        if (exist) {
            this.existsMap.set(address.toBase58(), true);
        }
        return !!exist;
    }
    async getWithdrawInstruction(dexParameter) {
        await this.fetchOnchainInfo();
        const memberAddress = new web3_js_1.PublicKey(dexParameter.user);
        const [sotadexAccount] = await this.getSotadexAccount();
        const [sotadexTokenAccount] = await this.getSotadexTokenAccount();
        const [sotadexMemberAccount] = await this.getMemberAccount(memberAddress);
        const [feeCollectorMemberAccount] = await this.getMemberAccount(this.feeCollector);
        const senderTokenAccount = await this.getUsdcTokenAccount(memberAddress);
        if (!this.isAccountExist(sotadexMemberAccount)) {
            throw new Error(`Member ${sotadexMemberAccount.toBase58()} account not exist, address=${memberAddress.toBase58()}`);
        }
        if (!this.isAccountExist(senderTokenAccount)) {
            throw new Error(`Token Account ${senderTokenAccount.toBase58()} account not exist, address=${memberAddress.toBase58()}`);
        }
        const withdrawArg = {
            id: new anchor_1.BN(dexParameter.id),
            operationId: new anchor_1.BN(dexParameter.operationId),
            user: memberAddress,
            amount: new anchor_1.BN(dexParameter.amount),
            fee: new anchor_1.BN(dexParameter.fee),
        };
        return this.program.instruction.withdraw(withdrawArg, {
            accounts: {
                sender: this.program.provider.wallet.publicKey,
                userTokenAccount: senderTokenAccount,
                sotadexAccount,
                sotadexTokenAccount,
                sotadexMemberAccount,
                feeCollectorMemberAccount,
                systemProgram: web3_js_1.SystemProgram.programId,
                tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            },
        });
    }
    async getFundingInstruction(dexParameter) {
        const memberAddress = new web3_js_1.PublicKey(dexParameter.user);
        const [sotadexAccount] = await this.getSotadexAccount();
        const [sotadexMemberAccount] = await this.getMemberAccount(memberAddress);
        if (!this.isAccountExist(sotadexMemberAccount)) {
            throw new Error(`Member ${sotadexMemberAccount.toBase58()} account not exist, address=${memberAddress.toBase58()}`);
        }
        const fundingArg = {
            id: new anchor_1.BN(dexParameter.id),
            operationId: new anchor_1.BN(dexParameter.operationId),
            user: memberAddress,
            amount: new anchor_1.BN(dexParameter.amount),
        };
        return this.program.instruction.funding(fundingArg, {
            accounts: {
                sender: this.program.provider.wallet.publicKey,
                sotadexAccount,
                sotadexMemberAccount,
                systemProgram: web3_js_1.SystemProgram.programId,
            },
        });
    }
    async initPosition(instrumentId, address) {
        const [sotadexAccount] = await this.getSotadexAccount();
        const [positionAccount, positionAccountBump] = await this.getMemberPositionAccount(address, instrumentId);
        return this.program.rpc.initPosition(instrumentId.toNumber(), positionAccountBump, {
            accounts: {
                sender: this.program.provider.wallet.publicKey,
                memberPubkey: address,
                sotadexAccount,
                positionAccount: positionAccount,
                systemProgram: web3_js_1.SystemProgram.programId,
            },
        });
    }
    async getTradeInstruction(dexParameter) {
        await this.fetchOnchainInfo();
        const buyerAddress = new web3_js_1.PublicKey(dexParameter.buyer);
        const sellerAddress = new web3_js_1.PublicKey(dexParameter.seller);
        const instrumentId = new anchor_1.BN(dexParameter.instrumentId);
        const [sotadexAccount] = await this.getSotadexAccount();
        const [buyerMemberAccount] = await this.getMemberAccount(buyerAddress);
        const [buyerPositionAccount] = await this.getMemberPositionAccount(buyerAddress, instrumentId);
        const [sellerMemberAccount] = await this.getMemberAccount(sellerAddress);
        const [sellerPositionAccount] = await this.getMemberPositionAccount(sellerAddress, instrumentId);
        const [feeCollectorMemberAccount] = await this.getMemberAccount(this.feeCollector);
        const [insuranceMemberAccount] = await this.getMemberAccount(this.insurance);
        if (!(await this.isAccountExist(buyerPositionAccount))) {
            throw new Error(`buyerPositionAccount ${buyerPositionAccount.toBase58()} is not exist, instrumentId=${instrumentId.toNumber()}, address=${buyerAddress.toBase58()}`);
        }
        if (!(await this.isAccountExist(sellerPositionAccount))) {
            throw new Error(`sellerPositionAccount ${sellerPositionAccount.toBase58()} is not exist, instrumentId=${instrumentId.toNumber()}, address=${sellerAddress.toBase58()}`);
        }
        const tradeArg = {
            id: new anchor_1.BN(dexParameter.id),
            operationId: new anchor_1.BN(dexParameter.operationId),
            buyer: buyerAddress,
            seller: sellerAddress,
            quantity: new anchor_1.BN(dexParameter.quantity),
            price: new anchor_1.BN(dexParameter.price),
            bankruptPrice: new anchor_1.BN(dexParameter.bankruptPrice),
            bankruptFee: new anchor_1.BN(dexParameter.bankruptFee),
            liquidationSide: dexParameter.liquidationSide,
            buyerFee: new anchor_1.BN(dexParameter.buyerFee),
            sellerFee: new anchor_1.BN(dexParameter.sellerFee),
            instrumentId: Number(dexParameter.instrumentId),
        };
        return this.program.instruction.trade(tradeArg, {
            accounts: {
                sender: this.program.provider.wallet.publicKey,
                sotadexAccount,
                buyerMemberAccount,
                buyerPositionAccount,
                sellerMemberAccount,
                sellerPositionAccount,
                feeCollectorMemberAccount,
                insuranceMemberAccount,
                systemProgram: web3_js_1.SystemProgram.programId,
            },
        });
    }
    async newTransaction(instructions) {
        const transaction = new web3_js_1.Transaction();
        transaction.add(...instructions);
        transaction.feePayer = this.program.provider.wallet.publicKey;
        return transaction;
    }
    async fetchOnchainInfo() {
        if (this.feeCollector) {
            return;
        }
        const [sotadexAccount] = await this.getSotadexAccount();
        const sotadexInfo = await this.program.account.sotadexAccount.fetch(sotadexAccount);
        this.feeCollector = sotadexInfo.feeCollector;
        this.insurance = sotadexInfo.insurance;
    }
    extractEvents(logMessages) {
        const groupLogMessages = this._groupLogMessages(logMessages);
        const needLogs = groupLogMessages[this.program.programId.toBase58()] || [];
        const serializedLogMessages = [];
        const events = [];
        for (let i = 0; i < needLogs.length; i++) {
            const logMessage = needLogs[i];
            const jsonStartStr = `Program log: ${exports.LOG_START}`;
            if (logMessage.startsWith(jsonStartStr)) {
                const serializedLog = needLogs[i + 1].slice('Program log: '.length);
                serializedLogMessages.push(serializedLog);
            }
        }
        for (let i = 0; i < serializedLogMessages.length; i++) {
            const log = serializedLogMessages[i];
            const decodedLog = this.program.coder.events.decode(log);
            if (!decodedLog) {
                continue;
            }
            events.push(decodedLog);
        }
        return events;
    }
    _groupLogMessages(logMessages) {
        if (!logMessages.length) {
            return {};
        }
        const logMapping = {};
        const programStack = [];
        for (const logMessage of logMessages) {
            const [_program, _programId, _method] = logMessage.split(' ');
            if (['Deployed', 'Upgraded'].includes(_program)) {
                continue;
            }
            if (_method === 'invoke') {
                if (!logMapping[_programId]) {
                    logMapping[_programId] = [];
                }
                logMapping[_programId].push(logMessage);
                programStack.push(_programId);
                continue;
            }
            if (_method === 'consumed') {
                logMapping[_programId].push(logMessage);
                continue;
            }
            if (_method === 'success') {
                logMapping[_programId].push(logMessage);
                programStack.pop();
                continue;
            }
            const lastProgramId = programStack[programStack.length - 1];
            logMapping[lastProgramId].push(logMessage);
        }
        return logMapping;
    }
}
exports.SotaDexWrapper = SotaDexWrapper;
//# sourceMappingURL=sotadex-wrapper.js.map