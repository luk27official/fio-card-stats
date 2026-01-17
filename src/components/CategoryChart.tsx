import "./CategoryChart.css";
import { FioCSVData } from "../utils/csvUtils";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useRef, useEffect, useState } from 'react';
import { categoryColors, CategoryName } from "../utils/customTypes";
import { convertToCZK, convertCurrency, Currency } from "../utils/otherUtils";

function CategoryChart({ categorizedData, currency = "CZK" }: { categorizedData: Record<CategoryName, FioCSVData[]>; currency?: Currency; }) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState(0);

    const categoryDataMap: Record<string, Record<string, number>> = {};
    const datesSet = new Set<string>();

    Object.entries(categorizedData).forEach(([category, dataArray]) => {
        if (!categoryDataMap[category]) {
            categoryDataMap[category] = {};
        }

        dataArray.forEach((data: FioCSVData) => {
            const [day, month, year] = data["Datum"].split(".");
            const standardizedDate = `${year}-${month}-${day}`;

            datesSet.add(standardizedDate);

            const amountInCZK = convertToCZK(data["Objem"].replace(",", "."), data["Měna"]);
            const amount = convertCurrency(amountInCZK, currency);

            if (!isNaN(amount)) {
                categoryDataMap[category][standardizedDate] = (categoryDataMap[category][standardizedDate] || 0) + amount;
            }
        });
    });

    const sortedDates = Array.from(datesSet).sort((a, b) => Date.parse(a) - Date.parse(b));

    const finalData = sortedDates.map((date) => {
        const entry: Record<string, number | string> = { date };
        let totalSum = 0;

        Object.keys(categoryDataMap).forEach((category) => {
            const previousDate = sortedDates[sortedDates.indexOf(date) - 1];
            if (categoryDataMap[category][date] === undefined) {
                categoryDataMap[category][date] = previousDate ? categoryDataMap[category][previousDate] : 0;
            } else if (previousDate) {
                categoryDataMap[category][date] += categoryDataMap[category][previousDate];
            }

            entry[category] = Math.round(categoryDataMap[category][date] * 10) / 10;
            totalSum += categoryDataMap[category][date];
        });

        entry["Total"] = Math.round(totalSum * 10) / 10;
        return entry;
    });

    const processedData = finalData;

    useEffect(() => {
        const updateWidth = () => {
            if (ref.current) {
                const containerWidth = ref.current.clientWidth;
                setWidth(containerWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);

        return () => {
            window.removeEventListener('resize', updateWidth);
        };
    }, []);

    return (
        <div className="category-chart" ref={ref}>
            <LineChart width={width} height={500} data={processedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(categorizedData).map((category) => (
                    <Line
                        key={category}
                        type="monotone"
                        dataKey={category}
                        stroke={categoryColors[category as CategoryName]}
                        strokeWidth={2}
                    />
                ))}
                <Line
                    type="monotone"
                    dataKey="Total"
                    stroke="black"
                    strokeWidth={2}
                />
            </LineChart>
        </div>
    );
}

export default CategoryChart;
