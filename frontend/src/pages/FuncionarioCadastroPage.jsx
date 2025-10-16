import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { TextField, Button, Container, Typography, Box, Grid } from '@mui/material';

const FuncionarioCadastroPage = () => {
    const [nome, setNome] = useState('');
    const [login, setLogin] = useState('');
    const [senhaHash, setSenha] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const novoFuncionario = { nome, login, senhaHash };

        try {
            await api.post('/funcionarios', novoFuncionario);
            alert('Funcionário cadastrado com sucesso!');
            navigate('/login/funcionario');
        } catch (err) {
            setError('Erro ao cadastrar funcionário. Verifique se o login já existe.');
            console.error("Erro no cadastro do funcionário:", err);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Cadastro de Funcionário
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField name="nome" required fullWidth label="Nome Completo" autoFocus value={nome} onChange={(e) => setNome(e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField required fullWidth label="Login de Acesso" name="login" value={login} onChange={(e) => setLogin(e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField required fullWidth name="password" label="Senha" type="password" value={senhaHash} onChange={(e) => setSenha(e.target.value)} />
                        </Grid>
                    </Grid>
                    {error && <Typography color="error" align="center" sx={{ mt: 2 }}>{error}</Typography>}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Cadastrar
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Button component={Link} to="/login/funcionario" fullWidth variant="outlined" sx={{ mt: 1 }}>Já é cadastrado? Faça login</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default FuncionarioCadastroPage;