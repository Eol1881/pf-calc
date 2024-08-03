import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { Entry, EntryLite } from '../types/shared';

export type EntriesStore = {
  entries: Entry[];

  setEntries: (entries: Entry[]) => void;
  addEntry: (entry: EntryLite) => void;
  deleteEntry: (entryId: Entry['entryId']) => void;
  changeFreq: (entryId: Entry['entryId'], freq: Entry['freq']) => void;
  changePeriod: (entryId: Entry['entryId'], period: Entry['period']) => void;
  changeKey: (entryId: Entry['entryId'], updatedKey: string, keyIndex: number) => void;
  deleteKey: (entryId: Entry['entryId'], keyIndex: number) => void;
  addKey: (entryId: Entry['entryId'], newKey: string) => void;
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
        entryId: Date.now(),
        base: entries[0].base,
        vitals: entries[0].vitals,
        region: entries[0].region,
        isOld: false,
      },
    ];
    set({ entries: updatedEntries });
  },

  deleteEntry: (entryId) => {
    const { entries } = get();
    const updatedEntries = entries.filter((entry) => entry.entryId !== entryId);
    set({ entries: updatedEntries });
  },

  changeFreq: (entryId, freq) => {
    const { entries } = get();
    const updatedEntries = entries.map((entry) => (entry.entryId === entryId ? { ...entry, freq } : entry));
    set({ entries: updatedEntries });
  },

  changePeriod: (entryId, period) => {
    const { entries } = get();
    const updatedEntries = entries.map((entry) => (entry.entryId === entryId ? { ...entry, period } : entry));
    set({ entries: updatedEntries });
  },

  changeKey: (entryId, updatedKey, keyIndex) => {
    const { entries } = get();
    const updatedEntries = entries.map((entry) =>
      entry.entryId === entryId
        ? { ...entry, keys: entry.keys.map((key, i) => (i === keyIndex ? updatedKey : key)) }
        : entry
    );
    set({ entries: updatedEntries });
  },

  deleteKey: (entryId, keyIndex) => {
    const { entries } = get();
    const updatedEntries = entries.map((entry) =>
      entry.entryId === entryId ? { ...entry, keys: entry.keys.filter((key, i) => i !== keyIndex) } : entry
    );
    set({ entries: updatedEntries });
  },

  addKey: (entryId, newKey) => {
    const { entries } = get();
    const updatedEntries = entries.map((entry) =>
      entry.entryId === entryId ? { ...entry, keys: [...entry.keys, newKey] } : entry
    );
    set({ entries: updatedEntries });
  },
}));

export const useEntries = () => useEntriesStore((state) => state.entries);
export const useEntry = (entryId: number) =>
  useEntriesStore((state) => state.entries.find((e) => e.entryId === entryId)!);
export const useKey = (entryId: number, keyIndex: number) =>
  useEntriesStore((state) => state.entries.find((e) => e.entryId === entryId)!.keys[keyIndex]);

export const useEntriesStoreActions = () =>
  useEntriesStore(
    useShallow(({ addEntry, setEntries, deleteEntry, changeFreq, changePeriod, changeKey, deleteKey, addKey }) => ({
      addEntry,
      setEntries,
      deleteEntry,
      changeFreq,
      changePeriod,
      changeKey,
      deleteKey,
      addKey,
    }))
  );
