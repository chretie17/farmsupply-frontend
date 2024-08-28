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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import api from '../../api';

function FieldOfficerOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [open, setOpen] = useState(false);

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

  const handleScheduleDelivery = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
    setDeliveryDate('');
  };

  const handleSubmitDelivery = async () => {
    if (!deliveryDate) {
      alert('Please select a delivery date.');
      return;
    }

    try {
      await api.put(`/orders/${selectedOrder.OrderId}/schedule-delivery`, { deliveryDate });
      alert('Delivery scheduled successfully. Invoice will be generated.');
      fetchOrders(); // Refresh the order list
      handleClose();
    } catch (error) {
      console.error('Failed to schedule delivery:', error);
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob', // Ensure the response is a blob for PDFs
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download invoice:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Field Officer Orders
      </Typography>

      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          Orders Overview
        </Typography>
        <List>
          {orders.map((order) => (
            <React.Fragment key={order.OrderId}>
              <ListItem>
                <ListItemText
                  primary={`Order ID: ${order.OrderId} - Product: ${order.ProductName}`}
                  secondary={`Quantity: ${order.Quantity} kg - Total Price: ${order.TotalPrice} RWF - Status: ${order.Status} - Ordered By: ${order.OrderedBy}`}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleScheduleDelivery(order)}
                  sx={{ mr: 2 }}
                >
                  Schedule Delivery
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleDownloadInvoice(order.OrderId)}
                >
                  Download Invoice
                </Button>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Dialog for scheduling delivery */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Schedule Delivery</DialogTitle>
        <DialogContent>
          <TextField
            type="date"
            label="Delivery Date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmitDelivery} color="primary">
            Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FieldOfficerOrders;
