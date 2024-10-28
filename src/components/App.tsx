import './App.css';
import { ChangeEvent, useState } from 'react';
import { loadCSV, parseCSV, FioCSVData, CategorizedFioCSVData } from "../utils/csvUtils";
import Item from "./Item";
import FileInput from "./FileInput";


function App() {
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
    <div id="main">
      <h1>Fio Card data</h1>
      <FileInput onChange={onChange} />
      {uniqueItems.map((item) => <Item itemName={item} />)}
      <div>
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
            <div>
              <strong>Total:</strong> {categorizedData[category].reduce((sum, item) => {
                const match = item["Zpráva pro příjemce"].match(/(\d+[\.,]?\d*)\s*CZK/);
                const amount = match ? parseFloat(match[1].replace(",", ".")) : 0;
                return sum + amount;
              }, 0).toFixed(2)} CZK
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
