import { CategorizedFioCSVData, getPaymentInformation } from "../utils/csvUtils";
import { useState } from "react";
import "./CategoryDetails.css";

function CategoryDetails({ category, categorizedData }: { category: string; categorizedData: Record<string, CategorizedFioCSVData[]>; }) {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <>
            <span className="category-name">{category}</span>
            <button onClick={() => setShowDetails(!showDetails)} className="details-btn">{showDetails ? "Hide" : "Show"} details</button>
            <div>
                {showDetails && categorizedData[category].map((item) => (
                    <div>
                        {getPaymentInformation(item)}
                    </div>
                ))}
                <div>
                    <br />
                    <strong>Total:</strong> {categorizedData[category].reduce((sum, item) => {
                        // TODO: add other currencies
                        const amount = parseFloat(item["Objem"].replace(",", ".").replace(" ", ""));
                        return sum + amount;
                    }, 0).toFixed(2)} CZK
                </div>
            </div>
        </>
    );
}

export default CategoryDetails;