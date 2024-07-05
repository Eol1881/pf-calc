import React, { useState } from 'react';
import { NewEntryForm } from './NewEntryForm';
import { Entry, EntryLite } from '../types/shared';
import { Cross } from './shared/Icons';

const FileUpload = () => {
  const [entriesArray, setEntriesArray] = useState<string[]>([]);
  const [oldEntries, setOldEntries] = useState<string[]>([]);
  const [vitals, setVitals] = useState<Entry['vitals']>([]);
  const [base, setBase] = useState<Entry['base']>('');
  const [region, setRegion] = useState<Entry['base']>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const rawContent = (event.target?.result as string) || '';
          const parsedKeys = rawContent.split('\n');
          const sortedParsedKeys = sortEntries(parsedKeys);

          const { vitals, base, region } = parseKey(parsedKeys[0]);

          if (base) setBase(base);
          if (vitals) setVitals(vitals);
          if (region) setRegion(region);

          setOldEntries(sortedParsedKeys);
          setEntriesArray(sortedParsedKeys);
        };
        reader.readAsText(file);
      }
    }
  };

  const addNewEntry = (newEntry: EntryLite) => {
    const newEntryString = `${base};{${newEntry.keys.join('|')}}|${vitals.join(
      '|'
    )};${newEntry.freq}.${newEntry.period};${region}`;

    setEntriesArray([...entriesArray, newEntryString]);
  };

  const deleteEntry = (indexToDelete: number) => {
    setEntriesArray(entriesArray.filter((_, index) => index !== indexToDelete));
  };

  const downloadFull = () => {
    const data = entriesArray.join('\n');
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
    const resultQueries: string[] = [];

    entriesArray.forEach((entrie) => {
      const { keys, vitals } = parseKey(entrie);
      const combinations = combineArrays(keys, vitals);
      resultQueries.push(...combinations);
    });

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
        <input
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="cursor-pointer"
        />
      </div>
      <div className="mt-3 space-y-1">
        {sortEntries(entriesArray).map((key, index) => (
          <EntryBlock
            oldEntries={oldEntries}
            key={key}
            keyData={key}
            onDelete={() => deleteEntry(index)}
          />
        ))}
      </div>

      {!!entriesArray.length && (
        <div className="mt-10">
          <NewEntryForm addNewEntry={addNewEntry} />
        </div>
      )}

      {!!entriesArray.length && (
        <button
          onClick={downloadFull}
          className="mt-10 rounded-md bg-green-400 px-3 py-2 font-bold text-black/80 transition-all hover:bg-green-700"
        >
          СКАЧАТЬ КОНФИГ
        </button>
      )}
      {!!entriesArray.length && (
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

export default FileUpload;

const EntryBlock = ({
  keyData,
  onDelete,
  oldEntries,
}: {
  keyData: string;
  onDelete: () => void;
  oldEntries: string[];
}) => {
  const { freq, period, keys, isOld } = parseKey(keyData, oldEntries);

  return (
    <div className="flex gap-1">
      <button
        onClick={onDelete}
        className="flex w-6 items-center justify-center rounded-md bg-white/20 transition-all hover:bg-red-600/90"
      >
        <Cross />
      </button>
      <div className="min-w-24 rounded-sm bg-slate-700 px-1">
        Частота: {freq}
      </div>
      <div className="min-w-24 rounded-sm bg-slate-600 px-1">
        Период: {period}
      </div>
      <div className="rounded-sm bg-red-400 px-1 text-black">
        {(+freq / +period).toFixed(1)}
      </div>
      {keys.map((key) => (
        <KeyBlock key={key} keyString={key} isOld={isOld} />
      ))}
    </div>
  );
};

const KeyBlock = ({
  keyString,
  isOld,
}: {
  keyString: string;
  isOld?: boolean;
}) => {
  return (
    <div
      className={`rounded-sm px-1 ${
        isOld ? 'bg-green-900' : 'bg-green-300 font-semibold text-black/80'
      }`}
    >
      {keyString}
    </div>
  );
};

const parseKey = (key: string, oldEntries?: string[]): Entry => {
  const regexFirstPart = /\{([^}]*)\}/;
  const matchFirstPart = key.match(regexFirstPart);
  const firstPart = (matchFirstPart ? matchFirstPart[1] : '').split('|');

  const secondPart = key
    .replace(regexFirstPart, '')
    .split(';')[1]
    .slice(1)
    .split('|');

  const freqPart = key.split(';')[2];

  return {
    keys: firstPart,
    vitals: secondPart,
    freq: +freqPart.split('.')[0],
    period: +freqPart.split('.')[1],
    base: key.split(';')[0],
    region: key.split(';')[key.split(';').length - 1],
    isOld: !!oldEntries?.includes(key),
  };
};

const sortEntries = (keys: string[]) => {
  return keys.sort(
    (a, b) =>
      +parseKey(b).freq / +parseKey(b).period -
      +parseKey(a).freq / +parseKey(a).period
  );
};

const combineArrays = (arr1: string[], arr2: string[]) => {
  const result: string[] = [];

  arr1.forEach((str1) => result.push(...arr2.map((str2) => str1 + ' ' + str2)));

  return result;
};
