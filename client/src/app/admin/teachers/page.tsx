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
  EyeOutlined,
  TeamOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AdminLayout from '@/components/Admin/AdminLayout';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface Teacher {
  id: string;
  teacher_id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female';
  birth_date: string;
  department: string;
  position: string;
  subjects: string[];
  hire_date: string;
  status: 'active' | 'inactive' | 'resigned';
  education: string;
  experience_years: number;
  salary: number;
  avatar?: string;
  address: string;
  emergency_contact: string;
  emergency_phone: string;
  created_at: string;
  updated_at: string;
}

interface TeacherStats {
  total: number;
  active: number;
  inactive: number;
  resigned: number;
  newThisMonth: number;
  avgExperience: number;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [stats, setStats] = useState<TeacherStats>({
    total: 0,
    active: 0,
    inactive: 0,
    resigned: 0,
    newThisMonth: 0,
    avgExperience: 0
  });

  useEffect(() => {
    fetchTeachers();
    fetchStats();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      // TODO: 实际API调用
      const mockTeachers: Teacher[] = [
        {
          id: '1',
          teacher_id: 'T2024001',
          name: '王老师',
          email: 'wanglaoshi@qilu.edu.cn',
          phone: '13800138001',
          gender: 'male',
          birth_date: '1985-03-15',
          department: '数学系',
          position: '高级教师',
          subjects: ['数学', '物理'],
          hire_date: '2020-09-01',
          status: 'active',
          education: '硕士',
          experience_years: 8,
          salary: 12000,
          address: '北京市朝阳区xxx街道xxx号',
          emergency_contact: '王夫人',
          emergency_phone: '13900139001',
          created_at: '2020-09-01T08:00:00Z',
          updated_at: '2024-01-01T08:00:00Z'
        },
        {
          id: '2',
          teacher_id: 'T2024002',
          name: '李老师',
          email: 'lilaoshi@qilu.edu.cn',
          phone: '13800138002',
          gender: 'female',
          birth_date: '1988-07-20',
          department: '语文系',
          position: '中级教师',
          subjects: ['语文', '文学'],
          hire_date: '2021-03-01',
          status: 'active',
          education: '本科',
          experience_years: 5,
          salary: 10000,
          address: '上海市浦东新区xxx路xxx号',
          emergency_contact: '李先生',
          emergency_phone: '13900139002',
          created_at: '2021-03-01T08:00:00Z',
          updated_at: '2024-01-01T08:00:00Z'
        }
      ];
      
      setTeachers(mockTeachers);
    } catch (error) {
      message.error('获取教师列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStats({
        total: 45,
        active: 42,
        inactive: 2,
        resigned: 1,
        newThisMonth: 3,
        avgExperience: 6.5
      });
    } catch (error) {
      message.error('获取统计数据失败');
    }
  };

  const handleAdd = () => {
    setEditingTeacher(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    form.setFieldsValue({
      ...teacher,
      birth_date: dayjs(teacher.birth_date),
      hire_date: dayjs(teacher.hire_date)
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      message.success('删除成功');
      fetchTeachers();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        birth_date: values.birth_date.format('YYYY-MM-DD'),
        hire_date: values.hire_date.format('YYYY-MM-DD')
      };

      if (editingTeacher) {
        message.success('更新成功');
      } else {
        message.success('创建成功');
      }
      
      setModalVisible(false);
      fetchTeachers();
    } catch (error) {
      message.error(editingTeacher ? '更新失败' : '创建失败');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'green',
      inactive: 'orange',
      resigned: 'red'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts = {
      active: '在职',
      inactive: '休假',
      resigned: '离职'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getFilteredTeachers = () => {
    let filtered = teachers;
    
    if (activeTab !== 'all') {
      filtered = filtered.filter(teacher => teacher.status === activeTab);
    }
    
    if (searchText) {
      filtered = filtered.filter(teacher => 
        teacher.name.toLowerCase().includes(searchText.toLowerCase()) ||
        teacher.teacher_id.toLowerCase().includes(searchText.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchText.toLowerCase()) ||
        teacher.department.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    return filtered;
  };

  const columns: ColumnsType<Teacher> = [
    {
      title: '教师信息',
      key: 'teacher_info',
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
            <div className="text-sm text-gray-500">{record.teacher_id}</div>
          </div>
        </div>
      ),
    },
    {
      title: '部门职位',
      key: 'department_position',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{record.department}</div>
          <div className="text-sm text-gray-500">{record.position}</div>
        </div>
      ),
    },
    {
      title: '任教科目',
      dataIndex: 'subjects',
      key: 'subjects',
      width: 120,
      render: (subjects: string[]) => (
        <div>
          {subjects.map(subject => (
            <Tag key={subject} size="small">{subject}</Tag>
          ))}
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
      title: '工作经验',
      dataIndex: 'experience_years',
      key: 'experience_years',
      width: 80,
      render: (years: number) => `${years}年`,
    },
    {
      title: '入职日期',
      dataIndex: 'hire_date',
      key: 'hire_date',
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
            title="确定要删除这个教师吗？"
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
            <Title level={2}>教师管理</Title>
            <Text type="secondary">管理教师信息，跟踪教学状态</Text>
          </div>
          <Space>
            <Button icon={<DownloadOutlined />}>
              导出数据
            </Button>
            <Button icon={<UploadOutlined />}>
              批量导入
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              添加教师
            </Button>
          </Space>
        </div>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="总教师数"
                value={stats.total}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="在职教师"
                value={stats.active}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="平均经验"
                value={stats.avgExperience}
                suffix="年"
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="本月新增"
                value={stats.newThisMonth}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <div className="mb-4 flex justify-between items-center">
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="全部教师" key="all" />
              <TabPane tab={`在职 (${stats.active})`} key="active" />
              <TabPane tab={`休假 (${stats.inactive})`} key="inactive" />
              <TabPane tab={`离职 (${stats.resigned})`} key="resigned" />
            </Tabs>
            
            <Input.Search
              placeholder="搜索教师姓名、工号、邮箱或部门"
              allowClear
              style={{ width: 300 }}
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <Table
            columns={columns}
            dataSource={getFilteredTeachers()}
            loading={loading}
            rowKey="id"
            pagination={{
              total: getFilteredTeachers().length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            }}
          />
        </Card>

        <Modal
          title={editingTeacher ? '编辑教师' : '添加教师'}
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
                  label="教师姓名"
                  rules={[{ required: true, message: '请输入教师姓名' }]}
                >
                  <Input placeholder="请输入教师姓名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="teacher_id"
                  label="工号"
                  rules={[{ required: true, message: '请输入工号' }]}
                >
                  <Input placeholder="请输入工号" />
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
                  name="department"
                  label="部门"
                  rules={[{ required: true, message: '请选择部门' }]}
                >
                  <Select placeholder="请选择部门">
                    <Option value="数学系">数学系</Option>
                    <Option value="语文系">语文系</Option>
                    <Option value="英语系">英语系</Option>
                    <Option value="物理系">物理系</Option>
                    <Option value="化学系">化学系</Option>
                    <Option value="生物系">生物系</Option>
                    <Option value="历史系">历史系</Option>
                    <Option value="地理系">地理系</Option>
                    <Option value="政治系">政治系</Option>
                    <Option value="体育系">体育系</Option>
                    <Option value="艺术系">艺术系</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="position"
                  label="职位"
                  rules={[{ required: true, message: '请选择职位' }]}
                >
                  <Select placeholder="请选择职位">
                    <Option value="初级教师">初级教师</Option>
                    <Option value="中级教师">中级教师</Option>
                    <Option value="高级教师">高级教师</Option>
                    <Option value="特级教师">特级教师</Option>
                    <Option value="教研组长">教研组长</Option>
                    <Option value="年级主任">年级主任</Option>
                    <Option value="副校长">副校长</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="subjects"
                  label="任教科目"
                  rules={[{ required: true, message: '请选择任教科目' }]}
                >
                  <Select mode="multiple" placeholder="请选择任教科目">
                    <Option value="数学">数学</Option>
                    <Option value="语文">语文</Option>
                    <Option value="英语">英语</Option>
                    <Option value="物理">物理</Option>
                    <Option value="化学">化学</Option>
                    <Option value="生物">生物</Option>
                    <Option value="历史">历史</Option>
                    <Option value="地理">地理</Option>
                    <Option value="政治">政治</Option>
                    <Option value="体育">体育</Option>
                    <Option value="音乐">音乐</Option>
                    <Option value="美术">美术</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="education"
                  label="学历"
                  rules={[{ required: true, message: '请选择学历' }]}
                >
                  <Select placeholder="请选择学历">
                    <Option value="本科">本科</Option>
                    <Option value="硕士">硕士</Option>
                    <Option value="博士">博士</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="手机号"
                  rules={[{ required: true, message: '请输入手机号' }]}
                >
                  <Input placeholder="请输入手机号" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="邮箱"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '请输入有效的邮箱地址' }
                  ]}
                >
                  <Input placeholder="请输入邮箱" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="hire_date"
                  label="入职日期"
                  rules={[{ required: true, message: '请选择入职日期' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="experience_years"
                  label="工作经验(年)"
                  rules={[{ required: true, message: '请输入工作经验' }]}
                >
                  <Input type="number" placeholder="请输入工作经验" />
                </Form.Item>
              </Col>
            </Row>

            <Divider>紧急联系人</Divider>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="emergency_contact"
                  label="紧急联系人"
                  rules={[{ required: true, message: '请输入紧急联系人' }]}
                >
                  <Input placeholder="请输入紧急联系人" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="emergency_phone"
                  label="紧急联系电话"
                  rules={[{ required: true, message: '请输入紧急联系电话' }]}
                >
                  <Input placeholder="请输入紧急联系电话" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="address"
              label="家庭地址"
            >
              <Input.TextArea rows={3} placeholder="请输入家庭地址" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="salary"
                  label="薪资"
                  rules={[{ required: true, message: '请输入薪资' }]}
                >
                  <Input type="number" placeholder="请输入薪资" addonAfter="元" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="状态"
                  rules={[{ required: true, message: '请选择状态' }]}
                >
                  <Select placeholder="请选择状态">
                    <Option value="active">在职</Option>
                    <Option value="inactive">休假</Option>
                    <Option value="resigned">离职</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item className="mb-0 text-right">
              <Space>
                <Button onClick={() => setModalVisible(false)}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingTeacher ? '更新' : '创建'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
