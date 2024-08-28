import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  People as UsersIcon,
  ShoppingBag as ProductsIcon,
  CreditCard as OrdersIcon,
  TrendingUp as RevenueIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from '@mui/icons-material';
import api from '../../api';

// Create the MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Styled-components theme to ensure compatibility
const styledTheme = {
  palette: theme.palette,
};

// Styled components using styled-components
const DashboardContainer = styled(Box)`
  padding: 24px;
  background-color: ${(props) => props.theme.palette.background.default || '#f5f5f5'};
`;

const MetricCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const MetricCardContent = styled(CardContent)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const MetricValue = styled(Typography)`
  font-size: 2rem;
  font-weight: bold;
  margin-top: 8px;
`;

const MetricChange = styled(Typography)`
  display: flex;
  align-items: center;
  margin-top: 8px;
  color: ${(props) => (props.isPositive ? '#4caf50' : '#f44336')};
`;

const ChartCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ChartCardContent = styled(CardContent)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ChartTitle = styled(Typography)`
  margin-bottom: 16px;
`;

const MetricCardIcon = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${(props) => props.bgcolor};
  color: white;
`;

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [ordersPerDay, setOrdersPerDay] = useState([]);
  const [productsPerDay, setProductsPerDay] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [metricsResponse, ordersResponse, productsResponse, revenueResponse] = await Promise.all([
          api.get('/admin/metrics'),
          api.get('/admin/orders-per-day'),
          api.get('/admin/products-per-day'),
          api.get('/admin/weekly-revenue'),
        ]);

        setMetrics(metricsResponse.data);
        setOrdersPerDay(ordersResponse.data);
        setProductsPerDay(productsResponse.data);
        setRevenueData(revenueResponse.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h5">Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <StyledThemeProvider theme={styledTheme}>
        <CssBaseline />
        <DashboardContainer>
          <Typography variant="h4" gutterBottom>
            Admin Dashboard
          </Typography>

          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard>
                <MetricCardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" color="textSecondary">
                      Total Users
                    </Typography>
                    <MetricCardIcon bgcolor="#3f51b5">
                      <UsersIcon />
                    </MetricCardIcon>
                  </Box>
                  <MetricValue>{metrics?.totalUsers?.toLocaleString() || '0'}</MetricValue>
                  <MetricChange isPositive={metrics?.userGrowth >= 0}>
                    {metrics?.userGrowth >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    {Math.abs(metrics?.userGrowth || 0)}% from last month
                  </MetricChange>
                </MetricCardContent>
              </MetricCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <MetricCard>
                <MetricCardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" color="textSecondary">
                      Total Products
                    </Typography>
                    <MetricCardIcon bgcolor="#f50057">
                      <ProductsIcon />
                    </MetricCardIcon>
                  </Box>
                  <MetricValue>{metrics?.totalProducts?.toLocaleString() || '0'}</MetricValue>
                  <MetricChange isPositive={metrics?.productGrowth >= 0}>
                    {metrics?.productGrowth >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    {Math.abs(metrics?.productGrowth || 0)}% from last month
                  </MetricChange>
                </MetricCardContent>
              </MetricCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <MetricCard>
                <MetricCardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" color="textSecondary">
                      Total Orders
                    </Typography>
                    <MetricCardIcon bgcolor="#ff9800">
                      <OrdersIcon />
                    </MetricCardIcon>
                  </Box>
                  <MetricValue>{metrics?.totalOrders?.toLocaleString() || '0'}</MetricValue>
                  <MetricChange isPositive={metrics?.orderGrowth >= 0}>
                    {metrics?.orderGrowth >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    {Math.abs(metrics?.orderGrowth || 0)}% from last month
                  </MetricChange>
                </MetricCardContent>
              </MetricCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <MetricCard>
                <MetricCardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" color="textSecondary">
                      Total Revenue
                    </Typography>
                    <MetricCardIcon bgcolor="#4caf50">
                      <RevenueIcon />
                    </MetricCardIcon>
                  </Box>
                  <MetricValue>{`${metrics?.totalRevenue?.toLocaleString() || '0'} RWF`}</MetricValue>
                  <MetricChange isPositive={metrics?.revenueGrowth >= 0}>
                    {metrics?.revenueGrowth >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    {Math.abs(metrics?.revenueGrowth || 0)}% from last month
                  </MetricChange>
                </MetricCardContent>
              </MetricCard>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <ChartCard>
                <ChartCardContent>
                  <ChartTitle variant="h6">Orders Per Day</ChartTitle>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={ordersPerDay}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="orders" stroke="#3f51b5" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCardContent>
              </ChartCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <ChartCard>
                <ChartCardContent>
                  <ChartTitle variant="h6">Products Added Per Day</ChartTitle>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={productsPerDay}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="products" stroke="#f50057" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCardContent>
              </ChartCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <ChartCard>
                <ChartCardContent>
                  <ChartTitle variant="h6">Weekly Revenue</ChartTitle>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#4caf50" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCardContent>
              </ChartCard>
            </Grid>
          </Grid>
        </DashboardContainer>
      </StyledThemeProvider>
    </ThemeProvider>
  );
};

export default AdminDashboard;
