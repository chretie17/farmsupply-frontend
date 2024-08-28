import React, { useEffect, useState } from 'react';
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
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import api from '../api';

function FarmerManagement() {
  const [farmers, setFarmers] = useState([]);
  const [newFarmer, setNewFarmer] = useState({
    FarmerName: '',
    TelNo: '',
    Address: '',
    AccountNo: '',
    NationalId: '',
    Site: '',
    farmSize: '',
    harvestPerSeason: '',
  });
  const [editingFarmerId, setEditingFarmerId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const role = localStorage.getItem('role');

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const response = await api.get('/farmers');
      setFarmers(response.data);
    } catch (error) {
      console.error('Failed to fetch farmers:', error);
      setSnackbarMessage('Failed to fetch farmers');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleChange = (e) => {
    setNewFarmer({
      ...newFarmer,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateOrUpdateFarmer = async (e) => {
    e.preventDefault();
    try {
      if (editingFarmerId) {
        await api.put(`/farmers/${editingFarmerId}`, newFarmer);
        setEditingFarmerId(null);
        setSnackbarMessage('Farmer updated successfully');
      } else {
        await api.post('/farmers', newFarmer);
        setSnackbarMessage('Farmer added successfully');
      }
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setNewFarmer({
        FarmerName: '',
        TelNo: '',
        Address: '',
        AccountNo: '',
        NationalId: '',
        Site: '',
        farmSize: '',
        harvestPerSeason: '',
      });
      fetchFarmers(); // Refresh farmer list
    } catch (error) {
      console.error('Failed to add or update farmer:', error);
      setSnackbarMessage('Failed to add or update farmer');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleEditFarmer = (farmer) => {
    setNewFarmer({
      FarmerName: farmer.FarmerName || '',
      TelNo: farmer.TelNo || '',
      Address: farmer.Address || '',
      AccountNo: farmer.AccountNo || '',
      NationalId: farmer.NationalId || '',
      Site: farmer.Site || '',
      farmSize: farmer.farmSize || '',
      harvestPerSeason: farmer.harvestPerSeason || '',
    });
    setEditingFarmerId(farmer.FarmerId);
  };

  const handleDeleteFarmer = async (id) => {
    try {
      await api.delete(`/farmers/${id}`);
      setSnackbarMessage('Farmer deleted successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchFarmers(); // Refresh farmer list
    } catch (error) {
      console.error('Failed to delete farmer:', error);
      setSnackbarMessage('Failed to delete farmer');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleApproveFarmer = async (id, status) => {
    try {
      await api.put(`/farmers/${id}/approve`, { status });
      setSnackbarMessage(`Farmer ${status} successfully`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchFarmers(); // Refresh farmer list
    } catch (error) {
      console.error(`Failed to ${status} farmer:`, error);
      setSnackbarMessage(`Failed to ${status} farmer`);
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
        Farmer Management
      </Typography>

      <Paper sx={{ p: 3, mb: 4, backgroundColor: '#f7f7f5' }} elevation={3}>
        <Typography variant="h6" gutterBottom sx={{ color: '#6b8e23' }}>
          {editingFarmerId ? 'Update Farmer' : 'Add New Farmer'}
        </Typography>
        <form onSubmit={handleCreateOrUpdateFarmer}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Farmer Name"
                variant="outlined"
                fullWidth
                name="FarmerName"
                value={newFarmer.FarmerName}
                onChange={handleChange}
                InputProps={{
                  sx: { backgroundColor: '#ffffff' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Telephone Number"
                variant="outlined"
                fullWidth
                name="TelNo"
                value={newFarmer.TelNo}
                onChange={handleChange}
                InputProps={{
                  sx: { backgroundColor: '#ffffff' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Address"
                variant="outlined"
                fullWidth
                name="Address"
                value={newFarmer.Address}
                onChange={handleChange}
                InputProps={{
                  sx: { backgroundColor: '#ffffff' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Account Number"
                variant="outlined"
                fullWidth
                name="AccountNo"
                value={newFarmer.AccountNo}
                onChange={handleChange}
                InputProps={{
                  sx: { backgroundColor: '#ffffff' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="National ID"
                variant="outlined"
                fullWidth
                name="NationalId"
                value={newFarmer.NationalId}
                onChange={handleChange}
                InputProps={{
                  sx: { backgroundColor: '#ffffff' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Site"
                variant="outlined"
                fullWidth
                name="Site"
                value={newFarmer.Site}
                onChange={handleChange}
                InputProps={{
                  sx: { backgroundColor: '#ffffff' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Farm Size (hectares)"
                variant="outlined"
                fullWidth
                name="farmSize"
                value={newFarmer.farmSize}
                onChange={handleChange}
                InputProps={{
                  sx: { backgroundColor: '#ffffff' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Harvest Per Season (tons)"
                variant="outlined"
                fullWidth
                name="harvestPerSeason"
                value={newFarmer.harvestPerSeason}
                onChange={handleChange}
                InputProps={{
                  sx: { backgroundColor: '#ffffff' },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                startIcon={editingFarmerId ? <EditIcon /> : <CheckCircleIcon />}
                sx={{ mt: 2, backgroundColor: '#6b8e23', color: '#ffffff' }}
              >
                {editingFarmerId ? 'Update Farmer' : 'Add Farmer'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper sx={{ p: 3, backgroundColor: '#f7f7f5' }} elevation={3}>
        <Typography variant="h6" gutterBottom sx={{ color: '#6b8e23' }}>
          All Farmers
        </Typography>
        <List>
          {farmers.map((farmer) => (
            <React.Fragment key={farmer.FarmerId}>
              <ListItem>
                <ListItemText
                  primary={`${farmer.FarmerName || 'N/A'} - ${farmer.Site || 'N/A'} - ${farmer.status || 'N/A'}`}
                  secondary={`Contact: ${farmer.TelNo || 'N/A'}, Address: ${farmer.Address || 'N/A'}, Account: ${farmer.AccountNo || 'N/A'}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditFarmer(farmer)}
                    sx={{ color: '#6b8e23' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteFarmer(farmer.FarmerId)}
                    sx={{ color: '#d32f2f' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  {farmer.status === 'pending' && role === 'admin' && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleApproveFarmer(farmer.FarmerId, 'approved')}
                        sx={{ ml: 2 }}
                        startIcon={<CheckCircleIcon />}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleApproveFarmer(farmer.FarmerId, 'rejected')}
                        sx={{ ml: 2 }}
                        startIcon={<CancelIcon />}
                      >
                        Reject
                      </Button>
                    </>
                  )}
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

export default FarmerManagement;
