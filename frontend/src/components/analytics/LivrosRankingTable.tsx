import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface RankingItem {
  id: number;
  titulo: string;
  qtdEmprestimos: number;
}

interface LivrosRankingTableProps {
  title: string;
  icon: LucideIcon;
  items: RankingItem[];
  maxItems?: number;
}

export function LivrosRankingTable({
  title,
  icon: Icon,
  items,
  maxItems = 10,
}: LivrosRankingTableProps) {
  const displayItems = items.slice(0, maxItems);

  const getRankingBadgeColor = (index: number) => {
    if (index === 0) return 'bg-yellow-500 text-white';
    if (index === 1) return 'bg-gray-400 text-white';
    if (index === 2) return 'bg-orange-600 text-white';
    return 'bg-gray-100 text-gray-700';
  };

  const getRankingBadgeVariant = (index: number) => {
    return index < 3 ? 'default' : 'secondary';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className="h-5 w-5 mr-2" />
          {title} ({displayItems.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Icon className="h-12 w-12 mb-2 opacity-50" />
            <p>Nenhum dado disponível</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {displayItems.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <Badge
                      variant={getRankingBadgeVariant(index)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${getRankingBadgeColor(
                        index
                      )}`}
                    >
                      {index + 1}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{item.titulo}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="ml-4 text-sm font-semibold whitespace-nowrap">
                  {item.qtdEmprestimos} empréstimos
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Loading Skeleton
export function LivrosRankingTableSkeleton({ items = 5 }: { items?: number }) {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: items }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
