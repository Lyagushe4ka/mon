import { Wallet } from 'ethers';
import { CONFIG } from './dependencies/config';
import {
  applyLoggerHandler,
  applyProcessHandlers,
  ExampleDatabase,
  ModuleName,
  ParsedData,
  sleep,
  timeout,
} from './src';

const userData = new ParsedData();
const database = new ExampleDatabase(ModuleName.EXAMPLE);

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
      console.log(`\nUsing wallet ${address}\n`);

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
