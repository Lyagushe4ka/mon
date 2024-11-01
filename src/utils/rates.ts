import axios from 'axios';
import { retry } from './general';

let RATES: Record<string, number> = {};
let RATES_LAST_UPDATED = 0;

export async function getRate(tickers: string[]): Promise<number[] | null> {
  if (Object.keys(RATES).length === 0 || Date.now() - RATES_LAST_UPDATED > 1000 * 60 * 60) {
    RATES = await getBinanceRatesToUSD();
    RATES_LAST_UPDATED = Date.now();
  }

  let ratesArr: Array<number> = [];
  for (const ticker of tickers) {
    let cur = ticker.toUpperCase();
    if (['USDT', 'USDC', 'DAI', 'XDAI', 'BUSD', 'USDZ', 'MUSD'].includes(cur)) {
      ratesArr.push(1);
      continue;
    }
    if (cur === 'WETH') {
      cur = 'ETH';
    }
    if (cur === 'BTCB' || cur === 'WBTC') {
      cur = 'BTC';
    }
    const currentRate = RATES[cur] ?? null;
    if (!currentRate) {
      return null;
    }
    ratesArr.push(currentRate);
  }

  return ratesArr;
}

export const getBinanceRatesToUSD = async (): Promise<Record<string, number>> => {
  const endpoint = 'https://api.binance.com/api/v3/ticker/price';
  const { data } = await retry(() => axios.get(endpoint));
  const prices: Record<string, number> = {};
  for (const { symbol, price } of data) {
    if (symbol.endsWith('USDT') || symbol.endsWith('USDC')) {
      prices[symbol.substring(0, symbol.length - 4)] = parseFloat(price);
    }
  }
  return prices;
};
