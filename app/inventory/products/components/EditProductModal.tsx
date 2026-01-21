'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EditProductFormData, Product } from '@/app/utils/type';

interface EditProductModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProductModal({ product, open, onOpenChange }: EditProductModalProps) {
const [formData, setFormData] = useState<EditProductFormData>({
  name: product.name,
  brand: product.brand,
  category: product.category,
  description: product.description,
  taxable: product.taxable,
  unit: product.unit,
  hasVariations: product.hasVariations,
});


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated product:', formData);
    onOpenChange(false);
  };

 const handleChange = <K extends keyof EditProductFormData>(
  field: K,
  value: EditProductFormData[K]
) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle className='text-gray-900'>Edit Product</DialogTitle>
          <DialogDescription className='text-gray-900'>
            Update product details. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                className='border border-gray-900'
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                className='border border-gray-900'
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                <SelectTrigger className='border border-gray-900 md:w-1/2 w-full text-gray-900'>
                  <SelectValue placeholder="Select category"  className='text-gray-900' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jackets">Jackets</SelectItem>
                  <SelectItem value="shirts">Shirts</SelectItem>
                  <SelectItem value="pants">Pants</SelectItem>
                  <SelectItem value="shoes">Shoes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                className='border border-gray-900'
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className='border border-gray-900'
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="taxable"
                checked={formData.taxable}
                onCheckedChange={(checked) => handleChange('taxable', Boolean(checked))}
              />
              <Label htmlFor="taxable" className="cursor-pointer">
                Product is taxable
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasVariations"
                checked={formData.hasVariations}
                onCheckedChange={(checked) => handleChange('hasVariations', Boolean(checked))}
              />
              <Label htmlFor="hasVariations" className="cursor-pointer">
                Product has variations
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}