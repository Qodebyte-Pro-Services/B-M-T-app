'use client';

import { Product } from "@/app/utils/type";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";


interface ProductFiltersProps {
  products: Product[];
  selectedBrand: string;
  selectedCategory: string;
  selectedProduct: string;
  searchQuery: string;
  onBrandChange: (brand: string) => void;
  onCategoryChange: (category: string) => void;
  onProductChange: (product: string) => void;
  onSearchChange: (query: string) => void;
}

export function ProductFilters({
  products,
  selectedBrand,
  selectedCategory,
  selectedProduct,
  searchQuery,
  onBrandChange,
  onCategoryChange,
  onProductChange,
  onSearchChange,
}: ProductFiltersProps) {
 
  const brands = Array.from(new Set(products.map(p => p.brand)));
  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      
        <div className="md:col-span-2">
          <Label className="text-sm">Search Products</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, SKU, variant..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className='border border-gray-900 pl-9'
            />
          </div>
        </div>

       
        <div>
          <Label className="text-sm">Brand</Label>
          <Select value={selectedBrand} onValueChange={onBrandChange}>
            <SelectTrigger className='border border-gray-900'>
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map(brand => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

       
        <div>
          <Label className="text-sm">Category</Label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className='border border-gray-900'>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

     
        <div>
          <Label className="text-sm">Product</Label>
          <Select value={selectedProduct} onValueChange={onProductChange}>
            <SelectTrigger className='border border-gray-900'>
              <SelectValue placeholder="All Products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {products.map(product => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}