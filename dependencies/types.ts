import { TimeSeparated } from '../src/types';

export interface Config {
  LIMITS: {
    TX_WAIT_TIMEOUT: number;

    ERROR_TIMEOUT: number;

    GENERAL_TIMEOUT: {
      min: TimeSeparated;
      max: TimeSeparated;
    };

    MIN_BALANCE: number;
  };

  CONSTANTS: {
    RPCS: Record<ChainId, string[]>;
  };

  FLAGS: {
    USE_PROXY: boolean;
    USE_REFS: boolean;
  };
}

export enum ChainId {
  ETHEREUM = 1,
  BSC = 56,
  POLYGON = 137,
  BASE = 8453,
  ARBITRUM = 42161,
  OP = 10,
  ZKSYNC = 324,
}
