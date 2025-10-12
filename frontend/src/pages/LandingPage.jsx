import { Link } from 'react-router-dom';
import { Container, Typography, Box, Grid, Paper, Card, CardActionArea, CardContent } from '@mui/material';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonIcon from '@mui/icons-material/Person';

const LandingPage = () => {
    return (
        <Container component="main" maxWidth="md">
        <Box
            sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            }}
        >
            <Typography component="h1" variant="h3" gutterBottom>
            Bem-vindo ao Sistema da Biblioteca
            </Typography>
            <Typography component="h2" variant="h5" color="text.secondary" sx={{ mb: 6 }}>
            Por favor, selecione o tipo de acesso:
            </Typography>
            
            <Grid container spacing={4} justifyContent="center">
            {/* Card para Login de Funcionário */}
            <Grid item xs={12} sm={6}>
                <Card sx={{ height: '100%' }}>
                <CardActionArea component={Link} to="/login/funcionario" sx={{ height: '100%', p: 3 }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <SupervisorAccountIcon sx={{ fontSize: 60 }} color="primary" />
                    <Typography gutterBottom variant="h5" component="div" sx={{ mt: 2 }}>
                        Sou Funcionário
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Acessar o painel administrativo para gerenciar livros, clientes e empréstimos.
                    </Typography>
                    </CardContent>
                </CardActionArea>
                </Card>
            </Grid>

            {/* Card para Login de Cliente */}
            <Grid item xs={12} sm={6}>
                <Card sx={{ height: '100%' }}>
                <CardActionArea component={Link} to="/login/cliente" sx={{ height: '100%', p: 3 }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <PersonIcon sx={{ fontSize: 60 }} color="secondary" />
                    <Typography gutterBottom variant="h5" component="div" sx={{ mt: 2 }}>
                        Sou Cliente
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Acessar sua área para visualizar empréstimos e informações pessoais.
                    </Typography>
                    </CardContent>
                </CardActionArea>
                </Card>
            </Grid>
            </Grid>
        </Box>
        </Container>
    );
};

export default LandingPage;