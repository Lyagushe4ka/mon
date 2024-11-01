import { sleep } from './time';

export async function retry<T>(
  fn: () => Promise<T>,
  attempts = 4,
  timeoutInSec = 6,
  logger?: (text: string, isError: boolean) => Promise<any>,
): Promise<T> {
  let response: T;
  while (attempts--) {
    if (attempts === Number.MAX_SAFE_INTEGER - 1) {
      attempts = Number.MAX_SAFE_INTEGER;
    }
    try {
      response = await fn();
      break;
    } catch (e: any) {
      let errorText: string;

      if (e instanceof Error) {
        errorText = e.message;
      } else if (typeof e === 'string') {
        errorText = e;
      } else {
        errorText = 'Unknown error occurred';
      }

      const text = `[RETRY] Error while executing function. Message: ${e}. Attempts left: ${
        attempts === Number.MAX_SAFE_INTEGER ? 'infinity' : attempts
      }`;
      console.log('\n' + text + '\n');
      if (logger) {
        await logger(text, true);
      }

      if (attempts === 0) {
        return Promise.reject(e.message);
      }

      await sleep({ seconds: timeoutInSec }, false);
    }
  }
  return response!;
}

export const shuffleArray = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const rndArrElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const randomBetween = (min: number, max: number, roundTo: number = 0): number => {
  const random = Math.random() * (max - min) + min;
  return roundTo !== undefined ? Math.round(random * 10 ** roundTo) / 10 ** roundTo : random;
};
