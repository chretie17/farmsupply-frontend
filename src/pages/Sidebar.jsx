import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Typography } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  BookOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import styled from 'styled-components';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const SidebarContainer = styled(Sider)`
  background-color: #f0ebe1 !important;
  color: #3e4e3e !important;
  border-radius: 20px;
  margin: 10px;
  overflow: hidden;
`;

const StyledMenu = styled(Menu)`
  background-color: #f0ebe1 !important;
  color: #3e4e3e !important;

  .ant-menu-item-selected {
    background-color: #d9e8d4 !important;
    border-left: 5px solid #8cae68 !important;
  }

  .ant-menu-item {
    &:hover {
      background-color: #d9e8d4 !important;
    }
  }

  .ant-menu-item-icon {
    color: #8cae68 !important;
  }
`;

const LogoutButton = styled(Button)`
  background-color: #8cae68 !important;
  color: #ffffff !important;
  border-radius: 10px !important;
  width: 100%;
  margin-top: 20px;

  &:hover {
    background-color: #6e8b4e !important;
    color: #ffffff !important;
  }
`;

const UserTitle = styled(Title)`
  color: #3e4e3e !important;
  margin-bottom: 20px !important;
  text-align: center;
`;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const getUserTitle = (role) => {
    switch (role) {
      case 'admin':
        return 'Admin Portal';
      case 'field-officer':
        return 'Field Officer Hub';
      case 'finance-officer':
        return 'Finance Center';
      case 'trainee':
        return 'Trainee Learning Portal';
      default:
        return 'Welcome';
    }
  };

  const getMenuItems = (role) => {
    const items = [];

    switch (role) {
      case 'admin':
        items.push(
          { key: '/admin/dashboard', icon: <DashboardOutlined />, label: <Link to="/admin/dashboard">Dashboard</Link> },
          { key: '/admin/users', icon: <TeamOutlined />, label: <Link to="/admin/users">Users</Link> },
          { key: '/farmer-management', icon: <TeamOutlined />, label: <Link to="/farmer-management">Farmers Management</Link> },
          { key: '/admin/trainings', icon: <BookOutlined />, label: <Link to="/admin/trainings">Manage Trainings</Link> },
          { key: '/admin/orders', icon: <BookOutlined />, label: <Link to="/admin/orders">All Orders</Link> },
          { key: '/finance/orders', icon: <BookOutlined />, label: <Link to="/finance/orders">Manage Order Status</Link> },
          { key: '/admin/reports', icon: <BookOutlined />, label: <Link to="/admin/reports">Reports</Link> }

        );
        break;
      case 'field-officer':
        items.push(
          { key: '/field-officer/dashboard', icon: <DashboardOutlined />, label: <Link to="/field-officer/dashboard">Dashboard</Link> },
          { key: '/farmer-management', icon: <TeamOutlined />, label: <Link to="/farmer-management">Farmers Management</Link> },
          { key: '/field-officer/trainings', icon: <BookOutlined />, label: <Link to="/field-officer/trainings">Manage Trainings</Link> },
          { key: '/field-officer/orders', icon: <BookOutlined />, label: <Link to="/field-officer/orders">Orders Done</Link> },
          { key: '/field-officer/products', icon: <BookOutlined />, label: <Link to="/field-officer/products">Manage Products</Link> }
        );
        break;
      case 'finance-officer':
        items.push(
          { key: '/finance/dashboard', icon: <DashboardOutlined />, label: <Link to="/finance/dashboard">Dashboard</Link> }
        );
        break;
      case 'trainee':
        items.push(
          { key: '/trainee/dashboard', icon: <DashboardOutlined />, label: <Link to="/trainee/dashboard">Dashboard</Link> }
        );
        break;
    }

    return items;
  };

  const menuItems = getMenuItems(role);

  return (
    <Layout>
      <SidebarContainer trigger={null} collapsible collapsed={collapsed}>
        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AgricultureIcon fontSize="large" style={{ marginRight: '8px', color: '#8cae68' }} />
          {!collapsed && <Typography.Title level={5} style={{ margin: 0, color: '#3e4e3e' }}>ONE ACRE FUND</Typography.Title>}
        </div>
        {!collapsed && <UserTitle level={4}>{getUserTitle(role)}</UserTitle>}
        <StyledMenu theme="light" mode="inline" selectedKeys={[location.pathname]} items={menuItems} />
        <div style={{ padding: '16px' }}>
          <LogoutButton icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </LogoutButton>
        </div>
      </SidebarContainer>
    </Layout>
  );
};

export default Sidebar;
