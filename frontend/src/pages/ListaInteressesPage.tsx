import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Heart, ArrowLeft, Book, Trash2, CheckCircle, XCircle, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { interessesApi, emprestimosApi, livrosApi } from '../services/api';
import type { LivroInteresse, Livro } from '../services/types';
import { toast } from 'sonner';

export default function ListaInteressesPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [interesses, setInteresses] = useState<LivroInteresse[]>([]);
  const [livrosDisponiveis, setLivrosDisponiveis] = useState<Livro[]>([]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      const [interessesData, livrosData] = await Promise.all([
        interessesApi.listarInteresses(user.id),
        livrosApi.getAll(),
      ]);
      setInteresses(interessesData);
      setLivrosDisponiveis(livrosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleRemoverInteresse = async (livroId: number) => {
    if (!user?.id) return;
    try {
      await interessesApi.removerInteresse(user.id, livroId);
      setInteresses((prev) => prev.filter((i) => i.livro.id !== livroId));
      toast.success('Interesse removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover interesse:', error);
      toast.error('Erro ao remover interesse');
    }
  };

  const handleSolicitarEmprestimo = async (livroId: number) => {
    if (!user?.id || user.id === 0) {
      toast.error('Erro ao identificar usuário. Por favor, faça logout e login novamente.');
      return;
    }

    try {
      await emprestimosApi.criarSolicitacao(user.id, livroId);
      toast.success('Solicitação de empréstimo enviada com sucesso!');
      // Refresh data to update loan status
      fetchData();
    } catch (error: any) {
      console.error('Erro ao solicitar empréstimo:', error);
      const errorMessage = error?.response?.data || 'Erro ao solicitar empréstimo';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Erro ao solicitar empréstimo');
    }
  };

  const checkIfAlreadyRequested = (livroId: number): boolean => {
    // Check if user already has an active/pending loan for this book
    // This would require fetching user's loans - for simplicity, returning false
    return false;
  };

  const getLivroDisponibilidade = (livroId: number): { disponivel: boolean; qntDisponivel: number } => {
    const livro = livrosDisponiveis.find((l) => l.id === livroId);
    return {
      disponivel: livro ? livro.qntDisponivel > 0 : false,
      qntDisponivel: livro?.qntDisponivel || 0,
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/cliente/dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Heart className="h-8 w-8 text-pink-600 mr-2" />
              <span className="font-semibold text-xl text-gray-900">
                Minha Lista de Interesse
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
          <h1 className="text-3xl font-bold text-gray-900">Livros de Interesse</h1>
          <p className="text-gray-600 mt-2">
            Gerencie os livros que você deseja ler. Você será notificado quando estiverem disponíveis!
          </p>
        </div>

        {/* Stats */}
        <Card className="mb-8 bg-gradient-to-r from-pink-50 to-white border-pink-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-pink-600 mr-4" />
                <div>
                  <p className="text-sm text-gray-600">Total de livros marcados</p>
                  <p className="text-3xl font-bold text-gray-900">{interesses.length}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Disponíveis agora</p>
                <p className="text-2xl font-bold text-green-600">
                  {interesses.filter((i) => {
                    const { disponivel } = getLivroDisponibilidade(i.livro.id);
                    return disponivel;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Interesses */}
        {interesses.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Nenhum livro marcado
              </h3>
              <p className="text-gray-500 mb-6">
                Comece a explorar os livros disponíveis e marque seus favoritos!
              </p>
              <Button
                onClick={() => navigate('/cliente/dashboard')}
                className="bg-pink-600 hover:bg-pink-700"
              >
                <Book className="h-4 w-4 mr-2" />
                Explorar Livros
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {interesses.map((interesse) => {
              const { disponivel, qntDisponivel } = getLivroDisponibilidade(interesse.livro.id);
              const jaSolicitado = checkIfAlreadyRequested(interesse.livro.id);

              return (
                <Card key={interesse.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            <Heart className="h-6 w-6 text-pink-600 fill-pink-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {interesse.livro.titulo}
                            </h3>
                            <p className="text-sm text-gray-500 mb-3">
                              Ano: {interesse.livro.anoPublicacao}
                            </p>

                            <div className="flex items-center gap-3">
                              <Badge
                                variant={disponivel ? 'default' : 'secondary'}
                                className={disponivel ? 'bg-green-100 text-green-800 border-green-300' : ''}
                              >
                                {disponivel ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Disponível ({qntDisponivel} em estoque)
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Indisponível
                                  </>
                                )}
                              </Badge>

                              <span className="text-xs text-gray-500">
                                Marcado em {new Date(interesse.dataCriacao).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {disponivel && !jaSolicitado ? (
                          <Button
                            onClick={() => handleSolicitarEmprestimo(interesse.livro.id)}
                            className="bg-green-600 hover:bg-green-700"
                            disabled={qntDisponivel === 0}
                          >
                            <Book className="h-4 w-4 mr-2" />
                            Solicitar Empréstimo
                          </Button>
                        ) : jaSolicitado ? (
                          <Button variant="outline" disabled>
                            Solicitação Pendente
                          </Button>
                        ) : null}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoverInteresse(interesse.livro.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Remover interesse"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
