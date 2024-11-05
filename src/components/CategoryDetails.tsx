import { CategorizedFioCSVData, getPaymentInformation } from "../utils/csvUtils";
import "./CategoryDetails.css";
import { categoryColors, CategoryName } from "../utils/customTypes";
import { useMemo } from "react";
import { convertToCZK } from "../utils/otherUtils";

export function CategoryBaseInfo({ category, categorizedData, setShownDetailedCategory }: {
    category: CategoryName;
    categorizedData: Record<string, CategorizedFioCSVData[]>;
    setShownDetailedCategory: (category: CategoryName) => void;
}) {

    const categorySum = useMemo(() => {
        let sum = 0;

        categorizedData[category].forEach((item) => {
            if (!item["Objem"] || !item["Měna"]) {
                return;
            }

            sum += convertToCZK(item["Objem"].replace(",", "."), item["Měna"]);
        });

        return sum;
    }, [categorizedData, category]);

    return (
        <div className="category-item">
            <span className="category-name">{category}</span>
            <button onClick={() => setShownDetailedCategory(category)} className="details-btn">Show details</button>
            <div>
                <br />
                <strong>Total: </strong>
                <span style={{
                    color: categorySum >= 0 ? "green" : "red"
                }}>
                    {categorySum.toFixed(2)} CZK
                </span>
                <br />
                <strong>Number of transactions: </strong>
                {categorizedData[category].length}
            </div>
        </div>
    );
}

export function CategoryDetails({ category, categorizedData }: { category: CategoryName; categorizedData: Record<string, CategorizedFioCSVData[]>; }) {
    return (
        <div>
            <table>
                <thead style={{ backgroundColor: categoryColors[category] }}>
                    <tr>
                        <th>Payment Information</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {categorizedData[category].map((item, index) => (
                        <tr key={index}>
                            <td>{getPaymentInformation(item)}</td>
                            <td style={{ color: parseFloat(item["Objem"]) >= 0 ? "green" : "red" }}>
                                {item["Objem"]} {item["Měna"]}
                            </td>
                            <td>{item["Datum"]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
