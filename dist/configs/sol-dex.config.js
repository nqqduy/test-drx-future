"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolDex = void 0;
const config = require("config");
const web3_js_1 = require("@solana/web3.js");
const anchor = require("@project-serum/anchor");
const nodewallet_1 = require("@project-serum/anchor/dist/cjs/nodewallet");
const bytes_1 = require("@project-serum/anchor/dist/cjs/utils/bytes");
const anchor_1 = require("@project-serum/anchor");
const sotadex_solana_1 = require("../idl/sotadex_solana");
const rpcHost = config.get('sol_dex.rpc_host');
const matcherPrivateKey = config.get('sol_dex.matcher_private_key');
const dexProgramId = new web3_js_1.PublicKey(config.get('sol_dex.program_id'));
const dexId = new anchor.BN(config.get('sol_dex.id'));
const collateralDecimal = Number(config.get('sol_dex.collateral_decimal'));
const defaultScale = Number(config.get('sol_dex.default_scale'));
const blockTimeInMs = Number(config.get('sol_dex.block_time_in_ms'));
const actionBatchSize = Number(config.get('sol_dex.action_batch_size'));
const usdcId = new web3_js_1.PublicKey(config.get('sol_dex.usdc_id'));
const matcherKeypair = web3_js_1.Keypair.fromSecretKey(bytes_1.bs58.decode(matcherPrivateKey));
const processedConnection = new web3_js_1.Connection(rpcHost, 'processed');
const connection = new web3_js_1.Connection(rpcHost, 'confirmed');
const finalizedConnection = new web3_js_1.Connection(rpcHost, 'finalized');
const matcherWallet = new nodewallet_1.default(matcherKeypair);
const provider = new anchor.Provider(connection, matcherWallet, {
    commitment: 'confirmed',
    preflightCommitment: 'confirmed',
});
const dexProgram = new anchor_1.Program(sotadex_solana_1.IDL, dexProgramId, provider);
exports.SolDex = {
    processedConnection,
    connection,
    dexId,
    provider,
    dexProgram,
    matcherKeypair,
    matcherWallet,
    collateralDecimal,
    defaultScale,
    blockTimeInMs,
    actionBatchSize,
    usdcId,
    dexContract: undefined,
    finalizedConnection,
};
//# sourceMappingURL=sol-dex.config.js.map