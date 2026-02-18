import "./App.css";
import { ChangeEvent, useState, useEffect } from "react";
import { loadCSV, parseCSV, FioCSVData, CategorizedFioCSVData, getPaymentInformation } from "../utils/csvUtils";
import Item from "./Item";
import FileInput from "./FileInput";
import Header from "./Header";
import HelpSection from "./HelpSection";
import ControlPanel from "./ControlPanel";
import ResultsSection from "./ResultsSection";
import CategoryManager from "./CategoryManager";
import { CategoryName, Category, loadCategories, saveCategories } from "../utils/customTypes";
import {
  calculateTotalSum,
  getUniqueItems,
  groupDataByCategory,
  createTransactionNameMapping,
  calculateItemAmounts,
  Currency,
  createItemToTransactionsMap,
} from "../utils/otherUtils";
import { fetchExchangeRates } from "../utils/exchangeRateService";

function App() {
  const [parsedData, setParsedData] = useState<FioCSVData[]>([]);
  const [categorizedData, setCategorizedData] = useState<Record<CategoryName, CategorizedFioCSVData[]>>(
    () => ({}) as Record<CategoryName, CategorizedFioCSVData[]>
  );
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [shownDetailedCategory, setShownDetailedCategory] = useState<CategoryName | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [hideDuplicates, setHideDuplicates] = useState<boolean>(true);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("CZK");
  const [categories, setCategories] = useState<Category[]>(loadCategories);
  const [showCategoryManager, setShowCategoryManager] = useState<boolean>(false);
  const [itemCategories, setItemCategories] = useState<Map<string, CategoryName>>(new Map());

  // Fetch exchange rates on app startup
  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const onChange = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const files = (e.target as HTMLInputElement).files;

    if (files) {
      const data = await loadCSV(files[0]);
      setParsedData(parseCSV(data));
    }
  };

  // Only compute these expensive calculations when there's data to process
  const hasData = parsedData.length > 0;
  const uniqueItems = hasData ? getUniqueItems(parsedData, getPaymentInformation, hideDuplicates) : [];
  const itemAmounts = hasData
    ? calculateItemAmounts(parsedData, getPaymentInformation, selectedCurrency, hideDuplicates)
    : new Map();
  const itemTransactions = hasData
    ? createItemToTransactionsMap(parsedData, getPaymentInformation, hideDuplicates)
    : new Map();

  const handleCategoryChange = (itemName: string, category: CategoryName) => {
    setItemCategories((prev) => new Map(prev).set(itemName, category));
  };

  const handleClick = () => {
    const nameMapping = createTransactionNameMapping(parsedData, getPaymentInformation);

    const data: CategorizedFioCSVData[] = parsedData.map((item) => {
      const itemName = getPaymentInformation(item);
      const representativeName = nameMapping.get(itemName) || itemName;
      const category = itemCategories.get(representativeName) || "other";

      return {
        ...item,
        category,
      };
    });

    const groupedData = groupDataByCategory(data);

    setSubmitted(true);
    setCategorizedData(groupedData);
  };

  const handleHelpClick = () => {
    setShowHelp(!showHelp);
  };

  const handleExampleClick = async () => {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}assets/data/example.csv`);
      const data = await response.text();
      setParsedData(parseCSV(data));
    } catch (error) {
      console.error("Failed to load example CSV:", error);
    }
  };

  const handleCategoriesUpdate = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
  };

  const handleCategoryManagerToggle = () => {
    setShowCategoryManager(!showCategoryManager);
  };

  // Only calculate total sum when results are submitted and displayed
  const totalSum = submitted && hasData ? calculateTotalSum(parsedData, selectedCurrency) : "0";

  return (
    <div id="main">
      <Header
        onHelpClick={handleHelpClick}
        onExampleClick={handleExampleClick}
        onCategoryManagerClick={handleCategoryManagerToggle}
      />

      {showHelp && <HelpSection onClose={handleHelpClick} />}

      {showCategoryManager && (
        <CategoryManager
          categories={categories}
          onUpdate={handleCategoriesUpdate}
          onClose={handleCategoryManagerToggle}
        />
      )}

      {!showHelp && !showCategoryManager && (
        <>
          <FileInput onChange={onChange} />

          {parsedData.length > 0 && (
            <ControlPanel
              hideDuplicates={hideDuplicates}
              setHideDuplicates={setHideDuplicates}
              selectedCurrency={selectedCurrency}
              setSelectedCurrency={setSelectedCurrency}
            />
          )}

          <div className="items-list">
            {uniqueItems.map((item) => (
              <Item
                itemName={item}
                amount={itemAmounts.get(item)}
                currency={selectedCurrency}
                transactions={itemTransactions.get(item) || []}
                categories={categories}
                onCategoryChange={handleCategoryChange}
                key={item}
              />
            ))}
          </div>

          {parsedData.length > 0 && (
            <input type="submit" value="Submit" onClick={handleClick} className="submit-button" />
          )}

          {submitted && (
            <ResultsSection
              categorizedData={categorizedData}
              currency={selectedCurrency}
              totalSum={totalSum}
              shownDetailedCategory={shownDetailedCategory}
              setShownDetailedCategory={setShownDetailedCategory}
              categories={categories}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
