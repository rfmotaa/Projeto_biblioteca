import { useEffect, useState } from 'react';
import { Plus, Search, CheckCircle, RotateCcw } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { emprestimosApi, livrosApi, clientesApi } from '../services/api';
import type { Emprestimo, Livro, Cliente } from '../services/types';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function EmprestimosPage() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    clienteId: 0,
    livroId: 0,
  });

  useEffect(() => {
    Promise.all([fetchEmprestimos(), fetchLivros(), fetchClientes()]);
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

  const fetchLivros = async () => {
    try {
      const data = await livrosApi.getDisponiveis();
      setLivros(data);
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const data = await clientesApi.getByStatus('ativo');
      setClientes(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clienteId || !formData.livroId) {
      toast.error('Selecione um cliente e um livro');
      return;
    }

    try {
      const dataRetirada = new Date().toISOString().split('T')[0];
      const dataRetornoPrevista = new Date();
      dataRetornoPrevista.setDate(dataRetornoPrevista.getDate() + 14);

      await emprestimosApi.create({
        clienteId: formData.clienteId,
        livroId: formData.livroId,
        dataRetirada: dataRetirada,
        dataRetornoPrevisto: dataRetornoPrevista.toISOString().split('T')[0],
      });

      toast.success('Empréstimo registrado com sucesso!');
      setDialogOpen(false);
      setFormData({ clienteId: 0, livroId: 0 });
      Promise.all([fetchEmprestimos(), fetchLivros()]);
    } catch (error) {
      console.error('Erro ao registrar empréstimo:', error);
      toast.error('Erro ao registrar empréstimo');
    }
  };

  const handleDevolucao = async (id: number) => {
    if (!confirm('Confirmar devolução deste livro?')) return;

    try {
      await emprestimosApi.devolucao(id);
      toast.success('Devolução registrada com sucesso!');
      Promise.all([fetchEmprestimos(), fetchLivros()]);
    } catch (error) {
      console.error('Erro ao registrar devolução:', error);
      toast.error('Erro ao registrar devolução');
    }
  };

  const handleRenovacao = async (id: number) => {
    if (!confirm('Confirmar renovação deste empréstimo?')) return;

    try {
      await emprestimosApi.renovacao(id);
      toast.success('Empréstimo renovado com sucesso!');
      fetchEmprestimos();
    } catch (error) {
      console.error('Erro ao renovar empréstimo:', error);
      toast.error('Erro ao renovar empréstimo');
    }
  };

  const getStatusBadge = (emprestimo: Emprestimo) => {
    if (emprestimo.dataRetornoOficial) {
      return <Badge variant="secondary">Devolvido</Badge>;
    }
    const dataPrevista = new Date(emprestimo.dataRetornoPrevisto);
    const hoje = new Date();
    if (hoje > dataPrevista) {
      return <Badge variant="destructive">Atrasado</Badge>;
    }
    return <Badge variant="default">Ativo</Badge>;
  };

  const filteredEmprestimos = emprestimos.filter((emp) =>
    emp.livro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const emprestimosAtivos = emprestimos.filter((e) => !e.dataRetornoOficial);
  const emprestimosAtrasados = emprestimosAtivos.filter((e) => new Date(e.dataRetornoPrevisto) < new Date());

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Empréstimos</h1>
          <p className="text-gray-600 mt-1">Gerencie os empréstimos de livros</p>
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
              <DialogTitle>Registrar Novo Empréstimo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="livroId">Livro</Label>
                <Select
                  value={formData.livroId.toString()}
                  onValueChange={(value) => setFormData({ ...formData, livroId: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um livro" />
                  </SelectTrigger>
                  <SelectContent>
                    {livros.map((livro) => (
                      <SelectItem key={livro.id} value={livro.id.toString()}>
                        {livro.titulo} ({livro.qntDisponivel} disponível)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="clienteId">Cliente</Label>
                <Select
                  value={formData.clienteId.toString()}
                  onValueChange={(value) => setFormData({ ...formData, clienteId: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id.toString()}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">Registrar Empréstimo</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
              <TableHead>Data Retirada</TableHead>
              <TableHead>Devolução Prevista</TableHead>
              <TableHead>Data Devolução</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmprestimos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  Nenhum empréstimo encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredEmprestimos.map((emprestimo) => (
                <TableRow key={emprestimo.id}>
                  <TableCell>
                    <p className="font-medium">{emprestimo.livro.titulo}</p>
                  </TableCell>
                  <TableCell>{emprestimo.cliente.nome}</TableCell>
                  <TableCell>{format(new Date(emprestimo.dataRetirada), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{format(new Date(emprestimo.dataRetornoPrevisto), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    {emprestimo.dataRetornoOficial
                      ? format(new Date(emprestimo.dataRetornoOficial), 'dd/MM/yyyy')
                      : '-'}
                  </TableCell>
                  <TableCell>{getStatusBadge(emprestimo)}</TableCell>
                  <TableCell className="text-right">
                    {!emprestimo.dataRetornoOficial && (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRenovacao(emprestimo.id)}
                          title="Renovar empréstimo"
                        >
                          <RotateCcw className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDevolucao(emprestimo.id)}
                          title="Registrar devolução"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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
    </div>
  );
}
