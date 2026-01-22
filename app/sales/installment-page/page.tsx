'use client';

import { useState, useEffect, useCallback } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  DollarSign, 
  CreditCard, 
  Filter, 
  Search, 
  Clock, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  RefreshCcw
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { InventoryLayout } from '@/app/inventory/components/InventoryLayout';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface InstallmentPlan {
  id: string;
  customer: {
    name: string;
    email?: string;
    phone?: string;
  };
  total: number;
  downPayment: number;
  remainingBalance: number;
  numberOfPayments: number;
  amountPerPayment: number;
  paymentFrequency: string;
  startDate: string;
payments: Array<{
  paymentNumber: number;
  dueDate: string;
  expectedAmount: number;
  paidAmount: number;
  status: 'paid' | 'pending' | 'partial' | 'overdue';
  paidDate?: string;
  method?: 'cash' | 'card' | 'transfer';
}>;
  status: 'active' | 'completed' | 'defaulted';
};

interface RawInstallmentPlan {
  id?: string | number;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  total?: number | string;
  downPayment?: number | string;
  remainingBalance?: number | string;
  numberOfPayments?: number | string;
  amountPerPayment?: number | string;
  paymentFrequency?: string;
  startDate?: string;
  status?: string;
  payments?: Array<{
    paymentNumber?: number | string;
    dueDate?: string;
    expectedAmount?: number | string;
    paidAmount?: number | string;
    status?: string;
    paidDate?: string;
    method?: string;
  }>;
}

export default function InstallmentsPage() {
  const [installments, setInstallments] = useState<InstallmentPlan[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  const [selectedPlan, setSelectedPlan] = useState<InstallmentPlan | null>(null);
const [selectedPayment, setSelectedPayment] = useState<number | null>(null);
const [paymentAmount, setPaymentAmount] = useState('');
const [paymentMethod, setPaymentMethod] =
  useState<'cash' | 'card' | 'transfer'>('cash');


function hasLegacyAmount(
  p: unknown
): p is { amount: number | string } {
  return (
    typeof p === 'object' &&
    p !== null &&
    'amount' in p
  );
}


const loadInstallments = useCallback(() => {
  try {
    const stored = localStorage.getItem('installment_plans');
    if (!stored) {
      setInstallments([]);
      return;
    }

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      setInstallments([]);
      return;
    }

    const normalized: InstallmentPlan[] = parsed.map((plan: RawInstallmentPlan) => ({
      id: String(plan.id),
      customer: {
        name: plan.customer?.name ? String(plan.customer.name) : 'Unknown',
        email: plan.customer?.email ? String(plan.customer.email) : undefined,
        phone: plan.customer?.phone ? String(plan.customer.phone) : undefined,
      },
      total: Number(plan.total),
      downPayment: Number(plan.downPayment),
      remainingBalance:
        Number(plan.remainingBalance) ||
        Number(plan.total) - Number(plan.downPayment),
      numberOfPayments: Number(plan.numberOfPayments),
      amountPerPayment: Number(plan.amountPerPayment),
      paymentFrequency: String(plan.paymentFrequency),
      startDate: String(plan.startDate),
      status: ['active', 'completed', 'defaulted'].includes(plan.status || '')
        ? (plan.status as 'active' | 'completed' | 'defaulted')
        : 'active',
   payments: Array.isArray(plan.payments)
  ? plan.payments.map((p) => ({
      paymentNumber: Number(p.paymentNumber),
      dueDate: String(p.dueDate),
    expectedAmount: Number(
    hasLegacyAmount(p)
  ? Number(p.amount)
  : Number(p.expectedAmount ?? plan.amountPerPayment)
),
paidAmount: Number(
  p.paidAmount ??
  (hasLegacyAmount(p) && p.status === 'paid'
  ? Number(p.amount)
  : 0
)
),
      status: ['paid', 'pending', 'partial', 'overdue'].includes(p.status || '')
        ? (p.status as 'paid' | 'pending' | 'partial' | 'overdue')
        : 'pending',
      paidDate: p.paidDate ? String(p.paidDate) : undefined,
      method: p.method as 'cash' | 'card' | 'transfer' | undefined,
    }))
  : [],
    }));

    setInstallments(normalized);
  } catch (err) {
    console.error('Failed to load installments:', err);
    setInstallments([]);
  }
}, []);


const filteredInstallments = installments.filter(plan => {
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    if (!plan.customer.name.toLowerCase().includes(q) && !plan.id.toLowerCase().includes(q)) {
      return false;
    }
  }

  if (statusFilter !== 'all' && plan.status !== statusFilter) {
    return false;
  }

  if (dateFilter && plan.startDate < dateFilter) {
    return false;
  }

  return true;
});


useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  loadInstallments();
}, [loadInstallments]);




const formatCurrency = (value?: number | string) =>
  `NGN ${(Number(value) || 0).toFixed(2)}`;

  const calculateKPIs = () => {
    const active = installments.filter(p => p.status === 'active');
    const overdue = active.filter(p => 
      p.payments.some(payment => 
        payment.status === 'overdue' || 
        (payment.status === 'pending' && new Date(payment.dueDate) < new Date())
      )
    );

    const totalActiveBalance = active.reduce((sum, plan) => sum + plan.remainingBalance, 0);
    const totalExpected = active.reduce((sum, plan) => sum + plan.total, 0);
    const collectionRate = totalExpected > 0 ? ((totalExpected - totalActiveBalance) / totalExpected) * 100 : 0;

    return {
      activeCount: active.length,
      overdueCount: overdue.length,
      totalActiveBalance,
      totalExpected,
      collectionRate,
      totalInstallments: installments.length,
    };
  };

  const kpis = calculateKPIs();

const handleRecordPayment = () => {
  if (!selectedPlan || !selectedPayment) return;

  const amount = Number(paymentAmount);
  if (amount <= 0) {
    toast.error('Enter a valid amount');
    return;
  }

  setInstallments((prev) => {
    const updated = prev.map((plan) => {
      if (plan.id !== selectedPlan.id) return plan;

      let remainingToApply = amount;

      const updatedPayments = plan.payments.map((p) => {
      if (p.paymentNumber !== selectedPayment || remainingToApply <= 0) {
  return { ...p };
}

        const balance = p.expectedAmount - p.paidAmount;
        const applied = Math.min(balance, remainingToApply);

        remainingToApply -= applied;

        const newPaid = p.paidAmount + applied;

       return {
  ...p,
  paidAmount: newPaid,
  status:
    newPaid >= p.expectedAmount
      ? ('paid' as const)
      : ('partial' as const),
  paidDate: new Date().toISOString().split('T')[0],
  method: paymentMethod,
};
      });

      const totalPaid = updatedPayments.reduce(
        (sum, p) => sum + p.paidAmount,
        0
      );

      const remainingBalance = Math.max(plan.total - totalPaid, 0);

     return {
  ...plan,
  payments: updatedPayments,
  remainingBalance,
  status:
    remainingBalance === 0
      ? ('completed' as const)
      : ('active' as const),
};

    });

    localStorage.setItem('installment_plans', JSON.stringify(updated));
    return updated;
  });

  toast.success('Payment recorded successfully');

  setPaymentAmount('');
  setSelectedPlan(null);
  setSelectedPayment(null);
};


  const getStatusBadge = (status: string) => {
    const variants = {
      active: { label: 'Active', color: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
      defaulted: { label: 'Defaulted', color: 'bg-red-100 text-red-800' },
    };
    return (
      <Badge className={`${variants[status as keyof typeof variants]?.color || 'bg-gray-100'} hover:${variants[status as keyof typeof variants]?.color || 'bg-gray-100'}`}>
        {variants[status as keyof typeof variants]?.label || status}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string, dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const isOverdue = status === 'pending' && due < now;

    if (isOverdue) {
      return <Badge variant="destructive">Overdue</Badge>;
    }

    const variants = {
      paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      overdue: { label: 'Overdue', color: 'bg-red-100 text-red-800' },
      partial: { label: 'Partial', color: 'bg-orange-100 text-orange-800' },

    };
    return (
      <Badge className={`${variants[status as keyof typeof variants]?.color || 'bg-gray-100'} hover:${variants[status as keyof typeof variants]?.color || 'bg-gray-100'}`}>
        {variants[status as keyof typeof variants]?.label || status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <InventoryLayout>
      <div className="space-y-2 p-1 md:p-6 lg:p-4">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Installment Management</h1>
            <p className="text-gray-600">Track and manage customer installment plans</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Reports
            </Button>
          </div>
        </div>

    
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className='bg-white text-gray-900 border border-gray-100 shadow-2xl rounded-2xl'>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Active Plans</div>
                  <div className="text-xl font-bold">{kpis.activeCount}</div>
                </div>
                <div className="bg-blue-500 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className='bg-white text-gray-900 border border-gray-100 shadow-2xl rounded-2xl'>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Overdue</div>
                  <div className="text-xl font-bold">{kpis.overdueCount}</div>
                </div>
                <div className="bg-red-500 p-2 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className='bg-white text-gray-900 border border-gray-100 shadow-2xl rounded-2xl'>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Active Balance</div>
                  <div className="text-xl font-bold">NGN {kpis.totalActiveBalance.toFixed(2)}</div>
                </div>
                <div className="bg-green-500 p-2 rounded-lg">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className='bg-white text-gray-900 border border-gray-100 shadow-2xl rounded-2xl'>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Collection Rate</div>
                  <div className="text-xl font-bold">{kpis.collectionRate.toFixed(1)}%</div>
                </div>
                <div className="bg-purple-500 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

   
        <Card className='bg-white text-gray-900 border border-gray-100 shadow-2xl rounded-2xl'>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter installment plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className='flex flex-col gap-2'>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by customer or ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9  border border-gray-900"
                  />
                </div>
              </div>
              
              <div className='flex flex-col gap-2'>
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className=' border border-gray-900'>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="defaulted">Defaulted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className='flex flex-col gap-2'>
                <Label htmlFor="date">Start Date From</Label>
                <Input
                  id="date"
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className=' border border-gray-900'
                />
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setDateFilter('');
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

   
        <Card className='bg-white text-gray-900 border border-gray-100 shadow-2xl rounded-2xl'>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Installment Plans</CardTitle>
                <CardDescription>
                  {filteredInstallments.length} installment plans found
                </CardDescription>
              </div>
              <Button variant="secondary" onClick={loadInstallments}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredInstallments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p>No installment plans found</p>
                <p className="text-sm mt-1">Create installment plans from the POS checkout</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredInstallments.map((plan) => (
                  <Card key={plan.id} className="overflow-hidden bg-white text-gray-900 border border-gray-200 shadow-2xl rounded-2xl" >
                    <CardContent className="p-0">
                 
                      <div className="p-4 bg-gray-50 border-b">
                        <div className="flex flex-col md:flex-row md:items-center  md:justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="font-medium">{plan.customer.name}</div>
                              <div className="text-sm text-gray-500">
                                {plan.customer.phone} • {plan.customer.email}
                              </div>
                            </div>
                            {getStatusBadge(plan.status)}
                          </div>
                          <div className="text-left flex flex-col ">
                            <div className="text-sm text-gray-500">Plan ID</div>
                            <div className="font-mono text-sm">{plan.id}</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2  md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <div className="text-sm text-gray-500">Total</div>
                        <div className="font-bold">{formatCurrency(plan.total)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Down Payment</div>
                            <div className="font-bold">{formatCurrency(plan.downPayment)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Remaining</div>
                            <div className="font-bold text-green-600">{formatCurrency(plan.remainingBalance)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Payment</div>
                            <div className="font-bold">{plan.numberOfPayments} × {formatCurrency(plan.amountPerPayment)}</div>
                          </div>
                        </div>
                      </div>

                    
                      <div className="p-4">
                        <div className="text-sm font-medium mb-3">Payment Schedule ({plan.paymentFrequency})</div>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="p-3 text-left text-sm">Payment #</th>
                                <th className="p-3 text-left text-sm">Amount</th>
                                <th className="p-3 text-left text-sm">Due Date</th>
                                <th className="p-3 text-left text-sm">Status</th>
                                <th className="p-3 text-left text-sm">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(plan.payments ?? []).map((payment) => (
                                <tr key={payment.paymentNumber} className="border-t">
                                  <td className="p-3">
                                    <div className="flex items-center gap-2">
                                      <CreditCard className="h-4 w-4 text-gray-400" />
                                      Payment {payment.paymentNumber}
                                    </div>
                                  </td>
                                  <td className="p-3 font-medium">
                                   {formatCurrency(payment.expectedAmount)}
                                  </td>
                                  <td className="p-3">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-gray-400" />
                                      {formatDate(payment.dueDate)}
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    {getPaymentStatusBadge(payment.status, payment.dueDate)}
                                  </td>
                                  <td className="p-3">
                                    {payment.status === 'pending' && (
                                     <Button
                                      size="sm"
                                      onClick={() => {
                                        setSelectedPlan(plan);
                                        setSelectedPayment(payment.paymentNumber);
                                      }}
                                    >
                                      Record Payment
                                    </Button>
                                    )}
                                    {payment.status === 'paid' && payment.paidDate && (
                                      <div className="text-sm text-gray-500">
                                        Paid on: {formatDate(payment.paidDate)}
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)} >
  <DialogContent className="max-w-lg bg-gray-900 text-white">
    <DialogHeader>
      <DialogTitle>Record Installment Payment</DialogTitle>
      <DialogDescription>
        {selectedPlan?.customer.name}
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Label>Amount</Label>
        <Input
          type="number"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Payment Method</Label>
        <Select value={paymentMethod} onValueChange={(v) =>
          setPaymentMethod(v as 'cash' | 'card' | 'transfer')
        }>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="transfer">Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <DialogFooter>
      <Button variant="outline" onClick={() => setSelectedPlan(null)}>
        Cancel
      </Button>
      <Button
        className="bg-yellow-500 text-black"
        onClick={handleRecordPayment}
      >
        Save Payment
      </Button>
    </DialogFooter>
  </DialogContent>
        </Dialog>

      </div>
    </InventoryLayout>
  );
}