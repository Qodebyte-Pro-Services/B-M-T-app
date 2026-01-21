'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockMovementTabProps {
  productId: string;
}

export function StockMovementTab({ productId }: StockMovementTabProps) {
  const movements = [
    {
      id: 1,
      date: "2024-01-20 10:30 AM",
      variant: "Red - XL",
      type: "Sale",
      quantity: -2,
      performedBy: "John Doe",
      status: "decreased"
    },
    {
      id: 2,
      date: "2024-01-19 02:15 PM",
      variant: "Black - L",
      type: "Restock",
      quantity: +50,
      performedBy: "Jane Smith",
      status: "increased"
    },
    {
      id: 3,
      date: "2024-01-18 11:45 AM",
      variant: "Red - XL",
      type: "Adjustment",
      quantity: -5,
      performedBy: "System Admin",
      status: "decreased"
    },

    {
      id: 4,
      date: "2024-01-17 09:30 AM",
      variant: "Black - L",
      type: "Sale",
      quantity: +3,
      performedBy: "Emily Clark",
    
      status: "decreased"
    },

    {
      id: 5,
      date: "2024-01-16 04:20 PM",
      variant: "Red - XL",
      type: "Adjustment",
      quantity: +5,
      performedBy: "System Admin",
      status: "increased"
    }
  
  ];

const getStatusBadge = (status: string) => {
  const isDecreased = status.toLowerCase() === "decreased";
  const isIncreased = status.toLowerCase() === "increased";

  return (
    <Badge
      variant="default"
      className={cn(
        "font-medium",
        isDecreased ? "bg-red-100 text-red-800 hover:bg-red-100" : "",
        isIncreased ? "bg-green-100 text-green-800 hover:bg-green-100" : ""
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};


  type MovementType =
  | "Sale"
  | "Restock"
  | "Adjustment"
  | "Return"
  | "Damage";


  const typeVariantMap: Record<
  MovementType,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Sale: "destructive",
  Restock: "default",
  Adjustment: "secondary",
  Return: "default",
  Damage: "outline",
};


 const getTypeBadge = (type: MovementType) => {
  return <Badge variant={typeVariantMap[type]}>{type}</Badge>;
};


  return (
    <Card className="bg-white text-gray-900 border border-gray-100 shadow-xl">
      <CardHeader>
        <CardTitle>Stock Movement History</CardTitle>
        <CardDescription>
          All stock transactions for this product
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-gray-900">Date & Time</TableHead>
                <TableHead className="bg-gray-900">Variant</TableHead>
                <TableHead className="bg-gray-900">Type</TableHead>
                <TableHead className="bg-gray-900">Quantity</TableHead>
                <TableHead className="bg-gray-900">Performed By</TableHead>
                <TableHead className="bg-gray-900">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell className="font-medium">{movement.date}</TableCell>
                  <TableCell>{movement.variant}</TableCell>
                  <TableCell>{getTypeBadge(movement.type as MovementType)}</TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-1 ${
                      movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {movement.quantity > 0 ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                      <span className="font-medium">
                        {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      {movement.performedBy}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(movement.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <div>Showing 4 of 124 movements</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded bg-gray-900 text-white hover:bg-gray-800">Previous</button>
            <button className="px-3 py-1 border rounded bg-gray-900 text-white hover:bg-gray-800">Next</button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}