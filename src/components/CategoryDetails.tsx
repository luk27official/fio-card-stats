import { CategorizedFioCSVData, getPaymentInformation } from "../utils/csvUtils";
import "./CategoryDetails.css";
import { CategoryName, Category, getCategoryColor, getCategoryPrettyName } from "../utils/customTypes";
import { convertToCZK, convertCurrency, Currency, formatCurrency } from "../utils/otherUtils";

export function CategoryBaseInfo({
  category,
  categorizedData,
  setShownDetailedCategory,
  currency = "CZK",
  categories = [],
}: {
  category: CategoryName;
  categorizedData: Record<string, CategorizedFioCSVData[]>;
  setShownDetailedCategory: (category: CategoryName) => void;
  currency?: Currency;
  categories?: Category[];
}) {
  // Calculate category sum (React Compiler will memoize this)
  const categorySum = categorizedData[category].reduce((sum, item) => {
    if (!item["Objem"] || !item["Měna"]) {
      return sum;
    }
    const amountInCZK = convertToCZK(item["Objem"].replace(",", "."), item["Měna"]);
    return sum + convertCurrency(amountInCZK, currency);
  }, 0);

  const backgroundColor = getCategoryColor(category, categories);
  const tintedBackground = `linear-gradient(135deg, white 0%, ${backgroundColor}15 100%)`;
  const categoryItemStyle = { background: tintedBackground, borderLeft: `4px solid ${backgroundColor}` };
  const amountColorStyle = { color: categorySum >= 0 ? "green" : "red" };

  const handleShowDetails = () => {
    setShownDetailedCategory(category);
    // Scroll to details section after state update
    setTimeout(() => {
      const detailsSection = document.querySelector(".category-details-section");
      if (detailsSection) {
        detailsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <div className="category-item" style={categoryItemStyle}>
      <span className="category-name">{getCategoryPrettyName(category, categories)}</span>
      <button onClick={handleShowDetails} className="details-btn">
        Show details
      </button>
      <div>
        <br />
        <strong>Total: </strong>
        <span style={amountColorStyle}>{formatCurrency(categorySum, currency)}</span>
        <br />
        <strong>Number of transactions: </strong>
        {categorizedData[category].length}
      </div>
    </div>
  );
}

export function CategoryDetails({
  category,
  categorizedData,
  currency = "CZK",
  categories = [],
}: {
  category: CategoryName;
  categorizedData: Record<string, CategorizedFioCSVData[]>;
  currency?: Currency;
  categories?: Category[];
}) {
  const theadStyle = { backgroundColor: getCategoryColor(category, categories) };

  return (
    <div className="category-details-wrapper">
      <div className="table-container">
        <table>
          <thead style={theadStyle}>
            <tr>
              <th>Payment Information</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {categorizedData[category].map((item, index) => {
              const amountInCZK = convertToCZK(item["Objem"].replace(",", "."), item["Měna"]);
              const convertedAmount = convertCurrency(amountInCZK, currency);
              const amountStyle = { color: convertedAmount >= 0 ? "green" : "red" };

              return (
                <tr key={index}>
                  <td>{getPaymentInformation(item)}</td>
                  <td style={amountStyle}>{formatCurrency(convertedAmount, currency)}</td>
                  <td>{item["Datum"]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
