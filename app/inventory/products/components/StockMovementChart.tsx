'use client';

import { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductVariant } from '@/app/utils/type';

interface StockMovementChartProps {
  productId: string;
  variants: ProductVariant[];
}

type StockPoint = {
  date: string;
  stock: number;
};

export function StockMovementChart({
  productId,
  variants,
}: StockMovementChartProps) {
  const stockData: StockPoint[] = useMemo(
    () => [
      { date: '2024-01-01', stock: 100 },
      { date: '2024-01-05', stock: 95 },
      { date: '2024-01-10', stock: 85 },
      { date: '2024-01-15', stock: 80 },
      { date: '2024-01-20', stock: 75 },
      { date: '2024-01-25', stock: 85 },
      { date: '2024-01-30', stock: 90 },
      { date: '2024-02-01', stock: 95 },
    ],
    []
  );

  const [selectedVariant, setSelectedVariant] = useState('all');

  
  const hashStock = (variant: string, date: string) => {
    let hash = 0;
    const str = `${variant}-${date}`;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
    }
    return Math.abs(hash % 50) + 50;
  };

  const chartData = useMemo(() => {
    if (selectedVariant === 'all') return stockData;

    return stockData.map((point) => ({
      ...point,
      stock: hashStock(selectedVariant, point.date),
    }));
  }, [selectedVariant, stockData]);

  const startStock = chartData[0]?.stock ?? 0;
  const currentStock = chartData.at(-1)?.stock ?? 0;
  const netChange = currentStock - startStock;

  return (
    <div className="space-y-4">
     
      <Select value={selectedVariant} onValueChange={setSelectedVariant}>
        <SelectTrigger className="w-52 border border-gray-900">
          <SelectValue placeholder="Select variant"  />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Variants</SelectItem>
          {variants.map((variant) => (
            <SelectItem key={variant.id} value={variant.id}>
              {variant.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

     
      <div className="h-72 w-full rounded-lg border bg-gray-50 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                })
              }
            />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="stock"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="text-sm text-gray-500">Starting Stock</div>
          <div className="text-xl font-bold">{startStock}</div>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <div className="text-sm text-gray-500">Current Stock</div>
          <div className="text-xl font-bold">{currentStock}</div>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <div className="text-sm text-gray-500">Net Change</div>
          <div
            className={`text-xl font-bold ${
              netChange > 0
                ? 'text-green-600'
                : netChange < 0
                ? 'text-red-600'
                : 'text-gray-600'
            }`}
          >
            {netChange > 0 ? '+' : ''}
            {netChange}
          </div>
        </div>
      </div>
    </div>
  );
}
