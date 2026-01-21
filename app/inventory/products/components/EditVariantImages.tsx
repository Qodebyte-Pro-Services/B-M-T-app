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
import { Plus, X } from "lucide-react";
import { ProductVariant } from '@/app/utils/type';
import Image from 'next/image';

interface EditVariantImagesModalProps {
  variant: ProductVariant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditVariantImagesModal({ variant, open, onOpenChange }: EditVariantImagesModalProps) {
  const [images, setImages] = useState<string[]>(variant.images);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    console.log('Updated variant images:', images);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle>Edit Variant Images</DialogTitle>
          <DialogDescription>
            Manage images for {variant.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Label>Current Images</Label>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <Image width={100} height={100} src={image} alt={`Variant ${index + 1}`} className="w-full h-full object-cover" />
                </div>
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
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
                onChange={handleImageUpload}
              />
              <div className="aspect-square rounded-lg border-2 border-dashed px-6 py-2 border-gray-300 hover:border-gray-400 flex flex-col items-center justify-center transition-colors">
                <Plus className="h-6 w-6 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Add Images</span>
              </div>
            </label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-black hover:bg-gray-800 text-white">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}