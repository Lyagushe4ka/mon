import { CONFIG } from '../../dependencies/config';
import { rndArrElement } from '../utils';
import fs from 'fs';

export class ParsedData {
  private keys: Set<string> = new Set();
  private proxies: Map<string, string> = new Map();
  private refferals: Set<string> = new Set();

  constructor() {
    this.load();
  }

  private load(): void {
    const keys = fs
      .readFileSync('./dependencies/keys.txt', 'utf8')
      .replaceAll('\r', '')
      .split('\n');

    keys.every((key, index) => {
      if (!((key.startsWith('0x') && key.length === 66) || key.length === 64)) {
        throw new Error(`Invalid key length at line ${index + 1}.`);
      }
      return true;
    });

    this.keys = new Set(keys);

    if (fs.existsSync('./dependencies/proxies.txt') && CONFIG.FLAGS.USE_PROXY) {
      let proxies = fs
        .readFileSync('./dependencies/proxies.txt', 'utf8')
        .replaceAll('\r', '')
        .split('\n');

      const proxyRegex = /^[a-zA-Z0-9]+:[a-zA-Z0-9]+@[0-9.]+:[0-9]+$/;

      proxies.every((proxy, index) => {
        if (!proxyRegex.test(proxy)) {
          throw new Error(`Invalid proxy at line ${index + 1}.`);
        }
        return true;
      });

      proxies = proxies.map((proxy) => {
        return (proxy = 'http://' + proxy);
      });

      if (proxies.length === 0) {
        return;
      }

      if (keys.length !== proxies.length) {
        throw new Error('Number of keys and proxies must be equal.');
      }

      this.proxies = new Map(keys.map((key, index) => [key, proxies[index]]));
    }

    if (fs.existsSync('./dependencies/refs.txt') && CONFIG.FLAGS.USE_REFS) {
      const refs = fs
        .readFileSync('./dependencies/refs.txt', 'utf8')
        .replaceAll('\r', '')
        .split('\n');

      refs.every((ref, index) => {
        if (!ref.startsWith('0x') || ref.length !== 42) {
          throw new Error(`Invalid ref at line ${index + 1}.`);
        }
        return true;
      });

      this.refferals = new Set(refs);
    }
  }

  getRefferals() {
    return this.refferals;
  }

  getRef() {
    return rndArrElement(Array.from(this.refferals));
  }

  keysLeft() {
    return this.keys.size;
  }

  getKey() {
    return rndArrElement(Array.from(this.keys));
  }

  getProxy(key: string) {
    return this.proxies.get(key);
  }

  getKeyWithProxy() {
    const key = this.getKey();
    const proxy = this.getProxy(key)!;

    return { key, proxy };
  }

  delete(key: string) {
    this.proxies.delete(key);

    this.keys.delete(key);
  }
}
