import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { TextField, Button, Container, Typography, Box, Grid } from '@mui/material';

const ClienteCadastroPage = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senhaHash, setSenha] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const novoCliente = {
            nome,
            email,
            senhaHash,
            status: 'ativo'
        };

        try {
            await api.post('/clientes', novoCliente);
            alert('Cadastro realizado com sucesso! Você já pode fazer o login.');
            navigate('/login/cliente');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Erro ao realizar o cadastro. Verifique se o e-mail já está em uso.';
            setError(errorMessage);
            console.error("Erro no cadastro do cliente:", err);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Cadastro de Cliente
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField name="nome" required fullWidth id="nome" label="Nome Completo" autoFocus value={nome} onChange={(e) => setNome(e.target.value)}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField required fullWidthid="email" label="Endereço de E-mail" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField required fullWidth name="password" label="Senha" type="password" id="password" value={senhaHash} onChange={(e) => setSenha(e.target.value)}/>
                        </Grid>
                    </Grid>
                    {error && <Typography color="error" align="center" sx={{ mt: 2 }}>{error}</Typography>}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Cadastrar</Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Button component={Link} to="/login/cliente" fullWidth variant="outlined" sx={{ mt: 1 }}>Já tem uma conta? Faça login</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default ClienteCadastroPage;