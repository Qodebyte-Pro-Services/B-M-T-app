'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from '@/app/utils/type';
import { SalesKPIs } from "./SalesKPIs";
import { SalesChart } from "./SalesChart";
import { PurchaseTypeChart } from "./PurchaseTypeChart";
import { TopProducts } from "./TopProducts";

type DateRange = {
  filter: string;
  startDate: string;
  endDate: string;
};

interface OverviewTabProps {
  transactions: Transaction[];
  dateRange: DateRange;
}

export function OverviewTab({ transactions, dateRange }: OverviewTabProps) {
  return (
    <div className="space-y-6">

      <SalesKPIs transactions={transactions} />
      
    
      <Card className="bg-gray-100 border border-gray-300 shadow-2xl text-gray-900 ">
        <CardHeader>
          <CardTitle>Sales Trend</CardTitle>
          <CardDescription>
            Revenue generated over selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SalesChart 
            transactions={transactions}
            dateRange={dateRange}
          />
        </CardContent>
      </Card>
      
  
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="bg-gray-100 border border-gray-300 shadow-2xl text-gray-900 ">
          <CardHeader>
            <CardTitle>Purchase Type Distribution</CardTitle>
            <CardDescription>
              Online vs In-Store sales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PurchaseTypeChart transactions={transactions} />
          </CardContent>
        </Card>
        
        <Card className="bg-gray-100 border border-gray-300 shadow-2xl text-gray-900 ">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>
              Best performing products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TopProducts transactions={transactions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}