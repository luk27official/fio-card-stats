import { ChangeEvent, useState, useEffect } from "react";
import "./Item.css";
import { CategoryName, categoryColors } from "../utils/customTypes";

function Item({ itemName }: { itemName: string; }) {

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
    }, [itemName]); // dependencies to ensure it runs only on mount

    // should correspond to CategoryName defined in utils/customTypes.ts
    const categories: CategoryName[] = ["food", "travel", "ATM", "freetime", "other"] as const;

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
        <div className="item-card" style={{ backgroundColor: categoryColors[selectedCategory] || '#ffffff' }}>
            <select name={itemName} className="item-select" value={selectedCategory} onChange={(e) => saveCategory(e)}>
                {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                ))}
            </select>
            <span className="item-name">{itemName}</span>
        </div>
    );
}

export default Item;