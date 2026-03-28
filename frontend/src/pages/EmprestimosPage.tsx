import { useEffect, useState } from 'react';
import { Plus, Search, CheckCircle, RotateCcw, XCircle, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { SearchableSelect } from '../components/SearchableSelect';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { emprestimosApi, livrosApi, clientesApi } from '../services/api';
import type { Emprestimo, Livro, Cliente } from '../services/types';
import { toast } from 'sonner';
import { format } from 'date-fns';

const MAX_RENOVACOES = 2;

export default function EmprestimosPage() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [pendentes, setPendentes] = useState<Emprestimo[]>([]);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [allLivros, setAllLivros] = useState<Livro[]>([]);
  const [allClientes, setAllClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    clienteId: '',
    livroId: '',
  });

  useEffect(() => {
    Promise.all([fetchEmprestimos(), fetchPendentes(), fetchLivros(), fetchClientes()]);
  }, []);

  const fetchEmprestimos = async () => {
    try {
      const data = await emprestimosApi.getAll();
      setEmprestimos(data);
    } catch (error) {
      console.error('Erro ao carregar empréstimos:', error);
      toast.error('Erro ao carregar empréstimos');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendentes = async () => {
    try {
      const data = await emprestimosApi.getPendentes();
      setPendentes(data);
    } catch (error) {
      console.error('Erro ao carregar pendentes:', error);
    }
  };

  const fetchLivros = async () => {
    try {
      const data = await livrosApi.getAll();
      setAllLivros(data);
      setLivros(data.filter(l => l.qntDisponivel > 0));
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const data = await clientesApi.getAll();
      setAllClientes(data);
      setClientes(data.filter(c => c.status === 'ativo'));
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const refreshAll = () => {
    Promise.all([fetchEmprestimos(), fetchPendentes(), fetchLivros()]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clienteId || !formData.livroId) {
      toast.error('Selecione um cliente e um livro');
      return;
    }

    try {
      await emprestimosApi.criarDireto({
        clienteId: parseInt(formData.clienteId),
        livroId: parseInt(formData.livroId),
        dataRetirada: new Date().toISOString().split('T')[0],
        dataRetornoPrevisto: new Date().toISOString().split('T')[0],
      });

      toast.success('Empréstimo criado com sucesso!');
      setDialogOpen(false);
      setFormData({ clienteId: '', livroId: '' });
      refreshAll();
    } catch (error: any) {
      console.error('Erro ao criar empréstimo:', error);
      const errorMessage = error?.response?.data || 'Erro ao criar empréstimo';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Erro ao criar empréstimo');
    }
  };

  const handleAprovar = async (id: number) => {
    try {
      await emprestimosApi.aprovarSolicitacao(id);
      toast.success('Solicitação aprovada com sucesso!');
      refreshAll();
    } catch (error: any) {
      console.error('Erro ao aprovar:', error);
      const errorMessage = error?.response?.data || 'Erro ao aprovar solicitação';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Erro ao aprovar solicitação');
    }
  };

  const handleRejeitar = async (id: number) => {
    if (!confirm('Tem certeza que deseja rejeitar esta solicitação?')) return;

    try {
      await emprestimosApi.rejeitarSolicitacao(id);
      toast.success('Solicitação rejeitada com sucesso!');
      refreshAll();
    } catch (error: any) {
      console.error('Erro ao rejeitar:', error);
      const errorMessage = error?.response?.data || 'Erro ao rejeitar solicitação';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Erro ao rejeitar solicitação');
    }
  };

  const handleRenovar = async (id: number) => {
    const emprestimo = emprestimosAtivos.find(e => e.id === id);
    if (!emprestimo) return;

    const renovacoes = emprestimo.numeroRenovacoes || 0;

    // Verificar limite de renovações
    if (renovacoes >= MAX_RENOVACOES) {
      toast.error(`Este empréstimo já atingiu o limite máximo de ${MAX_RENOVACOES} renovações.`);
      return;
    }

    if (!confirm(`Deseja renovar este empréstimo por 7 dias? (Renovação ${renovacoes + 1} de ${MAX_RENOVACOES})`)) return;

    try {
      await emprestimosApi.renovar(id);
      toast.success('Empréstimo renovado com sucesso!');
      refreshAll();
    } catch (error: any) {
      console.error('Erro ao renovar:', error);
      const errorMessage = error?.response?.data || 'Erro ao renovar empréstimo';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Erro ao renovar empréstimo');
    }
  };

  const handleFinalizar = async (id: number) => {
    if (!confirm('Confirmar devolução deste livro?')) return;

    try {
      await emprestimosApi.finalizar(id);
      toast.success('Empréstimo finalizado com sucesso!');
      refreshAll();
    } catch (error: any) {
      console.error('Erro ao finalizar:', error);
      const errorMessage = error?.response?.data || 'Erro ao finalizar empréstimo';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Erro ao finalizar empréstimo');
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
        // Usar campo do backend com fallback para cálculo local
        if (emprestimo.estaAtrasado || new Date(emprestimo.dataRetornoPrevisto) < new Date()) {
          return <Badge variant="destructive">Atrasado</Badge>;
        }
        return <Badge variant="default" className="bg-green-600">Ativo</Badge>;
      case 'FINALIZADO':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Finalizado</Badge>;
      default:
        return <Badge variant="default">Ativo</Badge>;
    }
  };

  const filteredEmprestimos = emprestimos.filter((emp) =>
    emp.livro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const emprestimosAtivos = emprestimos.filter((e) => e.status === 'ATIVO');
  const emprestimosAtrasados = emprestimosAtivos.filter((e) => new Date(e.dataRetornoPrevisto) < new Date());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Empréstimos</h1>
          <p className="text-gray-600 mt-1">Solicitações pendentes e empréstimos ativos</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Empréstimo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Empréstimo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="livroId">Livro</Label>
                <SearchableSelect
                  items={allLivros}
                  value={formData.livroId}
                  onChange={(value) => setFormData({ ...formData, livroId: value })}
                  getLabel={(livro) => livro.titulo}
                  getValue={(livro) => livro.id.toString()}
                  getSubtitle={(livro) =>
                    `${livro.qntDisponivel > 0 ? `${livro.qntDisponivel} disponível` : 'Indisponível'} - Ano: ${livro.anoPublicacao}`
                  }
                  placeholder="Selecione um livro"
                  searchPlaceholder="Buscar livro por título..."
                  emptyMessage="Nenhum livro encontrado."
                />
              </div>

              <div>
                <Label htmlFor="clienteId">Cliente</Label>
                <SearchableSelect
                  items={allClientes}
                  value={formData.clienteId}
                  onChange={(value) => setFormData({ ...formData, clienteId: value })}
                  getLabel={(cliente) => cliente.nome}
                  getValue={(cliente) => cliente.id.toString()}
                  getSubtitle={(cliente) => `${cliente.email} - ${cliente.status === 'ativo' ? 'Ativo' : 'Bloqueado'}`}
                  placeholder="Selecione um cliente"
                  searchPlaceholder="Buscar cliente por nome ou email..."
                  emptyMessage="Nenhum cliente encontrado."
                />
              </div>

              <Button type="submit" className="w-full">Criar Empréstimo</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Solicitações Pendentes</p>
          <p className="text-2xl font-bold text-yellow-600">{pendentes.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Empréstimos Ativos</p>
          <p className="text-2xl font-bold text-blue-600">{emprestimosAtivos.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Empréstimos Atrasados</p>
          <p className="text-2xl font-bold text-red-600">{emprestimosAtrasados.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total de Empréstimos</p>
          <p className="text-2xl font-bold text-gray-900">{emprestimos.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pendentes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pendentes">
            <Clock className="h-4 w-4 mr-2" />
            Solicitações Pendentes ({pendentes.length})
          </TabsTrigger>
          <TabsTrigger value="ativos">
            <CheckCircle className="h-4 w-4 mr-2" />
            Empréstimos Ativos ({emprestimosAtivos.length})
          </TabsTrigger>
          <TabsTrigger value="todos">
            Todos ({emprestimos.length})
          </TabsTrigger>
        </TabsList>

        {/* Solicitações Pendentes */}
        <TabsContent value="pendentes">
          {pendentes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Nenhuma solicitação pendente</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Livro</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data Solicitação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendentes.map((emprestimo) => (
                    <TableRow key={emprestimo.id}>
                      <TableCell className="font-medium">{emprestimo.livro.titulo}</TableCell>
                      <TableCell>{emprestimo.cliente.nome}</TableCell>
                      <TableCell>{format(new Date(emprestimo.dataRetirada), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{getStatusBadge(emprestimo)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAprovar(emprestimo.id)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            title="Aprovar"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRejeitar(emprestimo.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Rejeitar"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Empréstimos Ativos */}
        <TabsContent value="ativos">
          {emprestimosAtivos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Nenhum empréstimo ativo</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Livro</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Retirada</TableHead>
                    <TableHead>Devolução Prevista</TableHead>
                    <TableHead>Renovações</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emprestimosAtivos.map((emprestimo) => {
                    const renovacoes = emprestimo.numeroRenovacoes || 0;
                    const podeRenovar = renovacoes < MAX_RENOVACOES;

                    return (
                      <TableRow key={emprestimo.id}>
                        <TableCell className="font-medium">{emprestimo.livro.titulo}</TableCell>
                        <TableCell>{emprestimo.cliente.nome}</TableCell>
                        <TableCell>{format(new Date(emprestimo.dataRetirada), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{format(new Date(emprestimo.dataRetornoPrevisto), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>
                          <Badge variant={renovacoes === 0 ? 'secondary' : 'default'} className="text-xs">
                            {renovacoes}/{MAX_RENOVACOES}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(emprestimo)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRenovar(emprestimo.id)}
                              title={podeRenovar ? `Renovar (+7 dias) - Renovação ${renovacoes + 1} de ${MAX_RENOVACOES}` : 'Limite de renovações atingido'}
                              disabled={!podeRenovar}
                              className={!podeRenovar ? 'opacity-50 cursor-not-allowed' : ''}
                            >
                              <RotateCcw className={`h-4 w-4 ${podeRenovar ? 'text-blue-600' : 'text-gray-400'}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFinalizar(emprestimo.id)}
                              title="Finalizar empréstimo"
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Todos */}
        <TabsContent value="todos">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por livro ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Livro</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Retirada</TableHead>
                  <TableHead>Devolução Prevista</TableHead>
                  <TableHead>Devolução</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmprestimos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      Nenhum empréstimo encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmprestimos.map((emprestimo) => (
                    <TableRow key={emprestimo.id}>
                      <TableCell className="font-medium">{emprestimo.livro.titulo}</TableCell>
                      <TableCell>{emprestimo.cliente.nome}</TableCell>
                      <TableCell>{format(new Date(emprestimo.dataRetirada), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{format(new Date(emprestimo.dataRetornoPrevisto), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>
                        {emprestimo.dataRetornoOficial
                          ? format(new Date(emprestimo.dataRetornoOficial), 'dd/MM/yyyy')
                          : '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(emprestimo)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
