import React, { useEffect, useState } from 'react';
import api from '../../api';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: '' });
  const [editingUserId, setEditingUserId] = useState(null); // Track the user being edited
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const roles = ['admin', 'field-officer', 'trainee', 'finance-officer']; // Define available roles

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setSnackbarMessage('Failed to fetch users');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCreateOrUpdateUser = async () => {
    try {
      if (editingUserId) {
        // Update the user if editing
        await api.put(`/users/${editingUserId}`, newUser);
        setEditingUserId(null); // Reset editing state
        setSnackbarMessage('User updated successfully');
      } else {
        // Create a new user
        await api.post('/users', newUser);
        setSnackbarMessage('User created successfully');
      }
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setNewUser({ username: '', email: '', password: '', role: '' }); // Clear the form
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Failed to create or update user:', error);
      setSnackbarMessage('Failed to create or update user');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleEditUser = (user) => {
    setNewUser({ username: user.username, email: user.email, password: '', role: user.role });
    setEditingUserId(user.id);
  };

  const handleDeleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setSnackbarMessage('User deleted successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Failed to delete user:', error);
      setSnackbarMessage('Failed to delete user');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: '#3e4e3e', fontWeight: 'bold' }}>
        User Management
      </Typography>

      <Paper sx={{ p: 3, mb: 4, backgroundColor: '#f7f7f5' }} elevation={3}>
        <Typography variant="h6" gutterBottom sx={{ color: '#6b8e23' }}>
          {editingUserId ? 'Update User' : 'Create New User'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              InputProps={{
                sx: { backgroundColor: '#ffffff' },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              InputProps={{
                sx: { backgroundColor: '#ffffff' },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              InputProps={{
                sx: { backgroundColor: '#ffffff' },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                label="Role"
                sx={{ backgroundColor: '#ffffff' }}
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateOrUpdateUser}
              startIcon={editingUserId ? <EditIcon /> : <AddCircleOutlineIcon />}
              sx={{ mt: 2, backgroundColor: '#6b8e23', color: '#ffffff' }}
            >
              {editingUserId ? 'Update User' : 'Create User'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, backgroundColor: '#f7f7f5' }} elevation={3}>
        <Typography variant="h6" gutterBottom sx={{ color: '#6b8e23' }}>
          All Users
        </Typography>
        <List>
          {users.map((user) => (
            <React.Fragment key={user.id}>
              <ListItem>
                <ListItemText
                  primary={`${user.username} (${user.role})`}
                  secondary={user.email}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditUser(user)}
                    sx={{ color: '#6b8e23' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteUser(user.id)}
                    sx={{ color: '#d32f2f' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default UserManagement;
