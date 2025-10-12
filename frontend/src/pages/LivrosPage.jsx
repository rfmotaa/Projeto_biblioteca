import { useState, useEffect } from 'react';
import api from '../services/api.js';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, Container } from '@mui/material';

const LivrosPage = () => {
    const [livros, setLivros] = useState([]);

    const fetchLivros = async () => {
        const response = await api.get('/livros');
        setLivros(response.data);
    };

    useEffect(() => {
        fetchLivros();
    }, []);

    const handleDeletar = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este livro?")) {
        await api.delete(`/livros/${id}`);
        fetchLivros(); 
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1">Gerenciamento de Livros</Typography>
            <Button variant="contained" color="primary">Adicionar Livro</Button>
        </Box>
        <TableContainer component={Paper}>
            <Table>
            <TableHead>
                <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Ano</TableCell>
                <TableCell>Qtd. Total</TableCell>
                <TableCell>Qtd. Disponível</TableCell>
                <TableCell align="right">Ações</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {livros.map((livro) => (
                <TableRow key={livro.id_livro}>
                    <TableCell>{livro.id_livro}</TableCell>
                    <TableCell>{livro.titulo}</TableCell>
                    <TableCell>{livro.ano_publicacao}</TableCell>
                    <TableCell>{livro.qnt_total}</TableCell>
                    <TableCell>{livro.qnt_disponivel}</TableCell>
                    <TableCell align="right">
                    <Button size="small" variant="outlined" sx={{ mr: 1 }}>Editar</Button>
                    <Button size="small" variant="outlined" color="error" onClick={() => handleDeletar(livro.id_livro)}>Excluir</Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
        </Container>
    );
};

export default LivrosPage;