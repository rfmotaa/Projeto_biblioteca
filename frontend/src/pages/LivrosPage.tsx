import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
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
import { livrosApi } from '../services/api';
import type { Livro, LivroForm } from '../services/types';
import { toast } from 'sonner';

export default function LivrosPage() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingLivro, setEditingLivro] = useState<Livro | null>(null);
  const [formData, setFormData] = useState<LivroForm>({
    titulo: '',
    anoPublicacao: new Date().getFullYear(),
    qntTotal: 1,
  });

  useEffect(() => {
    fetchLivros();
  }, []);

  const fetchLivros = async () => {
    try {
      const data = await livrosApi.getAll();
      setLivros(data);
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
      toast.error('Erro ao carregar livros');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await livrosApi.create(formData);
      toast.success('Livro cadastrado com sucesso!');
      setCreateDialogOpen(false);
      setFormData({
        titulo: '',
        anoPublicacao: new Date().getFullYear(),
        qntTotal: 1,
      });
      fetchLivros();
    } catch (error) {
      console.error('Erro ao cadastrar livro:', error);
      toast.error('Erro ao cadastrar livro');
    }
  };

  const handleEditClick = (livro: Livro) => {
    setEditingLivro(livro);
    setFormData({
      titulo: livro.titulo,
      anoPublicacao: livro.anoPublicacao,
      qntTotal: livro.qntTotal,
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingLivro) return;

    try {
      await livrosApi.update(editingLivro.id, formData);
      toast.success('Livro atualizado com sucesso!');
      setEditDialogOpen(false);
      setEditingLivro(null);
      setFormData({
        titulo: '',
        anoPublicacao: new Date().getFullYear(),
        qntTotal: 1,
      });
      fetchLivros();
    } catch (error) {
      console.error('Erro ao atualizar livro:', error);
      toast.error('Erro ao atualizar livro');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este livro?')) return;

    try {
      await livrosApi.delete(id);
      toast.success('Livro excluído com sucesso!');
      fetchLivros();
    } catch (error) {
      console.error('Erro ao excluir livro:', error);
      toast.error('Erro ao excluir livro');
    }
  };

  const filteredLivros = livros.filter((livro) =>
    livro.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-900">Livros</h1>
          <p className="text-gray-600 mt-1">Gerencie o acervo da biblioteca</p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Livro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Livro</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <Label htmlFor="create-titulo">Título</Label>
                <Input
                  id="create-titulo"
                  required
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="create-ano">Ano de Publicação</Label>
                <Input
                  id="create-ano"
                  type="number"
                  required
                  value={formData.anoPublicacao}
                  onChange={(e) => setFormData({ ...formData, anoPublicacao: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="create-qnt">Quantidade Total</Label>
                <Input
                  id="create-qnt"
                  type="number"
                  min="1"
                  required
                  value={formData.qntTotal}
                  onChange={(e) => setFormData({ ...formData, qntTotal: parseInt(e.target.value) })}
                />
              </div>
              <Button type="submit" className="w-full">Cadastrar</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setEditingLivro(null);
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Livro</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-titulo">Título</Label>
                <Input
                  id="edit-titulo"
                  required
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-ano">Ano de Publicação</Label>
                <Input
                  id="edit-ano"
                  type="number"
                  required
                  value={formData.anoPublicacao}
                  onChange={(e) => setFormData({ ...formData, anoPublicacao: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="edit-qnt">Quantidade Total</Label>
                <Input
                  id="edit-qnt"
                  type="number"
                  min="1"
                  required
                  value={formData.qntTotal}
                  onChange={(e) => setFormData({ ...formData, qntTotal: parseInt(e.target.value) })}
                />
                {editingLivro && (
                  <p className="text-xs text-gray-500 mt-1">
                    Quantidade disponível: {editingLivro.qntDisponivel}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">Salvar Alterações</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por título..."
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
              <TableHead>Título</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Disponível</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLivros.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  Nenhum livro encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredLivros.map((livro) => (
                <TableRow key={livro.id}>
                  <TableCell className="font-medium">{livro.titulo}</TableCell>
                  <TableCell>{livro.anoPublicacao}</TableCell>
                  <TableCell>{livro.qntTotal}</TableCell>
                  <TableCell>
                    <span className={livro.qntDisponivel > 0 ? 'text-green-600' : 'text-red-600'}>
                      {livro.qntDisponivel}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(livro)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(livro.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total de Livros</p>
          <p className="text-2xl font-bold text-gray-900">{livros.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Livros Disponíveis</p>
          <p className="text-2xl font-bold text-green-600">
            {livros.filter((l) => l.qntDisponivel > 0).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Livros Indisponíveis</p>
          <p className="text-2xl font-bold text-red-600">
            {livros.filter((l) => l.qntDisponivel === 0).length}
          </p>
        </div>
      </div>
    </div>
  );
}
