'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Row, 
  Col, 
  Statistic, 
  Typography,
  message,
  Popconfirm,
  Avatar,
  Tabs,
  Upload,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined,
  SearchOutlined,
  DownloadOutlined,
  UploadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AdminLayout from '@/components/Admin/AdminLayout';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface Student {
  id: string;
  student_id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female';
  birth_date: string;
  grade: string;
  class: string;
  parent_name: string;
  parent_phone: string;
  parent_email: string;
  address: string;
  enrollment_date: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  avatar?: string;
  created_at: string;
  updated_at: string;
}

interface StudentStats {
  total: number;
  active: number;
  inactive: number;
  graduated: number;
  transferred: number;
  newThisMonth: number;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [stats, setStats] = useState<StudentStats>({
    total: 0,
    active: 0,
    inactive: 0,
    graduated: 0,
    transferred: 0,
    newThisMonth: 0
  });

  useEffect(() => {
    fetchStudents();
    fetchStats();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // TODO: 实际API调用
      // const response = await fetch('/api/students');
      // const data = await response.json();
      
      // 模拟数据
      const mockStudents: Student[] = [
        {
          id: '1',
          student_id: 'ST2024001',
          name: '张小明',
          email: 'zhangxiaoming@example.com',
          phone: '13800138001',
          gender: 'male',
          birth_date: '2010-05-15',
          grade: '高一',
          class: '高一(1)班',
          parent_name: '张大明',
          parent_phone: '13900139001',
          parent_email: 'zhangdaming@example.com',
          address: '北京市朝阳区xxx街道xxx号',
          enrollment_date: '2024-09-01',
          status: 'active',
          created_at: '2024-09-01T08:00:00Z',
          updated_at: '2024-09-01T08:00:00Z'
        },
        {
          id: '2',
          student_id: 'ST2024002',
          name: '李小红',
          email: 'lixiaohong@example.com',
          phone: '13800138002',
          gender: 'female',
          birth_date: '2009-08-20',
          grade: '高二',
          class: '高二(2)班',
          parent_name: '李大红',
          parent_phone: '13900139002',
          parent_email: 'lidahong@example.com',
          address: '上海市浦东新区xxx路xxx号',
          enrollment_date: '2023-09-01',
          status: 'active',
          created_at: '2023-09-01T08:00:00Z',
          updated_at: '2023-09-01T08:00:00Z'
        }
      ];
      
      setStudents(mockStudents);
    } catch (error) {
      message.error('获取学生列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // TODO: 实际API调用
      setStats({
        total: 156,
        active: 142,
        inactive: 8,
        graduated: 4,
        transferred: 2,
        newThisMonth: 12
      });
    } catch (error) {
      message.error('获取统计数据失败');
    }
  };

  const handleAdd = () => {
    setEditingStudent(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    form.setFieldsValue({
      ...student,
      birth_date: dayjs(student.birth_date),
      enrollment_date: dayjs(student.enrollment_date)
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: 实际API调用
      message.success('删除成功');
      fetchStudents();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        birth_date: values.birth_date.format('YYYY-MM-DD'),
        enrollment_date: values.enrollment_date.format('YYYY-MM-DD')
      };

      if (editingStudent) {
        // TODO: 更新学生
        message.success('更新成功');
      } else {
        // TODO: 创建学生
        message.success('创建成功');
      }
      
      setModalVisible(false);
      fetchStudents();
    } catch (error) {
      message.error(editingStudent ? '更新失败' : '创建失败');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'green',
      inactive: 'orange',
      graduated: 'blue',
      transferred: 'purple'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts = {
      active: '在读',
      inactive: '休学',
      graduated: '毕业',
      transferred: '转学'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getFilteredStudents = () => {
    let filtered = students;
    
    if (activeTab !== 'all') {
      filtered = filtered.filter(student => student.status === activeTab);
    }
    
    if (searchText) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchText.toLowerCase()) ||
        student.student_id.toLowerCase().includes(searchText.toLowerCase()) ||
        student.email.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    return filtered;
  };

  const columns: ColumnsType<Student> = [
    {
      title: '学生信息',
      key: 'student_info',
      width: 200,
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            size={40} 
            src={record.avatar} 
            icon={<UserOutlined />}
          />
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-sm text-gray-500">{record.student_id}</div>
          </div>
        </div>
      ),
    },
    {
      title: '年级班级',
      key: 'grade_class',
      width: 120,
      render: (_, record) => (
        <div>
          <div>{record.grade}</div>
          <div className="text-sm text-gray-500">{record.class}</div>
        </div>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      width: 150,
      render: (_, record) => (
        <div>
          <div className="text-sm">{record.phone}</div>
          <div className="text-sm text-gray-500">{record.email}</div>
        </div>
      ),
    },
    {
      title: '家长信息',
      key: 'parent',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{record.parent_name}</div>
          <div className="text-sm text-gray-500">{record.parent_phone}</div>
        </div>
      ),
    },
    {
      title: '入学日期',
      dataIndex: 'enrollment_date',
      key: 'enrollment_date',
      width: 100,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => {/* TODO: 查看详情 */}}
          >
            查看
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个学生吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Title level={2}>学生管理</Title>
            <Text type="secondary">管理学生信息，跟踪学习状态</Text>
          </div>
          <Space>
            <Button icon={<DownloadOutlined />}>
              导出数据
            </Button>
            <Button icon={<UploadOutlined />}>
              批量导入
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              添加学生
            </Button>
          </Space>
        </div>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="总学生数"
                value={stats.total}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="在读学生"
                value={stats.active}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="休学学生"
                value={stats.inactive}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="本月新增"
                value={stats.newThisMonth}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <div className="mb-4 flex justify-between items-center">
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="全部学生" key="all" />
              <TabPane tab={`在读 (${stats.active})`} key="active" />
              <TabPane tab={`休学 (${stats.inactive})`} key="inactive" />
              <TabPane tab={`毕业 (${stats.graduated})`} key="graduated" />
              <TabPane tab={`转学 (${stats.transferred})`} key="transferred" />
            </Tabs>
            
            <Input.Search
              placeholder="搜索学生姓名、学号或邮箱"
              allowClear
              style={{ width: 300 }}
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <Table
            columns={columns}
            dataSource={getFilteredStudents()}
            loading={loading}
            rowKey="id"
            pagination={{
              total: getFilteredStudents().length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            }}
          />
        </Card>

        <Modal
          title={editingStudent ? '编辑学生' : '添加学生'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={800}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="学生姓名"
                  rules={[{ required: true, message: '请输入学生姓名' }]}
                >
                  <Input placeholder="请输入学生姓名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="student_id"
                  label="学号"
                  rules={[{ required: true, message: '请输入学号' }]}
                >
                  <Input placeholder="请输入学号" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label="性别"
                  rules={[{ required: true, message: '请选择性别' }]}
                >
                  <Select placeholder="请选择性别">
                    <Option value="male">男</Option>
                    <Option value="female">女</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="birth_date"
                  label="出生日期"
                  rules={[{ required: true, message: '请选择出生日期' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="grade"
                  label="年级"
                  rules={[{ required: true, message: '请选择年级' }]}
                >
                  <Select placeholder="请选择年级">
                    <Option value="高一">高一</Option>
                    <Option value="高二">高二</Option>
                    <Option value="高三">高三</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="class"
                  label="班级"
                  rules={[{ required: true, message: '请输入班级' }]}
                >
                  <Input placeholder="请输入班级" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="学生手机"
                  rules={[{ required: true, message: '请输入手机号' }]}
                >
                  <Input placeholder="请输入手机号" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="学生邮箱"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '请输入有效的邮箱地址' }
                  ]}
                >
                  <Input placeholder="请输入邮箱" />
                </Form.Item>
              </Col>
            </Row>

            <Divider>家长信息</Divider>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="parent_name"
                  label="家长姓名"
                  rules={[{ required: true, message: '请输入家长姓名' }]}
                >
                  <Input placeholder="请输入家长姓名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="parent_phone"
                  label="家长手机"
                  rules={[{ required: true, message: '请输入家长手机号' }]}
                >
                  <Input placeholder="请输入家长手机号" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="parent_email"
                  label="家长邮箱"
                  rules={[
                    { type: 'email', message: '请输入有效的邮箱地址' }
                  ]}
                >
                  <Input placeholder="请输入家长邮箱" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="enrollment_date"
                  label="入学日期"
                  rules={[{ required: true, message: '请选择入学日期' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="address"
              label="家庭地址"
            >
              <Input.TextArea rows={3} placeholder="请输入家庭地址" />
            </Form.Item>

            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select placeholder="请选择状态">
                <Option value="active">在读</Option>
                <Option value="inactive">休学</Option>
                <Option value="graduated">毕业</Option>
                <Option value="transferred">转学</Option>
              </Select>
            </Form.Item>

            <Form.Item className="mb-0 text-right">
              <Space>
                <Button onClick={() => setModalVisible(false)}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingStudent ? '更新' : '创建'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
