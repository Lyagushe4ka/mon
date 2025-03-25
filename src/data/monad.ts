import { AbstractDatabase } from './abstract';
import { BaseStats } from './types';

interface MonadData extends BaseStats {
  finished: boolean;
}

export class MonadDatabase extends AbstractDatabase<MonadData> {
  init(wallet: string): void {
    this.data.set(wallet, {
      finished: false,
    });
  }
}
