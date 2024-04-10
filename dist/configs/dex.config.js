"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dex = void 0;
const config = require("config");
const ethers_1 = require("ethers");
const dexAbi = require("../abis/SotaDex.json");
const rpcHost = config.get('dex.rpc_host');
const matcherPrivateKey = config.get('dex.matcher_private_key');
const withdrawerPrivateKey = config.get('dex.withdrawer_private_key');
const dexAddress = config.get('dex.address');
const collateralDecimal = Number(config.get('dex.collateral_decimal'));
const defaultScale = Number(config.get('dex.default_scale'));
const blockTimeInMs = Number(config.get('dex.block_time_in_ms'));
const actionBatchSize = Number(config.get('dex.action_batch_size'));
const chainId = Number(config.get('dex.chain_id'));
const runningChain = config.get('dex.running_chain');
const provider = new ethers_1.providers.JsonRpcProvider(rpcHost);
const matcherWallet = new ethers_1.Wallet(matcherPrivateKey, provider);
const withdrawerWallet = new ethers_1.Wallet(withdrawerPrivateKey, provider);
const dexContract = new ethers_1.Contract(dexAddress, dexAbi).connect(matcherWallet);
exports.Dex = {
    provider,
    dexContract,
    matcherWallet,
    withdrawerWallet,
    collateralDecimal,
    defaultScale,
    blockTimeInMs,
    chainId,
    actionBatchSize,
    runningChain,
};
//# sourceMappingURL=dex.config.js.map