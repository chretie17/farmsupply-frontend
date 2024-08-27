import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, Typography, Divider, Button } from '@mui/material';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 240px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ListContainer = styled.div`
  flex-grow: 1;
`;

const LogoutContainer = styled.div`
  padding: 16px;
`;

const Sidebar = () => {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the local storage and redirect to the login page
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <Drawer variant="permanent" anchor="left">
      <SidebarContainer>
        <Typography variant="h6" sx={{ padding: '16px' }}>
          Menu
        </Typography>
        <ListContainer>
          <List>
            {role === 'admin' && (
              <>
                <ListItem button component={Link} to="/admin/dashboard">
                  <ListItemText primary="Admin Dashboard" />
                </ListItem>
                <ListItem button component={Link} to="/admin/users">
                  <ListItemText primary="Users" />
                </ListItem>
                <ListItem button component={Link} to="/farmer-management">
                  <ListItemText primary="Farmers Management" />
                </ListItem>
                <ListItem button component={Link} to="/admin/trainings">
                  <ListItemText primary="Manage Trainings" />
                </ListItem>
              </>
            )}
            {role === 'field-officer' && (
              <>
                <ListItem button component={Link} to="/field-officer/dashboard">
                  <ListItemText primary="Field Officer Dashboard" />
                </ListItem>
                <ListItem button component={Link} to="/farmer-management">
                  <ListItemText primary="Farmers Management" />
                </ListItem>
                <ListItem button component={Link} to="/field-officer/trainings">
                  <ListItemText primary="Manage Trainings" />
                </ListItem>
              </>
            )}
            {role === 'trainee' && (
              <>
                <ListItem button component={Link} to="/trainee/dashboard">
                  <ListItemText primary="Trainee Dashboard" />
                </ListItem>
              </>
            )}
          </List>
        </ListContainer>
        <Divider />
        <LogoutContainer>
          <Button variant="contained" color="secondary" onClick={handleLogout} fullWidth>
            Logout
          </Button>
        </LogoutContainer>
      </SidebarContainer>
    </Drawer>
  );
};

export default Sidebar;
