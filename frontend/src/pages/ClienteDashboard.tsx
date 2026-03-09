import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { Book, Clock, LogOut, CheckCircle, Library } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { livrosApi, emprestimosApi } from '../services/api';
import type { Livro, Emprestimo } from '../services/types';
import { toast } from 'sonner';

export default function ClienteDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [livrosDisponiveis, setLivrosDisponiveis] = useState<Livro[]>([]);
  const [meusEmprestimos, setMeusEmprestimos] = useState<Emprestimo[]>([]);
  const [solicitacoesPendentes, setSolicitacoesPendentes] = useState<Emprestimo[]>([]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const fetchData = async () => {
    try {
      const [livros, emprestimos] = await Promise.all([
        livrosApi.getDisponiveis(),
        emprestimosApi.getAll(),
      ]);

      setLivrosDisponiveis(livros);

      // Filter emprestimos for this user
      const userEmprestimos = emprestimos.filter(
        (e) => e.cliente.email === user?.email
      );
      setMeusEmprestimos(userEmprestimos);

      // Filter pending solicitacoes
      const pendentes = userEmprestimos.filter(
        (e) => e.status === 'PENDENTE'
      );
      setSolicitacoesPendentes(pendentes);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      // Check if user is blocked
      if (user.status === 'bloqueado') {
        toast.error('Sua conta está bloqueada. Entre em contato com a administração.');
        return;
      }
      fetchData();
    }
  }, [user]);

  const handleSolicitarEmprestimo = async (livroId: number) => {
    if (!user?.id || user.id === 0) {
      toast.error('Erro ao identificar usuário. Por favor, faça logout e login novamente.');
      return;
    }

    try {
      await emprestimosApi.criarSolicitacao(user.id, livroId);
      toast.success('Solicitação de empréstimo enviada com sucesso!');
      fetchData();
    } catch (error: any) {
      console.error('Erro ao solicitar empréstimo:', error);
      const errorMessage = error?.response?.data || 'Erro ao solicitar empréstimo';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Erro ao solicitar empréstimo');
    }
  };

  const getStatusBadge = (emprestimo: Emprestimo) => {
    switch (emprestimo.status) {
      case 'PENDENTE':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case 'APROVADO':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Aprovado</Badge>;
      case 'REJEITADO':
        return <Badge variant="destructive">Rejeitado</Badge>;
      case 'ATIVO':
        return <Badge variant="default" className="bg-green-600">Ativo</Badge>;
      case 'FINALIZADO':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Finalizado</Badge>;
      default:
        if (emprestimo.dataRetornoOficial) {
          return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Devolvido</Badge>;
        }
        return <Badge variant="default">Ativo</Badge>;
    }
  };

  const emprestimosAtivos = meusEmprestimos.filter(
    (e) => e.status === 'ATIVO'
  ).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Book className="h-8 w-8 text-green-600" />
              <span className="ml-2 font-semibold text-xl text-gray-900">
                Biblioteca - Área do Cliente
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Olá, {user?.nome}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bem-vindo</h1>
          <p className="text-gray-600 mt-2">Acompanhe seus empréstimos e descubra novos livros</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Empréstimos Ativos
              </CardTitle>
              <Book className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{emprestimosAtivos}</div>
              <p className="text-xs text-gray-500 mt-1">
                {emprestimosAtivos === 0 ? 'Nenhum empréstimo ativo' : 'Livros em seu poder'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Solicitações Pendentes
              </CardTitle>
              <Clock className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{solicitacoesPendentes.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                {solicitacoesPendentes.length === 0
                  ? 'Nenhuma solicitação pendente'
                  : 'Aguardando aprovação'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Status da Conta
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${user?.status === 'bloqueado' ? 'text-red-600' : 'text-green-600'}`}>
                {user?.status === 'bloqueado' ? 'Bloqueado' : 'Ativo'}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {user?.status === 'bloqueado' ? 'Sua conta está bloqueada' : 'Sua conta está ativa'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Solicitações Pendentes */}
        {solicitacoesPendentes.length > 0 && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-800">
                <Clock className="h-5 w-5 mr-2" />
                Solicitações Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {solicitacoesPendentes.map((solicitacao) => (
                  <div
                    key={solicitacao.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{solicitacao.livro.titulo}</p>
                      <p className="text-sm text-gray-500">
                        Solicitado em {new Date(solicitacao.dataRetirada).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      Aguardando aprovação
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Livros Disponíveis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Library className="h-5 w-5 mr-2" />
              Livros Disponíveis para Empréstimo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {livrosDisponiveis.map((livro) => (
                <Card key={livro.id} className="border-2 hover:border-green-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex flex-col h-full">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{livro.titulo}</h3>
                      <p className="text-sm text-gray-500 mb-4">Ano: {livro.anoPublicacao}</p>

                      <div className="mt-auto space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Disponíveis:</span>
                          <Badge variant={livro.qntDisponivel > 2 ? 'default' : 'outline'}>
                            {livro.qntDisponivel} / {livro.qntTotal}
                          </Badge>
                        </div>

                        {/* Check if user already has a pending or active loan for this book */}
                        {meusEmprestimos.some(
                          (e) =>
                            e.livro.id === livro.id &&
                            (e.status === 'PENDENTE' || e.status === 'ATIVO' || e.status === 'APROVADO')
                        ) ? (
                          <Button
                            variant="outline"
                            className="w-full"
                            disabled
                          >
                            {meusEmprestimos.find((e) => e.livro.id === livro.id)?.status === 'PENDENTE'
                              ? 'Solicitação Pendente'
                              : 'Já emprestado'}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleSolicitarEmprestimo(livro.id)}
                            className="w-full bg-green-600 hover:bg-green-700"
                            disabled={livro.qntDisponivel === 0}
                          >
                            Solicitar Empréstimo
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {livrosDisponiveis.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Library className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Nenhum livro disponível no momento</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Meus Empréstimos Ativos */}
        <Card>
          <CardHeader>
            <CardTitle>Meus Empréstimos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            {meusEmprestimos.filter(e => e.status === 'ATIVO').length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Você não possui empréstimos ativos</p>
                <p className="text-sm mt-2">Solicite um livro acima para começar!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {meusEmprestimos
                  .filter(e => e.status === 'ATIVO')
                  .map((emprestimo) => (
                  <div
                    key={emprestimo.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{emprestimo.livro.titulo}</p>
                      <p className="text-sm text-gray-500">
                        Retirada: {new Date(emprestimo.dataRetirada).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-sm text-gray-500">
                        Devolução prevista: {new Date(emprestimo.dataRetornoPrevisto).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="ml-4">
                      {getStatusBadge(emprestimo)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Histórico de Empréstimos */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Empréstimos</CardTitle>
          </CardHeader>
          <CardContent>
            {meusEmprestimos.filter(e => e.status === 'FINALIZADO' || e.status === 'REJEITADO').length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Você ainda não possui empréstimos finalizados</p>
              </div>
            ) : (
              <div className="space-y-3">
                {meusEmprestimos
                  .filter(e => e.status === 'FINALIZADO' || e.status === 'REJEITADO')
                  .map((emprestimo) => (
                  <div
                    key={emprestimo.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border opacity-75"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-700">{emprestimo.livro.titulo}</p>
                      <p className="text-sm text-gray-500">
                        Retirada: {new Date(emprestimo.dataRetirada).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-sm text-gray-500">
                        Devolvido em: {emprestimo.dataRetornoOficial
                          ? new Date(emprestimo.dataRetornoOficial).toLocaleDateString('pt-BR')
                          : new Date(emprestimo.dataRetornoPrevisto).toLocaleDateString('pt-BR')
                        }
                      </p>
                    </div>
                    <div className="ml-4">
                      {getStatusBadge(emprestimo)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informações Importantes */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Importantes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>O prazo padrão de empréstimo é de 7 dias</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>As solicitações precisam ser aprovadas por um funcionário</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Você pode ter até 3 empréstimos ativos simultaneamente</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Devolver os livros na data prevista evita problemas</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Como Funciona</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Escolha um Livro</h4>
                    <p className="text-sm text-gray-600">Selecione um livro disponível acima</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Faça a Solicitação</h4>
                    <p className="text-sm text-gray-600">Clique em "Solicitar Empréstimo"</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Aguarde a Aprovação</h4>
                    <p className="text-sm text-gray-600">Um funcionário analisará sua solicitação</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
