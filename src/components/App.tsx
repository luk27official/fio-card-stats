import './App.css';
import { ChangeEvent, useState } from 'react';
import { loadCSV, parseCSV, FioCSVData, CategorizedFioCSVData, getPaymentInformation } from "../utils/csvUtils";
import Item from "./Item";
import FileInput from "./FileInput";
import CategoryDetails from "./CategoryDetails";
import { CategoryName } from "../utils/customTypes";


function App() {
  const [parsedData, setParsedData] = useState<FioCSVData[]>([]);
  const [categorizedData, setCategorizedData] = useState<Record<CategoryName, CategorizedFioCSVData[]>>(() => ({} as Record<CategoryName, CategorizedFioCSVData[]>));

  const onChange = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const files = (e.target as HTMLInputElement).files;

    if (files) {
      const data = await loadCSV(files[0]);
      setParsedData(parseCSV(data));
    }
  };

  const uniqueItems = parsedData.reduce((acc: string[], item: FioCSVData) => {

    const it = getPaymentInformation(item).split(",")[0].replace("Nákup:", "").trim();

    if (!acc.includes(it)) {
      acc.push(it);
    }

    return acc;
  }, []);

  const handleClick = () => {
    const data: CategorizedFioCSVData[] = parsedData.map((item) => {
      return {
        ...item,
        category: (document.getElementsByName(getPaymentInformation(item).split(",")[0].replace("Nákup:", "").trim())[0] as unknown as HTMLSelectElement).value
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
      <span className="fancy-header">Fio Card data</span>
      <FileInput onChange={onChange} />
      <div className="items-list">
        {uniqueItems.map((item) => <Item itemName={item} />)}
      </div>
      {parsedData.length > 0 && <>
        <input type="submit" value="Submit" onClick={handleClick} className="submit-button" />
        <hr className="styled-hr" />
        <div className="category-list">
          {Object.keys(categorizedData).map((category, index) => (
            <CategoryDetails category={category as CategoryName} categorizedData={categorizedData} key={index} />
          ))}
        </div>
      </>}
    </div>
  );
}

export default App;
