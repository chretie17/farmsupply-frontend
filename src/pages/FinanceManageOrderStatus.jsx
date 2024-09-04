import React, { useEffect, useState } from 'react';
import { Table, Button, Typography, Space, notification, Popconfirm, Input } from 'antd';
import { CheckOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';
import api from '../api';

const ManageOrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
      setFilteredOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to fetch orders.',
      });
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      notification.success({
        message: 'Success',
        description: `Order ${status} successfully.`,
      });
      fetchOrders(); // Refresh orders list after status update
    } catch (error) {
      console.error('Failed to update order status:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to update order status.',
      });
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    render: (text) =>
      text ? <span>{text}</span> : null,
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setFilteredOrders((prevData) =>
      prevData.filter((item) => item[dataIndex].toString().toLowerCase().includes(selectedKeys[0].toLowerCase()))
    );
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setFilteredOrders(orders);
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'OrderId',
      key: 'OrderId',
      sorter: (a, b) => a.OrderId - b.OrderId,
      ...getColumnSearchProps('OrderId'),
    },
    {
      title: 'Product Name',
      dataIndex: 'ProductName',
      key: 'ProductName',
      sorter: (a, b) => a.ProductName.localeCompare(b.ProductName),
      ...getColumnSearchProps('ProductName'),
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
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' },
      ],
      onFilter: (value, record) => record.Status.includes(value),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.Status === 'pending' && (
            <>
              <Popconfirm
                title="Are you sure you want to approve this order?"
                onConfirm={() => handleUpdateOrderStatus(record.OrderId, 'approved')}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" icon={<CheckOutlined />}>
                  Approve
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Are you sure you want to reject this order?"
                onConfirm={() => handleUpdateOrderStatus(record.OrderId, 'rejected')}
                okText="Yes"
                cancelText="No"
              >
                <Button type="danger" icon={<CloseOutlined />}>
                  Reject
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="manage-order-status">
      <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>
        Manage Orders
      </Typography.Title>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        loading={loading}
        rowKey="OrderId"
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default ManageOrderStatus;
