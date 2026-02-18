import { ChangeEvent, useState } from "react";
import "./Item.css";
import { CategoryName, Category, defaultCategoryMapping, getCategoryColor } from "../utils/customTypes";
import { Currency, formatCurrency } from "../utils/otherUtils";
import { FioCSVData } from "../utils/csvUtils";
import { TransactionModal } from "./TransactionModal";

function Item({
  itemName,
  amount,
  currency = "CZK",
  transactions = [],
  categories = [],
  onCategoryChange,
}: {
  itemName: string;
  amount?: number;
  currency?: Currency;
  transactions?: FioCSVData[];
  categories?: Category[];
  onCategoryChange?: (itemName: string, category: CategoryName) => void;
}) {
  const loadData = () => {
    const jsonItems = localStorage.getItem("items");
    const itemsParsed = jsonItems ? JSON.parse(jsonItems) : [];

    return itemsParsed;
  };

  const getInitialCategory = (): CategoryName => {
    const items = loadData();
    const item = items.find((item: { name: string; category: string }) => item.name === itemName);

    // If found in localStorage, use that category
    if (item) {
      return item.category as CategoryName;
    }

    // Else look into the mapping if there is a match
    for (const key of Object.keys(defaultCategoryMapping)) {
      if (itemName.toLowerCase().includes(key)) {
        return defaultCategoryMapping[key];
      }
    }

    // Default to "other"
    return "other";
  };

  const [selectedCategory, setSelectedCategory] = useState<CategoryName>(getInitialCategory);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTransactionIndex, setCurrentTransactionIndex] = useState(0);

  // save the category to the localStorage on change
  const saveCategory = (e: ChangeEvent<HTMLSelectElement>) => {
    const category = (e.target as HTMLSelectElement).value as CategoryName;

    setSelectedCategory(category);

    const items = loadData();
    const newItems = items.filter((item: { name: string }) => item.name !== itemName);
    newItems.push({ name: itemName, category: category });

    localStorage.setItem("items", JSON.stringify(newItems));

    // Notify parent component
    if (onCategoryChange) {
      onCategoryChange(itemName, category);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open modal if clicking on the select dropdown
    if ((e.target as HTMLElement).tagName === "SELECT") {
      return;
    }

    if (transactions.length > 0) {
      setCurrentTransactionIndex(0);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTransactionIndex(0);
  };

  const handleNextTransaction = () => {
    if (currentTransactionIndex < transactions.length - 1) {
      setCurrentTransactionIndex(currentTransactionIndex + 1);
    }
  };

  const handlePreviousTransaction = () => {
    if (currentTransactionIndex > 0) {
      setCurrentTransactionIndex(currentTransactionIndex - 1);
    }
  };

  // Pre-compute style values to avoid creating new objects on every render
  const backgroundColor = getCategoryColor(selectedCategory, categories) + "30";
  const cursor = transactions.length > 0 ? "pointer" : "default";
  const cardStyle = { backgroundColor, cursor };

  return (
    <>
      <div className="item-card" style={cardStyle} onClick={handleCardClick}>
        <select name={itemName} className="item-select" value={selectedCategory} onChange={(e) => saveCategory(e)}>
          {categories.map((category, index) => (
            <option key={index} value={category.name}>
              {category.prettyName}
            </option>
          ))}
        </select>
        <span className="item-name">{itemName}</span>
        {amount !== undefined && (
          <div className="item-amount" style={{ color: amount >= 0 ? "green" : "red" }}>
            {formatCurrency(amount, currency)}
          </div>
        )}
        {transactions.length > 0 && (
          <div className="transaction-count">
            {transactions.length > 1 ? `${transactions.length} transactions - ` : ""}Click for details
          </div>
        )}
      </div>
      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        transaction={transactions[currentTransactionIndex] || null}
        itemName={itemName}
        currentIndex={currentTransactionIndex}
        totalTransactions={transactions.length}
        onNext={handleNextTransaction}
        onPrevious={handlePreviousTransaction}
      />
    </>
  );
}

export default Item;
