'use client';
import { useState } from 'react';

import { DateRangeFilter } from "./components/DateRangeFilter";
import { DashboardTabs } from "./components/DashboardTabs";
import { KpiCard } from "./components/KpiCard";
import { StockAlertWidget } from "./components/StockAlertWidget";
import { TopProductsWidget } from "./components/TopProductsWidget";

import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  Package,
  ShoppingCart,
  BarChart3,
  PieChart,
  PieChartIcon
} from "lucide-react";
import { DashboardLayout } from './components/DashboardLayout';
import { TabsContent } from '@/components/ui/tabs';
import { IncomeExpenseChart } from './components/IncomeExpenseChart';
import { SalesCategoryChart } from './components/SalesCategoryChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StockMovementTable } from '../inventory/components/StockMovement';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("thisMonth");

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    console.log("Date range changed to:", range);
  };

  const kpiData = [
    {
      title: "Total Sales",
      value: "NGN 142,580",
   
      icon: <DollarSign className="h-5 w-5" />,
      description: "earned"
    },
    {
      title: "Total Transactions",
      value: "1,248",
      change: "+8.2%",
   
      icon: <CreditCard className="h-5 w-5" />,
      description: "orders completed"
    },
    {
      title: "Total Expenses",
      value: "NGN42,850",
      change: "+3.1%",
      icon: <TrendingDown className="h-5 w-5" />,
      description: "operational costs"
    },
    {
      title: "Net Profit",
      value: "NGN99,730",
      change: "+18.7%",
      icon: <TrendingUp className="h-5 w-5" />,
      description: "after all deductions"
    }
  ];

  return (
    <DashboardLayout>
    
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-900 mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your business.
          </p>
        </div>
        <DateRangeFilter onDateRangeChange={handleDateRangeChange} />
      </div>

    
      <div className="grid grid-cols-1 
  xs:grid-cols-2 
  lg:grid-cols-4 
  gap-4 md:gap-5 lg:gap-6 
  mb-8">
        {kpiData.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

     
      <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab}>
        
        <TabsContent value="overview" className="space-y-6">
         
          <div className="grid grid-cols-1  gap-6">
           
            <div className="bg-white backdrop-blur-sm shadow-2xl
  rounded-xl 
  p-4 sm:p-5 lg:p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-yellow-600" />
                    Income vs Expenses
                  </h3>
                  <p className="text-sm text-gray-800">Monthly comparison</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-900">Income</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-900">Expenses</span>
                  </div>
                </div>
              </div>
              <IncomeExpenseChart />
            </div>

            
            <div className="bg-white backdrop-blur-sm shadow-2xl rounded-xl p-4 sm:p-5 lg:p-6 w-full  ">
      
 
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2 sm:gap-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-yellow-600" />
            Sales by Category
          </h3>
          <p className="text-sm sm:text-base text-gray-800">Revenue distribution</p>
        </div>
        <div className="text-sm sm:text-base text-gray-900">Selected: {dateRange}</div>
      </div>

      
      <SalesCategoryChart />
    </div>
          </div>

          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <StockAlertWidget />
            <TopProductsWidget />
          </div>
        </TabsContent>

        
        <TabsContent value="stock">
          <Card className="bg-gray-900 border-gray-200">
            <CardHeader>
              <CardTitle >Stock Movement</CardTitle>
              <CardDescription >
                View all inventory movements
              </CardDescription>
            </CardHeader>
            <CardContent className='p-3'>
              <StockMovementTable />
            </CardContent>
          </Card>
        </TabsContent>

       
        <TabsContent value="sales">
          <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Sales Analysis</h3>
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Sales data will appear here</p>
              <p className="text-sm text-gray-500 mt-2">Based on selected date range: {dateRange}</p>
            </div>
          </div>
        </TabsContent>

       
        <TabsContent value="expenses">
          <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Expenses Breakdown</h3>
            <div className="text-center py-12">
              <TrendingDown className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Expenses data will appear here</p>
              <p className="text-sm text-gray-500 mt-2">Based on selected date range: {dateRange}</p>
            </div>
          </div>
        </TabsContent>

       
        <TabsContent value="logins">
          <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Login Attempts & Security</h3>
            <div className="text-center py-12">
              <div className="h-12 w-12 text-gray-600 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-800">
                🔒
              </div>
              <p className="text-gray-400">Login activity data will appear here</p>
              <p className="text-sm text-gray-500 mt-2">Based on selected date range: {dateRange}</p>
            </div>
          </div>
        </TabsContent>
      </DashboardTabs>
    </DashboardLayout>
  );
}