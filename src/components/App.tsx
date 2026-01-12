import './App.css';
import { ChangeEvent, useMemo, useState } from 'react';
import { loadCSV, parseCSV, FioCSVData, CategorizedFioCSVData, getPaymentInformation } from "../utils/csvUtils";
import Item from "./Item";
import FileInput from "./FileInput";
import { CategoryBaseInfo, CategoryDetails } from "./CategoryDetails";
import { CategoryName, prettifiedCategoryNames } from "../utils/customTypes";
import { calculateTotalSum, getUniqueItems, groupDataByCategory, createTransactionNameMapping, calculateItemAmounts, Currency, formatCurrency } from "../utils/otherUtils";
import CategoryChart from "./CategoryChart";


function App() {
  const [parsedData, setParsedData] = useState<FioCSVData[]>([]);
  const [categorizedData, setCategorizedData] = useState<Record<CategoryName, CategorizedFioCSVData[]>>(() => ({} as Record<CategoryName, CategorizedFioCSVData[]>));
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [shownDetailedCategory, setShownDetailedCategory] = useState<CategoryName | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [hideDuplicates, setHideDuplicates] = useState<boolean>(true);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("CZK");

  const onChange = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const files = (e.target as HTMLInputElement).files;

    if (files) {
      const data = await loadCSV(files[0]);
      setParsedData(parseCSV(data));
    }
  };

  const uniqueItems = getUniqueItems(parsedData, getPaymentInformation, hideDuplicates);
  const itemAmounts = useMemo(() => calculateItemAmounts(parsedData, getPaymentInformation, selectedCurrency), [parsedData, selectedCurrency]);

  const handleClick = () => {
    const nameMapping = createTransactionNameMapping(parsedData, getPaymentInformation);

    const data: CategorizedFioCSVData[] = parsedData.map((item) => {
      const itemName = getPaymentInformation(item);
      const representativeName = nameMapping.get(itemName) || itemName;
      const selectElement = document.getElementsByName(representativeName)[0] as unknown as HTMLSelectElement;

      return {
        ...item,
        category: selectElement.value as CategoryName
      };
    });

    const groupedData = groupDataByCategory(data);

    setSubmitted(true);
    setCategorizedData(groupedData);
  };

  const handleHelpClick = () => {
    setShowHelp(!showHelp);
  };

  const totalSum = useMemo(() => calculateTotalSum(parsedData, selectedCurrency), [parsedData, selectedCurrency]);

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
        {parsedData.length > 0 && (
          <div className="duplicate-toggle">
            <label>
              <input
                type="checkbox"
                checked={hideDuplicates}
                onChange={(e) => setHideDuplicates(e.target.checked)}
              />
              {" Hide duplicate transactions"}
            </label>
          </div>
        )}
        {parsedData.length > 0 && (
          <div className="currency-selector">
            <label>
              Currency:
              <select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value as Currency)}>
                <option value="CZK">CZK (Kč)</option>
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="PLN">PLN (zł)</option>
              </select>
            </label>
          </div>
        )}
        <div className="items-list">
          {uniqueItems.map((item) => <Item itemName={item} amount={itemAmounts.get(item)} currency={selectedCurrency} key={item} />)}
        </div>
        {parsedData.length > 0 && <input type="submit" value="Submit" onClick={handleClick} className="submit-button" />}
        {submitted && <>
          <hr className="styled-hr" />
          <div className="category-list">
            {Object.keys(categorizedData).sort().map((category, index) => (
              <CategoryBaseInfo category={category as CategoryName} categorizedData={categorizedData} currency={selectedCurrency} key={index} setShownDetailedCategory={setShownDetailedCategory} />
            ))}
          </div>
          <hr className="styled-hr" style={{ width: "25%" }} />
          <CategoryChart categorizedData={categorizedData} currency={selectedCurrency} />
          <div className="category-final-stats">
            <strong>Total net: <span style={{ color: parseFloat(totalSum) >= 0 ? "green" : "red" }}>{formatCurrency(parseFloat(totalSum), selectedCurrency)}</span></strong>
          </div>
          {shownDetailedCategory &&
            <>
              <hr className="styled-hr" />
              <div>
                <span className="category-name category-detailed">{prettifiedCategoryNames[shownDetailedCategory]}</span>
                <CategoryDetails category={shownDetailedCategory} categorizedData={categorizedData} currency={selectedCurrency} />
              </div>
            </>}
        </>}
      </>}
    </div>
  );
}

export default App;
