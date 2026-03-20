import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface StatusItem {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

interface StatusDistributionCardProps {
  title: string;
  icon: LucideIcon;
  statuses: StatusItem[];
}

export function StatusDistributionCard({ title, icon: Icon, statuses }: StatusDistributionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statuses.map((status) => {
            const StatusIcon = status.icon;
            return (
              <div
                key={status.label}
                className={`flex items-center space-x-4 p-4 rounded-lg border ${status.bgColor} ${status.borderColor}`}
              >
                <div className={`p-3 rounded-full ${status.bgColor}`}>
                  <StatusIcon className={`h-6 w-6 ${status.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{status.label}</p>
                  <p className={`text-2xl font-bold ${status.textColor}`}>{status.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Loading Skeleton
export function StatusDistributionCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg border">
              <div className="p-3 bg-gray-200 rounded-full">
                <div className="h-6 w-6 bg-gray-300 rounded"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
