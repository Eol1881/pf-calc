import { Entry } from '../types/shared';

export const parseKey = (key: string, oldEntries?: string[]): Omit<Entry, 'entryId'> => {
  const regexFirstPart = /\{([^}]*)\}/;
  const matchFirstPart = key.match(regexFirstPart);
  const firstPart = (matchFirstPart ? matchFirstPart[1] : '').split('|');

  const secondPart = key.replace(regexFirstPart, '').split(';')[1].slice(1).split('|');

  const freqPart = key.split(';')[2];

  return {
    keys: firstPart,
    vitals: secondPart,
    freq: +freqPart.split('.')[0],
    period: +freqPart.split('.')[1],
    base: key.split(';')[0],
    region: key.split(';')[key.split(';').length - 1],
    isOld: !!oldEntries?.includes(key),
  };
};

export const sortEntries = (keys: string[]) => {
  return keys.sort((a, b) => +parseKey(b).freq / +parseKey(b).period - +parseKey(a).freq / +parseKey(a).period);
};

export const calculateTotalRequestsPerDay = (entries: Entry[]) => {
  return entries
    .reduce((acc, entrie) => {
      const { freq, period } = entrie;
      return acc + freq / period;
    }, 0)
    .toFixed(1);
};

export const combineArrays = (arr1: string[], arr2: string[]) => {
  const result: string[] = [];

  arr1.forEach((str1) => result.push(...arr2.map((str2) => str1 + ' ' + str2)));

  return result;
};

export const convertEntrieToString = (entry: Entry) => {
  const { base, vitals, region, freq, period, keys } = entry;

  return `${base};{${keys.join('|')}}|${vitals.join('|')};${freq}.${period};${region}`;
};
