import { useState } from 'react';
import { Plus } from './shared/Icons';
import { useEntriesStoreActions } from '../stores/entries-store';
import AutowidthInput from 'react-autowidth-input';

export const NewKeyBlock = ({ entryId }: { entryId: number }) => {
  const { addKey } = useEntriesStoreActions();

  const [newKey, setNewKey] = useState('');

  const handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (/[\.,;'"]/.test(event.target.value)) return;
    setNewKey(event.target.value);
  };

  const handleKeyKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (!newKey) return;
      addKey(entryId, newKey);
      setNewKey('');
    }
  };

  return (
    <div className={`ml-3 flex items-center rounded-sm bg-slate-600 pl-2 text-black`}>
      <AutowidthInput
        className={`bg-transparent`}
        value={newKey}
        onKeyDown={handleKeyKeydown}
        onChange={handleKeyChange}
        extraWidth={8}
        minWidth={48}
      />

      <button
        onClick={() => {
          if (!newKey) return;
          addKey(entryId, newKey);
          setNewKey('');
        }}
        className="h-full px-1 transition-all hover:bg-green-500/80"
      >
        <Plus />
      </button>
    </div>
  );
};
