import { useState, useEffect } from 'react';
import api from '../services/api.js';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Grid, Box, Container, TextField } from '@mui/material';

const initialFormState = {
    titulo: '',
    anoPublicacao: '',
    qntTotal: 1,
    qntDisponivel: 1,
};

const LivrosPage = () => {
    const [livros, setLivros] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState(initialFormState);
    const [editingId, setEditingId] = useState(null);

    const fetchLivros = async () => {
        const response = await api.get('/livros');
        setLivros(response.data);
    };

    useEffect(() => {
        fetchLivros();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleShowAddForm = () => {
        setFormData(initialFormState);
        setEditingId(null);
        setShowForm(true);
    };

    const handleShowEditForm = (livro) => {
        setFormData({
            titulo: livro.titulo,
            anoPublicacao: livro.anoPublicacao,
            qntTotal: livro.qntTotal,
            qntDisponivel: livro.qntDisponivel,
        });
        setEditingId(livro.id);
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setFormData(initialFormState);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const livroData = {
            ...formData,
            anoPublicacao: parseInt(formData.anoPublicacao, 10),
            qntTotal: parseInt(formData.qntTotal, 10),
            qntDisponivel: parseInt(formData.qntDisponivel, 10)
        };

        if (livroData.qntDisponivel > livroData.qntTotal) {
            alert('Erro: A quantidade disponível não pode ser maior que a quantidade total.');
            return; 
        }

        if (editingId) {
            await api.put(`/livros/${editingId}`, livroData);
        } else {
            await api.post('/livros', livroData);
        }
        
        fetchLivros();
        handleCancel();
    };

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
                <Button variant="contained" color="primary" onClick={handleShowAddForm}>Adicionar Livro</Button>
            </Box>
            {showForm && (
                <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>{editingId ? 'Editar Livro' : 'Adicionar Novo Livro'}</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField name="titulo" label="Título do Livro"
                                value={formData.titulo} onChange={handleInputChange} fullWidth required/>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField name="anoPublicacao" label="Ano de Publicação" type="number" value={formData.anoPublicacao} onChange={handleInputChange} fullWidth required/>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField name="qntTotal" label="Quantidade Total" type="number" value={formData.qntTotal} onChange={handleInputChange} fullWidth required/>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField name="qntDisponivel" label="Quantidade Disponível" type="number" value={formData.qntDisponivel} onChange={handleInputChange} fullWidth required/>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleCancel} sx={{ mr: 1 }}>Cancelar</Button>
                        <Button type="submit" variant="contained">Salvar</Button>
                    </Box>
                </Paper>
            )}
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
                            <TableRow key={livro.id}>
                                <TableCell>{livro.id}</TableCell>
                                <TableCell>{livro.titulo}</TableCell>
                                <TableCell>{livro.anoPublicacao}</TableCell>
                                <TableCell>{livro.qntTotal}</TableCell>
                                <TableCell>{livro.qntDisponivel}</TableCell>
                                <TableCell align="right">
                                    <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={() => handleShowEditForm(livro)}>Editar</Button>
                                    <Button size="small" variant="outlined" color="error" onClick={() => handleDeletar(livro.id)}>Excluir</Button>
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