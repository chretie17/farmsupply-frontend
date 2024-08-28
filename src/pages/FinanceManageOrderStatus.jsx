import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Button, Divider } from '@mui/material';
import api from '../api';

function ManageOrderStatus() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      fetchOrders(); // Refresh orders list after status update
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Orders
      </Typography>

      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          Orders List
        </Typography>
        <List>
          {orders.map((order) => (
            <React.Fragment key={order.OrderId}>
              <ListItem>
                <ListItemText
                  primary={`Order ID: ${order.OrderId} - Product: ${order.ProductName}`}
                  secondary={`Quantity: ${order.Quantity} - Total Price: ${order.TotalPrice} RWF - Status: ${order.Status}`}
                />
                {order.Status === 'pending' && (
                  <Box>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleUpdateOrderStatus(order.OrderId, 'approved')}
                      sx={{ ml: 2 }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleUpdateOrderStatus(order.OrderId, 'rejected')}
                      sx={{ ml: 2 }}
                    >
                      Reject
                    </Button>
                  </Box>
                )}
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default ManageOrderStatus;
