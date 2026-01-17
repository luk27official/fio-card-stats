import { ChangeEvent, useState, useEffect } from "react";
import "./Item.css";
import { CategoryName, categoryColors, defaultCategoryMapping, prettifiedCategoryNames } from "../utils/customTypes";
import { Currency, formatCurrency } from "../utils/otherUtils";
import { FioCSVData } from "../utils/csvUtils";
import { TransactionModal } from "./TransactionModal";

function Item({ itemName, amount, currency = "CZK", transactions = [] }: { itemName: string; amount?: number; currency?: Currency; transactions?: FioCSVData[]; }) {

    const [selectedCategory, setSelectedCategory] = useState<CategoryName>("other");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTransactionIndex, setCurrentTransactionIndex] = useState(0);

    const loadData = () => {
        const jsonItems = localStorage.getItem("items");
        const itemsParsed = jsonItems ? JSON.parse(jsonItems) : [];

        return itemsParsed;
    };

    // Load the initial category from localStorage on component mount
    useEffect(() => {
        const items = loadData();

        const item = items.find((item: { name: string; category: string; }) => item.name === itemName);

        // If found in localStorage, set as selected category
        if (item) {
            setSelectedCategory(item.category as CategoryName);
        }

        // Else look into the mapping if there is a match
        Object.keys(defaultCategoryMapping).forEach((key) => {
            if (itemName.toLowerCase().includes(key)) {
                setSelectedCategory(defaultCategoryMapping[key]);
            }
        });

    }, [itemName]); // dependencies to ensure it runs only on mount

    // should correspond to CategoryName defined in utils/customTypes.ts
    const categories: CategoryName[] = ["food", "travel", "ATM", "freetime", "income", "living", "other", "transfer"] as const;

    // save the category to the localStorage on change
    const saveCategory = (e: ChangeEvent<HTMLSelectElement>) => {
        const category = (e.target as HTMLSelectElement).value as CategoryName;

        setSelectedCategory(category);

        const items = loadData();
        const newItems = items.filter((item: { name: string; }) => item.name !== itemName);
        newItems.push({ name: itemName, category: category });

        localStorage.setItem("items", JSON.stringify(newItems));
    };

    const handleCardClick = (e: React.MouseEvent) => {
        // Don't open modal if clicking on the select dropdown
        if ((e.target as HTMLElement).tagName === 'SELECT') {
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

    return (
        <>
            <div
                className="item-card"
                style={{
                    backgroundColor: categoryColors[selectedCategory] ? categoryColors[selectedCategory] + '30' : '#ffffff',
                    cursor: transactions.length > 0 ? 'pointer' : 'default'
                }}
                onClick={handleCardClick}
            >
                <select name={itemName} className="item-select" value={selectedCategory} onChange={(e) => saveCategory(e)}>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>{prettifiedCategoryNames[category]}</option>
                    ))}
                </select>
                <span className="item-name">{itemName}</span>
                {amount !== undefined && (
                    <div className="item-amount" style={{ color: amount >= 0 ? 'green' : 'red' }}>
                        {formatCurrency(amount, currency)}
                    </div>
                )}
                {transactions.length > 0 && (
                    <div className="transaction-count">
                        {transactions.length > 1 ? `${transactions.length} transactions - ` : ''}Click for details
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