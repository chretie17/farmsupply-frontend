import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, List, ListItem, ListItemText, Divider, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const response = await api.get('/trainings');
      setTrainings(response.data);
    } catch (error) {
      console.error('Failed to fetch trainings:', error);
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
      } else {
        await api.post('/trainings', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setNewTraining({
        TrainingTitle: '',
        Description: '',
        ScheduledDate: '',
        PdfFile: null,
      });
      fetchTrainings(); // Refresh training list
    } catch (error) {
      console.error('Failed to create or update training:', error);
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
      fetchTrainings(); // Refresh training list
    } catch (error) {
      console.error('Failed to delete training:', error);
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Training Management
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
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
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" component="label" sx={{ mt: 2 }}>
                {newTraining.PdfFile ? newTraining.PdfFile.name : 'Upload PDF'}
                <input type="file" hidden name="PdfFile" onChange={handleChange} />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                {editingTrainingId ? 'Update Training' : 'Add Training'}
              </Button>
              <Button variant="outlined" onClick={handleReset} sx={{ mt: 2, ml: 2 }}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
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
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteTraining(training.TrainingId)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default ManageTrainings;
