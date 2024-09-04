import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Space, Typography, Modal, Form, notification, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../api';

const FarmerManagement = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFarmer, setEditingFarmer] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredFarmers, setFilteredFarmers] = useState([]);

  const role = localStorage.getItem('role');

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const response = await api.get('/farmers');
      setFarmers(response.data);
      setFilteredFarmers(response.data);
      setLoading(false);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to fetch farmers',
      });
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filteredData = farmers.filter((farmer) =>
      farmer.FarmerName.toLowerCase().includes(value.toLowerCase()) ||
      farmer.Site.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredFarmers(filteredData);
  };

  const handleDeleteFarmer = async (id) => {
    try {
      await api.delete(`/farmers/${id}`);
      notification.success({
        message: 'Success',
        description: 'Farmer deleted successfully',
      });
      fetchFarmers(); // Refresh farmer list
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to delete farmer',
      });
    }
  };

  const handleApproveFarmer = async (id, status) => {
    try {
      await api.put(`/farmers/${id}/approve`, { status });
      notification.success({
        message: 'Success',
        description: `Farmer ${status} successfully`,
      });
      fetchFarmers(); // Refresh farmer list
    } catch (error) {
      notification.error({
        message: 'Error',
        description: `Failed to ${status} farmer`,
      });
    }
  };

  const handleEditFarmer = (farmer) => {
    setEditingFarmer(farmer);
    setIsModalVisible(true);
  };

  const handleCreateOrUpdateFarmer = async (values) => {
    try {
      if (editingFarmer) {
        await api.put(`/farmers/${editingFarmer.FarmerId}`, values);
        notification.success({
          message: 'Success',
          description: 'Farmer updated successfully',
        });
      } else {
        await api.post('/farmers', values);
        notification.success({
          message: 'Success',
          description: 'Farmer added successfully',
        });
      }
      setIsModalVisible(false);
      setEditingFarmer(null);
      fetchFarmers(); // Refresh farmer list
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to create or update farmer',
      });
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingFarmer(null);
  };

  const columns = [
    {
      title: 'Farmer Name',
      dataIndex: 'FarmerName',
      key: 'FarmerName',
      sorter: (a, b) => a.FarmerName.localeCompare(b.FarmerName),
    },
    {
      title: 'Telephone Number',
      dataIndex: 'TelNo',
      key: 'TelNo',
    },
    {
      title: 'Site',
      dataIndex: 'Site',
      key: 'Site',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status.includes(value),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditFarmer(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this farmer?"
            onConfirm={() => handleDeleteFarmer(record.FarmerId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
          {record.status === 'pending' && role === 'admin' && (
            <>
              <Button
                type="success"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApproveFarmer(record.FarmerId, 'approved')}
              >
                Approve
              </Button>
              <Button
                type="danger"
                icon={<CloseCircleOutlined />}
                onClick={() => handleApproveFarmer(record.FarmerId, 'rejected')}
              >
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>
        Farmer Management
      </Typography.Title>

      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search Farmers"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Add Farmer
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredFarmers}
        loading={loading}
        rowKey="FarmerId"
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        title={editingFarmer ? 'Edit Farmer' : 'Add Farmer'}
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={editingFarmer || {}}
          onFinish={handleCreateOrUpdateFarmer}
        >
          <Form.Item
            label="Farmer Name"
            name="FarmerName"
            rules={[{ required: true, message: 'Please input the farmer name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Telephone Number"
            name="TelNo"
            rules={[{ required: true, message: 'Please input the telephone number!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Address"
            name="Address"
            rules={[{ required: true, message: 'Please input the address!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Account Number"
            name="AccountNo"
            rules={[{ required: true, message: 'Please input the account number!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="National ID"
            name="NationalId"
            rules={[{ required: true, message: 'Please input the national ID!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Site"
            name="Site"
            rules={[{ required: true, message: 'Please input the site!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Farm Size (hectares)"
            name="farmSize"
            rules={[{ required: true, message: 'Please input the farm size!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Harvest Per Season (tons)"
            name="harvestPerSeason"
            rules={[{ required: true, message: 'Please input the harvest per season!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingFarmer ? 'Update Farmer' : 'Add Farmer'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FarmerManagement;
