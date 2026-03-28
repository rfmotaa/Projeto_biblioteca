import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
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
import { livrosApi, categoriasApi } from '../services/api';
import type { Livro, LivroForm, Categoria } from '../services/types';
import { toast } from 'sonner';

export default function LivrosPage() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAutor, setFilterAutor] = useState('');
  const [filterEditora, setFilterEditora] = useState('');
  const [filterCategoria, setFilterCategoria] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingLivro, setEditingLivro] = useState<Livro | null>(null);
  const [selectedCategoriaIds, setSelectedCategoriaIds] = useState<number[]>([]);
  const [formData, setFormData] = useState<LivroForm>({
    titulo: '',
    autor: '',
    anoPublicacao: new Date().getFullYear(),
    qntTotal: 1,
    edicao: 1,
  });

  useEffect(() => {
    fetchLivros();
    fetchCategorias();
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

  const fetchCategorias = async () => {
    try {
      const data = await categoriasApi.getAll();
      setCategorias(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await livrosApi.create({
        ...formData,
        categoriaIds: selectedCategoriaIds,
      });
      toast.success('Livro cadastrado com sucesso!');
      setCreateDialogOpen(false);
      setFormData({
        titulo: '',
        autor: '',
        anoPublicacao: new Date().getFullYear(),
        qntTotal: 1,
        edicao: 1,
      });
      setSelectedCategoriaIds([]);
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
      isbn: livro.isbn,
      editora: livro.editora,
      edicao: livro.edicao,
      autor: livro.autor,
      anoPublicacao: livro.anoPublicacao,
      qntTotal: livro.qntTotal,
    });
    setSelectedCategoriaIds(livro.categorias?.map(c => c.id) || []);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingLivro) return;

    try {
      await livrosApi.update(editingLivro.id, {
        ...formData,
        categoriaIds: selectedCategoriaIds,
      });
      toast.success('Livro atualizado com sucesso!');
      setEditDialogOpen(false);
      setEditingLivro(null);
      setFormData({
        titulo: '',
        autor: '',
        anoPublicacao: new Date().getFullYear(),
        qntTotal: 1,
        edicao: 1,
      });
      setSelectedCategoriaIds([]);
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

  const filteredLivros = livros.filter((livro) => {
    const matchesTitulo = livro.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAutor = !filterAutor || livro.autor.toLowerCase().includes(filterAutor.toLowerCase());
    const matchesEditora = !filterEditora || (livro.editora?.toLowerCase().includes(filterEditora.toLowerCase()) ?? false);
    const matchesCategoria = !filterCategoria || livro.categorias?.some(c => c.nome === filterCategoria);
    return matchesTitulo && matchesAutor && matchesEditora && matchesCategoria;
  });

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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Livro</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="create-titulo">Título *</Label>
                  <Input
                    id="create-titulo"
                    required
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="create-autor">Autor *</Label>
                  <Input
                    id="create-autor"
                    required
                    value={formData.autor}
                    onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="create-isbn">ISBN</Label>
                  <Input
                    id="create-isbn"
                    placeholder="10 ou 13 dígitos"
                    value={formData.isbn || ''}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="create-editora">Editora</Label>
                  <Input
                    id="create-editora"
                    value={formData.editora || ''}
                    onChange={(e) => setFormData({ ...formData, editora: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="create-edicao">Edição</Label>
                  <Input
                    id="create-edicao"
                    type="number"
                    min="1"
                    value={formData.edicao || 1}
                    onChange={(e) => setFormData({ ...formData, edicao: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <Label htmlFor="create-ano">Ano de Publicação *</Label>
                  <Input
                    id="create-ano"
                    type="number"
                    required
                    value={formData.anoPublicacao}
                    onChange={(e) => setFormData({ ...formData, anoPublicacao: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="create-qnt">Quantidade Total *</Label>
                  <Input
                    id="create-qnt"
                    type="number"
                    min="1"
                    required
                    value={formData.qntTotal}
                    onChange={(e) => setFormData({ ...formData, qntTotal: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label>Categorias</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 max-h-40 overflow-y-auto border rounded-md p-3">
                  {categorias.map((categoria) => (
                    <label key={categoria.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedCategoriaIds.includes(categoria.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategoriaIds([...selectedCategoriaIds, categoria.id]);
                          } else {
                            setSelectedCategoriaIds(selectedCategoriaIds.filter(id => id !== categoria.id));
                          }
                        }}
                      />
                      <span className="text-sm">{categoria.nome}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full">Cadastrar</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) {
            setEditingLivro(null);
            setSelectedCategoriaIds([]);
          }
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Livro</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-titulo">Título *</Label>
                  <Input
                    id="edit-titulo"
                    required
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-autor">Autor *</Label>
                  <Input
                    id="edit-autor"
                    required
                    value={formData.autor}
                    onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-isbn">ISBN</Label>
                  <Input
                    id="edit-isbn"
                    placeholder="10 ou 13 dígitos"
                    value={formData.isbn || ''}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-editora">Editora</Label>
                  <Input
                    id="edit-editora"
                    value={formData.editora || ''}
                    onChange={(e) => setFormData({ ...formData, editora: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-edicao">Edição</Label>
                  <Input
                    id="edit-edicao"
                    type="number"
                    min="1"
                    value={formData.edicao || 1}
                    onChange={(e) => setFormData({ ...formData, edicao: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-ano">Ano de Publicação *</Label>
                  <Input
                    id="edit-ano"
                    type="number"
                    required
                    value={formData.anoPublicacao}
                    onChange={(e) => setFormData({ ...formData, anoPublicacao: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-qnt">Quantidade Total *</Label>
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
              </div>
              <div>
                <Label>Categorias</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 max-h-40 overflow-y-auto border rounded-md p-3">
                  {categorias.map((categoria) => (
                    <label key={categoria.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedCategoriaIds.includes(categoria.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategoriaIds([...selectedCategoriaIds, categoria.id]);
                          } else {
                            setSelectedCategoriaIds(selectedCategoriaIds.filter(id => id !== categoria.id));
                          }
                        }}
                      />
                      <span className="text-sm">{categoria.nome}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full">Salvar Alterações</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Filtrar por autor..."
              value={filterAutor}
              onChange={(e) => setFilterAutor(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Filtrar por editora..."
              value={filterEditora}
              onChange={(e) => setFilterEditora(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        {(searchTerm || filterAutor || filterEditora || filterCategoria) && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-gray-600">Filtros ativos:</span>
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Título: {searchTerm}
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1 hover:text-red-600"
                >
                  ×
                </button>
              </Badge>
            )}
            {filterAutor && (
              <Badge variant="secondary" className="gap-1">
                Autor: {filterAutor}
                <button
                  onClick={() => setFilterAutor('')}
                  className="ml-1 hover:text-red-600"
                >
                  ×
                </button>
              </Badge>
            )}
            {filterEditora && (
              <Badge variant="secondary" className="gap-1">
                Editora: {filterEditora}
                <button
                  onClick={() => setFilterEditora('')}
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
                setSearchTerm('');
                setFilterAutor('');
                setFilterEditora('');
                setFilterCategoria('');
              }}
              className="h-7 text-xs"
            >
              Limpar todos
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Editora</TableHead>
              <TableHead>Edição</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Disponível</TableHead>
              <TableHead>Categorias</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLivros.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-gray-500">
                  Nenhum livro encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredLivros.map((livro) => (
                <TableRow key={livro.id}>
                  <TableCell className="font-medium">{livro.titulo}</TableCell>
                  <TableCell>{livro.autor}</TableCell>
                  <TableCell>{livro.isbn || '-'}</TableCell>
                  <TableCell>{livro.editora || '-'}</TableCell>
                  <TableCell>{livro.edicao || 1}ª</TableCell>
                  <TableCell>{livro.anoPublicacao}</TableCell>
                  <TableCell>{livro.qntTotal}</TableCell>
                  <TableCell>
                    <span className={livro.qntDisponivel > 0 ? 'text-green-600' : 'text-red-600'}>
                      {livro.qntDisponivel}
                    </span>
                  </TableCell>
                  <TableCell>
                    {livro.categorias && livro.categorias.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {livro.categorias.map((cat) => (
                          <Badge key={cat.id} variant="outline" className="text-xs">
                            {cat.nome}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
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
