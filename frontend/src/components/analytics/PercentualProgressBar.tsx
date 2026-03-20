import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface PercentualProgressBarProps {
  title: string;
  icon: LucideIcon;
  value: number; // valor atual
  total: number; // valor total
  suffix?: string; // sufixo para exibir (ex: "%", " livros")
  showPercentage?: boolean; // se deve mostrar o percentual
  color?: string; // cor da barra (default: blue-600)
  bgColor?: string; // cor de fundo da barra (default: blue-100)
  size?: 'sm' | 'md' | 'lg'; // tamanho da barra
}

export function PercentualProgressBar({
  title,
  icon: Icon,
  value,
  total,
  suffix = '',
  showPercentage = true,
  color = 'bg-blue-600',
  bgColor = 'bg-blue-100',
  size = 'md',
}: PercentualProgressBarProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const percentageRounded = Math.round(percentage * 10) / 10;

  const getHeight = () => {
    switch (size) {
      case 'sm':
        return 'h-2';
      case 'lg':
        return 'h-6';
      default:
        return 'h-4';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Valor atual / Total */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Disponível</span>
            <span className="text-lg font-semibold text-gray-900">
              {value} / {total}
              {suffix}
            </span>
          </div>

          {/* Barra de progresso */}
          <div className="relative pt-1">
            <div className="flex items-center justify-between mb-2">
              {showPercentage && (
                <div>
                  <span
                    className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${color} ${bgColor}`}
                  >
                    {percentageRounded.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
            <div className={`overflow-hidden ${getHeight()} mb-4 text-xs flex rounded ${bgColor}`}>
              <div
                style={{ width: `${Math.min(percentage, 100)}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${color} transition-all duration-500`}
              ></div>
            </div>
          </div>

          {/* Texto adicional */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total do Acervo</span>
            <span className="font-semibold">
              {total}
              {suffix}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading Skeleton
export function PercentualProgressBarSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded-full w-full"></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
