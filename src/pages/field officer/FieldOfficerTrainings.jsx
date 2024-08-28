import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import api from '../../api';

function FieldOfficerTrainings() {
  const [trainings, setTrainings] = useState([]);

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

  const handleViewPdf = (trainingId) => {
    window.open(`http://localhost:3000/api/trainings/${trainingId}/pdf`, '_blank');
};


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Trainings
      </Typography>

      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          Available Trainings
        </Typography>
        <List>
          {trainings.map((training) => (
            <React.Fragment key={training.TrainingId}>
              <ListItem>
                <ListItemText
                  primary={training.TrainingTitle}
                  secondary={`Scheduled Date: ${training.ScheduledDate || 'Not scheduled'}`}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewPdf(training.TrainingId)}
                >
                  View PDF
                </Button>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default FieldOfficerTrainings;
