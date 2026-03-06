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

export interface Livro {
  id: number;
  titulo: string;
  anoPublicacao: number;
  qntTotal: number;
  qntDisponivel: number;
}

export interface LivroDTO {
  id: number;
  titulo: string;
  anoPublicacao: number;
  qntTotal: number;
  qntDisponivel: number;
  emprestimosIds: number[];
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
  anoPublicacao: number;
  qntTotal: number;
}

export interface LivroUpdateForm {
  titulo?: string;
  anoPublicacao?: number;
  qntTotal?: number;
  qntDisponivel?: number;
}

export interface EmprestimoForm {
  clienteId: number;
  livroId: number;
  dataRetirada: string;
  dataRetornoPrevisto: string;
}
