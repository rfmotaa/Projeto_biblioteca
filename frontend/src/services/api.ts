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
    // Backend expects qntDisponivel field, which should default to qntTotal
    const response = await api.post<Livro>('/livros', {
      titulo: data.titulo,
      anoPublicacao: data.anoPublicacao,
      qntTotal: data.qntTotal,
      qntDisponivel: data.qntTotal, // Default available to total quantity
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
      anoPublicacao: data.anoPublicacao ?? existing.anoPublicacao,
      qntTotal: newTotal,
      qntDisponivel: finalAvailable,
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

  create: async (data: EmprestimoForm): Promise<Emprestimo> => {
    // Backend expects full Cliente and Livro objects, not just IDs
    // We need to fetch the full objects first
    const [clienteResponse, livroResponse] = await Promise.all([
      api.get<Cliente>(`/clientes/${data.clienteId}`),
      api.get<Livro>(`/livros/${data.livroId}`),
    ]);

    const cliente = clienteResponse.data;
    const livro = livroResponse.data;

    const response = await api.post<Emprestimo>('/emprestimos', {
      cliente: cliente, // Full Cliente object
      livro: livro, // Full Livro object
      dataRetirada: data.dataRetirada,
      dataRetornoPrevisto: data.dataRetornoPrevisto,
    });
    return response.data;
  },

  update: async (id: number, data: Partial<EmprestimoForm>): Promise<Emprestimo> => {
    const response = await api.put<Emprestimo>(`/emprestimos/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/emprestimos/${id}`);
  },

  devolucao: async (id: number): Promise<Emprestimo> => {
    const response = await api.patch<Emprestimo>(`/emprestimos/${id}/devolucao`);
    return response.data;
  },

  renovacao: async (id: number): Promise<Emprestimo> => {
    const response = await api.patch<Emprestimo>(`/emprestimos/${id}/renovacao`);
    return response.data;
  },

  // Loan Request System
  criarSolicitacao: async (clienteId: number, livroId: number): Promise<Emprestimo> => {
    // Backend expects full Cliente and Livro objects
    const [clienteResponse, livroResponse] = await Promise.all([
      api.get<Cliente>(`/clientes/${clienteId}`),
      api.get<Livro>(`/livros/${livroId}`),
    ]);

    const response = await api.post<Emprestimo>('/emprestimos/solicitacao', {
      cliente: clienteResponse.data,
      livro: livroResponse.data,
    });
    return response.data;
  },

  getPendentes: async (): Promise<Emprestimo[]> => {
    const response = await api.get<Emprestimo[]>('/emprestimos/pendentes');
    return response.data;
  },

  aprovarSolicitacao: async (id: number): Promise<Emprestimo> => {
    const response = await api.patch<Emprestimo>(`/emprestimos/${id}/aprovar`);
    return response.data;
  },

  rejeitarSolicitacao: async (id: number): Promise<Emprestimo> => {
    const response = await api.patch<Emprestimo>(`/emprestimos/${id}/rejeitar`);
    return response.data;
  },
};

// Export default api instance for custom requests
export default api;
