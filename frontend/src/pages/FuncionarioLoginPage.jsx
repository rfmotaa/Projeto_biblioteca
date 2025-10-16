import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext.jsx';
import { TextField, Button, Container, Typography, Box, Grid } from '@mui/material';

const FuncionarioLoginPage = () => {
    const [loginField, setLoginField] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const success = await login(loginField, senha);
        if (success) {
        navigate('/dashboard');
        } else {
        setError('Login ou senha incorretos.');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5"> Login do Funcionário </Typography>
                <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                    <TextField margin="normal" required fullWidth id="login" label="Login" name="login" autoFocus value={loginField} onChange={(e) => setLoginField(e.target.value)}/>
                    <TextField margin="normal" required fullWidth name="password" label="Senha" type="password" id="password" value={senha} onChange={(e) => setSenha(e.target.value)}/>
                    {error && <Typography color="error">{error}</Typography>}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 1 }}> Entrar </Button>
                    <Grid container>
                        <Grid item>
                            <Button component={Link} to="/cadastro/funcionario" fullWidth variant="outlined" sx={{ mt: 1 }}>Criar Nova Conta</Button>
                        </Grid>
                    </Grid>
                    <Button component={Link} to="/" fullWidth variant="text" sx={{ mt: 1 }}> Voltar </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default FuncionarioLoginPage;