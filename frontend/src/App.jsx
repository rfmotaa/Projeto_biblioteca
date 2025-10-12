import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx'; 
import { CssBaseline } from '@mui/material';     

function App() {
  return (
    <AuthProvider>
      <Router>
        <CssBaseline />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;