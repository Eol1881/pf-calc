import { Entry } from '../types/shared';

export const parseKey = (entryStringified: string): Entry => {
  const parts = entryStringified.split(';');

  const base = parts[0];
  const key = parts[1];
  const freq = +parts[2].split('.')[0];
  const period = +parts[2].split('.')[1];
  const region = parts[3];

  return { key, freq, period, base, region };
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

export const convertEntryToString = (entry: Entry) => {
  const { base, region, freq, period, key } = entry;
  return `${base};${key};${freq}.${period};${region}`;
};
