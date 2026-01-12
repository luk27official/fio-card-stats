import { CategorizedFioCSVData, getPaymentInformation } from "../utils/csvUtils";
import "./CategoryDetails.css";
import { categoryColors, CategoryName, prettifiedCategoryNames } from "../utils/customTypes";
import { useMemo } from "react";
import { convertToCZK, convertCurrency, Currency, formatCurrency } from "../utils/otherUtils";

export function CategoryBaseInfo({ category, categorizedData, setShownDetailedCategory, currency = "CZK" }: {
    category: CategoryName;
    categorizedData: Record<string, CategorizedFioCSVData[]>;
    setShownDetailedCategory: (category: CategoryName) => void;
    currency?: Currency;
}) {

    const categorySum = useMemo(() => {
        let sum = 0;

        categorizedData[category].forEach((item) => {
            if (!item["Objem"] || !item["Měna"]) {
                return;
            }

            const amountInCZK = convertToCZK(item["Objem"].replace(",", "."), item["Měna"]);
            sum += convertCurrency(amountInCZK, currency);
        });

        return sum;
    }, [categorizedData, category, currency]);

    return (
        <div className="category-item">
            <span className="category-name">{prettifiedCategoryNames[category]}</span>
            <button onClick={() => setShownDetailedCategory(category)} className="details-btn">Show details</button>
            <div>
                <br />
                <strong>Total: </strong>
                <span style={{
                    color: categorySum >= 0 ? "green" : "red"
                }}>
                    {formatCurrency(categorySum, currency)}
                </span>
                <br />
                <strong>Number of transactions: </strong>
                {categorizedData[category].length}
            </div>
        </div>
    );
}

export function CategoryDetails({ category, categorizedData, currency = "CZK" }: { category: CategoryName; categorizedData: Record<string, CategorizedFioCSVData[]>; currency?: Currency; }) {
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
                    {categorizedData[category].map((item, index) => {
                        const amountInCZK = convertToCZK(item["Objem"].replace(",", "."), item["Měna"]);
                        const convertedAmount = convertCurrency(amountInCZK, currency);

                        return (
                            <tr key={index}>
                                <td>{getPaymentInformation(item)}</td>
                                <td style={{ color: convertedAmount >= 0 ? "green" : "red" }}>
                                    {formatCurrency(convertedAmount, currency)}
                                </td>
                                <td>{item["Datum"]}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
