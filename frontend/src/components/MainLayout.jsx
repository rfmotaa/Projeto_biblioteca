import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext.jsx';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, CssBaseline, AppBar, Toolbar, Typography, Drawer } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

const MainLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Livros', icon: <BookIcon />, path: '/livros' },
        { text: 'Clientes', icon: <PeopleIcon />, path: '/clientes' },
        { text: 'Empréstimos', icon: <ReceiptLongIcon />, path: '/emprestimos' },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Painel Administrativo
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding component={Link} to={item.path} sx={{ color: 'inherit', textDecoration: 'none' }}>
                                <ListItemButton>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <ListItem disablePadding onClick={handleLogout}>
                        <ListItemButton>
                            <ListItemIcon><LogoutIcon /></ListItemIcon>
                            <ListItemText primary="Sair" />
                        </ListItemButton>
                    </ListItem>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {/* O conteúdo da página atual será renderizado aqui */}
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;