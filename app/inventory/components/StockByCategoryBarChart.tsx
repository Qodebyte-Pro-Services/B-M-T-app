'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface CategoryStock {
  category: string;
  stock: number;
}

const CATEGORY_STOCK_DATA: CategoryStock[] = [
  { category: "Suits & Blazers", stock: 320 },
  { category: "Shirts", stock: 280 },
  { category: "Trousers", stock: 210 },
  { category: "Accessories", stock: 145 },
  { category: "Shoes", stock: 98 },
];


interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: CategoryStock;
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg">
        <div className="font-medium">{payload[0].payload.category}</div>
        <div className="text-green-400">
          Stock: {payload[0].value} items
        </div>
      </div>
    );
  }
  return null;
};

export function StockByCategoryBarChart() {
  return (
    <div className="w-full h-80 sm:h-90 md:h-100">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={CATEGORY_STOCK_DATA}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="#e5e7eb"
          />

          {/* X = numbers */}
          <XAxis
            type="number"
            stroke="#6b7280"
            fontSize={12}
          />

          {/* Y = categories */}
          <YAxis
            type="category"
            dataKey="category"
            stroke="#6b7280"
            fontSize={12}
            width={120}
          />

          <Tooltip content={<CustomTooltip />} />

          <Bar
            dataKey="stock"
            radius={[0, 6, 6, 0]}
            fill="#10b981"
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
