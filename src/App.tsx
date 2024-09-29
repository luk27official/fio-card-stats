import './App.css';
import { ChangeEvent, useState } from 'react';
import { loadCSV } from "./csvUtils";

function App() {
  // TODO: add csv parsing
  // TODO: add list of card-related items to the left
  // TODO: add drag n drop to other categories

  const [formData, setFormData] = useState<FileList | null>(null);
  const [fileData, setFileData] = useState<string>("");

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const files = (e.target as HTMLInputElement).files;

    if (files) {
      setFormData(files);

      loadCSV(files[0]).then((data) => {
        setFileData(data);
      });
    }
  };

  if (fileData) {
    console.log(fileData);
  }

  return (
    <>
      <h1>Hello World</h1>
      Load file: <input type="file" onChange={onChange} accept=".csv" />
      <div>
        {formData && (
          <ul>
            {Array.from(formData).map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default App;
