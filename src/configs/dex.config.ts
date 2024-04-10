import * as config from 'config';
import { Contract, providers, Wallet } from 'ethers';
import * as dexAbi from 'src/abis/SotaDex.json';

const rpcHost = config.get<string>('dex.rpc_host');
const matcherPrivateKey = config.get<string>('dex.matcher_private_key');
const withdrawerPrivateKey = config.get<string>('dex.withdrawer_private_key');
const dexAddress = config.get<string>('dex.address');
const collateralDecimal = Number(config.get<string>('dex.collateral_decimal'));
const defaultScale = Number(config.get<string>('dex.default_scale'));
const blockTimeInMs = Number(config.get<number>('dex.block_time_in_ms'));
const actionBatchSize = Number(config.get<number>('dex.action_batch_size'));
const chainId = Number(config.get<number>('dex.chain_id'));
const runningChain = config.get<string>('dex.running_chain');

const provider = new providers.JsonRpcProvider(rpcHost);
const matcherWallet = new Wallet(matcherPrivateKey, provider);
const withdrawerWallet = new Wallet(withdrawerPrivateKey, provider);
const dexContract = new Contract(dexAddress, dexAbi).connect(matcherWallet);

export const Dex = {
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
