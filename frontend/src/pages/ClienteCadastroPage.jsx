import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { TextField, Button, Container, Typography, Box, Grid } from '@mui/material';

const ClienteCadastroPage = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senhaHash, setSenhaHash] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [error, setError] = useState('');
    const [senhaError, setSenhaError] = useState('');

    const navigate = useNavigate();

    const SENHA_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;

    const validarSenha = (currentSenha) => {
        if (!SENHA_REGEX.test(currentSenha)) {
            return "A senha deve ter entre 8 e 12 caracteres e incluir maiúsculas, minúsculas, números e símbolos (@$!%*?&).";
        }
        
        const senhasComuns = ['password', '12345678', 'senha123', 'admin', 'qwerty'];
        if (senhasComuns.includes(currentSenha.toLowerCase())) {
             return "A senha é muito comum. Por favor, escolha outra.";
        }

        return ''; 
    };

    const handleSenhaChange = (e) => {
        const novaSenha = e.target.value;
        setSenhaHash(novaSenha); 
        const validationError = validarSenha(novaSenha);
        setSenhaError(validationError);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSenhaError('');

        if (senhaHash !== confirmaSenha) {
            setError('A senha e a confirmação de senha não coincidem.');
            return;
        }

        const validationError = validarSenha(senhaHash);
        if (validationError) {
             setSenhaError(validationError);
             return;
        }
        
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
                            <TextField required fullWidth id="email" label="Endereço de E-mail" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                required fullWidth 
                                name="password" 
                                label="Senha" 
                                type="password" 
                                id="password" 
                                value={senhaHash} 
                                onChange={handleSenhaChange}
                                error={!!senhaError}
                                helperText={senhaError || "8-12 caracteres, c/ maiúsculas, minúsculas, números e símbolos."}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                required fullWidth 
                                name="confirmPassword" 
                                label="Confirmação de Senha" 
                                type="password" 
                                id="confirmPassword" 
                                value={confirmaSenha} 
                                onChange={(e) => setConfirmaSenha(e.target.value)}
                                error={!!error && error.includes('não coincidem')}
                            />
                        </Grid>
                    </Grid>
                    {error && !senhaError && <Typography color="error" align="center" sx={{ mt: 2 }}>{error}</Typography>}
                    
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={!!senhaError}>Cadastrar</Button>
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