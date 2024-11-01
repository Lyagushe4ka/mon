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

      if (fileData === '') {
        return;
      }

      this.data = new Map(JSON.parse(fileData));
    }
  }

  save(): void {
    fs.writeFileSync(this.path, this.data ? JSON.stringify(this.data, null, 2) : '');
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

    this.data.get(wallet)![statName] = value;
  }

  setAll(wallet: string, data: T): void {
    this.data.set(wallet, data);
  }

  delete(wallet: string): void {
    this.data.delete(wallet);
  }
}
