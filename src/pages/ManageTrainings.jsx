import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Typography, Modal, Form, notification, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, UploadOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import api from '../api';

const ManageTrainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTraining, setEditingTraining] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredTrainings, setFilteredTrainings] = useState([]);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const response = await api.get('/trainings');
      setTrainings(response.data);
      setFilteredTrainings(response.data);
      setLoading(false);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to fetch trainings',
      });
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filteredData = trainings.filter(
      (training) =>
        training.TrainingTitle.toLowerCase().includes(value.toLowerCase()) ||
        training.ScheduledDate.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTrainings(filteredData);
  };

  const handleCreateOrUpdateTraining = async (values) => {
    const formData = new FormData();
    formData.append('TrainingTitle', values.TrainingTitle);
    formData.append('Description', values.Description);
    formData.append('ScheduledDate', values.ScheduledDate);
    if (values.PdfFile) {
      formData.append('pdf', values.PdfFile.file.originFileObj);
    }

    try {
      if (editingTraining) {
        await api.put(`/trainings/${editingTraining.TrainingId}`, formData);
        notification.success({
          message: 'Success',
          description: 'Training updated successfully',
        });
      } else {
        await api.post('/trainings', formData);
        notification.success({
          message: 'Success',
          description: 'Training added successfully',
        });
      }
      setIsModalVisible(false);
      setEditingTraining(null);
      fetchTrainings(); // Refresh training list
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to create or update training',
      });
    }
  };

  const handleEditTraining = (training) => {
    setEditingTraining(training);
    setIsModalVisible(true);
  };

  const handleDeleteTraining = async (id) => {
    try {
      await api.delete(`/trainings/${id}`);
      notification.success({
        message: 'Success',
        description: 'Training deleted successfully',
      });
      fetchTrainings(); // Refresh training list
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to delete training',
      });
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingTraining(null);
  };

  const columns = [
    {
      title: 'Training Title',
      dataIndex: 'TrainingTitle',
      key: 'TrainingTitle',
      sorter: (a, b) => a.TrainingTitle.localeCompare(b.TrainingTitle),
    },
    {
      title: 'Scheduled Date',
      dataIndex: 'ScheduledDate',
      key: 'ScheduledDate',
      sorter: (a, b) => new Date(a.ScheduledDate) - new Date(b.ScheduledDate),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditTraining(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this training?"
            onConfirm={() => handleDeleteTraining(record.TrainingId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="manage-trainings">
      <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>
        Training Management
      </Typography.Title>

      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search Trainings"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Add Training
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredTrainings}
        loading={loading}
        rowKey="TrainingId"
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        title={editingTraining ? 'Edit Training' : 'Add Training'}
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={editingTraining || {}}
          onFinish={handleCreateOrUpdateTraining}
        >
          <Form.Item
            label="Training Title"
            name="TrainingTitle"
            rules={[{ required: true, message: 'Please input the training title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="Description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Scheduled Date"
            name="ScheduledDate"
            rules={[{ required: true, message: 'Please input the scheduled date!' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            label="PDF File"
            name="PdfFile"
            valuePropName="file"
            getValueFromEvent={(e) => e.fileList[0]}
          >
            <UploadOutlined />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingTraining ? 'Update Training' : 'Add Training'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageTrainings;
