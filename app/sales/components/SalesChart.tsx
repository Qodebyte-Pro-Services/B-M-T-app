'use client';
import React from 'react';
import { Transaction } from '@/app/utils/type';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { SalesChartTooltip } from './Omo'; // your tooltip component

type DateRange = {
  filter: string;
  startDate: string;
  endDate: string;
};

interface SalesChartProps {
  transactions: Transaction[];
  dateRange: DateRange;
}

interface ChartDataItem {
  time: string;
  amount: number;
  count: number;
}

export function SalesChart({ transactions, dateRange }: SalesChartProps) {
  const chartData: ChartDataItem[] = React.useMemo(() => {
    const data: ChartDataItem[] = [];

    if (transactions.length === 0) return data;

    const now = new Date();

    if (dateRange.filter === 'today' || dateRange.filter === 'yesterday') {
   
      const baseDate = dateRange.filter === 'today' ? now : new Date(now.setDate(now.getDate() - 1));
      for (let hour = 0; hour < 24; hour++) {
        const hourTransactions = transactions.filter(t => new Date(t.timestamp).getHours() === hour);
        const total = hourTransactions.reduce((sum, t) => sum + t.total, 0);
        data.push({
          time: `${hour.toString().padStart(2, '0')}:00`,
          amount: total,
          count: hourTransactions.length,
        });
      }
    } else if (dateRange.filter === 'thisWeek') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      days.forEach((day, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dayStr = date.toISOString().split('T')[0];
        const dayTransactions = transactions.filter(t => new Date(t.timestamp).toISOString().split('T')[0] === dayStr);
        const total = dayTransactions.reduce((sum, t) => sum + t.total, 0);
        data.push({ time: day, amount: total, count: dayTransactions.length });
      });
    } else if (dateRange.filter === 'thisMonth') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(startOfMonth);
        date.setDate(i);
        const dateStr = date.toISOString().split('T')[0];
        const dayTransactions = transactions.filter(t => new Date(t.timestamp).toISOString().split('T')[0] === dateStr);
        const total = dayTransactions.reduce((sum, t) => sum + t.total, 0);
        data.push({ time: dateStr, amount: total, count: dayTransactions.length });
      }
    } else if (dateRange.filter === 'thisYear') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const monthsInYear = 12;
      for (let i = 0; i < monthsInYear; i++) {
        const date = new Date(startOfYear);
        date.setMonth(i);
        const monthStr = date.toISOString().split('T')[0];
        const monthTransactions = transactions.filter(t => new Date(t.timestamp).toISOString().split('T')[0].startsWith(monthStr));
        const total = monthTransactions.reduce((sum, t) => sum + t.total, 0);
        data.push({ time: monthStr, amount: total, count: monthTransactions.length });
      }
    } else if (dateRange.filter === 'custom') {
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      const dayCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
        for (let i = 0; i < dayCount; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            const dayTransactions = transactions.filter(t => new Date(t.timestamp).toISOString().split('T')[0] === dateStr);
            const total = dayTransactions.reduce((sum, t) => sum + t.total, 0);
            data.push({ time: dateStr, amount: total, count: dayTransactions.length });
        }
    }
    return data;
  }, [transactions, dateRange]);

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="time" stroke="#666" tick={{ fill: '#666' }} />
          <YAxis stroke="#666" tick={{ fill: '#666' }} tickFormatter={v => `NGN ${v}`} />
          <Tooltip content={<SalesChartTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Revenue (NGN)"
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Transactions"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
