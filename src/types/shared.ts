export type Entry = {
  keys: string[];
  freq: number;
  period: number;
  base: string;
  vitals: string[];
  region: string;
  isOld: boolean;
  entryId: number;
};

export type EntryLite = Omit<Entry, 'base' | 'vitals' | 'region' | 'isOld' | 'entryId'>;
