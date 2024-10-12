import { FC, useState } from 'react';
import { NewEntry } from '../types/shared';
import { useEntriesStoreActions } from '../stores/entries-store';

export const NewEntryForm: FC = () => {
  const { addEntry } = useEntriesStoreActions();

  const [newEntry, setNewEntry] = useState<NewEntry>({
    freq: 0,
    period: 0,
    key: '',
  });

  const handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (/[\.,;'"]/.test(event.target.value)) return;
    setNewEntry({ ...newEntry, key: event.target.value });
  };

  const handleAddEntryClick = () => {
    if (!newEntry.key || !newEntry.freq || !newEntry.period) return;
    addEntry(newEntry);
    setNewEntry({ freq: 0, period: 0, key: '' });
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
        <label htmlFor="keys">Запрос:</label>
        <input
          className="ml-3 min-w-[40vw] rounded-md pl-2 outline-none"
          type="text"
          id="keys"
          name="keys"
          value={newEntry.key}
          onChange={handleKeyChange}
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
      </div>
      <button
        className="!mt-4 rounded-md bg-slate-800 px-2 py-1 font-semibold transition-all hover:bg-slate-700"
        onClick={handleAddEntryClick}
      >
        Добавить запись
      </button>
    </div>
  );
};
