import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { Entry, NewEntry } from '../types/shared';

export type EntriesStore = {
  entries: Entry[];

  setEntries: (entries: Entry[]) => void;
  addEntry: (entry: NewEntry) => void;
  deleteEntry: (key: Entry['key']) => void;
  changeFreq: (key: Entry['key'], freq: Entry['freq']) => void;
  changePeriod: (key: Entry['key'], period: Entry['period']) => void;
  deleteKey: (key: Entry['key'], keyIndex: number) => void;
};

export const useEntriesStore = create<EntriesStore>((set, get) => ({
  entries: [],
  oldEntries: [],

  setEntries: (entries) => {
    set({ entries });
  },

  addEntry: (entry) => {
    const { entries } = get();
    const updatedEntries = [
      ...entries,
      {
        ...entry,
        base: entries[0].base,
        region: entries[0].region,
        isOld: false,
      },
    ];
    set({ entries: updatedEntries });
  },

  deleteEntry: (key) => {
    const { entries } = get();
    const updatedEntries = entries.filter((entry) => entry.key !== key);
    set({ entries: updatedEntries });
  },

  changeFreq: (key, freq) => {
    const { entries } = get();
    const updatedEntries = entries.map((entry) => (entry.key === key ? { ...entry, freq } : entry));
    set({ entries: updatedEntries });
  },

  changePeriod: (key, period) => {
    const { entries } = get();
    const updatedEntries = entries.map((entry) => (entry.key === key ? { ...entry, period } : entry));
    set({ entries: updatedEntries });
  },

  deleteKey: (key) => {
    const { entries } = get();
    const updatedEntries = entries.filter((entry) => entry.key !== key);
    set({ entries: updatedEntries });
  },
}));

export const useEntries = () => useEntriesStore((state) => state.entries);
export const useEntry = (key: string) => useEntriesStore((state) => state.entries.find((e) => e.key === key)!);
export const useKey = (key: string) => useEntriesStore((state) => state.entries.find((e) => e.key === key));

export const useEntriesStoreActions = () =>
  useEntriesStore(
    useShallow(({ addEntry, setEntries, deleteEntry, changeFreq, changePeriod, deleteKey }) => ({
      addEntry,
      setEntries,
      deleteEntry,
      changeFreq,
      changePeriod,
      deleteKey,
    }))
  );
