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
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {  Plus, X } from "lucide-react";
import Image from 'next/image';
import { Product, ProductVariant } from '@/app/utils/type';

interface EditImagesModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditImagesModal({ product, open, onOpenChange }: EditImagesModalProps) {
  const [productImages, setProductImages] = useState<string[]>(product.images);
 const [variantImages, setVariantImages] = useState<Record<string, string[]>>(
  product.variants.reduce<Record<string, string[]>>((acc, variant) => {
    acc[String(variant.id)] = variant.images;
    return acc;
  }, {})
);

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setProductImages(prev => [...prev, ...newImages]);
    }
  };

  const handleVariantImageUpload = (variantId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setVariantImages(prev => ({
        ...prev,
        [variantId]: [...(prev[variantId] || []), ...newImages]
      }));
    }
  };

  const removeProductImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVariantImage = (variantId: string, index: number) => {
    setVariantImages(prev => ({
      ...prev,
      [variantId]: prev[variantId]?.filter((_, i) => i !== index) ?? []
    }));
  };

  const handleSubmit = () => {
   
    console.log('Updated product images:', productImages);
    console.log('Updated variant images:', variantImages);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-white max-h-[90vh] text-gray-900  overflow-y-auto">
        <DialogHeader>
          <DialogTitle className='text-gray-900'>Manage Images</DialogTitle>
          <DialogDescription className='text-gray-900'>
            Add or remove images for the product and its variants
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="product" className="w-full">
          <TabsList className="grid grid-cols-2 w-full bg-gray-900">
            <TabsTrigger value="product">Product Images</TabsTrigger>
            <TabsTrigger value="variants">Variant Images</TabsTrigger>
          </TabsList>
          
          <TabsContent value="product" className="space-y-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {productImages.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image src={image} alt={`Product ${index + 1}`} width={100} height={100} className="w-full h-full object-cover" />
                  </div>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeProductImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleProductImageUpload}
                />
                <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 flex flex-col items-center justify-center transition-colors">
                  <Plus className="h-6 w-6 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Add Images</span>
                </div>
              </label>
            </div>
          </TabsContent>
          
          <TabsContent value="variants" className="space-y-6">
            {product.variants.map((variant: ProductVariant) => (
              <div key={variant.id} className="space-y-3">
                <Label>{variant.name}</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {(variantImages[variant.id] || []).map((image: string, index: number) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <Image src={image} alt={`Variant ${index + 1}`} width={100} height={100} className="w-full h-full object-cover" />
                      </div>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeVariantImage(String(variant.id), index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleVariantImageUpload(String(variant.id), e)}
                    />
                    <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 flex flex-col items-center justify-center transition-colors">
                      <Plus className="h-6 w-6 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">Add</span>
                    </div>
                  </label>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button  onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-gray-900 hover:bg-gray-800 text-white">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}