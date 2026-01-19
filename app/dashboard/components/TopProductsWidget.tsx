import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const topProducts = [
  { id: 1, name: "Executive Blazer", sold: 142, revenue: "$28,400", growth: "+24%" },
  { id: 2, name: "Luxury Wool Trousers", sold: 118, revenue: "$17,700", growth: "+18%" },
  { id: 3, name: "Premium Dress Shirt", sold: 96, revenue: "$14,400", growth: "+32%" },
  { id: 4, name: "Designer Leather Belt", sold: 85, revenue: "$8,500", growth: "+15%" },
  { id: 5, name: "Silk Pocket Square", sold: 73, revenue: "$3,650", growth: "+28%" },
];

export function TopProductsWidget() {
  return (
    <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-white">Best Performing</CardTitle>
            <CardDescription className="text-gray-400">
              Top 5 products by revenue
            </CardDescription>
          </div>
          <div className="text-yellow-300">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-300/10 text-yellow-300 font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-white">{product.name}</div>
                  <div className="text-sm text-gray-400">
                    {product.sold} units sold
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white">{product.revenue}</div>
                <div className="text-sm text-green-400 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {product.growth}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-800">
          <div className="text-sm text-gray-400">
            <span className="text-yellow-300">Note:</span> Data based on selected date range
          </div>
        </div>
      </CardContent>
    </Card>
  );
}