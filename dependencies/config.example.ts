import { ChainId, Config } from './types';

export const CONFIG: Config = {
  FLAGS: {
    USE_PROXY: true, // specify whether to use proxy or not;
    USE_REFS: true, // specify whether to use refs or not;
  },

  LIMITS: {
    GENERAL_TIMEOUT: {
      min: {
        seconds: 10, // specify minimum timeout between actions
        minutes: 0,
        hours: 0,
      },
      max: {
        seconds: 20, // specify maximum timeout between actions
        minutes: 0,
        hours: 0,
      },
    },

    TX_WAIT_TIMEOUT: 10, // specify timeout for waiting for transaction
    ERROR_TIMEOUT: 10, // specify timeout to sleep after an error

    MIN_BALANCE: 0.0001, // specify minimum balance to proceed
  },

  CONSTANTS: {
    // specify RPCs for each network id, example - '1': ['https://rpc1', 'https://rpc2']
    RPCS: {
      [ChainId.ETHEREUM]: [
        'https://eth.llamarpc.com',
        'https://rpc.ankr.com/eth',
        'https://ethereum-rpc.publicnode.com',
      ],
      [ChainId.BSC]: [
        'https://binance.llamarpc.com',
        'https://rpc.ankr.com/bsc',
        'https://bscrpc.com',
        'https://bsc-pokt.nodies.app',
      ],
      [ChainId.POLYGON]: [
        'https://polygon.llamarpc.com',
        'https://1rpc.io/matic',
        'https://rpc.ankr.com/polygon',
      ],
      [ChainId.ARBITRUM]: [
        'https://arbitrum.llamarpc.com',
        'https://arb1.arbitrum.io/rpc',
        'https://arbitrum-one.public.blastapi.io',
        'https://arbitrum.drpc.org',
      ],
      [ChainId.OP]: [
        'https://optimism.llamarpc.com',
        'https://mainnet.optimism.io',
        'https://optimism-mainnet.public.blastapi.io',
        'https://1rpc.io/op',
        'https://optimism-rpc.publicnode.com',
      ],
      [ChainId.ZKSYNC]: [
        'https://mainnet.era.zksync.io',
        'https://zksync.drpc.org',
        'https://endpoints.omniatech.io/v1/zksync-era/mainnet/public',
        'https://1rpc.io/zksync2-era',
      ],
      [ChainId.BASE]: [
        'https://base.llamarpc.com',
        'https://mainnet.base.org',
        'https://1rpc.io/base',
        'https://base.meowrpc.com',
      ],
    },
  },
};
