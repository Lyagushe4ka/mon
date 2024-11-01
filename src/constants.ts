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
};

export const TOKENS: Partial<Record<ChainId, Record<string, Token>>> = {};
