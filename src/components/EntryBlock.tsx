import { useEffect } from 'react';
import { useEntriesStoreActions } from '../stores/entries-store';
import { KeyBlock } from './KeyBlock';
import { NewKeyBlock } from './NewKeyBlock';
import { Cross } from './shared/Icons';
import { Entry } from '../types/shared';

export const EntryBlock = ({ entry }: { entry: Entry }) => {
  const { freq, period, keys, isOld, entryId } = entry;
  const { deleteEntry, changeFreq, changePeriod } = useEntriesStoreActions();

  const keysLength = keys.length;

  useEffect(() => {
    console.log(1, 'keys changed');
  }, [keys]);

  return (
    <div className="flex gap-1">
      <button
        onClick={() => {
          deleteEntry(entryId);
        }}
        className="flex w-6 shrink-0 items-center justify-center rounded-md bg-white/20 transition-all hover:bg-red-600/90"
      >
        <Cross />
      </button>
      <label className="flex items-center text-nowrap rounded-sm bg-slate-700 px-1">
        Частота:{' '}
        <input
          type="number"
          className="w-10 bg-slate-700 outline-none"
          min={1}
          value={freq}
          onChange={(e) => {
            changeFreq(entryId, +e.target.value);
          }}
        />
      </label>
      <label className="flex items-center text-nowrap rounded-sm bg-slate-700 px-1">
        Период:{' '}
        <input
          type="number"
          className="w-10 bg-slate-700 outline-none"
          min={1}
          value={period}
          onChange={(e) => {
            changePeriod(entryId, +e.target.value);
          }}
        />
      </label>
      <div className="flex items-center rounded-sm bg-red-400 px-1 text-black">{(+freq / +period).toFixed(1)}</div>

      <div className="flex flex-wrap gap-2 gap-y-1">
        {Array.from({ length: keysLength }, (_, i) => i).map((keyIndex) => (
          <KeyBlock keyIndex={keyIndex} entryId={entryId} isOld={isOld} />
        ))}
      </div>

      <NewKeyBlock entryId={entryId} />
    </div>
  );
};
