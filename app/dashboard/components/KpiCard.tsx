import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  description?: string;
}

export function KpiCard({ title, value, change, changeType, icon, description }: KpiCardProps) {
  return (
    <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800 hover:border-yellow-300/30 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">
          {title}
        </CardTitle>
        <div className="text-yellow-300">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className={cn(
            "text-xs font-medium",
            changeType === 'positive' && "text-green-400",
            changeType === 'negative' && "text-red-400",
            changeType === 'neutral' && "text-gray-400"
          )}>
            {change}
          </span>
          {description && (
            <span className="text-xs text-gray-500">{description}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}