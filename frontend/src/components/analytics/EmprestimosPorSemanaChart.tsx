import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface SemanaItem {
  semana: number;
  ano: number;
  quantidade: number;
}

interface EmprestimosPorSemanaChartProps {
  title: string;
  icon: LucideIcon;
  data: SemanaItem[];
  maxItems?: number;
}

export function EmprestimosPorSemanaChart({
  title,
  icon: Icon,
  data,
  maxItems,
}: EmprestimosPorSemanaChartProps) {
  const displayData = maxItems ? data.slice(0, maxItems) : data;

  if (displayData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon className="h-5 w-5 mr-2" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Icon className="h-12 w-12 mb-2 opacity-50" />
            <p>Nenhum dado disponível</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...displayData.map((item) => item.quantidade));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {displayData.map((item) => {
            const percentage = maxValue > 0 ? (item.quantidade / maxValue) * 100 : 0;

            return (
              <div
                key={`${item.ano}-${item.semana}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">
                    Semana {item.semana} - {item.ano}
                  </p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <Badge variant="secondary" className="ml-4 text-lg font-semibold">
                  {item.quantidade}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Loading Skeleton
export function EmprestimosPorSemanaChartSkeleton({ items = 5 }: { items?: number }) {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: items }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded-full w-full"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-12 ml-4"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
