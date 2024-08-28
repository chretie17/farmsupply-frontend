import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import api from '../api';

function ManageTrainings() {
  const [trainings, setTrainings] = useState([]);
  const [newTraining, setNewTraining] = useState({
    TrainingTitle: '',
    Description: '',
    ScheduledDate: '',
    PdfFile: null,
  });
  const [editingTrainingId, setEditingTrainingId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const response = await api.get('/trainings');
      setTrainings(response.data);
    } catch (error) {
      console.error('Failed to fetch trainings:', error);
      setSnackbarMessage('Failed to fetch trainings');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'PdfFile' && files) {
      setNewTraining({ ...newTraining, PdfFile: files[0] });
    } else {
      setNewTraining({ ...newTraining, [name]: value });
    }
  };

  const handleCreateOrUpdateTraining = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('TrainingTitle', newTraining.TrainingTitle);
    formData.append('Description', newTraining.Description);
    formData.append('ScheduledDate', newTraining.ScheduledDate);
    if (newTraining.PdfFile) {
      formData.append('pdf', newTraining.PdfFile);
    }

    try {
      if (editingTrainingId) {
        await api.put(`/trainings/${editingTrainingId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setEditingTrainingId(null);
        setSnackbarMessage('Training updated successfully');
      } else {
        await api.post('/trainings', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setSnackbarMessage('Training added successfully');
      }

      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      setNewTraining({
        TrainingTitle: '',
        Description: '',
        ScheduledDate: '',
        PdfFile: null,
      });
      fetchTrainings(); // Refresh training list
    } catch (error) {
      console.error('Failed to create or update training:', error);
      setSnackbarMessage('Failed to create or update training');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleEditTraining = (training) => {
    setNewTraining({
      TrainingTitle: training.TrainingTitle,
      Description: training.Description,
      ScheduledDate: training.ScheduledDate,
      PdfFile: null, // PDF upload is optional, so reset the file field
    });
    setEditingTrainingId(training.TrainingId);
  };

  const handleDeleteTraining = async (id) => {
    try {
      await api.delete(`/trainings/${id}`);
      setSnackbarMessage('Training deleted successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchTrainings(); // Refresh training list
    } catch (error) {
      console.error('Failed to delete training:', error);
      setSnackbarMessage('Failed to delete training');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleReset = () => {
    setNewTraining({
      TrainingTitle: '',
      Description: '',
      ScheduledDate: '',
      PdfFile: null,
    });
    setEditingTrainingId(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: '#3e4e3e', fontWeight: 'bold' }}>
        Training Management
      </Typography>

      <Paper sx={{ p: 3, mb: 4, backgroundColor: '#f7f7f5' }} elevation={3}>
        <Typography variant="h6" gutterBottom sx={{ color: '#6b8e23' }}>
          {editingTrainingId ? 'Update Training' : 'Add New Training'}
        </Typography>
        <form onSubmit={handleCreateOrUpdateTraining}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Training Title"
                variant="outlined"
                fullWidth
                name="TrainingTitle"
                value={newTraining.TrainingTitle}
                onChange={handleChange}
                required
                InputProps={{
                  sx: { backgroundColor: '#ffffff' },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                name="Description"
                value={newTraining.Description}
                onChange={handleChange}
                required
                InputProps={{
                  sx: { backgroundColor: '#ffffff' },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Scheduled Date"
                type="date"
                variant="outlined"
                fullWidth
                name="ScheduledDate"
                InputLabelProps={{ shrink: true }}
                value={newTraining.ScheduledDate}
                onChange={handleChange}
                required
                InputProps={{
                  sx: { backgroundColor: '#ffffff' },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" component="label" startIcon={<UploadFileIcon />} sx={{ mt: 2, backgroundColor: '#6b8e23', color: '#ffffff' }}>
                {newTraining.PdfFile ? newTraining.PdfFile.name : 'Upload PDF'}
                <input type="file" hidden name="PdfFile" onChange={handleChange} />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit" sx={{ mt: 2, backgroundColor: '#6b8e23', color: '#ffffff' }}>
                {editingTrainingId ? 'Update Training' : 'Add Training'}
              </Button>
              <Button variant="outlined" onClick={handleReset} sx={{ mt: 2, ml: 2, color: '#6b8e23', borderColor: '#6b8e23' }}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper sx={{ p: 3, backgroundColor: '#f7f7f5' }} elevation={3}>
        <Typography variant="h6" gutterBottom sx={{ color: '#6b8e23' }}>
          All Trainings
        </Typography>
        <List>
          {trainings.map((training) => (
            <React.Fragment key={training.TrainingId}>
              <ListItem>
                <ListItemText
                  primary={training.TrainingTitle}
                  secondary={`Scheduled Date: ${training.ScheduledDate || 'Not scheduled'}`}
                />
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEditTraining(training)}
                  sx={{ color: '#6b8e23' }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteTraining(training.TrainingId)}
                  sx={{ color: '#d32f2f' }}
                >
                  <DeleteIcon />
                </IconButton>
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

export default ManageTrainings;
