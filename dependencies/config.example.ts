import { Config } from './types';

export const CONFIG: Config = {
  FLAGS: {
    USE_PROXY: true, // specify whether to use proxy or not;
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
  },

  CONSTANTS: {
    // specify RPCs for each network id, example - '1': ['https://rpc1', 'https://rpc2']
    RPCS: {
      '1': [
        'https://eth.llamarpc.com',
        'https://rpc.ankr.com/eth',
        'https://ethereum-rpc.publicnode.com',
      ],
      '56': [
        'https://binance.llamarpc.com',
        'https://rpc.ankr.com/bsc',
        'https://bscrpc.com',
        'https://bsc-pokt.nodies.app',
      ],
      '137': [
        'https://polygon.llamarpc.com',
        'https://1rpc.io/matic',
        'https://rpc.ankr.com/polygon',
      ],
    },
  },
};
