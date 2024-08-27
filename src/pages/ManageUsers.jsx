import React, { useEffect, useState } from 'react';
import api from '../api';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: '' });
  const [editingUserId, setEditingUserId] = useState(null); // Track the user being edited

  const roles = ['admin', 'field-officer', 'trainee']; // Define available roles

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleCreateOrUpdateUser = async () => {
    try {
      if (editingUserId) {
        // Update the user if editing
        await api.put(`/users/${editingUserId}`, newUser);
        setEditingUserId(null); // Reset editing state
      } else {
        // Create a new user
        await api.post('/users', newUser);
      }
      setNewUser({ username: '', email: '', password: '', role: '' }); // Clear the form
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Failed to create or update user:', error);
    }
  };

  const handleEditUser = (user) => {
    setNewUser({ username: user.username, email: user.email, password: '', role: user.role });
    setEditingUserId(user.id);
  };

  const handleDeleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
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
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
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
              sx={{ mt: 2 }}
            >
              {editingUserId ? 'Update User' : 'Create User'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
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
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteUser(user.id)}
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
    </Box>
  );
}

export default UserManagement;
