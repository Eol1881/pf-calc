export type Entry = {
  key: string;
  freq: number;
  period: number;
  base: string;
  region: string;
};

export type NewEntry = Omit<Entry, 'base' | 'region'>;
