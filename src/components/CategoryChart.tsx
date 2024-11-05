import "./CategoryChart.css";
import { FioCSVData } from "../utils/csvUtils";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useMemo, useRef, useEffect, useState } from 'react';
import { categoryColors, CategoryName } from "../utils/customTypes";

function CategoryChart({ categorizedData }: { categorizedData: Record<CategoryName, FioCSVData[]>; }) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState(0);

    const processedData = useMemo(() => {
        const categoryDataMap: Record<string, Record<string, number>> = {};
        const datesSet = new Set<string>();

        // Collect and normalize dates and amounts for each category
        Object.entries(categorizedData).forEach(([category, dataArray]) => {
            if (!categoryDataMap[category]) {
                categoryDataMap[category] = {};
            }

            dataArray.forEach((data: FioCSVData) => {
                const [day, month, year] = data["Datum"].split(".");
                const standardizedDate = `${year}-${month}-${day}`;

                datesSet.add(standardizedDate);

                const amount = parseFloat(data["Objem"].replace(",", "."));
                if (!isNaN(amount)) {
                    categoryDataMap[category][standardizedDate] = (categoryDataMap[category][standardizedDate] || 0) + amount;
                }
            });
        });

        const sortedDates = Array.from(datesSet).sort((a, b) => Date.parse(a) - Date.parse(b));

        // Ensure cumulative sums across sorted dates
        const finalData = sortedDates.map((date) => {
            const entry: Record<string, number | string> = { date };
            let totalSum = 0;

            Object.keys(categoryDataMap).forEach((category) => {
                // Carry forward the last cumulative amount if the date is missing
                const previousDate = sortedDates[sortedDates.indexOf(date) - 1];
                if (categoryDataMap[category][date] === undefined) {
                    categoryDataMap[category][date] = previousDate ? categoryDataMap[category][previousDate] : 0;
                } else if (previousDate) {
                    // Add to cumulative sum from previous date if date is found
                    categoryDataMap[category][date] += categoryDataMap[category][previousDate];
                }

                // Round to 1 decimal place without converting to string
                entry[category] = Math.round(categoryDataMap[category][date] * 10) / 10;
                totalSum += categoryDataMap[category][date];
            });

            // Track total across categories for this date, rounded to 1 decimal
            entry["Total"] = Math.round(totalSum * 10) / 10;
            return entry;
        });

        return finalData;
    }, [categorizedData]);

    useEffect(() => {
        if (ref.current) {
            setWidth(ref.current.clientWidth);
        }
    }, [ref]);

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
