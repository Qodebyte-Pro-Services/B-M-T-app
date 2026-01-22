import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CartItem, Customer } from "@/app/utils/type";
import { Calendar } from "lucide-react";
import { useMemo } from "react";

interface ReceiptProps {
  customer: Customer;
  cart: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  amountPaid: number;
  change: number;
  purchaseType: 'in-store' | 'online';
  splitPayments?: { method: string; amount: string }[];
  installmentPlan?: {
    numberOfPayments: number;
    amountPerPayment: number;
    paymentFrequency: 'daily' | 'weekly' | 'monthly';
    startDate: string;
    notes: string;
    downPayment: number;
    remainingBalance: number;
  };
}

export function Receipt({
  customer,
  cart,
  subtotal,
  tax,
  total,
  paymentMethod,
  amountPaid,
  change,
  purchaseType,
  splitPayments = [],
  installmentPlan,
}: ReceiptProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
 // eslint-disable-next-line react-hooks/purity
 const receiptId = useMemo(() => `TXN-${Date.now().toString().slice(-8)}`, []);
  const todayDate = useMemo(() => new Date().toLocaleDateString(), []);
  return (
    <div className="space-y-4 text-sm">
  
      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-yellow-300 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-sm">BMT</span>
          </div>
          <div>
            <div className="font-bold text-gray-100 text-lg">Big Men</div>
            <div className="text-xs text-gray-100 -mt-1">Transaction Apparel</div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-lg font-bold">Big Men Transaction Apparel</h2>
        <p className="text-gray-300">
          {installmentPlan ? 'INSTALLMENT SALES RECEIPT' : 'SALES RECEIPT'}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
        </p>
      </div>

      <Separator />

     
      <div>
        <div className="flex items-center justify-between">
          <p className="font-medium">{customer.name}</p>
          <Badge variant="secondary">
            {customer.id === 'walk-in' ? 'Walk-in' : 'Registered'}
          </Badge>
        </div>
        {customer.email && <p className="text-gray-500">{customer.email}</p>}
        {customer.phone && <p className="text-gray-500">{customer.phone}</p>}
      </div>

      <Separator />

    
      <div className="space-y-1">
        {cart.map(item => (
          <div key={item.id} className="flex justify-between">
            <span>
              {item.productName} ({item.variantName}) × {item.quantity}
            </span>
            <span>NGN {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <Separator />

      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span>Purchase Type</span>
          <Badge variant="secondary">
            {purchaseType === 'in-store' ? 'In-Store' : 'Online'}
          </Badge>
        </div>

        <div className="flex justify-between items-center">
          <span>Payment Method</span>
          <Badge variant={installmentPlan ? "default" : "secondary"} 
            className={installmentPlan ? "bg-yellow-500 text-black" : ""}>
            {paymentMethod === 'split' ? 'Split Payment' : 
             paymentMethod === 'installment' ? 'Installment' : paymentMethod}
          </Badge>
        </div>

        
        {paymentMethod === 'split' && splitPayments.length > 0 && (
          <div className="text-sm mt-1">
            {splitPayments.map((p, i) => (
              <div key={i} className="flex justify-between">
                <span>{p.method}:</span>
                <span>NGN {parseFloat(p.amount || '0').toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

      
        {installmentPlan && (
          <div className="mt-4 p-3 bg-yellow-900/20 rounded-lg space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <Calendar className="h-4 w-4" />
              INSTALLMENT PLAN
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-gray-400">Down Payment</div>
                <div className="font-bold">NGN {installmentPlan.downPayment.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-400">Remaining Balance</div>
                <div className="font-bold">NGN {installmentPlan.remainingBalance.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-400">Payments</div>
                <div className="font-bold">{installmentPlan.numberOfPayments} × NGN {installmentPlan.amountPerPayment.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-400">Frequency</div>
                <div className="font-bold capitalize">{installmentPlan.paymentFrequency}</div>
              </div>
            </div>
            
            <div className="text-xs text-gray-400 pt-2 border-t border-yellow-800/30">
              Next payment due: {installmentPlan.startDate}
            </div>
          </div>
        )}
      </div>

      <Separator />

     
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>NGN {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>NGN {tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>NGN {total.toFixed(2)}</span>
        </div>
      </div>

      <Separator />

     
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Amount Paid</span>
          <span>NGN {amountPaid.toFixed(2)}</span>
        </div>

        {paymentMethod !== 'installment' && (
          <div className="flex justify-between">
            <span>Change</span>
            <span>NGN {change.toFixed(2)}</span>
          </div>
        )}

        {installmentPlan && (
          <>
            <div className="flex justify-between text-yellow-300">
              <span>Down Payment (Paid)</span>
              <span>NGN {amountPaid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Balance Due</span>
              <span>NGN {(total - amountPaid).toFixed(2)}</span>
            </div>
          </>
        )}
      </div>

      <Separator />

     
      {installmentPlan && (
        <div className="text-xs text-gray-400 space-y-1">
          <div className="font-bold">INSTALLMENT TERMS:</div>
          <div>1. Payments are due {installmentPlan.paymentFrequency}.</div>
          <div>2. Late payments may incur additional fees.</div>
          <div>3. Products remain property of Big Men Transaction Apparel until fully paid.</div>
          <div>4. Default may result in collection proceedings.</div>
        </div>
      )}

     
      <div className="text-center text-xs text-gray-400 pt-4">
        <div>Thank you for your business!</div>
        <div className="mt-1">For inquiries: contact@bigmenapparel.com | 0800-BIG-MEN</div>
         <div className="mt-2">
          Receipt ID: {receiptId} • {todayDate}
        </div>
      </div>
    </div>
  );
}