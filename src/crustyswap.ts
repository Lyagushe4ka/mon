import { Contract, formatEther, JsonRpcProvider, ZeroAddress } from 'ethers';
import { ChainId } from '../dependencies/types';
import { routers } from './constants';
import { CRUSTY_ABI } from './abi/crustyAbi';
import { executeTx } from './utils';
import { CONFIG } from '../dependencies/config';

export async function bridgeMon(pk: string, chainId: ChainId, amount: bigint, ref: string) {
  const routerAddress = routers[chainId];
  const rpc = CONFIG.CONSTANTS.RPCS[chainId][0];

  if (!routerAddress) {
    console.log('Router not found');
    throw new Error('Router not found');
  }

  const provider = new JsonRpcProvider(rpc);
  const router = new Contract(routerAddress, CRUSTY_ABI, provider);

  const minAmount: bigint = await router.minimumDeposit();

  if (amount < minAmount) {
    console.log('Amount too low, min amount to bridge is ', formatEther(minAmount), ' ETH');
    return null;
  }

  const referral = ref ?? ZeroAddress;
  const txData = await router.deposit.populateTransaction(referral, {
    value: amount,
  });

  const receipt = await executeTx(txData, chainId, pk, 'legacy');

  if (!receipt) {
    console.log('Error executing tx');
    return null;
  }

  return receipt;
}
