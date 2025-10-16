import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { TextField, Button, Container, Typography, Box, Grid } from '@mui/material';

const ClienteLoginPage = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/clientes/login', { email, senha });

            if (response.data.status === 'sucesso') {
                const clienteResponse = await api.get(`/clientes/email?email=${email}`);
                if (clienteResponse.data) { 
                    const cliente = clienteResponse.data; 
                    localStorage.setItem('clienteLogado', JSON.stringify(cliente));
                    navigate('/cliente/dashboard');
                } else {
                    setError('Não foi possível encontrar os dados do cliente após o login.');
                }
            } else {
                setError(response.data.mensagem || 'E-mail ou senha incorretos.');
            }
        } catch (err) {
            setError('Ocorreu um erro. Tente novamente.');
            console.error("Erro no login do cliente:", err);
        }
    };


    return (
        <Container maxWidth="xs">
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h5"> Login do Cliente </Typography>
            <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                <TextField margin="normal" required fullWidth id="email" label="E-mail" name="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)}/>
                <TextField margin="normal" required fullWidth name="password" label="Senha" type="password" id="password" autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)}/>
                {error && <Typography color="error" align="center">{error}</Typography>}
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}> Entrar </Button>
                <Grid container>
                    <Grid item>
                        <Button component={Link} to="/cadastro/cliente" fullWidth variant="outlined" sx={{ mt: 1 }}>Não tem uma conta? Cadastre-se</Button>
                    </Grid>
                </Grid>
                <Button component={Link} to="/" fullWidth variant="text" sx={{ mt: 1 }}> Voltar </Button>
            </Box>
        </Box>
        </Container>
    );
};

export default ClienteLoginPage;