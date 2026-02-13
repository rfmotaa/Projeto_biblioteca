import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext.jsx';
import api from '../services/api.js';
import { Container, Typography, Grid, Paper, Box, Button, CircularProgress } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const Dashboard = () => {
    const { funcionario } = useAuth();
    const [stats, setStats] = useState({
        totalLivros: 0,
        totalClientes: 0,
        totalEmprestimos: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [livrosResponse, clientesResponse, emprestimosResponse] = await Promise.all([
                    api.get('/livros'),
                    api.get('/clientes'),
                    api.get('/emprestimos')
                ]);

                setStats({
                    totalLivros: livrosResponse.data.length,
                    totalClientes: clientesResponse.data.length,
                    totalEmprestimos: emprestimosResponse.data.length,
                });
            } catch (error) {
                console.error("Erro ao buscar estatísticas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom> Dashboard </Typography>
                <Typography variant="h6" component="p"> Olá, {funcionario?.nome || 'Funcionário'}! Bem-vindo(a) ao sistema. </Typography>
            </Box>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4} lg={4}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <MenuBookIcon color="primary" sx={{ fontSize: 40, mb: 1 }}/>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom> Total de Livros </Typography>
                            <Typography component="p" variant="h4">{stats.totalLivros}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <PeopleIcon color="secondary" sx={{ fontSize: 40, mb: 1 }}/>
                            <Typography component="h2" variant="h6" color="secondary" gutterBottom> Clientes Cadastrados</Typography>
                            <Typography component="p" variant="h4">{stats.totalClientes}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ReceiptLongIcon style={{ color: '#f57c00' }} sx={{ fontSize: 40, mb: 1 }}/>
                            <Typography component="h2" variant="h6" style={{ color: '#f57c00' }} gutterBottom>Empréstimos Realizados</Typography>
                            <Typography component="p" variant="h4">{stats.totalEmprestimos}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            <Box sx={{ mt: 5, borderTop: '1px solid #ddd', pt: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Ações Rápidas
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Button component={Link} to="/livros" variant="contained" fullWidth size="large">Gerenciar Livros</Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button component={Link} to="/clientes" variant="contained" fullWidth size="large">Gerenciar Clientes</Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button component={Link} to="/emprestimos" variant="contained" fullWidth size="large">Gerenciar Empréstimos</Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Dashboard;