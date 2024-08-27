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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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

  const role = localStorage.getItem('role');

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const response = await api.get('/farmers');
      console.log('Farmers data:', response.data);
      setFarmers(response.data);
    } catch (error) {
      console.error('Failed to fetch farmers:', error);
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
      } else {
        await api.post('/farmers', newFarmer);
      }
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
      fetchFarmers(); // Refresh farmer list
    } catch (error) {
      console.error('Failed to delete farmer:', error);
    }
  };

  const handleApproveFarmer = async (id, status) => {
    try {
      await api.put(`/farmers/${id}/approve`, { status });
      fetchFarmers(); // Refresh farmer list
    } catch (error) {
      console.error(`Failed to ${status} farmer:`, error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Farmer Management
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
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
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 2 }}
              >
                {editingFarmerId ? 'Update Farmer' : 'Add Farmer'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
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
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteFarmer(farmer.FarmerId)}
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
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleApproveFarmer(farmer.FarmerId, 'rejected')}
                        sx={{ ml: 2 }}
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
    </Box>
  );
}

export default FarmerManagement;
