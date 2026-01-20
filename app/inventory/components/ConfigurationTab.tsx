'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Tag, Folder } from "lucide-react";

export function ConfigureTab() {
  const [activeSubTab, setActiveSubTab] = useState("attributes");

    const [attrValues, setAttrValues] = useState<string[]>(["Red", "Blue", "Green"]);

const updateValue = (index: number, newValue: string) => {
  setAttrValues(prev => prev.map((v, i) => (i === index ? newValue : v)));
};

const removeValue = (index: number) => {
  setAttrValues(prev => prev.filter((_, i) => i !== index));
};

const addValue = (value: string) => {
  setAttrValues(prev => [...prev, value]);
};

  const attributes = [
    { id: 1, name: "Color", values: ["Red", "Blue", "Black", "White"], products: 42 },
    { id: 2, name: "Size", values: ["S", "M", "L", "XL"], products: 124 },
    { id: 3, name: "Material", values: ["Cotton", "Polyester", "Silk"], products: 38 },
  ];

  const categories = [
    { id: 1, name: "Jackets", products: 86, subcategories: ["Leather", "Denim", "Bomber"] },
    { id: 2, name: "Shirts", products: 154, subcategories: ["Formal", "Casual", "Polo"] },
    { id: 3, name: "Pants", products: 92, subcategories: ["Jeans", "Chinos", "Slacks"] },
    { id: 4, name: "Shoes", products: 68, subcategories: ["Formal", "Sneakers", "Boots"] },
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-900">
          <TabsTrigger value="attributes" className="data-[state=active]:bg-black data-[state=active]:text-white">
            <Tag className="h-4 w-4 mr-2" />
            Attributes
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-black data-[state=active]:text-white">
            <Folder className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>
        </TabsList>

       
        <TabsContent  value="attributes">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
            <Card className='bg-gray-900'>
              <CardHeader>
                <CardTitle>Create Attribute</CardTitle>
                <CardDescription>
                  Add new product attributes and values
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className='flex flex-col gap-2'>
                  <Label htmlFor="attrName">Attribute Name</Label>
                  <Input id="attrName" placeholder="e.g., Color, Size, Material" />
                </div>
                
                <div className='flex flex-col gap-2'>
                  <Label>Values</Label>
                 <div className="space-y-2">
  {attrValues.map((value, index) => (
    <div key={index} className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => updateValue(index, e.target.value)}
        placeholder="Value"
      />
      <Button variant="ghost" size="icon" onClick={() => removeValue(index)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  ))}

  <Button
    variant="outline"
    size="sm"
    className="w-full"
    onClick={() => addValue("New Value")}
  >
    <Plus className="h-4 w-4 mr-2" />
    Add Value
  </Button>
</div>

                </div>
                
                <Button className="w-full bg-gray-900 hover:bg-gray-800 border-white border text-white">
                  Create Attribute
                </Button>
              </CardContent>
            </Card>

         
            <Card className="lg:col-span-2 bg-gray-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Attributes</CardTitle>
                    <CardDescription>
                      Manage product attributes and their values
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Attribute</TableHead>
                      <TableHead>Values</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attributes.map((attr) => (
                      <TableRow key={attr.id}>
                        <TableCell className="font-medium">{attr.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {attr.values.map((value, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {value}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{attr.products} products</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

       
        <TabsContent value="categories">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
            <Card className='bg-gray-900'>
              <CardHeader>
                <CardTitle>Create Category</CardTitle>
                <CardDescription>
                  Add new product categories
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className='flex flex-col gap-2'>
                  <Label htmlFor="catName">Category Name</Label>
                  <Input id="catName" placeholder="e.g., Jackets, Shoes" />
                </div>
                
                <div>
                </div>
                
                <Button className="w-full bg-gray-900 border border-white hover:bg-gray-800 text-white">
                  Create Category
                </Button>
              </CardContent>
            </Card>

        
            <Card className="lg:col-span-2 bg-gray-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Categories</CardTitle>
                    <CardDescription>
                      Manage product categories and hierarchy
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((cat) => (
                      <TableRow key={cat.id}>
                        <TableCell className="font-medium">{cat.name}</TableCell>
                      
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}