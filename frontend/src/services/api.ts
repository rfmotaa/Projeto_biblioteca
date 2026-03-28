import axios from 'axios';
import type {
  Cliente,
  ClienteDTO,
  Funcionario,
  Livro,
  LivroDTO,
  Emprestimo,
  LoginRequest,
  LoginResponse,
  ClienteForm,
  FuncionarioForm,
  LivroForm,
  EmprestimoForm,
  DashboardAnalytics,
  EmprestimosPorSemana,
  EmprestimosStatus,
  LivroMaisEmprestado,
  PercentualLivros,
  Categoria,
} from './types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For session-based authentication
});

// Auth API
export const authApi = {
  // Employee login
  funcionarioLogin: async (login: string, senha: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/funcionarios/login', { login, senha });
    return response.data;
  },

  // Customer login
  clienteLogin: async (email: string, senha: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/clientes/login', { email, senha });
    return response.data;
  },

  // Employee logout
  funcionarioLogout: async (): Promise<string> => {
    const response = await api.post<string>('/funcionarios/logout');
    return response.data;
  },

  // Customer logout
  clienteLogout: async (): Promise<string> => {
    const response = await api.post<string>('/clientes/logout');
    return response.data;
  },

  // Get authenticated employee
  getAuthenticatedFuncionario: async (): Promise<Funcionario> => {
    const response = await api.get<Funcionario>('/funcionarios/autenticado');
    return response.data;
  },
};

// Clientes API
export const clientesApi = {
  getAll: async (): Promise<Cliente[]> => {
    const response = await api.get<Cliente[]>('/clientes');
    return response.data;
  },

  getById: async (id: number): Promise<Cliente> => {
    const response = await api.get<Cliente>(`/clientes/${id}`);
    return response.data;
  },

  create: async (data: ClienteForm): Promise<Cliente> => {
    // Backend expects senhaHash field, not senha, and status is required
    const response = await api.post<Cliente>('/clientes', {
      nome: data.nome,
      email: data.email,
      senhaHash: data.senha, // Backend stores as plaintext, uses senhaHash field
      status: 'ativo', // Default status for new customers
    });
    return response.data;
  },

  update: async (id: number, data: Partial<ClienteForm>): Promise<Cliente> => {
    const response = await api.put<Cliente>(`/clientes/${id}`, data);
    return response.data;
  },

  toggleStatus: async (id: number, currentStatus: 'ativo' | 'bloqueado'): Promise<Cliente> => {
    // Toggle status - backend now handles partial updates properly
    const newStatus: 'ativo' | 'bloqueado' = currentStatus === 'ativo' ? 'bloqueado' : 'ativo';
    const response = await api.put<Cliente>(`/clientes/${id}`, {
      status: newStatus,
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/clientes/${id}`);
  },

  getByStatus: async (status: 'ativo' | 'bloqueado'): Promise<Cliente[]> => {
    const response = await api.get<Cliente[]>(`/clientes/status/${status}`);
    return response.data;
  },

  getByNome: async (nome: string): Promise<Cliente[]> => {
    const response = await api.get<Cliente[]>('/clientes/nome', { params: { nome } });
    return response.data;
  },

  getByEmail: async (email: string): Promise<Cliente> => {
    const response = await api.get<Cliente>('/clientes/email', { params: { email } });
    return response.data;
  },

  getClientesWithOpenLoans: async (): Promise<Cliente[]> => {
    const response = await api.get<Cliente[]>('/clientes/emprestimos/abertos');
    return response.data;
  },
};

// Funcionarios API
export const funcionariosApi = {
  getAll: async (): Promise<Funcionario[]> => {
    const response = await api.get<Funcionario[]>('/funcionarios');
    return response.data;
  },

  getById: async (id: number): Promise<Funcionario> => {
    const response = await api.get<Funcionario>(`/funcionarios/${id}`);
    return response.data;
  },

  create: async (data: FuncionarioForm): Promise<Funcionario> => {
    // Backend expects senhaHash field, not senha
    const response = await api.post<Funcionario>('/funcionarios', {
      nome: data.nome,
      login: data.login,
      senhaHash: data.senha, // Backend stores as plaintext, uses senhaHash field
    });
    return response.data;
  },

  update: async (id: number, data: Partial<FuncionarioForm>): Promise<Funcionario> => {
    const response = await api.put<Funcionario>(`/funcionarios/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/funcionarios/${id}`);
  },
};

// Livros API
export const livrosApi = {
  getAll: async (): Promise<Livro[]> => {
    const response = await api.get<Livro[]>('/livros');
    return response.data;
  },

  getById: async (id: number): Promise<Livro> => {
    const response = await api.get<Livro>(`/livros/${id}`);
    return response.data;
  },

  create: async (data: LivroForm): Promise<Livro> => {
    const response = await api.post<Livro>('/livros', {
      titulo: data.titulo,
      isbn: data.isbn || undefined,
      editora: data.editora || undefined,
      edicao: data.edicao || 1,
      autor: data.autor,
      anoPublicacao: data.anoPublicacao,
      qntTotal: data.qntTotal,
      qntDisponivel: data.qntTotal, // Default available to total quantity
      categoriaIds: data.categoriaIds,
    });
    return response.data;
  },

  update: async (id: number, data: Partial<LivroForm>): Promise<Livro> => {
    // Fetch existing livro to preserve qntDisponivel
    const existingResponse = await api.get<Livro>(`/livros/${id}`);
    const existing = existingResponse.data;

    // Calculate borrowed books
    const borrowed = existing.qntTotal - existing.qntDisponivel;

    // Calculate new total and available
    const newTotal = data.qntTotal ?? existing.qntTotal;
    const newAvailable = data.qntTotal !== undefined
      ? newTotal - borrowed
      : existing.qntDisponivel;

    // Ensure available doesn't go negative
    const finalAvailable = Math.max(0, newAvailable);

    // Send all fields
    const response = await api.put<Livro>(`/livros/${id}`, {
      titulo: data.titulo ?? existing.titulo,
      isbn: data.isbn !== undefined ? data.isbn : existing.isbn,
      editora: data.editora !== undefined ? data.editora : existing.editora,
      edicao: data.edicao !== undefined ? data.edicao : existing.edicao,
      autor: data.autor ?? existing.autor,
      anoPublicacao: data.anoPublicacao ?? existing.anoPublicacao,
      qntTotal: newTotal,
      qntDisponivel: finalAvailable,
      categoriaIds: data.categoriaIds,
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/livros/${id}`);
  },

  getByTitulo: async (titulo: string): Promise<Livro[]> => {
    const response = await api.get<Livro[]>('/livros/titulo', { params: { titulo } });
    return response.data;
  },

  getByAno: async (ano: number): Promise<Livro[]> => {
    const response = await api.get<Livro[]>('/livros/ano', { params: { ano } });
    return response.data;
  },

  getDisponiveis: async (): Promise<Livro[]> => {
    const response = await api.get<Livro[]>('/livros/disponiveis');
    return response.data;
  },

  getIndisponiveis: async (): Promise<Livro[]> => {
    const response = await api.get<Livro[]>('/livros/indisponiveis');
    return response.data;
  },

  // Novos métodos de busca
  getByAutor: async (autor: string): Promise<Livro[]> => {
    const response = await api.get<Livro[]>('/livros/autor', { params: { autor } });
    return response.data;
  },

  getByEditora: async (editora: string): Promise<Livro[]> => {
    const response = await api.get<Livro[]>('/livros/editora', { params: { editora } });
    return response.data;
  },

  getByIsbn: async (isbn: string): Promise<Livro> => {
    const response = await api.get<Livro>('/livros/isbn', { params: { isbn } });
    return response.data;
  },

  getByCategoria: async (categoriaNome: string): Promise<Livro[]> => {
    const response = await api.get<Livro[]>(`/livros/categoria/${categoriaNome}`);
    return response.data;
  },
};

// ============================================================
// CATEGORIAS API
// ============================================================

export const categoriasApi = {
  getAll: async (): Promise<Categoria[]> => {
    const response = await api.get<Categoria[]>('/categorias');
    return response.data;
  },

  getById: async (id: number): Promise<Categoria> => {
    const response = await api.get<Categoria>(`/categorias/${id}`);
    return response.data;
  },

  getByNome: async (nome: string): Promise<Categoria> => {
    const response = await api.get<Categoria>(`/categorias/nome/${nome}`);
    return response.data;
  },

  create: async (nome: string): Promise<Categoria> => {
    const response = await api.post<Categoria>('/categorias', { nome });
    return response.data;
  },

  update: async (id: number, nome: string): Promise<Categoria> => {
    const response = await api.put<Categoria>(`/categorias/${id}`, { nome });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categorias/${id}`);
  },
};

// Emprestimos API
export const emprestimosApi = {
  getAll: async (): Promise<Emprestimo[]> => {
    const response = await api.get<Emprestimo[]>('/emprestimos');
    return response.data;
  },

  getById: async (id: number): Promise<Emprestimo> => {
    const response = await api.get<Emprestimo>(`/emprestimos/${id}`);
    return response.data;
  },

  getAtivos: async (): Promise<Emprestimo[]> => {
    const response = await api.get<Emprestimo[]>('/emprestimos/ativos');
    return response.data;
  },

  getPendentes: async (): Promise<Emprestimo[]> => {
    const response = await api.get<Emprestimo[]>('/emprestimos/pendentes');
    return response.data;
  },

  // ============================================================
  // CLIENTE - Solicitar Empréstimo
  // ============================================================

  criarSolicitacao: async (clienteId: number, livroId: number): Promise<Emprestimo> => {
    const response = await api.post<Emprestimo>('/emprestimos/solicitacao', {
      clienteId,
      livroId,
    });
    return response.data;
  },

  // ============================================================
  // ADMIN - Gerenciar Solicitações
  // ============================================================

  aprovarSolicitacao: async (id: number): Promise<Emprestimo> => {
    const response = await api.patch<Emprestimo>(`/emprestimos/${id}/aprovar`);
    return response.data;
  },

  rejeitarSolicitacao: async (id: number): Promise<Emprestimo> => {
    const response = await api.patch<Emprestimo>(`/emprestimos/${id}/rejeitar`);
    return response.data;
  },

  // ============================================================
  // ADMIN - Criar Empréstimo Diretamente
  // ============================================================

  criarDireto: async (data: EmprestimoForm): Promise<Emprestimo> => {
    const response = await api.post<Emprestimo>('/emprestimos', {
      clienteId: data.clienteId,
      livroId: data.livroId,
    });
    return response.data;
  },

  // Legacy method name (uses same endpoint)
  create: async (data: EmprestimoForm): Promise<Emprestimo> => {
    return emprestimosApi.criarDireto(data);
  },

  // ============================================================
  // ADMIN - Renovar Empréstimo
  // ============================================================

  renovar: async (id: number): Promise<Emprestimo> => {
    const response = await api.patch<Emprestimo>(`/emprestimos/${id}/renovar`);
    return response.data;
  },

  // Legacy method name (uses same endpoint)
  renovacao: async (id: number): Promise<Emprestimo> => {
    return emprestimosApi.renovar(id);
  },

  // ============================================================
  // ADMIN - Encerrar/Finalizar Empréstimo
  // ============================================================

  finalizar: async (id: number): Promise<Emprestimo> => {
    const response = await api.patch<Emprestimo>(`/emprestimos/${id}/finalizar`);
    return response.data;
  },

  // Legacy method name (uses same endpoint)
  devolucao: async (id: number): Promise<Emprestimo> => {
    return emprestimosApi.finalizar(id);
  },
};

// ============================================================
// Dashboard Analytics API
// ============================================================

export const dashboardAnalyticsApi = {
  /**
   * GET /api/dashboard/analytics
   * Retorna todos os dados consolidados do dashboard de analytics.
   */
  getDashboardAnalytics: async (
    ultimasSemanas?: number,
    topLivros?: number
  ): Promise<DashboardAnalytics> => {
    const params: Record<string, number> = {};
    if (ultimasSemanas !== undefined) {
      params.ultimasSemanas = ultimasSemanas;
    }
    if (topLivros !== undefined) {
      params.topLivros = topLivros;
    }

    const response = await api.get<DashboardAnalytics>('/api/dashboard/analytics', {
      params: Object.keys(params).length > 0 ? params : undefined,
    });
    return response.data;
  },

  /**
   * GET /api/dashboard/emprestimos-por-semana
   * Retorna a contagem de empréstimos agrupados por semana e ano.
   */
  getEmprestimosPorSemana: async (
    ultimasSemanas?: number
  ): Promise<EmprestimosPorSemana[]> => {
    const params = ultimasSemanas !== undefined ? { ultimasSemanas } : undefined;
    const response = await api.get<EmprestimosPorSemana[]>(
      '/api/dashboard/emprestimos-por-semana',
      { params }
    );
    return response.data;
  },

  /**
   * GET /api/dashboard/emprestimos-status
   * Retorna a contagem de empréstimos por status.
   */
  getEmprestimosStatus: async (): Promise<EmprestimosStatus> => {
    const response = await api.get<EmprestimosStatus>(
      '/api/dashboard/emprestimos-status'
    );
    return response.data;
  },

  /**
   * GET /api/dashboard/livros-mais-emprestados
   * Retorna o ranking dos livros mais emprestados.
   */
  getLivrosMaisEmprestados: async (
    top?: number
  ): Promise<LivroMaisEmprestado[]> => {
    const params = top !== undefined ? { top } : undefined;
    const response = await api.get<LivroMaisEmprestado[]>(
      '/api/dashboard/livros-mais-emprestados',
      { params }
    );
    return response.data;
  },

  /**
   * GET /api/dashboard/percentual-livros
   * Retorna o percentual de livros disponíveis em relação ao total.
   */
  getPercentualLivros: async (): Promise<PercentualLivros> => {
    const response = await api.get<PercentualLivros>(
      '/api/dashboard/percentual-livros'
    );
    return response.data;
  },
};

// ============================================================
// NOTIFICAÇÕES API
// ============================================================

export const notificacoesApi = {
  getNaoLidas: async (clienteId: number): Promise<Notificacao[]> => {
    const response = await api.get<Notificacao[]>(`/notificacoes/cliente/${clienteId}`);
    return response.data;
  },

  contarNaoLidas: async (clienteId: number): Promise<number> => {
    const response = await api.get<number>(`/notificacoes/cliente/${clienteId}/contar`);
    return response.data;
  },

  marcarComoLida: async (notificacaoId: number): Promise<void> => {
    await api.patch(`/notificacoes/${notificacaoId}/marcar-lida`);
  },

  marcarTodasComoLidas: async (clienteId: number): Promise<void> => {
    await api.patch(`/notificacoes/cliente/${clienteId}/marcar-todas-lidas`);
  },
};

// ============================================================
// INTERESSES API
// ============================================================

export const interessesApi = {
  adicionarInteresse: async (clienteId: number, livroId: number): Promise<void> => {
    await api.post(`/interesses/cliente/${clienteId}`, { livroId });
  },

  removerInteresse: async (clienteId: number, livroId: number): Promise<void> => {
    await api.delete(`/interesses/cliente/${clienteId}/livro/${livroId}`);
  },

  listarInteresses: async (clienteId: number): Promise<LivroInteresse[]> => {
    const response = await api.get<LivroInteresse[]>(`/interesses/cliente/${clienteId}`);
    return response.data;
  },

  verificarInteresse: async (clienteId: number, livroId: number): Promise<boolean> => {
    const response = await api.get<boolean>(`/interesses/cliente/${clienteId}/verificar/${livroId}`);
    return response.data;
  },
};

// Export default api instance for custom requests
export default api;
