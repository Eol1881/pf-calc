import { ChangeEvent, useEffect, useState } from 'react';
import { useEntriesStoreActions, useKey } from '../stores/entries-store';
import { Cross } from './shared/Icons';
import AutowidthInput from 'react-autowidth-input';

export const KeyBlock = ({ keyIndex, entryId, isOld }: { keyIndex: number; entryId: number; isOld?: boolean }) => {
  const { changeKey, deleteKey } = useEntriesStoreActions();
  const keyString = useKey(entryId, keyIndex);
  const [localValue, setLocalValue] = useState(keyString);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleBlur = () => {
    changeKey(entryId, localValue, keyIndex);
  };

  useEffect(() => {
    console.log(0, '[KeyBlock] render');
  }, []);

  useEffect(() => {
    console.log(0, '[KeyBlock] keyString changed');
    setLocalValue(keyString);
  }, [keyString]);

  return (
    <div
      className={`flex items-center overflow-hidden rounded-sm pl-2 ${isOld ? 'bg-green-900' : 'bg-green-300 font-semibold text-black/80'}`}
    >
      <AutowidthInput
        className={`bg-transparent`}
        value={localValue}
        onBlur={handleBlur}
        onChange={handleChange}
        extraWidth={8}
      />

      <button
        onClick={() => {
          deleteKey(entryId, keyIndex);
          console.log(entryId, keyIndex);
        }}
        className="h-full bg-red-400 px-1 transition-all hover:bg-red-500"
      >
        <Cross />
      </button>
    </div>
  );
};
