// API Types based on Backend schema

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  status: 'ativo' | 'bloqueado';
}

export interface ClienteDTO {
  id: number;
  nome: string;
  email: string;
  status: 'ativo' | 'bloqueado';
  emprestimosIds: number[];
}

export interface Funcionario {
  id: number;
  nome: string;
  login: string;
}

export interface Categoria {
  id: number;
  nome: string;
}

export interface Livro {
  id: number;
  titulo: string;
  isbn?: string;
  editora?: string;
  edicao?: number;
  autor: string;
  anoPublicacao: number;
  qntTotal: number;
  qntDisponivel: number;
  categorias?: Categoria[];
}

export interface LivroDTO {
  id: number;
  titulo: string;
  isbn?: string;
  editora?: string;
  edicao?: number;
  autor: string;
  anoPublicacao: number;
  qntTotal: number;
  qntDisponivel: number;
  emprestimosIds: number[];
  categorias?: Categoria[];
}

export type StatusEmprestimo = 'PENDENTE' | 'APROVADO' | 'REJEITADO' | 'ATIVO' | 'FINALIZADO';

export interface Emprestimo {
  id: number;
  dataRetirada: string;
  dataRetornoPrevisto: string;
  dataRetornoOficial: string | null;
  cliente: ClienteDTO;
  livro: LivroDTO;
  status?: StatusEmprestimo;
  estaAtrasado?: boolean;
  numeroRenovacoes?: number;
}

export interface LoginRequest {
  login?: string;
  email?: string;
  senha: string;
}

export interface LoginResponse {
  status: 'sucesso' | 'erro';
  mensagem: string;
}

// Form types
export interface ClienteForm {
  nome: string;
  email: string;
  senha: string;
}

export interface ClienteUpdateForm {
  nome?: string;
  email?: string;
  senhaHash?: string;
  status?: 'ativo' | 'bloqueado';
}

export interface FuncionarioForm {
  nome: string;
  login: string;
  senha: string;
}

export interface LivroForm {
  titulo: string;
  isbn?: string;
  editora?: string;
  edicao?: number;
  autor: string;
  anoPublicacao: number;
  qntTotal: number;
  categoriaIds?: number[];
}

export interface LivroUpdateForm {
  titulo?: string;
  isbn?: string;
  editora?: string;
  edicao?: number;
  autor?: string;
  anoPublicacao?: number;
  qntTotal?: number;
  qntDisponivel?: number;
  categoriaIds?: number[];
}

export interface EmprestimoForm {
  clienteId: number;
  livroId: number;
  dataRetirada: string;
  dataRetornoPrevisto: string;
}

// ============================================================
// Dashboard Analytics Types
// ============================================================

export interface EmprestimosPorSemana {
  semana: number;
  ano: number;
  quantidade: number;
}

export interface EmprestimosStatus {
  solicitados: number;
  negados: number;
  aprovados: number;
  atrasados: number;
}

export interface LivroMaisEmprestado {
  id: number;
  titulo: string;
  qtdEmprestimos: number;
}

export interface PercentualLivros {
  livrosTotais: number;
  livrosDisponiveis: number;
  percentual: number;
}

export interface DashboardAnalytics {
  emprestimosPorSemana: EmprestimosPorSemana[];
  emprestimosStatus: EmprestimosStatus;
  livrosMaisEmprestados: LivroMaisEmprestado[];
  percentualLivros: PercentualLivros;
}

// ============================================================
// Notificações e Lista de Interesse Types
// ============================================================

export type TipoNotificacao = 'VENCIMENTO_PROXIMO' | 'LIVRO_DISPONIVEL';

export interface Notificacao {
  id: number;
  mensagem: string;
  tipoNotificacao: TipoNotificacao;
  lida: boolean;
  dataCriacao: string;
  livro?: Livro;
}

export interface LivroInteresse {
  id: number;
  cliente: ClienteDTO;
  livro: LivroDTO;
  dataCriacao: string;
}

export interface LivroInteresseRequest {
  livroId: number;
}
