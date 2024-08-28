import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Button, Typography, CircularProgress, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Card, CardContent } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from '../../assets/logo.png';
// Add custom fonts
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf'
});

// Define a custom theme with a more vibrant color palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f0f4f8',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
          },
        },
      },
    },
  },
});

// Enhanced styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Roboto',
    backgroundColor: '#f0f4f8',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottom: 2,
    borderBottomColor: '#3f51b5',
    paddingBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 32,
    textAlign: 'right',
    color: '#3f51b5',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
  },
  section: {
    marginBottom: 30,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#3f51b5',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#3f51b5',
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    minHeight: 30,
  },
  tableCell: {
    flex: 1,
    padding: 10,
    fontSize: 12,
  },
  tableHeader: {
    backgroundColor: '#3f51b5',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  metricsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  metricBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    width: '22%',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  metricTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3f51b5',
  },
});

// PDF Document Component
const ReportDocument = ({ reportData }) => {
  const { metrics, ordersDetails, weeklyRevenue, productsPerDay, ordersPerDay, farmers, trainings } = reportData;

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <Image style={styles.logo} src="../../assets/logo.png" /> {/* Replace with your actual logo URL */}
          <View>
            <Text style={styles.title}>Admin Report</Text>
            <Text style={styles.subtitle}>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Metrics Section */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricBox}>
            <Text style={styles.metricTitle}>Total Users</Text>
            <Text style={styles.metricValue}>{metrics.totalUsers}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricTitle}>Total Products</Text>
            <Text style={styles.metricValue}>{metrics.totalProducts}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricTitle}>Total Orders</Text>
            <Text style={styles.metricValue}>{metrics.totalOrders}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricTitle}>Total Revenue</Text>
            <Text style={styles.metricValue}>{metrics.totalRevenue} RWF</Text>
          </View>
        </View>

        {/* Orders Details Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Orders Details</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Order ID</Text>
              <Text style={styles.tableCell}>Quantity</Text>
              <Text style={styles.tableCell}>Total Price</Text>
              <Text style={styles.tableCell}>Delivery Date</Text>
              <Text style={styles.tableCell}>Product Name</Text>
              <Text style={styles.tableCell}>Farmer Name</Text>
            </View>
            {ordersDetails.slice(0, 5).map((order) => (
              <View style={styles.tableRow} key={order.OrderId}>
                <Text style={styles.tableCell}>{order.OrderId}</Text>
                <Text style={styles.tableCell}>{order.Quantity}</Text>
                <Text style={styles.tableCell}>{order.TotalPrice}</Text>
                <Text style={styles.tableCell}>{order.deliveryDate}</Text>
                <Text style={styles.tableCell}>{order.ProductName}</Text>
                <Text style={styles.tableCell}>{order.FarmerName}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Add more sections for charts and other data */}
      </Page>
    </Document>
  );
};

const Report = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/report');
        console.log(response.data); // Check the structure of the data
        setReportData(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch report data');
        setLoading(false);
      }
    };
  
    fetchReportData();
  }, []);
  


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h5" align="center" color="error">
        {error}
      </Typography>
    );
  }

  const COLORS = ['#3f51b5', '#f50057', '#00bcd4', '#ff9800'];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: '30px', backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Paper elevation={3} sx={{ padding: '30px', marginBottom: '30px', borderRadius: '12px' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
            <Typography variant="h3" gutterBottom color="primary" fontWeight="bold">
              Admin Report
            </Typography>
            <PDFDownloadLink
              document={<ReportDocument reportData={reportData} />}
              fileName="admin_report.pdf"
            >
              {({ loading }) => (
                <Button 
                  variant="contained" 
                  color="primary" 
                  disabled={loading}
                  sx={{ 
                    padding: '10px 20px', 
                    fontSize: '1.1rem',
                    borderRadius: '25px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 8px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  {loading ? 'Preparing document...' : 'Download Report as PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          </Box>

          {/* Display Metrics */}
          <Grid container spacing={4} mb={6}>
            {Object.entries(reportData.metrics).map(([key, value]) => (
              <Grid item xs={12} sm={6} md={3} key={key}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <CardContent>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </Typography>
                    <Typography variant="h3" component="div" color="primary" fontWeight="bold">
                      {value}
                      {key === 'totalRevenue' && ' RWF'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Orders Details Table */}
          <Paper elevation={2} sx={{ marginBottom: '30px', overflow: 'hidden', borderRadius: '12px' }}>
            <Typography variant="h5" sx={{ padding: '20px', backgroundColor: 'primary.light', color: 'white' }}>
              Orders Details
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Total Price</TableCell>
                    <TableCell>Delivery Date</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Farmer Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.ordersDetails.map((order) => (
                    <TableRow key={order.OrderId} hover>
                      <TableCell>{order.OrderId}</TableCell>
                      <TableCell>{order.Quantity}</TableCell>
                      <TableCell>{order.TotalPrice}</TableCell>
                      <TableCell>{order.deliveryDate}</TableCell>
                      <TableCell>{order.ProductName}</TableCell>
                      <TableCell>{order.FarmerName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Charts */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ padding: '25px', height: '450px', borderRadius: '12px' }}>
                <Typography variant="h5" gutterBottom color="primary">Weekly Revenue</Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={reportData.weeklyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#3f51b5" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ padding: '25px', height: '450px', borderRadius: '12px' }}>
                <Typography variant="h5" gutterBottom color="primary">Products and Orders Per Day</Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" allowDuplicatedCategory={false} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="products" data={reportData.productsPerDay} stroke="#3f51b5" name="Products" />
                    <Line yAxisId="right" type="monotone" dataKey="orders" data={reportData.ordersPerDay} stroke="#f50057" name="Orders" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ padding: '25px', height: '450px', borderRadius: '12px' }}>
                <ResponsiveContainer width="100%" height="90%">
                  
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default Report;