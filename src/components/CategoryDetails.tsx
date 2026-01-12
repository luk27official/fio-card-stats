import { CategorizedFioCSVData, getPaymentInformation } from "../utils/csvUtils";
import "./CategoryDetails.css";
import { categoryColors, CategoryName, prettifiedCategoryNames } from "../utils/customTypes";
import { convertToCZK, convertCurrency, Currency, formatCurrency } from "../utils/otherUtils";

export function CategoryBaseInfo({ category, categorizedData, setShownDetailedCategory, currency = "CZK" }: {
    category: CategoryName;
    categorizedData: Record<string, CategorizedFioCSVData[]>;
    setShownDetailedCategory: (category: CategoryName) => void;
    currency?: Currency;
}) {
    let categorySum = 0;

    categorizedData[category].forEach((item) => {
        if (!item["Objem"] || !item["Měna"]) {
            return;
        }

        const amountInCZK = convertToCZK(item["Objem"].replace(",", "."), item["Měna"]);
        categorySum += convertCurrency(amountInCZK, currency);
    });

    const backgroundColor = categoryColors[category];
    const tintedBackground = `linear-gradient(135deg, white 0%, ${backgroundColor}15 100%)`;

    const handleShowDetails = () => {
        setShownDetailedCategory(category);
        // Scroll to details section after state update
        setTimeout(() => {
            const detailsSection = document.querySelector('.category-details-section');
            if (detailsSection) {
                detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    return (
        <div className="category-item" style={{ background: tintedBackground, borderLeft: `4px solid ${backgroundColor}` }}>
            <span className="category-name">{prettifiedCategoryNames[category]}</span>
            <button onClick={handleShowDetails} className="details-btn">Show details</button>
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
