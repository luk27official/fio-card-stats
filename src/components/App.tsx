import './App.css';
import { ChangeEvent, useState } from 'react';
import { loadCSV, parseCSV, FioCSVData, CategorizedFioCSVData, getPaymentInformation } from "../utils/csvUtils";
import Item from "./Item";
import FileInput from "./FileInput";
import Header from "./Header";
import HelpSection from "./HelpSection";
import ControlPanel from "./ControlPanel";
import ResultsSection from "./ResultsSection";
import { CategoryName } from "../utils/customTypes";
import { calculateTotalSum, getUniqueItems, groupDataByCategory, createTransactionNameMapping, calculateItemAmounts, Currency } from "../utils/otherUtils";


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
  const itemAmounts = calculateItemAmounts(parsedData, getPaymentInformation, selectedCurrency, hideDuplicates);

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

  const totalSum = calculateTotalSum(parsedData, selectedCurrency);

  return (
    <div id="main">
      <Header onHelpClick={handleHelpClick} />

      {showHelp && <HelpSection onClose={handleHelpClick} />}

      {!showHelp && (
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
                key={item}
              />
            ))}
          </div>

          {parsedData.length > 0 && (
            <input
              type="submit"
              value="Submit"
              onClick={handleClick}
              className="submit-button"
            />
          )}

          {submitted && (
            <ResultsSection
              categorizedData={categorizedData}
              currency={selectedCurrency}
              totalSum={totalSum}
              shownDetailedCategory={shownDetailedCategory}
              setShownDetailedCategory={setShownDetailedCategory}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
