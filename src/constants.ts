import { ChainId } from '../dependencies/types';
import { ChainData, Token } from './types';

export const CHAIN_DATA: Record<ChainId, ChainData> = {
  '1': {
    explorer: 'https://etherscan.io',
    native: 'ETH',
  },
  '137': {
    explorer: 'https://polygonscan.com',
    native: 'POL',
  },
  '56': {
    explorer: 'https://bscscan.com',
    native: 'BNB',
  },
  '42161': {
    explorer: 'https://arbiscan.io',
    native: 'ETH',
  },
  '10': {
    explorer: 'https://optimistic.etherscan.io',
    native: 'ETH',
  },
  '324': {
    explorer: 'https://era.zksync.network',
    native: 'ETH',
  },
  '8453': {
    explorer: 'https://basescan.org',
    native: 'ETH',
  },
};

export const TOKENS: Partial<Record<ChainId, Record<string, Token>>> = {};

export const routers: Partial<Record<ChainId, string>> = {
  [ChainId.BASE]: '0x3f82E0e8c853d1C8B4deB68b09b379ec25C2B0ee',
  [ChainId.ARBITRUM]: '0x3f82E0e8c853d1C8B4deB68b09b379ec25C2B0ee',
  [ChainId.OP]: '0x3f82E0e8c853d1C8B4deB68b09b379ec25C2B0ee',
  [ChainId.ZKSYNC]: '0xcD5D7Ed8C081a60D7A1436937cE944F671204280',
};
