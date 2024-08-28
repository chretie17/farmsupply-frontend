import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Typography } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  BookOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import AgricultureIcon from '@mui/icons-material/Agriculture'; // Importing the AgricultureIcon
import styled from 'styled-components';

const { Header, Sider, Content } = Layout;

const SidebarContainer = styled(Sider)`
  background-color: #f0ebe1 !important; /* Light beige background color */
  color: #3e4e3e !important; /* Dark brown text color */
  border-radius: 20px; /* Rounded edges */
  margin: 10px; /* Add some margin for better appearance */
  overflow: hidden; /* Ensure the content stays within rounded edges */
`;

const StyledMenu = styled(Menu)`
  background-color: #f0ebe1 !important;
  color: #3e4e3e !important;

  .ant-menu-item-selected {
    background-color: #d9e8d4 !important; /* Light green background for active menu item */
    border-left: 5px solid #8cae68 !important; /* Dark green border for active menu item */
  }

  .ant-menu-item {
    &:hover {
      background-color: #d9e8d4 !important;
    }
  }

  .ant-menu-item-icon {
    color: #8cae68 !important; /* Dark green icon color */
  }
`;

const LogoutButton = styled(Button)`
  background-color: #8cae68 !important; /* Dark green for the logout button */
  color: #ffffff !important;
  border-radius: 10px !important; /* Rounded edges for logout button */
  width: 100%;
  margin-top: 20px;

  &:hover {
    background-color: #6e8b4e !important; /* Slightly darker green on hover */
    color: #ffffff !important;
  }
`;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Admin Dashboard</Link>,
    },
    {
      key: '/admin/users',
      icon: <TeamOutlined />,
      label: <Link to="/admin/users">Users</Link>,
    },
    {
      key: '/farmer-management',
      icon: <TeamOutlined />,
      label: <Link to="/farmer-management">Farmers Management</Link>,
    },
    {
      key: '/admin/trainings',
      icon: <BookOutlined />,
      label: <Link to="/admin/trainings">Manage Trainings</Link>,
    },
  ];

  return (
    <Layout>
      <SidebarContainer trigger={null} collapsible collapsed={collapsed}>
        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AgricultureIcon fontSize="large" style={{ marginRight: '8px', color: '#8cae68' }} />
          {!collapsed && <Typography.Title level={5} style={{ margin: 0, color: '#3e4e3e' }}>ONE ACRE FUND</Typography.Title>}
        </div>
        <StyledMenu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
        <div style={{ padding: '16px' }}>
          <LogoutButton icon={<LogoutOutlined />}>Logout</LogoutButton>
        </div>
      </SidebarContainer>
      <Layout>
        <Header style={{ padding: 0, backgroundColor: '#f0ebe1', borderRadius: '20px' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              color: '#3e4e3e',
            }}
          />
        </Header>
      </Layout>
    </Layout>
  );
};

export default App;
