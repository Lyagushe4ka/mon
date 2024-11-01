export interface TimeSeparated {
  seconds?: number;
  minutes?: number;
  hours?: number;
}

export interface ChainData {
  explorer: string;
  native: string;
}

export interface Token {
  address: string;
  decimals: number;
  ticker: string;
}
