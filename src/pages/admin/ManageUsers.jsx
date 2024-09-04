import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Select, Space, Typography, Modal, Form, notification } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import api from '../../api';

const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const roles = ['admin', 'field-officer', 'trainee', 'finance-officer']; // Define available roles

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to fetch users',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filteredData = users.filter(
      (user) =>
        user.username.toLowerCase().includes(value.toLowerCase()) ||
        user.email.toLowerCase().includes(value.toLowerCase()) ||
        user.role.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filteredData);
  };

  const handleDeleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      notification.success({
        message: 'Success',
        description: 'User deleted successfully',
      });
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Failed to delete user:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to delete user',
      });
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalVisible(true);
  };

  const handleCreateOrUpdateUser = async (values) => {
    try {
      if (editingUser) {
        // Update the user if editing
        await api.put(`/users/${editingUser.id}`, values);
        notification.success({
          message: 'Success',
          description: 'User updated successfully',
        });
      } else {
        // Create a new user
        await api.post('/users', values);
        notification.success({
          message: 'Success',
          description: 'User created successfully',
        });
      }
      setIsModalVisible(false);
      setEditingUser(null);
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Failed to create or update user:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to create or update user',
      });
    }
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      filters: roles.map((role) => ({
        text: role.charAt(0).toUpperCase() + role.slice(1),
        value: role,
      })),
      onFilter: (value, record) => record.role.includes(value),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          >
            Edit
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
  };

  return (
    <div className="user-management">
      <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>
        User Management
      </Typography.Title>

      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search Users"
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
          Create User
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        title={editingUser ? 'Edit User' : 'Create User'}
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={editingUser || { role: roles[0] }}
          onFinish={handleCreateOrUpdateUser}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input the username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input the email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: !editingUser,
                message: 'Please input the password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select>
              {roles.map((role) => (
                <Option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
