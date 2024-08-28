import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import api from '../api';

function FinanceOfficerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // Default quantity
  const [totalPrice, setTotalPrice] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const handleOpenOrderDialog = (product) => {
    setSelectedProduct(product);
    setQuantity(1); // Reset quantity
    setTotalPrice(product.UnitPriceRwf); // Set initial total price based on default quantity
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleQuantityChange = (e) => {
    const qty = parseInt(e.target.value, 10);
    setQuantity(qty);
    if (selectedProduct) {
      setTotalPrice(qty * selectedProduct.UnitPriceRwf);
    }
  };

  const handleConfirmOrder = async () => {
    try {
      const OrderedBy = localStorage.getItem('user_id'); // Retrieve the user ID from local storage
      if (!OrderedBy) {
        alert('User ID not found. Please log in.');
        return;
      }

      const orderData = {
        ProductId: selectedProduct.ProductId,
        Quantity: quantity,
        OrderedBy: parseInt(OrderedBy, 10), // Convert to integer if necessary
      };

      await api.post('/orders', orderData);
      fetchOrders(); // Refresh the orders list after placing an order
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to order product:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Finance Officer Dashboard
      </Typography>

      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          Available Products
        </Typography>
        <List>
          {products.map((product) => (
            <React.Fragment key={product.ProductId}>
              <ListItem>
                <ListItemText
                  primary={`${product.ProductName} - ${product.Quantity} kg - ${product.UnitPriceRwf} RWF per kg`}
                  secondary={`Farmer: ${product.FarmerName}`}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenOrderDialog(product)}
                  disabled={product.Quantity < 1} // Disable if the product is out of stock
                >
                  Order
                </Button>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Paper sx={{ p: 3, mt: 4 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          Orders
        </Typography>
        <List>
          {orders.map((order) => (
            <React.Fragment key={order.OrderId}>
              <ListItem>
                <ListItemText
                  primary={`Order ID: ${order.OrderId} - Product: ${order.ProductName}`}
                  secondary={`Quantity: ${order.Quantity} - Total Price: ${order.TotalPrice} RWF - Status: ${order.Status}`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Dialog for Ordering Product */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Order {selectedProduct?.ProductName}</DialogTitle>
        <DialogContent>
          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            fullWidth
            inputProps={{ min: 1 }}
          />
          <Typography sx={{ mt: 2 }}>
            Total Price: {totalPrice} RWF
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmOrder} color="primary">
            Confirm Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FinanceOfficerDashboard;
