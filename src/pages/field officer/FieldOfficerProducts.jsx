import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Typography,
  Space,
  Input,
  Modal,
  Form,
  Select,
  notification,
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../../api';

const { Option } = Select;

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
    fetchFarmers();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setLoading(false);
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

  const handleSearch = (value) => {
    const filteredData = products.filter(
      (product) =>
        product.ProductName.toLowerCase().includes(value.toLowerCase()) ||
        product.FarmerName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filteredData);
  };

  const handleAddOrEditProduct = (record) => {
    setIsModalVisible(true);
    setEditingProduct(record);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      notification.success({ message: 'Product deleted successfully.' });
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error('Failed to delete product:', error);
      notification.error({ message: 'Failed to delete product.' });
    }
  };

  const handleModalOk = async () => {
    try {
      const values = form.getFieldsValue();
      if (editingProduct) {
        await api.put(`/products/${editingProduct.ProductId}`, values);
        notification.success({ message: 'Product updated successfully.' });
      } else {
        await api.post('/products', values);
        notification.success({ message: 'Product added successfully.' });
      }
      fetchProducts(); // Refresh product list
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to add or update product:', error);
      notification.error({ message: 'Failed to add or update product.' });
    }
  };

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'ProductName',
      key: 'ProductName',
      sorter: (a, b) => a.ProductName.localeCompare(b.ProductName),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Product"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys[0])}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys[0])}
              icon={<PlusOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={() => handleSearch('')} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => <PlusOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) => record.ProductName.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Quantity (kg)',
      dataIndex: 'Quantity',
      key: 'Quantity',
      sorter: (a, b) => a.Quantity - b.Quantity,
    },
    {
      title: 'Unit Price (RWF)',
      dataIndex: 'UnitPriceRwf',
      key: 'UnitPriceRwf',
      sorter: (a, b) => a.UnitPriceRwf - b.UnitPriceRwf,
    },
    {
      title: 'Farmer Name',
      dataIndex: 'FarmerName',
      key: 'FarmerName',
      sorter: (a, b) => a.FarmerName.localeCompare(b.FarmerName),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleAddOrEditProduct(record)}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteProduct(record.ProductId)}
            danger
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="manage-products">
      <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>
        Product Management
      </Typography.Title>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => handleAddOrEditProduct(null)}
        style={{ marginBottom: 20 }}
      >
        Add New Product
      </Button>

      <Input.Search
        placeholder="Search Products"
        onSearch={handleSearch}
        style={{ marginBottom: 20, width: '50%' }}
      />

      <Table
        columns={columns}
        dataSource={filteredProducts}
        loading={loading}
        rowKey="ProductId"
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        title={editingProduct ? 'Update Product' : 'Add New Product'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleModalOk}
        okText={editingProduct ? 'Update' : 'Add'}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="ProductName"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter the product name.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Quantity"
            label="Quantity (kg)"
            rules={[{ required: true, message: 'Please enter the quantity.' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="UnitPriceRwf"
            label="Unit Price (RWF)"
            rules={[{ required: true, message: 'Please enter the unit price.' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="FarmerId"
            label="Farmer"
            rules={[{ required: true, message: 'Please select a farmer.' }]}
          >
            <Select placeholder="Select Farmer">
              {farmers.map((farmer) => (
                <Option key={farmer.FarmerId} value={farmer.FarmerId}>
                  {farmer.FarmerName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageProducts;
