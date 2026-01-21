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
import { ProductVariant } from '@/app/utils/type';

interface EditVariantModalProps {
  variant: ProductVariant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditVariantModal({ variant, open, onOpenChange }: EditVariantModalProps) {
  const [formData, setFormData] = useState({
    sku: variant.sku,
    threshold: variant.threshold,
    costPrice: variant.costPrice,
    sellingPrice: variant.sellingPrice,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated variant:', formData);
    onOpenChange(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle>Edit Variant</DialogTitle>
          <DialogDescription>
            Update variant details for {variant.name}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sku">SKU *</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => handleChange('sku', e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price</Label>
              <Input
                id="costPrice"
                type="number"
                value={formData.costPrice}
                onChange={(e) => handleChange('costPrice', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Selling Price</Label>
              <Input
                id="sellingPrice"
                type="number"
                value={formData.sellingPrice}
                onChange={(e) => handleChange('sellingPrice', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="threshold">Low Stock Threshold</Label>
            <Input
              id="threshold"
              type="number"
              value={formData.threshold}
              onChange={(e) => handleChange('threshold', e.target.value)}
            />
            <p className="text-sm text-gray-500">
              System will alert when stock falls below this number
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-black hover:bg-gray-800 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}