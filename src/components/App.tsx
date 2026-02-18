import "./App.css";
import { ChangeEvent, useState } from "react";
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

  const onChange = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const files = (e.target as HTMLInputElement).files;

    if (files) {
      const data = await loadCSV(files[0]);
      setParsedData(parseCSV(data));
    }
  };

  const uniqueItems = getUniqueItems(parsedData, getPaymentInformation, hideDuplicates);
  const itemAmounts = calculateItemAmounts(parsedData, getPaymentInformation, selectedCurrency, hideDuplicates);
  const itemTransactions = createItemToTransactionsMap(parsedData, getPaymentInformation, hideDuplicates);

  const handleClick = () => {
    const nameMapping = createTransactionNameMapping(parsedData, getPaymentInformation);

    const data: CategorizedFioCSVData[] = parsedData.map((item) => {
      const itemName = getPaymentInformation(item);
      const representativeName = nameMapping.get(itemName) || itemName;
      const selectElement = document.getElementsByName(representativeName)[0] as unknown as HTMLSelectElement;

      return {
        ...item,
        category: selectElement.value as CategoryName,
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

  const totalSum = calculateTotalSum(parsedData, selectedCurrency);

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
