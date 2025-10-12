import { Routes, Route } from 'react-router-dom';

import MainLayout from '../components/MainLayout.jsx';

// Rotas Públicas
import LandingPage from '../pages/LandingPage';
import FuncionarioLoginPage from '../pages/FuncionarioLoginPage';
import ClienteLoginPage from '../pages/ClienteLoginPage';

// Rotas Privadas - Funcionário
import PrivateRoute from './PrivateRoute';
import Dashboard from '../pages/Dashboard';
import LivrosPage from '../pages/LivrosPage';
import ClientesPage from '../pages/ClientesPage';
import EmprestimosPage from '../pages/EmprestimosPage';


// Rotas Privadas - Cliente
import ClientePrivateRoute from './ClientePrivateRoute';
import ClienteDashboard from '../pages/ClienteDashboard';

const AppRoutes = () => {
    return (
        <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/funcionario" element={<FuncionarioLoginPage />} />
        <Route path="/login/cliente" element={<ClienteLoginPage />} />
        
        {/* Rotas Privadas do Funcionário (com layout) */}
        <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/livros" element={<LivrosPage />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/emprestimos" element={<EmprestimosPage />} />
            </Route>
        </Route>

        {/* Rotas Privadas do Cliente */}
        <Route element={<ClientePrivateRoute />}>
            <Route path="/cliente/dashboard" element={<ClienteDashboard />} />
        </Route>
        </Routes>
    );
};

export default AppRoutes;