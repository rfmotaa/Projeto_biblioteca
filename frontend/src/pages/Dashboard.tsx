import { useEffect, useState } from 'react';
import { Book, Users, FileText, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { livrosApi, clientesApi, emprestimosApi } from '../services/api';
import type { Emprestimo } from '../services/types';
import { toast } from 'sonner';

interface DashboardStats {
  totalLivros: number;
  totalClientes: number;
  emprestimosAtivos: number;
  livrosDisponiveis: number;
  solicitacoesPendentes: number;
  emprestimosAtrasados: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLivros: 0,
    totalClientes: 0,
    emprestimosAtivos: 0,
    livrosDisponiveis: 0,
    solicitacoesPendentes: 0,
    emprestimosAtrasados: 0,
  });
  const [solicitacoesPendentes, setSolicitacoesPendentes] = useState<Emprestimo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [livros, clientes, emprestimos, pendentes] = await Promise.all([
          livrosApi.getAll(),
          clientesApi.getAll(),
          emprestimosApi.getAll(),
          emprestimosApi.getPendentes(),
        ]);

        const livrosDisponiveis = livros.filter((l) => l.qntDisponivel > 0).length;
        const emprestimosAtivos = emprestimos.filter((e) => e.status === 'ATIVO');
        const emprestimosAtrasados = emprestimosAtivos.filter((e) =>
          e.estaAtrasado || new Date(e.dataRetornoPrevisto) < new Date()
        ).length;

        setStats({
          totalLivros: livros.length,
          totalClientes: clientes.length,
          emprestimosAtivos: emprestimosAtivos.length,
          livrosDisponiveis,
          solicitacoesPendentes: pendentes.length,
          emprestimosAtrasados,
        });
        setSolicitacoesPendentes(pendentes);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleAprovar = async (id: number) => {
    try {
      await emprestimosApi.aprovarSolicitacao(id);
      toast.success('Solicitação aprovada com sucesso!');

      // Refresh data
      const [emprestimos, pendentes] = await Promise.all([
        emprestimosApi.getAll(),
        emprestimosApi.getPendentes(),
      ]);

      const emprestimosAtivos = emprestimos.filter((e) => e.status === 'ATIVO');
      const emprestimosAtrasados = emprestimosAtivos.filter((e) =>
        e.estaAtrasado || new Date(e.dataRetornoPrevisto) < new Date()
      ).length;

      setStats((prev) => ({
        ...prev,
        emprestimosAtivos: emprestimosAtivos.length,
        solicitacoesPendentes: pendentes.length,
        emprestimosAtrasados,
      }));
      setSolicitacoesPendentes(pendentes);
    } catch (error: any) {
      console.error('Erro ao aprovar solicitação:', error);
      const errorMessage = error?.response?.data || 'Erro ao aprovar solicitação';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Erro ao aprovar solicitação');
    }
  };

  const handleRejeitar = async (id: number) => {
    if (!confirm('Tem certeza que deseja rejeitar esta solicitação?')) return;

    try {
      await emprestimosApi.rejeitarSolicitacao(id);
      toast.success('Solicitação rejeitada com sucesso!');

      // Refresh pending solicitacoes
      const pendentes = await emprestimosApi.getPendentes();
      setStats((prev) => ({ ...prev, solicitacoesPendentes: pendentes.length }));
      setSolicitacoesPendentes(pendentes);
    } catch (error: any) {
      console.error('Erro ao rejeitar solicitação:', error);
      const errorMessage = error?.response?.data || 'Erro ao rejeitar solicitação';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Erro ao rejeitar solicitação');
    }
  };

  const statCards = [
    {
      title: 'Solicitações Pendentes',
      value: stats.solicitacoesPendentes,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      highlight: stats.solicitacoesPendentes > 0,
    },
    {
      title: 'Total de Livros',
      value: stats.totalLivros,
      icon: Book,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Clientes Cadastrados',
      value: stats.totalClientes,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Empréstimos Ativos',
      value: stats.emprestimosAtivos,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Empréstimos Atrasados',
      value: stats.emprestimosAtrasados,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      highlight: stats.emprestimosAtrasados > 0,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral do sistema de biblioteca</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className={stat.highlight ? 'ring-2 ring-yellow-400' : ''}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pending Requests Section */}
      {solicitacoesPendentes.length > 0 && (
        <Card className="mb-8 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800">
              <Clock className="h-5 w-5 mr-2" />
              Solicitações de Empréstimo Pendentes ({solicitacoesPendentes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {solicitacoesPendentes.map((solicitacao) => (
                <div
                  key={solicitacao.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-yellow-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {solicitacao.livro.titulo}
                        </p>
                        <p className="text-sm text-gray-500">
                          Solicitado por: <span className="font-medium">{solicitacao.cliente.nome}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Email: {solicitacao.cliente.email}
                        </p>
                        <p className="text-sm text-gray-500">
                          Data da solicitação: {new Date(solicitacao.dataRetirada).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        Pendente
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => handleAprovar(solicitacao.id)}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Aprovar
                    </Button>
                    <Button
                      onClick={() => handleRejeitar(solicitacao.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Rejeitar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Pending Requests Message */}
      {solicitacoesPendentes.length === 0 && stats.solicitacoesPendentes === 0 && (
        <Card className="mb-8 bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <p className="text-green-800 font-medium">
                Nenhuma solicitação de empréstimo pendente no momento
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo ao Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Este é o sistema de gerenciamento de biblioteca. Use o menu lateral para navegar
              entre as diferentes funcionalidades.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>• Gerencie o acervo de livros na seção Livros</li>
              <li>• Cadastre e visualize clientes na seção Clientes</li>
              <li>• Aprove ou rejeite solicitações de empréstimo</li>
              <li>• Gerencie empréstimos na seção Empréstimos</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Taxa de Ocupação</span>
                <span className="text-sm font-semibold">
                  {stats.totalLivros > 0
                    ? Math.round(((stats.totalLivros - stats.livrosDisponiveis) / stats.totalLivros) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${
                      stats.totalLivros > 0
                        ? Math.round(((stats.totalLivros - stats.livrosDisponiveis) / stats.totalLivros) * 100)
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Livros Disponíveis</span>
                <span className="text-sm font-semibold">{stats.livrosDisponiveis}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Média de Empréstimos por Cliente</span>
                <span className="text-sm font-semibold">
                  {stats.totalClientes > 0 ? (stats.emprestimosAtivos / stats.totalClientes).toFixed(1) : 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
