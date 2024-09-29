import './App.css';
import { ChangeEvent, useState } from 'react';
import { loadCSV, parseCSV, FioCSVData, CategorizedFioCSVData } from "./csvUtils";


function App() {
  // TODO: add drag n drop to other categories

  const [parsedData, setParsedData] = useState<FioCSVData[]>([]);
  const [categorizedData, setCategorizedData] = useState<Record<string, CategorizedFioCSVData[]>>({});

  const onChange = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const files = (e.target as HTMLInputElement).files;

    if (files) {
      const data = await loadCSV(files[0]);
      setParsedData(parseCSV(data));
    }
  };

  const uniqueItems = parsedData.reduce((acc: string[], item: FioCSVData) => {

    const it = item["Zpráva pro příjemce"].split(",")[0].replace("Nákup:", "").trim();

    if (!acc.includes(it)) {
      acc.push(it);
    }

    return acc;
  }, []);

  const handleClick = () => {
    const data: CategorizedFioCSVData[] = parsedData.map((item) => {
      return {
        ...item,
        category: (document.getElementsByName(item["Zpráva pro příjemce"].split(",")[0].replace("Nákup:", "").trim())[0] as unknown as HTMLSelectElement).value
      };
    });

    // group data by category
    const groupedData = data.reduce((acc: Record<string, CategorizedFioCSVData[]>, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }

      acc[item.category].push(item);

      return acc;
    }, {});

    setCategorizedData(groupedData);
  };

  return (
    <>
      <h1>Hello World</h1>
      Load file: <input type="file" onChange={onChange} accept=".csv" />
      <div style={{ width: "50%" }}>
        {uniqueItems.map((item, index) => (
          <div key={index}>
            <select name={item}>
              <option value="food">Food</option>
              <option value="travel">Travel</option>
              <option value="ATM">ATM</option>
              <option value="freetime">Free time</option>
              <option value="other">Other</option>
            </select>
            &nbsp;
            {item}
          </div>
        ))}
        <br />
        <input type="submit" value="Submit" onClick={handleClick} />
        <br />
        grouped data:
        {Object.keys(categorizedData).map((category, index) => (
          <div key={index}>
            <h2>{category}</h2>
            {categorizedData[category].map((item, index) => (
              <div key={index}>
                {item["Zpráva pro příjemce"]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
