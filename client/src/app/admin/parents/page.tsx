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
  Row, 
  Col, 
  Statistic, 
  Typography,
  message,
  Popconfirm,
  Avatar,
  Tabs,
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
  TeamOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AdminLayout from '@/components/Admin/AdminLayout';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female';
  relationship: 'father' | 'mother' | 'guardian';
  occupation: string;
  company: string;
  address: string;
  children: {
    id: string;
    name: string;
    grade: string;
    class: string;
  }[];
  emergency_contact: string;
  emergency_phone: string;
  wechat: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

interface ParentStats {
  total: number;
  active: number;
  inactive: number;
  fathers: number;
  mothers: number;
  guardians: number;
}

export default function ParentsPage() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [stats, setStats] = useState<ParentStats>({
    total: 0,
    active: 0,
    inactive: 0,
    fathers: 0,
    mothers: 0,
    guardians: 0
  });

  useEffect(() => {
    fetchParents();
    fetchStats();
  }, []);

  const fetchParents = async () => {
    setLoading(true);
    try {
      // TODO: 实际API调用
      const mockParents: Parent[] = [
        {
          id: '1',
          name: '张大明',
          email: 'zhangdaming@example.com',
          phone: '13900139001',
          gender: 'male',
          relationship: 'father',
          occupation: '软件工程师',
          company: '科技有限公司',
          address: '北京市朝阳区xxx街道xxx号',
          children: [
            {
              id: '1',
              name: '张小明',
              grade: '高一',
              class: '高一(1)班'
            }
          ],
          emergency_contact: '张夫人',
          emergency_phone: '13800138001',
          wechat: 'zhangdaming2024',
          status: 'active',
          created_at: '2024-09-01T08:00:00Z',
          updated_at: '2024-09-01T08:00:00Z'
        },
        {
          id: '2',
          name: '李大红',
          email: 'lidahong@example.com',
          phone: '13900139002',
          gender: 'female',
          relationship: 'mother',
          occupation: '医生',
          company: '人民医院',
          address: '上海市浦东新区xxx路xxx号',
          children: [
            {
              id: '2',
              name: '李小红',
              grade: '高二',
              class: '高二(2)班'
            }
          ],
          emergency_contact: '李先生',
          emergency_phone: '13800138002',
          wechat: 'lidahong2024',
          status: 'active',
          created_at: '2023-09-01T08:00:00Z',
          updated_at: '2023-09-01T08:00:00Z'
        }
      ];
      
      setParents(mockParents);
    } catch (error) {
      message.error('获取家长列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStats({
        total: 128,
        active: 125,
        inactive: 3,
        fathers: 65,
        mothers: 58,
        guardians: 5
      });
    } catch (error) {
      message.error('获取统计数据失败');
    }
  };

  const handleAdd = () => {
    setEditingParent(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (parent: Parent) => {
    setEditingParent(parent);
    form.setFieldsValue(parent);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      message.success('删除成功');
      fetchParents();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingParent) {
        message.success('更新成功');
      } else {
        message.success('创建成功');
      }
      
      setModalVisible(false);
      fetchParents();
    } catch (error) {
      message.error(editingParent ? '更新失败' : '创建失败');
    }
  };

  const getRelationshipColor = (relationship: string) => {
    const colors = {
      father: 'blue',
      mother: 'pink',
      guardian: 'purple'
    };
    return colors[relationship as keyof typeof colors] || 'default';
  };

  const getRelationshipText = (relationship: string) => {
    const texts = {
      father: '父亲',
      mother: '母亲',
      guardian: '监护人'
    };
    return texts[relationship as keyof typeof texts] || relationship;
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'green' : 'red';
  };

  const getStatusText = (status: string) => {
    return status === 'active' ? '正常' : '停用';
  };

  const getFilteredParents = () => {
    let filtered = parents;
    
    if (activeTab !== 'all') {
      if (activeTab === 'active' || activeTab === 'inactive') {
        filtered = filtered.filter(parent => parent.status === activeTab);
      } else {
        filtered = filtered.filter(parent => parent.relationship === activeTab);
      }
    }
    
    if (searchText) {
      filtered = filtered.filter(parent => 
        parent.name.toLowerCase().includes(searchText.toLowerCase()) ||
        parent.email.toLowerCase().includes(searchText.toLowerCase()) ||
        parent.phone.includes(searchText) ||
        parent.children.some(child => 
          child.name.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
    
    return filtered;
  };

  const columns: ColumnsType<Parent> = [
    {
      title: '家长信息',
      key: 'parent_info',
      width: 200,
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            size={40} 
            icon={<UserOutlined />}
            style={{ 
              backgroundColor: record.gender === 'male' ? '#1890ff' : '#eb2f96' 
            }}
          />
          <div>
            <div className="font-medium">{record.name}</div>
            <Tag color={getRelationshipColor(record.relationship)} size="small">
              {getRelationshipText(record.relationship)}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      width: 180,
      render: (_, record) => (
        <div>
          <div className="flex items-center text-sm mb-1">
            <PhoneOutlined className="mr-1" />
            {record.phone}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MailOutlined className="mr-1" />
            {record.email}
          </div>
        </div>
      ),
    },
    {
      title: '职业信息',
      key: 'occupation',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{record.occupation}</div>
          <div className="text-sm text-gray-500">{record.company}</div>
        </div>
      ),
    },
    {
      title: '子女信息',
      key: 'children',
      width: 200,
      render: (_, record) => (
        <div>
          {record.children.map(child => (
            <div key={child.id} className="mb-1">
              <div className="font-medium">{child.name}</div>
              <div className="text-sm text-gray-500">
                {child.grade} {child.class}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: '微信号',
      dataIndex: 'wechat',
      key: 'wechat',
      width: 120,
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
            title="确定要删除这个家长吗？"
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
            <Title level={2}>家长管理</Title>
            <Text type="secondary">管理学生家长信息，维护家校联系</Text>
          </div>
          <Space>
            <Button icon={<DownloadOutlined />}>
              导出数据
            </Button>
            <Button icon={<UploadOutlined />}>
              批量导入
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              添加家长
            </Button>
          </Space>
        </div>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="总家长数"
                value={stats.total}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="父亲"
                value={stats.fathers}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="母亲"
                value={stats.mothers}
                valueStyle={{ color: '#eb2f96' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="监护人"
                value={stats.guardians}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <div className="mb-4 flex justify-between items-center">
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="全部家长" key="all" />
              <TabPane tab={`父亲 (${stats.fathers})`} key="father" />
              <TabPane tab={`母亲 (${stats.mothers})`} key="mother" />
              <TabPane tab={`监护人 (${stats.guardians})`} key="guardian" />
              <TabPane tab={`正常 (${stats.active})`} key="active" />
              <TabPane tab={`停用 (${stats.inactive})`} key="inactive" />
            </Tabs>
            
            <Input.Search
              placeholder="搜索家长姓名、邮箱、电话或子女姓名"
              allowClear
              style={{ width: 300 }}
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <Table
            columns={columns}
            dataSource={getFilteredParents()}
            loading={loading}
            rowKey="id"
            pagination={{
              total: getFilteredParents().length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            }}
          />
        </Card>

        <Modal
          title={editingParent ? '编辑家长' : '添加家长'}
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
                  label="家长姓名"
                  rules={[{ required: true, message: '请输入家长姓名' }]}
                >
                  <Input placeholder="请输入家长姓名" />
                </Form.Item>
              </Col>
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
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="relationship"
                  label="与学生关系"
                  rules={[{ required: true, message: '请选择关系' }]}
                >
                  <Select placeholder="请选择关系">
                    <Option value="father">父亲</Option>
                    <Option value="mother">母亲</Option>
                    <Option value="guardian">监护人</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="手机号"
                  rules={[{ required: true, message: '请输入手机号' }]}
                >
                  <Input placeholder="请输入手机号" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
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
              <Col span={12}>
                <Form.Item
                  name="wechat"
                  label="微信号"
                >
                  <Input placeholder="请输入微信号" />
                </Form.Item>
              </Col>
            </Row>

            <Divider>职业信息</Divider>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="occupation"
                  label="职业"
                  rules={[{ required: true, message: '请输入职业' }]}
                >
                  <Input placeholder="请输入职业" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="company"
                  label="工作单位"
                >
                  <Input placeholder="请输入工作单位" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="address"
              label="家庭地址"
              rules={[{ required: true, message: '请输入家庭地址' }]}
            >
              <Input.TextArea rows={3} placeholder="请输入家庭地址" />
            </Form.Item>

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
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select placeholder="请选择状态">
                <Option value="active">正常</Option>
                <Option value="inactive">停用</Option>
              </Select>
            </Form.Item>

            <Form.Item className="mb-0 text-right">
              <Space>
                <Button onClick={() => setModalVisible(false)}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingParent ? '更新' : '创建'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
