import { createContext, useState, useContext } from 'react';
import api from '../services/api.js'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [funcionario, setFuncionario] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (login, senha) => {
        try {
            const response = await api.post('/funcionarios/login', { login, senha });
            if (response.data.status === 'sucesso') {
                const userResponse = await api.get('/funcionarios/autenticado');
                setFuncionario(userResponse.data);
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Erro no login:", error);
            setIsAuthenticated(false);
            return false;
        }
    };

    const logout = async () => {
        setFuncionario(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, funcionario, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};