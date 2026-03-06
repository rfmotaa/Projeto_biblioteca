import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, clientesApi } from '../services/api';
import type { Funcionario, Cliente } from '../services/types';

interface User {
  id: number;
  nome: string;
  email?: string;
  login?: string;
  tipo: 'funcionario' | 'cliente';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginFuncionario: (login: string, senha: string) => Promise<boolean>;
  loginCliente: (email: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário salvo no sessionStorage
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const loginFuncionario = async (login: string, senha: string): Promise<boolean> => {
    try {
      const response = await authApi.funcionarioLogin(login, senha);
      if (response.status === 'sucesso') {
        const userResponse = await authApi.getAuthenticatedFuncionario();
        const userData: User = {
          id: userResponse.id,
          nome: userResponse.nome,
          login: userResponse.login,
          tipo: 'funcionario',
        };
        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro no login de funcionário:', error);
      return false;
    }
  };

  const loginCliente = async (email: string, senha: string): Promise<boolean> => {
    try {
      const response = await authApi.clienteLogin(email, senha);
      if (response.status === 'sucesso') {
        // Fetch cliente data by email after successful login
        const clienteData = await clientesApi.getByEmail(email);
        const userData: User = {
          id: clienteData.id,
          nome: clienteData.nome,
          email: clienteData.email,
          tipo: 'cliente',
        };
        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro no login de cliente:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      if (user?.tipo === 'funcionario') {
        await authApi.funcionarioLogout();
      } else if (user?.tipo === 'cliente') {
        await authApi.clienteLogout();
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setUser(null);
      sessionStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loginFuncionario,
        loginCliente,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
