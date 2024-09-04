import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Typography,
  Space,
  Input,
  Modal,
  DatePicker,
  notification,
} from 'antd';
import { DownloadOutlined, CalendarOutlined } from '@ant-design/icons';
import api from '../../api';
import moment from 'moment';

const FieldOfficerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    const filteredData = orders.filter(
      (order) =>
        order.ProductName.toLowerCase().includes(value.toLowerCase()) ||
        order.OrderedBy.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOrders(filteredData);
  };

  const handleScheduleDelivery = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
    setDeliveryDate(null);
  };

  const handleSubmitDelivery = async () => {
    if (!deliveryDate) {
      notification.error({ message: 'Please select a delivery date.' });
      return;
    }

    try {
      await api.put(`/orders/${selectedOrder.OrderId}/schedule-delivery`, {
        deliveryDate: deliveryDate.format('YYYY-MM-DD'),
      });
      notification.success({ message: 'Delivery scheduled successfully.' });
      fetchOrders(); // Refresh the order list
      handleCloseModal();
    } catch (error) {
      console.error('Failed to schedule delivery:', error);
      notification.error({ message: 'Failed to schedule delivery.' });
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob',
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
      notification.error({ message: 'Failed to download invoice.' });
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
              icon={<DownloadOutlined />}
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
      filterIcon: (filtered) => <DownloadOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) => record.ProductName.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Quantity (kg)',
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
        { text: 'Scheduled', value: 'scheduled' },
        { text: 'Delivered', value: 'delivered' },
      ],
      onFilter: (value, record) => record.Status.includes(value),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<CalendarOutlined />}
            onClick={() => handleScheduleDelivery(record)}
          >
            Schedule Delivery
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => handleDownloadInvoice(record.OrderId)}
          >
            Download Invoice
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="field-officer-orders">
      <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>
        Field Officer Orders
      </Typography.Title>

      <Input.Search
        placeholder="Search Orders"
        onSearch={handleSearch}
        style={{ marginBottom: 20, width: '50%' }}
      />

      <Table
        columns={columns}
        dataSource={filteredOrders}
        loading={loading}
        rowKey="OrderId"
        pagination={{ pageSize: 10 }}
        bordered
      />

      {/* Modal for scheduling delivery */}
      <Modal
        title="Schedule Delivery"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onOk={handleSubmitDelivery}
        okText="Schedule"
      >
        <DatePicker
          value={deliveryDate}
          onChange={setDeliveryDate}
          style={{ width: '100%' }}
          placeholder="Select Delivery Date"
          disabledDate={(current) => current && current < moment().endOf('day')}
        />
      </Modal>
    </div>
  );
};

export default FieldOfficerOrders;
