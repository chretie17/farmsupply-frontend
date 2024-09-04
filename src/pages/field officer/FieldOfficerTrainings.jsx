import React, { useEffect, useState } from 'react';
import { Table, Button, Typography, Space, Input } from 'antd';
import { SearchOutlined, FilePdfOutlined } from '@ant-design/icons';
import api from '../../api';

const FieldOfficerTrainings = () => {
  const [trainings, setTrainings] = useState([]);
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
    } catch (error) {
      console.error('Failed to fetch trainings:', error);
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

  const handleViewPdf = (trainingId) => {
    window.open(`http://localhost:3000/api/trainings/${trainingId}/pdf`, '_blank');
  };

  const columns = [
    {
      title: 'Training Title',
      dataIndex: 'TrainingTitle',
      key: 'TrainingTitle',
      sorter: (a, b) => a.TrainingTitle.localeCompare(b.TrainingTitle),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Title"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys[0])}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys[0])}
              icon={<SearchOutlined />}
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
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) => record.TrainingTitle.toLowerCase().includes(value.toLowerCase()),
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
        <Button
          type="primary"
          icon={<FilePdfOutlined />}
          onClick={() => handleViewPdf(record.TrainingId)}
        >
          View PDF
        </Button>
      ),
    },
  ];

  return (
    <div className="field-officer-trainings">
      <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>
        Trainings
      </Typography.Title>

      <Table
        columns={columns}
        dataSource={filteredTrainings}
        rowKey="TrainingId"
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default FieldOfficerTrainings;
