import './App.css';
import { ChangeEvent, useState } from 'react';
import { loadCSV, parseCSV, CSVData } from "./csvUtils";


function App() {
  // TODO: add list of card-related items to the left
  // TODO: add drag n drop to other categories

  const [parsedData, setParsedData] = useState<CSVData[]>([]);

  const onChange = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const files = (e.target as HTMLInputElement).files;

    if (files) {
      const data = await loadCSV(files[0]);
      setParsedData(parseCSV(data));
    }
  };

  return (
    <>
      <h1>Hello World</h1>
      Load file: <input type="file" onChange={onChange} accept=".csv" />
      <div>
        {parsedData.map((item, index) => (
          <ul>
            <li key={index}>{JSON.stringify(item)}</li>
          </ul>
        ))}
      </div>
    </>
  );
}

export default App;
