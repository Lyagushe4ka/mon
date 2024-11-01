import { Contract, formatEther, formatUnits, JsonRpcProvider } from 'ethers';
import { CONFIG } from '../../dependencies/config';
import { ChainId } from '../../dependencies/types';
import { CHAIN_DATA, TOKENS } from '../constants';
import { MulticallWrapper } from 'ethers-multicall-provider';
import { ERC20_ABI } from '../abi';
import { getRate } from './rates';

interface Balances {
  tokens: {
    wei: Record<string, bigint>;
    ether: Record<string, number>;
    usd?: Record<string, number>;
  };
  native: {
    wei: bigint;
    ether: number;
    usd?: number;
  };
}

export const getBalances = async (
  address: string,
  chainId: ChainId,
  usdBalances = true,
): Promise<Balances | null> => {
  const tokens = TOKENS[chainId];
  const chainData = CHAIN_DATA[chainId];

  if (!tokens) {
    console.log('Tokens not found');
    return null;
  }

  const rpcs = CONFIG.CONSTANTS.RPCS[chainId];

  const providers = rpcs.map((rpc) => new JsonRpcProvider(rpc));
  const multicallProviders = providers.map((provider) => MulticallWrapper.wrap(provider));

  let nativeBalInWei: bigint | null = null;
  let tokenBalances: bigint[] | null = null;
  for (const provider of multicallProviders) {
    try {
      const tokenContracts = Object.values(tokens).map(
        (token) => new Contract(token.address, ERC20_ABI, provider),
      );

      tokenBalances = await Promise.all(
        tokenContracts.map((contract) => contract.balanceOf(address)),
      );

      nativeBalInWei = await provider.getBalance(address);
    } catch (e) {
      continue;
    }
  }

  if (!nativeBalInWei || !tokenBalances) {
    console.log('Error while getting balances');
    return null;
  }

  let tokenBalancesInWei: Record<string, bigint> = {};
  let tokenBalancesInEther: Record<string, number> = {};
  const nativeBalInEther = parseFloat(formatEther(nativeBalInWei));

  Object.keys(tokens).forEach((key, i) => {
    tokenBalancesInWei[key] = tokenBalances[i];
  });

  Object.keys(tokens).forEach((key, i) => {
    tokenBalancesInEther[key] = parseFloat(formatUnits(tokenBalances[i], tokens[key].decimals));
  });

  if (usdBalances) {
    const tokenRates = await getRate(Object.keys(tokens));
    const nativeRate = await getRate([chainData.native]);

    if (!tokenRates || !nativeRate) {
      console.log('Error while getting token rates');
      return null;
    }

    const nativeBalInUsd = nativeBalInEther * nativeRate[0];
    const tokenBalancesInUsd: Record<string, number> = {};

    Object.keys(tokens).forEach((key, i) => {
      tokenBalancesInUsd[key] = tokenBalancesInEther[key] * tokenRates[i];
    });

    return {
      tokens: {
        wei: tokenBalancesInWei,
        ether: tokenBalancesInEther,
        usd: tokenBalancesInUsd,
      },
      native: {
        wei: nativeBalInWei,
        ether: nativeBalInEther,
        usd: nativeBalInUsd,
      },
    };
  }

  return {
    tokens: {
      wei: tokenBalancesInWei,
      ether: tokenBalancesInEther,
      usd: undefined,
    },
    native: {
      wei: nativeBalInWei,
      ether: nativeBalInEther,
      usd: undefined,
    },
  };
};
