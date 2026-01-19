import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

const lowStockItems = [
  { id: 1, name: "Premium Leather Jacket", current: 3, min: 5, status: "critical" },
  { id: 2, name: "Designer Denim Jeans", current: 8, min: 10, status: "warning" },
  { id: 3, name: "Silk Business Shirts", current: 4, min: 8, status: "critical" },
  { id: 4, name: "Formal Dress Shoes", current: 6, min: 10, status: "warning" },
  { id: 5, name: "Wool Blend Suits", current: 2, min: 5, status: "critical" },
];

export function StockAlertWidget() {
  return (
    <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-white">Stock Alert</CardTitle>
            <CardDescription className="text-gray-400">
              Low stock items requiring attention
            </CardDescription>
          </div>
          <div className="text-yellow-300">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {lowStockItems.map((item) => (
            <div
              key={item.id}
              className={`
                flex items-center justify-between p-3 rounded-lg border
                ${item.status === 'critical' 
                  ? 'bg-red-900/20 border-red-800/50' 
                  : 'bg-yellow-900/10 border-yellow-800/30'
                }
              `}
            >
              <div className="space-y-1">
                <div className="font-medium text-white">{item.name}</div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-gray-400">Current: </span>
                    <span className={item.status === 'critical' ? 'text-red-400 font-bold' : 'text-yellow-400'}>
                      {item.current} units
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Min: {item.min} units
                  </div>
                </div>
              </div>
              <div className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300">
                {item.status === 'critical' ? 'URGENT' : 'WARNING'}
              </div>
            </div>
          ))}
        </div>
        
        <Button asChild variant="outline" className="w-full mt-6 border-yellow-300/50 text-yellow-300 hover:bg-yellow-300/10">
          <Link href="/inventory" className="flex items-center justify-center gap-2">
            View All Inventory
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}