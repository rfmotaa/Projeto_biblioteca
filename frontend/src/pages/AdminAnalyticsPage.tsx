import { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  BookOpen,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { dashboardAnalyticsApi } from '../services/api';
import type {
  DashboardAnalytics,
  EmprestimosPorSemana,
  LivroMaisEmprestado,
} from '../services/types';
import { toast } from 'sonner';

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardAnalyticsApi.getDashboardAnalytics(12, 10);

      // Edge case: Verificar se dados vieram vazios ou nulos
      if (!data) {
        throw new Error('Dados não recebidos do servidor');
      }

      // Edge case: Validar estrutura dos dados
      if (!data.emprestimosStatus || !data.percentualLivros) {
        console.warn('Estrutura de dados incompleta, usando valores padrão');
      }

      setAnalytics(data);
    } catch (err: any) {
      console.error('Erro ao carregar analytics:', err);
      const errorMessage =
        err?.response?.data?.message || err?.message || 'Erro ao carregar dados do dashboard';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleRefresh = () => {
    fetchAnalytics();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard de Analytics</h1>
            <p className="text-gray-600 mt-2">Análise detalhada dos dados da biblioteca</p>
          </div>
        </div>

        {/* Loading Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard de Analytics</h1>
            <p className="text-gray-600 mt-2">Análise detalhada dos dados da biblioteca</p>
          </div>
        </div>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <p className="text-red-800 font-medium">Erro ao carregar dados</p>
                <p className="text-red-600 text-sm mt-1">{error || 'Erro desconhecido'}</p>
                <Button onClick={handleRefresh} variant="outline" className="mt-4">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Analytics</h1>
          <p className="text-gray-600 mt-2">Análise detalhada dos dados da biblioteca</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Status Cards - Empréstimos por Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Status dos Empréstimos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Solicitados</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {analytics.emprestimosStatus.solicitados}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Negados</p>
                <p className="text-2xl font-bold text-red-700">
                  {analytics.emprestimosStatus.negados}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Aprovados</p>
                <p className="text-2xl font-bold text-green-700">
                  {analytics.emprestimosStatus.aprovados}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Percentual de Livros Disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Percentual de Livros Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Livros Disponíveis</span>
              <span className="text-lg font-semibold text-gray-900">
                {analytics.percentualLivros.livrosDisponiveis} / {analytics.percentualLivros.livrosTotais}
              </span>
            </div>

            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    {analytics.percentualLivros.percentual.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-blue-100">
                <div
                  style={{ width: `${analytics.percentualLivros.percentual}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total do Acervo</span>
              <span className="font-semibold">{analytics.percentualLivros.livrosTotais} livros</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Empréstimos por Semana */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Empréstimos por Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.emprestimosPorSemana.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <TrendingUp className="h-12 w-12 mb-2 opacity-50" />
                <p>Nenhum dado de empréstimo disponível</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {analytics.emprestimosPorSemana.map((item: EmprestimosPorSemana) => (
                  <div
                    key={`${item.ano}-${item.semana}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        Semana {item.semana} - {item.ano}
                      </p>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              (item.quantidade /
                                Math.max(
                                  ...analytics.emprestimosPorSemana.map((e) => e.quantidade)
                                )) *
                                100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="ml-4 text-lg font-semibold">
                      {item.quantidade}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Livros Mais Emprestados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Top {analytics.livrosMaisEmprestados.length} Livros Mais Emprestados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.livrosMaisEmprestados.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <BookOpen className="h-12 w-12 mb-2 opacity-50" />
                <p>Nenhum dado de empréstimo disponível</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {analytics.livrosMaisEmprestados.map((livro: LivroMaisEmprestado, index: number) => (
                  <div
                    key={livro.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <Badge
                          variant={index < 3 ? 'default' : 'secondary'}
                          className={`w-8 h-8 flex items-center justify-center rounded-full ${
                            index === 0
                              ? 'bg-yellow-500 text-white'
                              : index === 1
                              ? 'bg-gray-400 text-white'
                              : index === 2
                              ? 'bg-orange-600 text-white'
                              : ''
                          }`}
                        >
                          {index + 1}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{livro.titulo}</p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="ml-4 text-sm font-semibold whitespace-nowrap"
                    >
                      {livro.qtdEmprestimos} empréstimos
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
