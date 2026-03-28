import { Bell, AlertCircle, BookOpen, X } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { Notificacao } from '../services/types';

interface NotificacaoCardProps {
  notificacao: Notificacao;
  onMarcarLida: (id: number) => void;
}

export default function NotificacaoCard({ notificacao, onMarcarLida }: NotificacaoCardProps) {
  const getIcon = () => {
    switch (notificacao.tipoNotificacao) {
      case 'VENCIMENTO_PROXIMO':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'LIVRO_DISPONIVEL':
        return <BookOpen className="h-5 w-5 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 text-blue-600" />;
    }
  };

  const getBadgeVariant = () => {
    switch (notificacao.tipoNotificacao) {
      case 'VENCIMENTO_PROXIMO':
        return 'destructive' as const;
      case 'LIVRO_DISPONIVEL':
        return 'default' as const;
      default:
        return 'secondary' as const;
    }
  };

  const getTipoLabel = () => {
    switch (notificacao.tipoNotificacao) {
      case 'VENCIMENTO_PROXIMO':
        return 'Vencimento Próximo';
      case 'LIVRO_DISPONIVEL':
        return 'Livro Disponível';
      default:
        return 'Notificação';
    }
  };

  const formatarData = (data: string) => {
    const date = new Date(data);
    const agora = new Date();
    const diffMs = agora.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-1">{getIcon()}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={getBadgeVariant()} className="text-xs">
                  {getTipoLabel()}
                </Badge>
                <span className="text-xs text-gray-500">
                  {formatarData(notificacao.dataCriacao)}
                </span>
              </div>
              <p className="text-gray-900 font-medium">{notificacao.mensagem}</p>
              {notificacao.livro && (
                <p className="text-sm text-gray-600 mt-1">
                  Livro: <span className="font-semibold">{notificacao.livro.titulo}</span>
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarcarLida(notificacao.id)}
            className="h-8 w-8 p-0 hover:bg-gray-100"
            title="Marcar como lida"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
