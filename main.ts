import { parseEther, Wallet } from 'ethers';
import {
  applyLoggerHandler,
  applyProcessHandlers,
  getNativeBalance,
  ModuleName,
  ParsedData,
  randomBetween,
  sleep,
  timeout,
} from './src';
import { CONFIG } from './dependencies/config';
import { MonadDatabase } from './src/data/monad';
import { bridgeMon } from './src/crustyswap';
import { ChainId } from './dependencies/types';

const userData = new ParsedData();
const database = new MonadDatabase(ModuleName.MONAD);

applyProcessHandlers(database);
applyLoggerHandler();

async function main() {
  while (true) {
    try {
      if (userData.keysLeft() === 0) {
        console.log('No keys left, exiting...');
        break;
      }

      const key = userData.getKey();
      const wallet = new Wallet(key);
      const address = wallet.address;

      if (database.get(address, 'finished')) {
        userData.delete(key);
        continue;
      }

      console.log(`\nUsing wallet ${address}\n`);

      const ref = userData.getRef();

      let amount: bigint | null = null;
      let chainId: ChainId | null = null;
      for (const _chainId of [ChainId.ARBITRUM, ChainId.OP, ChainId.BASE, ChainId.ZKSYNC]) {
        const balance = await getNativeBalance(address, _chainId);

        if (!balance || balance < parseEther(CONFIG.LIMITS.MIN_BALANCE.toString())) {
          continue;
        }
        amount = balance;
        chainId = _chainId;
        break;
      }

      if (!amount || !chainId) {
        console.log('No balance found or balance too low on wallet: ', address);
        userData.delete(key);
        continue;
      }

      if (chainId === ChainId.ZKSYNC) {
        const rnd = randomBetween(150000, 90000, 0);
        const fee = parseEther((rnd / 10000000000).toFixed(18));
        // console.log(`Fee: ${fee}`);
        amount = amount - fee;
      } else {
        const rnd = randomBetween(60000, 15000, 0);
        const fee = parseEther((rnd / 10000000000).toFixed(18));
        // console.log(`Fee: ${fee}`);
        amount = amount - fee;
      }

      const tx = await bridgeMon(key, chainId, amount, ref);

      if (!tx) {
        userData.delete(key);
        continue;
      }

      database.set(address, 'finished', true);

      await timeout();
    } catch (error: any) {
      console.log(`\nCaught error: ${error}\n`);

      await sleep({ seconds: CONFIG.LIMITS.ERROR_TIMEOUT });
    }
  }

  database.save();
  process.exit(0);
}

main();
