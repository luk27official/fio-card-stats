import { ChangeEvent, useState, useEffect } from "react";
import "./Item.css";
import { CategoryName, categoryColors, defaultCategoryMapping, prettifiedCategoryNames } from "../utils/customTypes";
import { Currency, formatCurrency } from "../utils/otherUtils";

function Item({ itemName, amount, currency = "CZK" }: { itemName: string; amount?: number; currency?: Currency; }) {

    const [selectedCategory, setSelectedCategory] = useState<CategoryName>("other");

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

    return (
        <div className="item-card" style={{ backgroundColor: categoryColors[selectedCategory] ? categoryColors[selectedCategory] + '30' : '#ffffff' }}>
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
        </div>
    );
}

export default Item;