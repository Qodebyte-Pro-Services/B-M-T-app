'use client';

import React from 'react';
import { Transaction } from '@/app/utils/type';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ChartDataItem {
  [key: string]: string | number;
  name: string;
  value: number;
  percentage: string;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: ChartDataItem }[];
}

interface PurchaseTypeChartProps {
  transactions: Transaction[];
}


function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold">{data.name}</p>
        <p className="text-sm">{data.value} transactions</p>
        <p className="text-sm">{data.percentage}% of total</p>
      </div>
    );
  }
  return null;
}

interface CustomLegendProps {
  payload?: { payload: ChartDataItem }[];
}

function CustomLegend({ payload }: CustomLegendProps) {
  if (!payload) return null;
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry, index) => {
        const data = entry.payload;
        return (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <span className="text-sm">{data.value}</span>
            <span className="text-sm text-gray-500">({data.percentage}%)</span>
          </div>
        );
      })}
    </div>
  );
}

export function PurchaseTypeChart({ transactions }: PurchaseTypeChartProps) {
  const chartData: ChartDataItem[] = React.useMemo(() => {
    const purchaseTypes = transactions.reduce((acc, t) => {
      const type = t.purchaseType || 'in-store';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(purchaseTypes).reduce((a, b) => a + b, 0);

    return Object.entries(purchaseTypes).map(([type, count]) => ({
      name: type === 'in-store' ? 'In-Store' : 'Online',
      value: count,
      percentage: total > 0 ? ((count / total) * 100).toFixed(1) : '0',
      color: type === 'in-store' ? '#3b82f6' : '#10b981'
    }));
  }, [transactions]);

  return (
    <div className="h-64">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              label={({ index }) =>
                `${chartData[index].name}: ${chartData[index].percentage}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          No purchase type data available
        </div>
      )}
    </div>
  );
}
