'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  DollarSign, 
  CreditCard, 
  Smartphone, 
  Store, 
  Globe,
  Calendar,
  Wallet
} from "lucide-react";
import { Transaction } from '@/app/utils/type';

interface SalesKPIsProps {
  transactions: Transaction[];
}

export function SalesKPIs({ transactions }: SalesKPIsProps) {
  
  const totalOrders = transactions.length;
  const totalAmount = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalDiscount = transactions.reduce((sum, t) => sum + (t.discount || 0), 0);
  
  
  const paymentMethods = transactions.reduce((acc, t) => {
    acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const totalPaymentTransactions = Object.values(paymentMethods).reduce((a, b) => a + b, 0);
  
 
  const purchaseTypes = transactions.reduce((acc, t) => {
    const type = t.purchaseType || 'in-store';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const totalPurchaseTransactions = Object.values(purchaseTypes).reduce((a, b) => a + b, 0);

  const kpis = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      color: "bg-blue-500",
      description: "Number of transactions"
    },
    {
      title: "Total Amount",
      value: `NGN ${totalAmount.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-green-500",
      description: "Total revenue"
    },
    {
      title: "Total Discount",
      value: `NGN ${totalDiscount.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-purple-500",
      description: "Total discounts given"
    }

   
  ];

  return (
    <div className="space-y-6">
     
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="border-gray-200 bg-white border  shadow-2xl text-gray-900 transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-xl font-bold text-gray-900 mt-2">{kpi.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{kpi.description}</p>
                </div>
                <div className={`${kpi.color} p-3 rounded-lg`}>
                  <kpi.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
           <Card className="bg-gray-100 border  border-gray-300 shadow-2xl text-gray-900">
             <CardContent className="xl:p-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold">Payment Method Distribution</h3>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(paymentMethods).map(([method, count]) => {
              const percentage = totalPaymentTransactions > 0 
                ? ((count / totalPaymentTransactions) * 100).toFixed(1)
                : "0.0";
              
              const getMethodIcon = (method: string) => {
                switch (method) {
                  case 'cash': return <DollarSign className="h-4 w-4" />;
                  case 'card': return <CreditCard className="h-4 w-4" />;
                  case 'transfer': return <Smartphone className="h-4 w-4" />;
                  case 'credit': return <CreditCard className="h-4 w-4" />;
                  case 'installment': return <Calendar className="h-4 w-4" />;
                  case 'split': return <Wallet className="h-4 w-4" />;
                  default: return <CreditCard className="h-4 w-4" />;
                }
              };
              
              const getMethodColor = (method: string) => {
                switch (method) {
                  case 'cash': return 'bg-green-100 text-green-800';
                  case 'card': return 'bg-blue-100 text-blue-800';
                  case 'transfer': return 'bg-purple-100 text-purple-800';
                  case 'credit': return 'bg-yellow-100 text-yellow-800';
                  case 'installment': return 'bg-indigo-100 text-indigo-800';
                  case 'split': return 'bg-pink-100 text-pink-800';
                  default: return 'bg-gray-100 text-gray-800';
                }
              };
              
              return (
                <div key={method} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {getMethodIcon(method)}
                    <span className="xl:font-medium lg:text-[10px] xl:text-[14px] xl:capitalize">{method}</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{count}</div>
                  <Badge variant="secondary" className={getMethodColor(method)}>
                    {percentage}%
                  </Badge>
                  <div className="text-sm text-gray-500 mt-2">
                    {method === 'installment' ? 'Installment Plans' : 
                     method === 'credit' ? 'Credit (Waived)' : 
                     `${method.charAt(0).toUpperCase()}${method.slice(1)}`}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
     
      <Card className="bg-gray-100 border border-gray-300 shadow-2xl text-gray-900 sm:max-h-70  xl:max-h-50">
        <CardContent >
          <div className="flex items-center gap-3 mb-4">
            <Store className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold">Purchase Type Distribution</h3>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {Object.entries(purchaseTypes).map(([type, count]) => {
              const percentage = totalPurchaseTransactions > 0 
                ? ((count / totalPurchaseTransactions) * 100).toFixed(1)
                : "0.0";
              
              return (
                <div key={type} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      type === 'in-store' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {type === 'in-store' ? (
                        <Store className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Globe className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium capitalize">
                        {type === 'in-store' ? 'In-Store' : 'Online'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {count} transactions
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold">{percentage}%</div>
                    <div className="text-sm text-gray-500">
                      of total sales
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
        </div>
   
    </div>
  );
}