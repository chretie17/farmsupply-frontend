import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Spin, Alert } from 'antd';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import api from '../../api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/orders');
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
    const filteredData = orders.filter(
      (order) =>
        order.ProductName.toLowerCase().includes(value.toLowerCase()) ||
        order.FarmerName.toLowerCase().includes(value.toLowerCase()) ||
        order.OrderId.toString().includes(value)
    );
    setFilteredOrders(filteredData);
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await api.get(`/admin/orders/invoice/${orderId}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading invoice:', err);
      alert('Failed to download invoice. Please try again later.');
    }
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'OrderId',
      key: 'OrderId',
      sorter: (a, b) => a.OrderId - b.OrderId,
    },
    {
      title: 'Product Name',
      dataIndex: 'ProductName',
      key: 'ProductName',
    },
    {
      title: 'Farmer Name',
      dataIndex: 'FarmerName',
      key: 'FarmerName',
    },
    {
      title: 'Quantity',
      dataIndex: 'Quantity',
      key: 'Quantity',
      sorter: (a, b) => a.Quantity - b.Quantity,
    },
    {
      title: 'Total Price (RWF)',
      dataIndex: 'TotalPrice',
      key: 'TotalPrice',
      sorter: (a, b) => a.TotalPrice - b.TotalPrice,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={() => handleDownloadInvoice(record.OrderId)}
        >
          Download Invoice
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Alert message={error} type="error" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-white">
      <h1 className="text-3xl font-bold mb-8">Admin Orders</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search Orders"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="OrderId"
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default AdminOrders;
