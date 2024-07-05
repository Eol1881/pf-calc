import { FC, useState } from 'react';
import { EntryLite } from '../types/shared';
import { Cross, Plus } from './shared/Icons';

type Props = {
  addNewEntry: (newEntry: EntryLite) => void;
};

export const NewEntryForm: FC<Props> = ({ addNewEntry }) => {
  const [newEntry, setNewEntry] = useState<EntryLite>({
    freq: 0,
    period: 0,
    keys: [],
  });

  const [newKey, setNewKey] = useState('');

  const handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (/[\.,;'"]/.test(event.target.value)) return;
    setNewKey(event.target.value);
  };

  const handleKeyKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') addKey();
  };

  const addKey = () => {
    if (newKey.trim() !== '') {
      setNewEntry({ ...newEntry, keys: [...newEntry.keys, newKey.trim()] });
      setNewKey('');
    }
  };

  const deleteKey = (index: number) => {
    setNewEntry({
      ...newEntry,
      keys: newEntry.keys.filter((_, i) => i !== index),
    });
  };

  const handleAddEntryClick = () => {
    if (!newEntry.keys.length || !newEntry.freq || !newEntry.period) return;
    addNewEntry(newEntry);
    setNewEntry({ freq: 0, keys: [], period: 0 });
  };

  const handleNewEntryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === 'freq' || name === 'period') {
      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue) && parsedValue !== 0) {
        setNewEntry({ ...newEntry, [name]: parsedValue });
      } else {
        setNewEntry({ ...newEntry, [name]: 1 });
      }
      return;
    }

    setNewEntry({ ...newEntry, [name]: value });
  };

  return (
    <div className="mt-3 w-fit space-y-1 rounded-md bg-slate-500 p-3">
      <div>
        <label htmlFor="freq">Частота:</label>
        <input
          className="ml-2 w-16 rounded-md pl-2 outline-none"
          type="number"
          id="freq"
          name="freq"
          min={0}
          value={newEntry.freq || ''}
          onChange={handleNewEntryChange}
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
      </div>
      <div>
        <label htmlFor="period">Период:</label>
        <input
          className="ml-2 w-16 rounded-md pl-2 outline-none"
          type="number"
          id="period"
          name="period"
          min={0}
          value={newEntry.period || ''}
          onChange={handleNewEntryChange}
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
      </div>

      <div className="flex">
        <label htmlFor="keys">Добавить вариант:</label>
        <input
          className="ml-2 rounded-l-md pl-2 outline-none"
          type="text"
          id="keys"
          name="keys"
          value={newKey}
          onChange={handleKeyChange}
          onKeyDown={handleKeyKeydown}
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
        <button
          className="flex w-6 items-center justify-center rounded-r-md bg-green-900 font-bold transition-all hover:bg-green-800"
          onClick={addKey}
        >
          <Plus />
        </button>
      </div>
      <div className="!mt-3 flex gap-2">
        {newEntry.keys.map((key, index) => (
          <div
            key={index}
            className="flex items-center rounded-md bg-green-900/80 px-2 py-1"
          >
            <span className="mr-2">{key}</span>
            <button onClick={() => deleteKey(index)}>
              <Cross />
            </button>
          </div>
        ))}
      </div>
      <button
        className="!mt-5 rounded-md bg-slate-800 px-2 py-1 font-semibold transition-all hover:bg-slate-700"
        onClick={handleAddEntryClick}
      >
        Добавить запись
      </button>
    </div>
  );
};
