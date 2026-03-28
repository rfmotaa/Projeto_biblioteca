import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { Book, Clock, LogOut, CheckCircle, Library, ChevronLeft, ChevronRight, Search, Heart, Bell } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { livrosApi, emprestimosApi, notificacoesApi, interessesApi, categoriasApi } from '../services/api';
import type { Livro, Emprestimo, Notificacao, Categoria } from '../services/types';
import { toast } from 'sonner';
import NotificacaoCard from '../components/NotificacaoCard';

const MAX_RENOVACOES = 2;

export default function ClienteDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [livrosDisponiveis, setLivrosDisponiveis] = useState<Livro[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [meusEmprestimos, setMeusEmprestimos] = useState<Emprestimo[]>([]);
  const [solicitacoesPendentes, setSolicitacoesPendentes] = useState<Emprestimo[]>([]);
  const [historicoPage, setHistoricoPage] = useState(1);
  const historicoPageSize = 10;
  const [livrosPage, setLivrosPage] = useState(1);
  const livrosPageSize = 6;
  const [livroSearch, setLivroSearch] = useState('');
  const [filterCategoria, setFilterCategoria] = useState<string>('');

  // Estados para notificações e interesses
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [notificacaoAtual, setNotificacaoAtual] = useState(0);
  const [livrosInteresse, setLivrosInteresse] = useState<Set<number>>(new Set());

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const fetchData = async () => {
    try {
      const [livros, emprestimos, notifs, cats] = await Promise.all([
        livrosApi.getAll(),
        emprestimosApi.getAll(),
        user ? notificacoesApi.getNaoLidas(user.id) : Promise.resolve([]),
        categoriasApi.getAll(),
      ]);

      setLivrosDisponiveis(livros);
      setNotificacoes(notifs);
      setCategorias(cats);

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

      // Carregar interesses do usuário
      if (user) {
        carregarInteresses();
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const carregarInteresses = async () => {
    if (!user?.id) return;
    try {
      const interesses = await interessesApi.listarInteresses(user.id);
      const livroIds = new Set(interesses.map((i) => i.livro.id));
      setLivrosInteresse(livroIds);
    } catch (error) {
      console.error('Erro ao carregar interesses:', error);
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

  const handleMarcarComoLida = async (notificacaoId: number) => {
    try {
      await notificacoesApi.marcarComoLida(notificacaoId);
      // Remover notificação da lista
      setNotificacoes((prev) => prev.filter((n) => n.id !== notificacaoId));
      if (notificacaoAtual >= notificacoes.length - 1) {
        setNotificacaoAtual(0);
      }
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      toast.error('Erro ao marcar notificação como lida');
    }
  };

  const handleMarcarTodasComoLidas = async () => {
    if (!user?.id) return;
    try {
      await notificacoesApi.marcarTodasComoLidas(user.id);
      setNotificacoes([]);
      setNotificacaoAtual(0);
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
      toast.error('Erro ao marcar notificações como lidas');
    }
  };

  const handleToggleInteresse = async (livroId: number) => {
    if (!user?.id) return;

    const temInteresse = livrosInteresse.has(livroId);

    try {
      if (temInteresse) {
        await interessesApi.removerInteresse(user.id, livroId);
        setLivrosInteresse((prev) => {
          const novoSet = new Set(prev);
          novoSet.delete(livroId);
          return novoSet;
        });
        toast.success('Interesse removido');
      } else {
        await interessesApi.adicionarInteresse(user.id, livroId);
        setLivrosInteresse((prev) => new Set(prev).add(livroId));
        toast.success('Livro marcado com interesse! Você será notificado quando estiver disponível.');
      }
    } catch (error: any) {
      console.error('Erro ao gerenciar interesse:', error);
      const errorMessage = error?.response?.data || 'Erro ao gerenciar interesse';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Erro ao gerenciar interesse');
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
        // Verificar se está atrasado (usar campo do backend ou calcular localmente como fallback)
        if (emprestimo.estaAtrasado || new Date(emprestimo.dataRetornoPrevisto) < new Date()) {
          return <Badge variant="destructive">Atrasado</Badge>;
        }
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

  const emprestimosHistorico = meusEmprestimos.filter(
    (e) => e.status === 'FINALIZADO' || e.status === 'REJEITADO'
  );
  const totalHistoricoPages = Math.ceil(emprestimosHistorico.length / historicoPageSize);
  const startIndex = (historicoPage - 1) * historicoPageSize;
  const endIndex = startIndex + historicoPageSize;
  const paginatedHistorico = emprestimosHistorico.slice(startIndex, endIndex);

  // Filtrar e paginar livros disponíveis
  const filteredLivros = livrosDisponiveis.filter((livro) => {
    const matchesSearch =
      livro.titulo.toLowerCase().includes(livroSearch.toLowerCase()) ||
      livro.anoPublicacao.toString().includes(livroSearch) ||
      (livro.autor && livro.autor.toLowerCase().includes(livroSearch.toLowerCase()));
    const matchesCategoria = !filterCategoria || livro.categorias?.some(c => c.nome === filterCategoria);
    return matchesSearch && matchesCategoria;
  });
  const totalLivrosPages = Math.ceil(filteredLivros.length / livrosPageSize);
  const livrosStartIndex = (livrosPage - 1) * livrosPageSize;
  const livrosEndIndex = livrosStartIndex + livrosPageSize;
  const paginatedLivros = filteredLivros.slice(livrosStartIndex, livrosEndIndex);

  // Resetar página da busca quando mudar o termo de busca
  useEffect(() => {
    setLivrosPage(1);
  }, [livroSearch, filterCategoria]);

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
              {/* Notification Bell */}
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-600" />
                {notificacoes.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {notificacoes.length > 9 ? '9+' : notificacoes.length}
                  </span>
                )}
              </div>
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

        {/* Notificações */}
        {notificacoes.length > 0 && (
          <Card className="mb-8 border-blue-200 bg-gradient-to-r from-blue-50 to-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-blue-600" />
                  Notificações ({notificacoes.length})
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarcarTodasComoLidas}
                  className="text-xs"
                >
                  Marcar todas como lidas
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="overflow-hidden">
                  <div
                    className="transition-transform duration-300 ease-in-out"
                    style={{
                      transform: `translateX(-${notificacaoAtual * 100}%)`,
                    }}
                  >
                    <div className="flex">
                      {notificacoes.map((notificacao) => (
                        <div
                          key={notificacao.id}
                          className="w-full flex-shrink-0"
                        >
                          <NotificacaoCard
                            notificacao={notificacao}
                            onMarcarLida={handleMarcarComoLida}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Navegação entre notificações */}
                {notificacoes.length > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNotificacaoAtual((prev) => (prev === 0 ? notificacoes.length - 1 : prev - 1))}
                      disabled={notificacoes.length === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600">
                      {notificacaoAtual + 1} de {notificacoes.length}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNotificacaoAtual((prev) => (prev === notificacoes.length - 1 ? 0 : prev + 1))}
                      disabled={notificacoes.length === 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/cliente/interesses')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Lista de Interesse
              </CardTitle>
              <Heart className="h-5 w-5 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pink-600">{livrosInteresse.size}</div>
              <p className="text-xs text-gray-500 mt-1">
                {livrosInteresse.size === 0 ? 'Nenhum livro marcado' : 'Livros de interesse'}
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
              Todos os Livros
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Campo de busca e filtros */}
            <div className="mb-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por título, autor ou ano..."
                    value={livroSearch}
                    onChange={(e) => setLivroSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <select
                    value={filterCategoria}
                    onChange={(e) => setFilterCategoria(e.target.value)}
                    className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Todas as categorias</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.nome}>
                        {cat.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {(livroSearch || filterCategoria) && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-600">Filtros ativos:</span>
                  {livroSearch && (
                    <Badge variant="secondary" className="gap-1">
                      Busca: {livroSearch}
                      <button
                        onClick={() => setLivroSearch('')}
                        className="ml-1 hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {filterCategoria && (
                    <Badge variant="secondary" className="gap-1">
                      Categoria: {filterCategoria}
                      <button
                        onClick={() => setFilterCategoria('')}
                        className="ml-1 hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setLivroSearch('');
                      setFilterCategoria('');
                    }}
                    className="h-7 text-xs"
                  >
                    Limpar todos
                  </Button>
                  <span className="text-sm text-gray-600 ml-auto">
                    {filteredLivros.length} {filteredLivros.length === 1 ? 'livro encontrado' : 'livros encontrados'}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedLivros.map((livro) => (
                <Card
                  key={livro.id}
                  className={`border-2 transition-colors ${
                    livro.qntDisponivel > 0
                      ? 'hover:border-green-300'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{livro.titulo}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleInteresse(livro.id)}
                          className="ml-2 h-8 w-8 p-0 hover:bg-pink-50"
                          title={livrosInteresse.has(livro.id) ? 'Remover interesse' : 'Marcar interesse'}
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              livrosInteresse.has(livro.id)
                                ? 'fill-pink-500 text-pink-500'
                                : 'text-gray-400'
                            }`}
                          />
                        </Button>
                      </div>

                      <div className="text-sm text-gray-600 space-y-1 mb-3">
                        <p className="font-medium text-gray-900">{livro.autor || 'Autor não informado'}</p>
                        <p>Ano: {livro.anoPublicacao}{livro.edicao && ` • ${livro.edicao}ª ed.`}</p>
                        {livro.isbn && <p className="text-xs text-gray-500">ISBN: {livro.isbn}</p>}
                        {livro.editora && <p className="text-xs text-gray-500">Editora: {livro.editora}</p>}
                        {livro.categorias && livro.categorias.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {livro.categorias.map((cat) => (
                              <Badge key={cat.id} variant="outline" className="text-xs">
                                {cat.nome}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-auto space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Disponíveis:</span>
                          <Badge
                            variant={livro.qntDisponivel > 2 ? 'default' : livro.qntDisponivel > 0 ? 'outline' : 'destructive'}
                          >
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
                        ) : livro.qntDisponivel > 0 ? (
                          // Livro disponível - mostrar botão de solicitação
                          <Button
                            onClick={() => handleSolicitarEmprestimo(livro.id)}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            Solicitar Empréstimo
                          </Button>
                        ) : (
                          // Livro indisponível - mostrar botão de interesse destacado
                          <Button
                            onClick={() => handleToggleInteresse(livro.id)}
                            className={`w-full ${
                              livrosInteresse.has(livro.id)
                                ? 'bg-pink-600 hover:bg-pink-700'
                                : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                          >
                            <Heart className={`h-4 w-4 mr-2 ${livrosInteresse.has(livro.id) ? 'fill-white' : ''}`} />
                            {livrosInteresse.has(livro.id) ? 'Interesse Adicionado' : 'Adicionar à Lista de Interesse'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Estado vazio */}
            {filteredLivros.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Library className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>{livroSearch ? 'Nenhum livro encontrado com este termo' : 'Nenhum livro cadastrado'}</p>
              </div>
            )}

            {/* Paginação */}
            {totalLivrosPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <span className="text-sm text-gray-600">
                  Página {livrosPage} de {totalLivrosPages} {livroSearch && `(${filteredLivros.length} encontrados, ${livrosDisponiveis.length} total)`}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLivrosPage(livrosPage - 1)}
                    disabled={livrosPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLivrosPage(livrosPage + 1)}
                    disabled={livrosPage === totalLivrosPages}
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
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
                  .map((emprestimo) => {
                    const renovacoes = emprestimo.numeroRenovacoes || 0;
                    return (
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
                          <div className="mt-2">
                            <Badge variant={renovacoes === 0 ? 'secondary' : 'default'} className="text-xs">
                              Renovações: {renovacoes}/{MAX_RENOVACOES}
                            </Badge>
                          </div>
                        </div>
                        <div className="ml-4">
                          {getStatusBadge(emprestimo)}
                        </div>
                      </div>
                    );
                  })}
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
            {emprestimosHistorico.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Você ainda não possui empréstimos finalizados</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {paginatedHistorico.map((emprestimo) => (
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

                {/* Paginação */}
                {totalHistoricoPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <span className="text-sm text-gray-600">
                      Página {historicoPage} de {totalHistoricoPages} ({emprestimosHistorico.length} registros)
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setHistoricoPage(historicoPage - 1)}
                        disabled={historicoPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setHistoricoPage(historicoPage + 1)}
                        disabled={historicoPage === totalHistoricoPages}
                      >
                        Próxima
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
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
                  <div className="shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Escolha um Livro</h4>
                    <p className="text-sm text-gray-600">Selecione um livro disponível acima</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Faça a Solicitação</h4>
                    <p className="text-sm text-gray-600">Clique em "Solicitar Empréstimo"</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
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
