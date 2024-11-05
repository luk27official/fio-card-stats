import './App.css';
import { ChangeEvent, useMemo, useState } from 'react';
import { loadCSV, parseCSV, FioCSVData, CategorizedFioCSVData, getPaymentInformation } from "../utils/csvUtils";
import Item from "./Item";
import FileInput from "./FileInput";
import { CategoryBaseInfo, CategoryDetails } from "./CategoryDetails";
import { CategoryName, prettifiedCategoryNames } from "../utils/customTypes";
import { convertToCZK } from "../utils/otherUtils";
import CategoryChart from "./CategoryChart";


function App() {
  const [parsedData, setParsedData] = useState<FioCSVData[]>([]);
  const [categorizedData, setCategorizedData] = useState<Record<CategoryName, CategorizedFioCSVData[]>>(() => ({} as Record<CategoryName, CategorizedFioCSVData[]>));
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [shownDetailedCategory, setShownDetailedCategory] = useState<CategoryName | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

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

    const it = getPaymentInformation(item);

    if (!acc.includes(it)) {
      acc.push(it);
    }

    return acc;
  }, []);

  const handleClick = () => {
    const data: CategorizedFioCSVData[] = parsedData.map((item) => {
      return {
        ...item,
        category: (document.getElementsByName(getPaymentInformation(item))[0] as unknown as HTMLSelectElement).value as CategoryName
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

    setSubmitted(true);
    setCategorizedData(groupedData);
  };

  const handleHelpClick = () => {
    setShowHelp(!showHelp);
  };

  const totalSum = useMemo(() => {
    let sum = 0;

    for (const record of parsedData) {
      if (!record["Objem"] || !record["Měna"]) {
        continue;
      }

      sum += convertToCZK(record["Objem"].replace(",", "."), record["Měna"]);
    }

    return sum.toFixed(1);
  }, [parsedData]);

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
        <p>
          The usage is simple. Just upload your Fio Card data in CSV format. Then you can categorize your payments by selecting the category from the dropdown menu.
          The categories are saved in the local storage so you don't have to categorize them again. Data is neither stored nor sent to any server.
        </p>
        <p>
          Použití nástroje je jednoduché. Stačí nahrát data z Fio banky ve formátu CSV. Poté můžete kategorizovat platby výběrem kategorie z rozbalovacího menu.
          Kategorie jsou ukládány v lokálním úložišti, takže je nemusíte znovu kategorizovat. Data nejsou ukládána ani odesílána na žádný server.
        </p>
        <a href="#" onClick={() => handleHelpClick()}>Back to upload</a>
      </div>}
      {!showHelp && <>
        <FileInput onChange={onChange} />
        <div className="items-list">
          {uniqueItems.map((item) => <Item itemName={item} key={item} />)}
        </div>
        {parsedData.length > 0 && <input type="submit" value="Submit" onClick={handleClick} className="submit-button" />}
        {submitted && <>
          <hr className="styled-hr" />
          <div className="category-list">
            {Object.keys(categorizedData).sort().map((category, index) => (
              <CategoryBaseInfo category={category as CategoryName} categorizedData={categorizedData} key={index} setShownDetailedCategory={setShownDetailedCategory} />
            ))}
          </div>
          <hr className="styled-hr" style={{ width: "25%" }} />
          <CategoryChart categorizedData={categorizedData} />
          <div className="category-final-stats">
            <strong>Total net: <span style={{ color: parseFloat(totalSum) >= 0 ? "green" : "red" }}>{totalSum} CZK</span></strong>
          </div>
          {shownDetailedCategory &&
            <>
              <hr className="styled-hr" />
              <div>
                <span className="category-name category-detailed">{prettifiedCategoryNames[shownDetailedCategory]}</span>
                <CategoryDetails category={shownDetailedCategory} categorizedData={categorizedData} />
              </div>
            </>}
        </>}
      </>}
    </div>
  );
}

export default App;
