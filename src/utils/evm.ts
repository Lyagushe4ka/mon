import { ContractTransaction, JsonRpcProvider, TransactionReceipt, Wallet } from 'ethers';
import { retry } from './general';
import { sleep } from './time';
import { CONFIG } from '../../dependencies/config';
import { ChainId } from '../../dependencies/types';
import { CHAIN_DATA } from '../constants';

export async function executeTx(
  txData: ContractTransaction,
  chainId: ChainId,
  pk: string,
  type: 'legacy' | 'eip1559' = 'legacy',
): Promise<TransactionReceipt | null> {
  try {
    const rpcs = CONFIG.CONSTANTS.RPCS[chainId];
    const providers = rpcs.map((rpc) => new JsonRpcProvider(rpc));
    const signers = providers.map((provider) => new Wallet(pk, provider));

    const nonce = await retry(() => Promise.any(signers.map((signer) => signer.getNonce())));
    const feeData = await retry(() =>
      Promise.any(providers.map((provider) => provider.getFeeData())),
    );

    if (type === 'eip1559') {
      txData.maxFeePerGas = (feeData.maxFeePerGas! * 150n) / 100n;
      txData.maxPriorityFeePerGas = (feeData.maxPriorityFeePerGas! * 120n) / 100n;
    } else {
      txData.gasPrice = (feeData.gasPrice! * 150n) / 100n;
    }

    txData.nonce = nonce;

    console.log(`\nSending tx from ${signers[0].address}...`);

    const tx = await retry(() =>
      Promise.race([
        Promise.any(signers.map((signer) => signer.sendTransaction(txData))),
        sleep({ seconds: CONFIG.LIMITS.TX_WAIT_TIMEOUT }, false).then(() =>
          Promise.reject('timeout waiting for tx to be sent'),
        ),
      ]),
    );

    console.log(`Sent tx: ${tx.hash}, waiting for receipt...`);

    const receipt = await retry(() =>
      Promise.race([
        Promise.any(providers.map((provider) => provider.getTransactionReceipt(tx.hash))).then(
          (r) => (r === null ? Promise.reject('Got null from rpc, trying again...') : r),
        ),
        sleep({ seconds: CONFIG.LIMITS.TX_WAIT_TIMEOUT }, false).then(() =>
          Promise.reject('timeout waiting for tx to be sent'),
        ),
      ]),
    );

    const chainData = CHAIN_DATA[chainId];

    console.log(`Tx mined: ${chainData.explorer}/tx/${tx.hash}\n`);

    return receipt;
  } catch (e: any) {
    return null;
  }
}
