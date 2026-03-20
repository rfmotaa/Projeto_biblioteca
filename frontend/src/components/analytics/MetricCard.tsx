import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: string;
  bgColor?: string;
  highlight?: boolean;
  subtitle?: string;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  color = 'text-blue-600',
  bgColor = 'bg-blue-100',
  highlight = false,
  subtitle,
}: MetricCardProps) {
  return (
    <Card className={highlight ? 'ring-2 ring-yellow-400' : ''}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
      </CardContent>
    </Card>
  );
}

// Loading Skeleton
export function MetricCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="p-2 bg-gray-200 rounded-lg">
          <div className="h-5 w-5 bg-gray-300 rounded"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      </CardContent>
    </Card>
  );
}
