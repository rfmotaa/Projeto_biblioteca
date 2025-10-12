import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { 
    Container, Typography, Box, Grid, Card, CardContent, CardActions, Button, 
    CircularProgress, Paper, Divider, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import LogoutIcon from '@mui/icons-material/Logout';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const ClienteDashboard = () => {
    const [cliente, setCliente] = useState(null);
    const [livrosDisponiveis, setLivrosDisponiveis] = useState([]);
    const [meusEmprestimos, setMeusEmprestimos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchDados = useCallback(async (clienteId) => {
        setLoading(true);
        try {
            const [livrosRes, emprestimosRes] = await Promise.all([
                api.get('/livros/disponiveis'),
                api.get('/emprestimos')
            ]);

            setLivrosDisponiveis(livrosRes.data);
            
            const emprestimosDoCliente = emprestimosRes.data.filter(
                (emp) => emp.cliente.id_cliente === clienteId && emp.data_retorno_oficial === null
            );
            setMeusEmprestimos(emprestimosDoCliente);

        } catch (error) {
            console.error("Erro ao buscar dados do cliente:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const clienteData = JSON.parse(localStorage.getItem('clienteLogado'));
        if (clienteData) {
            setCliente(clienteData);
            fetchDados(clienteData.id_cliente);
        } else {
            navigate('/');
        }
    }, [fetchDados, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('clienteLogado');
        navigate('/');
    };
    
    const handleDevolver = async (emprestimoId) => {
        if(window.confirm('Tem certeza que deseja registrar a devolução deste livro?')) {
            await api.patch(`/emprestimos/${emprestimoId}/devolucao`);
            fetchDados(cliente.id_cliente);
        }
    };

    const handleRenovar = async (emprestimoId) => {
         if(window.confirm('Tem certeza que deseja renovar este empréstimo?')) {
            await api.patch(`/emprestimos/${emprestimoId}/renovacao`);
            fetchDados(cliente.id_cliente);
        }
    };

    const handleSolicitarEmprestimo = async (livroId) => {
        if(window.confirm('Confirmar a solicitação de empréstimo deste livro?')) {
            try {
                const hoje = new Date();
                const dataRetorno = new Date();
                dataRetorno.setDate(hoje.getDate() + 14); 

                const novoEmprestimo = {
                    cliente: { id_cliente: cliente.id_cliente },
                    livro: { id_livro: livroId },
                    data_retirada: hoje.toISOString().split('T')[0],
                    data_retorno_previsto: dataRetorno.toISOString().split('T')[0],
                };
                
                await api.post('/emprestimos', novoEmprestimo);
                alert('Empréstimo solicitado com sucesso!');
                fetchDados(cliente.id_cliente);
            } catch (error) {
                alert('Falha ao solicitar o empréstimo. Tente novamente.');
                console.error("Erro ao solicitar empréstimo:", error);
            }
        }
    };


    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress size={60} /></Box>;
    }

    const EmptyState = ({ message }) => (
        <Paper elevation={0} sx={{ textAlign: 'center', p: 4, backgroundColor: '#f9f9f9' }}>
            <InfoOutlinedIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
            <Typography color="text.secondary" sx={{ mt: 1 }}>{message}</Typography>
        </Paper>
    );

    return (
        <Box sx={{ backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
                <Paper elevation={2} sx={{ p: 2, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' }}>
                    <Box>
                        <Typography variant="h4" component="h1">Bem-vindo(a), {cliente?.nome}!</Typography>
                        <Typography variant="body1" color="text.secondary">Esta é a sua área pessoal da biblioteca.</Typography>
                    </Box>
                    <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout}>
                        Sair
                    </Button>
                </Paper>

                <Box component={Paper} elevation={2} sx={{ mb: 5, p: 3, backgroundColor: 'white' }}>
                    <Typography variant="h5" gutterBottom>Meus Empréstimos Ativos</Typography>
                    {meusEmprestimos.length > 0 ? (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Livro</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Data de Retirada</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Devolução Prevista</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {meusEmprestimos.map((emp) => (
                                        <TableRow key={emp.id_emprestimo}>
                                            <TableCell>{emp.livro.titulo}</TableCell>
                                            <TableCell>{emp.data_retirada}</TableCell>
                                            <TableCell>{emp.data_retorno_previsto}</TableCell>
                                            <TableCell align="right">
                                                <Button size="small" variant="contained" onClick={() => handleDevolver(emp.id_emprestimo)} sx={{ mr: 1 }}>Devolver</Button>
                                                <Button size="small" variant="outlined" onClick={() => handleRenovar(emp.id_emprestimo)}>Renovar</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <EmptyState message="Você não possui empréstimos ativos no momento." />
                    )}
                </Box>

                <Box>
                    <Typography variant="h5" gutterBottom>Livros Disponíveis para Empréstimo</Typography>
                    <Divider sx={{ mb: 3 }} />
                    <Grid container spacing={3}>
                        {livrosDisponiveis.length > 0 ? (
                            livrosDisponiveis.map((livro) => (
                            <Grid item key={livro.id_livro} xs={12} sm={6} md={4}>
                                <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                            <AutoStoriesIcon color="primary" sx={{ mr: 1.5 }}/>
                                            <Typography variant="h6" component="div">{livro.titulo}</Typography>
                                        </Box>
                                        <Typography sx={{ mb: 1 }} color="text.secondary">Ano: {livro.ano_publicacao}</Typography>
                                        <Typography variant="body2">
                                            <strong>{livro.qnt_disponivel}</strong> {livro.qnt_disponivel > 1 ? 'cópias disponíveis' : 'cópia disponível'}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'flex-end', p:2 }}>
                                        <Button 
                                            size="medium" 
                                            variant="contained" 
                                            color="secondary"
                                            onClick={() => handleSolicitarEmprestimo(livro.id_livro)}
                                        >
                                            Solicitar Empréstimo
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))) : (
                            <Grid item xs={12}>
                            <EmptyState message="Nenhum livro disponível para empréstimo no momento." />
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default ClienteDashboard;