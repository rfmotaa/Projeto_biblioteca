import { createBrowserRouter } from 'react-router';
import { PrivateRoute } from './components/PrivateRoute';
import { ClientePrivateRoute } from './components/ClientePrivateRoute';
import { MainLayout } from './components/MainLayout';

// Páginas públicas
import LandingPage from './pages/LandingPage';
import FuncionarioLoginPage from './pages/FuncionarioLoginPage';
import ClienteLoginPage from './pages/ClienteLoginPage';
import ClienteCadastroPage from './pages/ClienteCadastroPage';
import FuncionarioCadastroPage from './pages/FuncionarioCadastroPage';

// Páginas privadas - Funcionário
import Dashboard from './pages/Dashboard';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import LivrosPage from './pages/LivrosPage';
import ClientesPage from './pages/ClientesPage';
import EmprestimosPage from './pages/EmprestimosPage';

// Páginas privadas - Cliente
import ClienteDashboard from './pages/ClienteDashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LandingPage,
  },
  {
    path: '/login/funcionario',
    Component: FuncionarioLoginPage,
  },
  {
    path: '/login/cliente',
    Component: ClienteLoginPage,
  },
  {
    path: '/cadastro/cliente',
    Component: ClienteCadastroPage,
  },
  {
    path: '/cadastro/funcionario',
    Component: FuncionarioCadastroPage,
  },
  {
    path: '/',
    Component: PrivateRoute,
    children: [
      {
        path: '/',
        Component: MainLayout,
        children: [
          {
            path: 'dashboard',
            Component: Dashboard,
          },
          {
            path: 'analytics',
            Component: AdminAnalyticsPage,
          },
          {
            path: 'livros',
            Component: LivrosPage,
          },
          {
            path: 'clientes',
            Component: ClientesPage,
          },
          {
            path: 'emprestimos',
            Component: EmprestimosPage,
          },
        ],
      },
    ],
  },
  {
    path: '/',
    Component: ClientePrivateRoute,
    children: [
      {
        path: 'cliente/dashboard',
        Component: ClienteDashboard,
      },
    ],
  },
]);
