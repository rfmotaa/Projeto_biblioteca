import { Navigate, Outlet } from 'react-router-dom';

const ClientePrivateRoute = () => {
    const clienteLogado = localStorage.getItem('clienteLogado');

    return clienteLogado ? <Outlet /> : <Navigate to="/" />;
};

export default ClientePrivateRoute;