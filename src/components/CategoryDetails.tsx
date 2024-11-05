import { CategorizedFioCSVData, getPaymentInformation } from "../utils/csvUtils";
import "./CategoryDetails.css";
import { categoryColors, CategoryName } from "../utils/customTypes";

export function CategoryBaseInfo({ category, categorizedData, setShownDetailedCategory }: {
    category: CategoryName;
    categorizedData: Record<string, CategorizedFioCSVData[]>;
    setShownDetailedCategory: (category: CategoryName) => void;
}) {

    return (
        <div className="category-item">
            <span className="category-name">{category}</span>
            <button onClick={() => setShownDetailedCategory(category)} className="details-btn">Show details</button>
            <div>
                <br />
                <strong>Total: </strong>
                <span style={{
                    color: categorizedData[category].reduce((sum, item) => {
                        const amount = parseFloat(item["Objem"].replace(",", ".").replace(" ", ""));
                        return sum + amount;
                    }, 0) >= 0 ? "green" : "red"
                }}>
                    {categorizedData[category].reduce((sum, item) => {
                        const amount = parseFloat(item["Objem"].replace(",", ".").replace(" ", ""));
                        return sum + amount;
                    }, 0).toFixed(2)} CZK
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
                            {/* // TODO: add other currencies */}
                            <td style={{ color: parseFloat(item["Objem"]) >= 0 ? "green" : "red" }}>
                                {item["Objem"]} CZK
                            </td>
                            <td>{item["Datum"]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
