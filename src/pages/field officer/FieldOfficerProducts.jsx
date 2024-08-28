import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import api from '../../api';

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [newProduct, setNewProduct] = useState({
    ProductName: '',
    Quantity: '',
    UnitPriceRwf: '',
    FarmerId: '',
  });
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchFarmers();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchFarmers = async () => {
    try {
      const response = await api.get('/farmers');
      setFarmers(response.data);
    } catch (error) {
      console.error('Failed to fetch farmers:', error);
    }
  };

  const handleChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateOrUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, newProduct);
        setEditingProductId(null);
      } else {
        await api.post('/products', newProduct);
      }
      setNewProduct({
        ProductName: '',
        Quantity: '',
        UnitPriceRwf: '',
        FarmerId: '',
      });
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error('Failed to add or update product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setNewProduct({
      ProductName: product.ProductName,
      Quantity: product.Quantity,
      UnitPriceRwf: product.UnitPriceRwf,
      FarmerId: product.FarmerId,
    });
    setEditingProductId(product.ProductId);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Product Management
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          {editingProductId ? 'Update Product' : 'Add New Product'}
        </Typography>
        <form onSubmit={handleCreateOrUpdateProduct}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Product Name"
                variant="outlined"
                fullWidth
                name="ProductName"
                value={newProduct.ProductName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantity (kg)"
                variant="outlined"
                fullWidth
                name="Quantity"
                type="number"
                value={newProduct.Quantity}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Unit Price (RWF)"
                variant="outlined"
                fullWidth
                name="UnitPriceRwf"
                type="number"
                value={newProduct.UnitPriceRwf}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="farmer-label">Farmer</InputLabel>
                <Select
                  labelId="farmer-label"
                  name="FarmerId"
                  value={newProduct.FarmerId}
                  onChange={handleChange}
                  label="Farmer"
                >
                  {farmers.map((farmer) => (
                    <MenuItem key={farmer.FarmerId} value={farmer.FarmerId}>
                      {farmer.FarmerName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 2 }}
              >
                {editingProductId ? 'Update Product' : 'Add Product'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          All Products
        </Typography>
        <List>
          {products.map((product) => (
            <React.Fragment key={product.ProductId}>
              <ListItem>
                <ListItemText
                  primary={`Product Name: ${product.ProductName} - Product Quantity: ${product.Quantity}kg - Unit Price: ${product.UnitPriceRwf} RWF - Total Price: ${product.TotalPriceRwf} RWF`}
                  secondary={`Farmer: ${product.FarmerName}`}
                />
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEditProduct(product)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteProduct(product.ProductId)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default ManageProducts;
