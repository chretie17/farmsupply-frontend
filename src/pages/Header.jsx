import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role'); // Example of role-based rendering

  const handleLogout = () => {
    // Clear local storage and navigate to the login page
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #ccc' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="logo" component={Link} to="/">
          <AgricultureIcon fontSize="large" sx={{ color: '#6b8e23' }} />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, color: '#3e4e3e', fontWeight: 'bold' }}>
          Farm Management System
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button color="inherit" component={Link} to="/" sx={{ color: '#3e4e3e' }}>
            Home
          </Button>
          {role && (
            <>
              <Button color="inherit" component={Link} to={`/${role}/dashboard`} sx={{ color: '#3e4e3e' }}>
                Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/profile" sx={{ color: '#3e4e3e' }}>
                Profile
              </Button>
              <Button color="inherit" onClick={handleLogout} sx={{ color: '#3e4e3e' }}>
                Logout
              </Button>
            </>
          )}
          {!role && (
            <Button color="inherit" component={Link} to="/login" sx={{ color: '#3e4e3e' }}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
