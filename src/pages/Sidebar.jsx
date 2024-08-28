import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, Typography, Divider, Button, ListItemIcon, Paper } from '@mui/material';
import styled from 'styled-components';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import TrainingIcon from '@mui/icons-material/School';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AgricultureIcon from '@mui/icons-material/Agriculture';

const SidebarContainer = styled.div`
  width: 240px;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f0ebe1; /* Light beige background color */
  color: #3e4e3e; /* Dark brown text color */
  border-radius: 20px; /* Rounded edges */
  margin: 10px; /* Add some margin for better appearance */
  overflow: hidden; /* Ensure the content stays within rounded edges */
`;

const ListContainer = styled.div`
  flex-grow: 1;
`;

const LogoutContainer = styled.div`
  padding: 16px;
`;

const ActiveCard = styled(Paper)`
  background-color: #d9e8d4; /* Light green background for active card */
  border-left: 5px solid #8cae68; /* Dark green border for active card */
  margin-left: -16px;
  margin-right: -16px;
  padding-left: 16px;
  border-radius: 10px; /* Rounded edges for active card */
`;

const Sidebar = () => {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const renderMenuItem = (to, icon, text) => {
    const isActive = location.pathname === to;
    const MenuItemContent = (
      <ListItem button component={Link} to={to}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItem>
    );

    return isActive ? (
      <ActiveCard elevation={3} key={to}>
        {MenuItemContent}
      </ActiveCard>
    ) : (
      <React.Fragment key={to}>{MenuItemContent}</React.Fragment>
    );
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: 240,
          backgroundColor: 'transparent',
          border: 'none',
        },
      }}
    >
      <SidebarContainer>
        <Typography variant="h6" sx={{ padding: '16px', display: 'flex', alignItems: 'center' }}>
          <AgricultureIcon fontSize="large" sx={{ marginRight: '8px', color: '#8cae68' }} />
          ONE ACRE FUND
        </Typography>
        <Divider />
        <ListContainer>
          <List>
            {role === 'admin' && (
              <>
                {renderMenuItem('/admin/dashboard', <DashboardIcon sx={{ color: '#8cae68' }} />, 'Admin Dashboard')}
                {renderMenuItem('/admin/users', <GroupIcon sx={{ color: '#8cae68' }} />, 'Users')}
                {renderMenuItem('/farmer-management', <GroupIcon sx={{ color: '#8cae68' }} />, 'Farmers Management')}
                {renderMenuItem('/admin/trainings', <TrainingIcon sx={{ color: '#8cae68' }} />, 'Manage Trainings')}
              </>
            )}
            {role === 'field-officer' && (
              <>
                {renderMenuItem('/field-officer/dashboard', <DashboardIcon sx={{ color: '#8cae68' }} />, 'Field Officer Dashboard')}
                {renderMenuItem('/farmer-management', <GroupIcon sx={{ color: '#8cae68' }} />, 'Farmers Management')}
                {renderMenuItem('/field-officer/trainings', <TrainingIcon sx={{ color: '#8cae68' }} />, 'Manage Trainings')}
              </>
            )}
            {role === 'trainee' && (
              <>
                {renderMenuItem('/trainee/dashboard', <DashboardIcon sx={{ color: '#8cae68' }} />, 'Trainee Dashboard')}
              </>
            )}
          </List>
        </ListContainer>
        <Divider />
        <LogoutContainer>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            fullWidth
            startIcon={<ExitToAppIcon />}
            sx={{
              backgroundColor: '#8cae68', /* Dark green for the logout button */
              color: '#ffffff',
              borderRadius: '10px', /* Rounded edges for logout button */
              '&:hover': {
                backgroundColor: '#6e8b4e', /* Slightly darker green on hover */
              },
            }}
          >
            Logout
          </Button>
        </LogoutContainer>
      </SidebarContainer>
    </Drawer>
  );
};

export default Sidebar;
