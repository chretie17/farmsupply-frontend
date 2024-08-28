import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import AgricultureIcon from '@mui/icons-material/Agriculture';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

 // Frontend - Login component
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await api.post('/auth/login', { username, password });
    const { token, role, userId } = response.data; // Capture userId from the response

    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('user_id', userId); // Save user ID in local storage

    // Navigate based on user role
    switch (role) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'field-officer':
        navigate('/field-officer/dashboard');
        break;
      case 'trainee':
        navigate('/trainee/dashboard');
        break;
      case 'finance-officer':
        navigate('/finance/dashboard');
        break;
      default:
        console.error('Unknown role:', role);
        break;
    }
  } catch (err) {
    console.error('Login failed:', err);
  }
};


  return (
    <>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="logo">
            <AgricultureIcon fontSize="large" />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#3e4e3e' }}>
            Farm Supply
          </Typography>
          <Button
            color="inherit"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{ color: '#3e4e3e' }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            startIcon={<LoginIcon />}
            onClick={() => navigate('/')}
            sx={{ color: '#3e4e3e' }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            mt: 8,
            borderRadius: 2,
            backgroundColor: '#f7f7f5',
            boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ color: '#3e4e3e', fontWeight: 'bold' }}
          >
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Username or Email"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                InputProps={{
                  sx: { backgroundColor: '#ffffff' },
                }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  sx: { backgroundColor: '#ffffff' },
                }}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: '#6b8e23',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#556b2f',
                },
              }}
              fullWidth
            >
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
}

export default Login;
