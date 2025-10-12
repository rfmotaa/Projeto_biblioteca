import { useState } from 'react';
import api from '../services/api.js';
import { TextField, Button, Box, Typography, List, ListItem, ListItemText, Paper, Divider } from '@mui/material';

const ClientesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if (!searchTerm) return;
        try {
            const response = await api.get(`/clientes/nome?nome=${searchTerm}`);
            setResults(response.data);
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
            setResults([]);
        } finally {
            setSearched(true);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Busca de Clientes</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <TextField 
                    label="Buscar por nome ou email" 
                    variant="outlined" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flexGrow: 1, mr: 2 }}
                />
                <Button variant="contained" onClick={handleSearch}>Buscar</Button>
            </Box>

            {searched && (
                <Paper elevation={2}>
                    <List>
                        {results.length > 0 ? (
                            results.map((cliente, index) => (
                                <React.Fragment key={cliente.id_cliente}>
                                    <ListItem>
                                        <ListItemText 
                                            primary={cliente.nome}
                                            secondary={`Email: ${cliente.email} | Status: ${cliente.status}`}
                                        />
                                    </ListItem>
                                    {index < results.length - 1 && <Divider />}
                                </React.Fragment>
                            ))
                        ) : (
                            <ListItem>
                                <ListItemText primary="Nenhum cliente encontrado." />
                            </ListItem>
                        )}
                    </List>
                </Paper>
            )}
        </Box>
    );
};

export default ClientesPage;