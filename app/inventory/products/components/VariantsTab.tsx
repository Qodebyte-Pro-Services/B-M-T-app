'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MoreVertical, ImageIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditVariantModal } from './EditVariantModal';
import { EditVariantImagesModal } from './EditVariantImages';
import { ProductVariant } from '@/app/utils/type';


interface VariantsTabProps {
  variants: ProductVariant[];
  productId: string;
}

export function VariantsTab({ variants, productId }: VariantsTabProps) {
 const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImagesModal, setShowImagesModal] = useState(false);

const getStockStatus = (quantity: number, threshold: number) => {
  if (quantity === 0) {
    return { status: "Out of Stock", color: "destructive" } as const;
  }

  if (quantity <= threshold) {
    return { status: "Low Stock", color: "secondary" } as const;
  }

  return { status: "In Stock", color: "default" } as const;
};



  const handleEdit = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setShowEditModal(true);
  };

  const handleEditImages = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setShowImagesModal(true);
  };

const [openRowId, setOpenRowId] = useState<string | number | null>(null);




  return (
    <>
      <Card className="bg-white text-gray-900 border border-gray-100 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Variants</CardTitle>
              <CardDescription>
                Manage all variations of this product
              </CardDescription>
            </div>

          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='bg-gray-900'>SKU</TableHead>
                  <TableHead className='bg-gray-900'>Attributes</TableHead>
                  <TableHead className='bg-gray-900'>Quantity</TableHead>
                  <TableHead className='bg-gray-900'>Threshold</TableHead>
                  <TableHead className='bg-gray-900'>Cost Price</TableHead>
                  <TableHead className='bg-gray-900'>Selling Price</TableHead>
                  <TableHead className='bg-gray-900'>Status</TableHead>
                  <TableHead className="text-right bg-gray-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
  {variants.map((variant) => {
    const status = getStockStatus(variant.quantity, variant.threshold);
    const isOpen = openRowId === variant.id;

    return (
      <TableRow
        key={variant.id}
        className="cursor-pointer"
        onClick={() => setOpenRowId(variant.id === openRowId ? null : variant.id)}
      >
        <TableCell className="font-medium">{variant.sku}</TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-1">
            {Object.entries(variant.attributes).map(([key, value]) => (
              <Badge key={key} className="text-xs">
                {key}: {value as string}
              </Badge>
            ))}
          </div>
        </TableCell>
        <TableCell className="font-bold">{variant.quantity}</TableCell>
        <TableCell>{variant.threshold}</TableCell>
        <TableCell>NGN {variant.costPrice}</TableCell>
        <TableCell>NGN {variant.sellingPrice}</TableCell>
        <TableCell>
          <Badge variant={status.color}>{status.status}</Badge>
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu open={isOpen} onOpenChange={(open) => setOpenRowId(open ? variant.id : null)}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(variant)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Variant
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditImages(variant)}>
                <ImageIcon className="h-4 w-4 mr-2" />
                Edit Images
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Variant
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  })}
</TableBody>

            </Table>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Total Variants</div>
              <div className="text-2xl font-bold">{variants.length}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Total Stock Value</div>
              <div className="text-2xl font-bold">
                NGN {variants.reduce((sum, v) => sum + (v.quantity * v.costPrice), 0).toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Potential Revenue</div>
              <div className="text-2xl font-bold">
                NGN {variants.reduce((sum, v) => sum + (v.quantity * v.sellingPrice), 0).toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

     
      {selectedVariant && (
        <EditVariantModal
          variant={selectedVariant}
          open={showEditModal}
          onOpenChange={setShowEditModal}
        />
      )}

      
      {selectedVariant && (
        <EditVariantImagesModal
          variant={selectedVariant}
          open={showImagesModal}
          onOpenChange={setShowImagesModal}
        />
      )}
    </>
  );
}