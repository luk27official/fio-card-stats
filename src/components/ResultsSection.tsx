import "./ResultsSection.css";
import { CategoryName, Category } from "../utils/customTypes";
import { CategorizedFioCSVData } from "../utils/csvUtils";
import { Currency, formatCurrency } from "../utils/otherUtils";
import { CategoryBaseInfo, CategoryDetails } from "./CategoryDetails";
import CategoryChart from "./CategoryChart";

interface ResultsSectionProps {
  categorizedData: Record<CategoryName, CategorizedFioCSVData[]>;
  currency: Currency;
  totalSum: string;
  shownDetailedCategory: CategoryName | null;
  setShownDetailedCategory: (category: CategoryName | null) => void;
  categories: Category[];
}

function ResultsSection({
  categorizedData,
  currency,
  totalSum,
  shownDetailedCategory,
  setShownDetailedCategory,
  categories,
}: ResultsSectionProps) {
  const handleBackToOverview = () => {
    setShownDetailedCategory(null);
    // Scroll to categories overview
    setTimeout(() => {
      const categoriesSection = document.querySelector(".categories-overview");
      if (categoriesSection) {
        categoriesSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <div className="results-section">
      <div className="results-divider"></div>

      <section className="categories-overview">
        <h2 className="section-title">Categories Overview</h2>
        <div className="category-grid">
          {Object.keys(categorizedData)
            .sort()
            .map((category, index) => (
              <CategoryBaseInfo
                category={category as CategoryName}
                categorizedData={categorizedData}
                currency={currency}
                key={index}
                setShownDetailedCategory={setShownDetailedCategory}
                categories={categories}
              />
            ))}
        </div>
      </section>

      <div className="results-divider-small"></div>

      <section className="chart-section">
        <h2 className="section-title">Spending Over Time</h2>
        <CategoryChart categorizedData={categorizedData} currency={currency} categories={categories} />
      </section>

      <div className="total-summary">
        <div className="total-card">
          <span className="total-label">Total Net:</span>
          <span className={`total-amount ${parseFloat(totalSum) >= 0 ? "positive" : "negative"}`}>
            {formatCurrency(parseFloat(totalSum), currency)}
          </span>
        </div>
      </div>

      {shownDetailedCategory && (
        <>
          <div className="results-divider"></div>
          <section className="category-details-section">
            <button className="close-details-btn" onClick={handleBackToOverview}>
              ← Back to Overview
            </button>
            <CategoryDetails
              category={shownDetailedCategory}
              categorizedData={categorizedData}
              currency={currency}
              categories={categories}
            />
          </section>
        </>
      )}
    </div>
  );
}

export default ResultsSection;
