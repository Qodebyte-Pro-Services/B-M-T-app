export interface ProductAttribute {
  id: string;
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  attributes: Record<string, string>;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  threshold: number;
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  description: string;
  taxable: boolean;
  unit: string;
  hasVariations: boolean;
  images: string[];
  variants: ProductVariant[];
  inventoryValue: number;
  inventoryCost: number;
  totalStock: number;
  totalRevenue: number;
}

export interface ProductFormData {
  productName: string;
  brand: string;
  category: string;
  unit: string;
  baseSku: string;
  taxable: boolean;
  description: string;
  images: string[];
  hasVariations: boolean;
  attributes: ProductAttribute[];
  variations: ProductVariant[];
}


export type EditProductFormData = {
  name: string;
  brand: string;
  category: string;
  description: string;
  taxable: boolean;
  unit: string;
  hasVariations: boolean;
};

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  sku: string;
  price: number;
  quantity: number;
  taxable: boolean;
  image: string;
  stock: number;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface Draft {
  id: string;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  timestamp: string;
}


export interface InstallmentPayment {
  paymentNumber: number;
  amount: number;
  date?: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'down_payment';
  method?: string;
  notes?: string;
}

export interface InstallmentPlan {
  numberOfPayments: number;
  amountPerPayment: number;
  paymentFrequency: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate?: string;
  notes: string;
  downPayment: number;
  remainingBalance: number;
  payments: InstallmentPayment[];
  interestRate?: number;
  lateFee?: number;
}

export interface Transaction {
  id: string;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  discount?: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'split' | 'installment' | 'credit';
  amountPaid: number;
  change: number;
  timestamp: string;
  synced: boolean;
  purchaseType?: 'in-store' | 'online';
  installmentPlan?: InstallmentPlan;
  splitPayments?: { method: string; amount: number }[];
  credit?:  {
  waived: true
}
}
