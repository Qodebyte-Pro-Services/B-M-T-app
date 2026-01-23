'use client';

import { useState, useEffect, useMemo } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Transaction } from '@/app/utils/type';
import { InventoryLayout } from '../inventory/components/InventoryLayout';
import { SalesHeader } from './components/SalesHeader';
import { DateFilter } from './components/DateFilter';
import { SalesTabs } from './components/SalesTabs';
import { OverviewTab } from './components/OverviewTab';
import { TransactionsTab } from './components/TransactionsTab';
import { ReportsTab } from './components/ReportsTab';

export default function SalesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    filter: 'today',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');


  useEffect(() => {
    const loadTransactions = () => {
      try {
        const savedTransactions = JSON.parse(localStorage.getItem('pos_transactions') || '[]');
        setTransactions(savedTransactions);
      } catch {
        setTransactions([]);
      }
    };
    
    loadTransactions();
    const interval = setInterval(loadTransactions, 30000);
    return () => clearInterval(interval);
  }, []);


  const filteredTransactions = useMemo(() => {
  let filtered = transactions;

  if (dateRange.filter === 'custom') {
    filtered = filtered.filter(t => {
      const transactionDate = new Date(t.timestamp).toISOString().split('T')[0];
      return transactionDate >= dateRange.startDate && transactionDate <= dateRange.endDate;
    });
  } else if (dateRange.filter === 'today') {
    const today = new Date().toDateString();
    filtered = filtered.filter(t => new Date(t.timestamp).toDateString() === today);
  } else if (dateRange.filter === 'yesterday') {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    filtered = filtered.filter(t => new Date(t.timestamp).toDateString() === yesterdayStr);
  } else if (dateRange.filter === 'thisWeek') {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    filtered = filtered.filter(t => new Date(t.timestamp) >= startOfWeek);
  } else if (dateRange.filter === 'thisMonth') {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    filtered = filtered.filter(t => new Date(t.timestamp) >= startOfMonth);
  } else if (dateRange.filter === 'thisYear') {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    filtered = filtered.filter(t => new Date(t.timestamp) >= startOfYear);
  }

  if (paymentMethodFilter !== 'all') {
    filtered = filtered.filter(t => t.paymentMethod === paymentMethodFilter);
  }

  return filtered;
}, [transactions, dateRange, paymentMethodFilter]);


  return (
    <InventoryLayout>
      <div className="space-y-6 p-1 md:p-4 lg:p-6 text-gray-900">
        <SalesHeader />
        
        <DateFilter 
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        
        
       <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 ">
  <SalesTabs activeTab={activeTab} onTabChange={setActiveTab} />
  <TabsContent value="overview">
    <OverviewTab transactions={filteredTransactions} dateRange={dateRange} />
  </TabsContent>
  <TabsContent value="transactions">
    <TransactionsTab 
      transactions={filteredTransactions}
      paymentMethodFilter={paymentMethodFilter}
      onPaymentMethodFilterChange={setPaymentMethodFilter}
    />
  </TabsContent>
  <TabsContent value="reports">
    <ReportsTab transactions={transactions} dateRange={dateRange} />
  </TabsContent>
</Tabs>

      </div>
    </InventoryLayout>
  );
}