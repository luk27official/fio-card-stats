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
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const onChange = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const files = (e.target as HTMLInputElement).files;

    if (files) {
      const data = await loadCSV(files[0]);
      setParsedData(parseCSV(data));
    }
  };

  const uniqueItems = parsedData.reduce((acc: string[], item: FioCSVData) => {
    if (!item) {
      return acc;
    }

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

      if (!item["Datum"]) {
        return acc;
      }

      acc[item.category].push(item);

      return acc;
    }, {});

    setCategorizedData(groupedData);
  };

  const handleHelpClick = () => {
    setShowHelp(!showHelp);
  };

  return (
    <div id="main">
      <span className="fancy-header">Fio Card data</span>
      <div>
        <a href="#" onClick={() => handleHelpClick()}>Help</a>
        <span> | </span>
        <a href="https://github.com/luk27official/fio-card-stats" target="_blank">GitHub</a>
        <span> | </span>
        <a href="/assets/data/example.csv">Download example CSV</a>
      </div>
      {showHelp && <div className="help">
        The usage is simple. Just upload your Fio Card data in CSV format. Then you can categorize your payments by selecting the category from the dropdown menu.
        The categories are saved in the local storage so you don't have to categorize them again. Data is neither stored nor sent to any server.
        <br />
        Použití nástroje je jednoduché. Stačí nahrát data z Fio banky ve formátu CSV. Poté můžete kategorizovat platby výběrem kategorie z rozbalovacího menu.
        Kategorie jsou ukládány v lokálním úložišti, takže je nemusíte znovu kategorizovat. Data nejsou ukládána ani odesílána na žádný server.
        <a href="#" onClick={() => handleHelpClick()} style={{ fontSize: "1rem" }}>Back to upload</a>
      </div>}
      {!showHelp && <>
        <FileInput onChange={onChange} />
        <div className="items-list">
          {uniqueItems.map((item) => <Item itemName={item} key={item} />)}
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
      </>}
    </div>
  );
}

export default App;
