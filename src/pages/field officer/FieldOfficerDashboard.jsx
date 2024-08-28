import React from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AgricultureIcon from '@mui/icons-material/Agriculture';

function FieldOfficerDashboard() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: '#3e4e3e', fontWeight: 'bold' }}>
        Field Officer Dashboard
      </Typography>
      <Typography variant="subtitle1" align="center" sx={{ mb: 4, color: '#6b8e23' }}>
        Welcome to the Field Officer Dashboard
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
              Overview
            </Typography>
            <Typography variant="body2" align="center">
              Get a summary of your field operations, including visits, assessments, and upcoming tasks.
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
              Farmer Management
            </Typography>
            <Typography variant="body2" align="center">
              Manage your assigned farmers, including visits, status updates, and reporting.
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
            <AssignmentIcon fontSize="large" sx={{ color: '#6b8e23' }} />
            <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
              Task Management
            </Typography>
            <Typography variant="body2" align="center">
              View and manage your tasks, including scheduling and reporting.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default FieldOfficerDashboard;
