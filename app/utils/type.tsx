export interface ProductAttribute {
  id: string;
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string | number;
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
