import { useState, useEffect } from 'react';
import api from '../services/api.js';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Box } from '@mui/material';

const EmprestimosPage = () => {
    const [emprestimos, setEmprestimos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmprestimos = async () => {
            try {
                const response = await api.get('/emprestimos');
                setEmprestimos(response.data);
            } catch (error) {
                console.error("Erro ao buscar empréstimos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEmprestimos();
    }, []);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Todos os Empréstimos</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Livro</TableCell>
                            <TableCell>Data de Retirada</TableCell>
                            <TableCell>Devolução Prevista</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {emprestimos.map((emp) => (
                            <TableRow key={emp.id}>
                                <TableCell>{emp.id}</TableCell>
                                <TableCell>{emp.cliente.nome}</TableCell>
                                <TableCell>{emp.livro.titulo}</TableCell>
                                <TableCell>{emp.dataRetirada}</TableCell>
                                <TableCell>{emp.dataRetornoPrevisto}</TableCell>
                                <TableCell>{emp.dataRetornoOficial ? `Devolvido em ${emp.dataRetornoOficial}` : 'Em aberto'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default EmprestimosPage;