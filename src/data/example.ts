import { AbstractDatabase } from './abstract';
import { BaseStats, ModuleName } from './types';

interface ExampleData extends BaseStats {
  txCount: number;
  balance: number;
}

export class ExampleDatabase extends AbstractDatabase<ExampleData> {
  init(wallet: string): void {
    this.data.set(wallet, {
      txCount: 0,
      balance: 0,
    });
  }
}

const exampleDatabase = new ExampleDatabase(ModuleName.ETHEREUM);

const x = exampleDatabase.getAll('0x123');
