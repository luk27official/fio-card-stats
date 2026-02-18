import "./CategoryChart.css";
import { FioCSVData } from "../utils/csvUtils";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CategoryName, Category, getCategoryColor } from "../utils/customTypes";
import { convertToCZK, convertCurrency, Currency, formatCurrency } from "../utils/otherUtils";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
  currency: Currency;
}

const CustomTooltip = ({ active, payload, label, currency }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const [year, month, day] = label?.split("-") || [];
    const formattedDate = `${day}.${month}.${year}`;

    return (
      <div className="custom-tooltip">
        <p className="tooltip-date">{formattedDate}</p>
        {payload.map((entry, index) => (
          <p key={index} className="tooltip-item" style={{ color: entry.color }}>
            <span className="tooltip-label">{entry.name}:</span>
            <span className="tooltip-value">{formatCurrency(entry.value, currency)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function CategoryChart({
  categorizedData,
  currency = "CZK",
  categories = [],
}: {
  categorizedData: Record<CategoryName, FioCSVData[]>;
  currency?: Currency;
  categories?: Category[];
}) {
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

  const formatXAxis = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="category-chart">
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" strokeOpacity={0.5} />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            stroke="#666"
            style={{ fontSize: "12px", fontWeight: 500 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke="#666"
            style={{ fontSize: "12px", fontWeight: 500 }}
            tickFormatter={(value) => formatCurrency(value, currency)}
          />
          <Tooltip content={<CustomTooltip currency={currency} />} />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            iconType="line"
            formatter={(value) => <span style={{ fontSize: "14px", fontWeight: 500 }}>{value}</span>}
          />
          {Object.keys(categorizedData).map((category) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={getCategoryColor(category, categories)}
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          ))}
          <Line
            type="monotone"
            dataKey="Total"
            stroke="#1a1a1a"
            strokeWidth={4}
            dot={{ r: 5, strokeWidth: 2, fill: "#1a1a1a" }}
            activeDot={{ r: 7, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryChart;
