import { CONFIG } from '../../dependencies/config';
import { TimeSeparated } from '../types';
import { randomBetween } from './general';

export const convertTimeToSeconds = (time: TimeSeparated): number => {
  const seconds = time.seconds || 0;
  const minutes = time.minutes || 0;
  const hours = time.hours || 0;
  return seconds + minutes * 60 + hours * 60 * 60;
};

export async function sleep(from: TimeSeparated, logger = true, to?: TimeSeparated): Promise<void> {
  const msFrom = convertTimeToSeconds(from) * 1000;

  let timeoutMilliseconds = msFrom;
  if (to) {
    const msTo = convertTimeToSeconds(to) * 1000;
    const ms = Math.floor(Math.random() * (msTo - msFrom + 1) + msFrom);
    timeoutMilliseconds = ms;
  }

  const timeoutMinutes = Math.floor(timeoutMilliseconds / 1000 / 60);
  const timeoutSeconds = Math.floor((timeoutMilliseconds / 1000) % 60);

  if (logger) {
    let msg = `\nSleeping for ${Math.floor(timeoutMilliseconds / 1000)} seconds`;
    msg +=
      timeoutMinutes > 0 ? ` | ${timeoutMinutes} minutes and ${timeoutSeconds} seconds\n` : '\n';

    console.log(msg);
  }

  return new Promise((resolve) => setTimeout(resolve, timeoutMilliseconds));
}

export const timeout = async () => {
  const timeoutMin = convertTimeToSeconds(CONFIG.LIMITS.GENERAL_TIMEOUT.min);
  const timeoutMax = convertTimeToSeconds(CONFIG.LIMITS.GENERAL_TIMEOUT.max);
  const rndTimeout = randomBetween(timeoutMin, timeoutMax);

  await sleep({ seconds: rndTimeout });
};
