import React from 'react';
import { NewEntryForm } from './NewEntryForm';
import { calculateTotalRequestsPerDay, convertEntryToString, parseKey } from '../_models/common';
import { EntryBlock } from './EntryBlock';
import { useEntries, useEntriesStoreActions } from '../stores/entries-store';

export const Home = () => {
  const { setEntries } = useEntriesStoreActions();
  const entries = useEntries();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const rawContent = (event.target?.result as string) || '';
          const rawEntries = rawContent.split('\n');
          const parsedEntries = rawEntries.map((entry) => parseKey(entry));
          const parsedEntriesWithentryIds = parsedEntries.map((entry, i) => ({ ...entry, entryId: i, isOld: true }));

          setEntries(parsedEntriesWithentryIds);
        };
        reader.readAsText(file);
      }
    }
  };

  const downloadFull = () => {
    const data = entries.map((entry) => convertEntryToString(entry)).join('\n');
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'updated_config.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadQueriesOnly = () => {
    const resultQueries = entries.map((entry) => entry.key);
    const data = resultQueries.join('\n');
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'updated_queries.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div>
        <input type="file" accept=".txt" onChange={handleFileChange} className="cursor-pointer" />
      </div>

      <div className="mt-3 space-y-1">
        {entries.map((entry) => (
          <EntryBlock key={entry.key} entry={entry} />
        ))}
      </div>

      {!!entries.length && (
        <div className="mt-10">Суммарно заходов в день: ~{calculateTotalRequestsPerDay(entries)}</div>
      )}

      {!!entries.length && (
        <div className="mt-10">
          <NewEntryForm />
        </div>
      )}

      {!!entries.length && (
        <button
          onClick={downloadFull}
          className="mt-10 rounded-md bg-green-400 px-3 py-2 font-bold text-black/80 transition-all hover:bg-green-700"
        >
          СКАЧАТЬ КОНФИГ
        </button>
      )}
      {!!entries.length && (
        <button
          onClick={downloadQueriesOnly}
          className="ml-6 mt-10 rounded-md bg-green-400 px-3 py-2 font-bold text-black/80 transition-all hover:bg-green-700"
        >
          СКАЧАТЬ ЧИСТЫЕ ЗАПРОСЫ
        </button>
      )}
    </>
  );
};
