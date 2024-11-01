import { TimeSeparated } from '../src/types';

export interface Config {
  LIMITS: {
    TX_WAIT_TIMEOUT: number;

    ERROR_TIMEOUT: number;

    GENERAL_TIMEOUT: {
      min: TimeSeparated;
      max: TimeSeparated;
    };
  };

  CONSTANTS: {
    RPCS: Record<ChainId, string[]>;
  };

  FLAGS: {
    USE_PROXY: boolean;
  };
}

export enum ChainId {
  ETHEREUM = 1,
  BSC = 56,
  POLYGON = 137,
}
