import fs from 'fs';
import { ModuleName } from './types';

export abstract class AbstractDatabase<T> {
  protected moduleName: ModuleName;
  protected data: Map<string, T> = new Map();
  private path: string;

  constructor(_moduleName: ModuleName) {
    this.moduleName = _moduleName;
    this.path = `./data/${this.moduleName}_stats.json`;

    this.load();
  }

  private load(): void {
    if (fs.existsSync(this.path)) {
      const fileData = fs.readFileSync(this.path, 'utf8');

      if (fileData === '' || fileData === '{}') {
        return;
      }

      this.data = new Map(Object.entries(JSON.parse(fileData)));
      console.log('\nData loaded.\n');
      // console.log(this.data);
    }
  }

  save(): void {
    console.log('\nSaving data...\n');
    // console.log(this.mapToObject(this.data));
    fs.writeFileSync(
      this.path,
      this.data ? JSON.stringify(this.mapToObject(this.data), null, 2) : '',
    );
  }

  abstract init(wallet: string): void;

  get(wallet: string, statName: keyof T) {
    if (!this.data.has(wallet)) {
      this.init(wallet);
    }

    return this.data.get(wallet)![statName];
  }

  getAll(wallet: string): T {
    if (!this.data.has(wallet)) {
      this.init(wallet);
    }

    return this.data.get(wallet)!;
  }

  set(wallet: string, statName: keyof T, value: any): void {
    if (!this.data.has(wallet)) {
      this.init(wallet);
    }

    const data = this.data.get(wallet)!;
    data[statName] = value;
    this.data.set(wallet, data);
  }

  setAll(wallet: string, data: T): void {
    this.data.set(wallet, data);
  }

  delete(wallet: string): void {
    this.data.delete(wallet);
  }

  private mapToObject<K extends string, V>(map: Map<K, V>): Record<K, V> {
    return Array.from(map.entries()).reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {} as Record<K, V>);
  }
}
