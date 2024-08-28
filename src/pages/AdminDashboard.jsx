import React from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import TrainingIcon from '@mui/icons-material/School';
import AgricultureIcon from '@mui/icons-material/Agriculture';

function AdminDashboard() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: '#3e4e3e', fontWeight: 'bold' }}>
        Admin Dashboard
      </Typography>
      <Typography variant="subtitle1" align="center" sx={{ mb: 4, color: '#6b8e23' }}>
        Welcome to the Admin Dashboard
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#f7f7f5',
              color: '#3e4e3e',
            }}
          >
            <DashboardIcon fontSize="large" sx={{ color: '#6b8e23' }} />
            <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
              Dashboard Overview
            </Typography>
            <Typography variant="body2" align="center">
              Get a quick overview of key metrics and insights for your farm operations.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#f7f7f5',
              color: '#3e4e3e',
            }}
          >
            <GroupIcon fontSize="large" sx={{ color: '#6b8e23' }} />
            <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
              Manage Users
            </Typography>
            <Typography variant="body2" align="center">
              View and manage user accounts including farmers, trainees, and field officers.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#f7f7f5',
              color: '#3e4e3e',
            }}
          >
            <TrainingIcon fontSize="large" sx={{ color: '#6b8e23' }} />
            <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
              Manage Trainings
            </Typography>
            <Typography variant="body2" align="center">
              Oversee training programs and materials available to trainees and field officers.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}


export default AdminDashboard;
