import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Container,
    Snackbar,
    Alert
} from '@mui/material';
import { LoginCredentials, authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [credentials, setCredentials] = useState<LoginCredentials>({
        email: '',
        senha: ''
    });
    const [error, setError] = useState<string | null>(null);

    console.log('Renderizando Login, error:', error);

    useEffect(() => {
        if (isAuthenticated) {
            console.log('isAuthenticated changed to true, navigating to /...');
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = await authService.login(credentials);
            login(token); // Atualiza o contexto de autenticação
            console.log('Login realizado com token:', token);
            // Navegação será feita pelo useEffect
        } catch (err: any) {
            console.error('Erro ao fazer login:', err);
            setError(null);
            setTimeout(() => {
                setError('Usuário ou senha inválidos');
                console.log('Setou error para: Usuário ou senha inválidos');
            }, 10);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Paper sx={{ p: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Login
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="senha"
                            label="Senha"
                            type="password"
                            id="senha"
                            autoComplete="current-password"
                            value={credentials.senha}
                            onChange={(e) => setCredentials({ ...credentials, senha: e.target.value })}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Entrar
                        </Button>
                    </Box>
                </Paper>
            </Box>
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError(null)}
            >
                <Alert severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
} 