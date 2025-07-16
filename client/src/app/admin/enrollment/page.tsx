'use client';

import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Descriptions,
  Tabs
} from 'antd';
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import AdminLayout from '@/components/Admin/AdminLayout';
import { enrollmentAPI } from '@/lib/api';
import type { Enrollment } from '@/types';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const EnrollmentManagement: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  // 模拟报名数据
  const mockEnrollments: Enrollment[] = [
    {
      id: 1,
      student_name: '张小明',
      student_email: 'zhangxiaoming@example.com',
      student_phone: '13800138001',
      parent_name: '张大明',
      parent_phone: '13900139001',
      grade: '高一',
      message: '希望能够进入贵校学习，对数学和物理特别感兴趣。',
      status: 'pending',
      created_at: '2024-03-15T10:30:00Z',
      updated_at: '2024-03-15T10:30:00Z'
    },
    {
      id: 2,
      student_name: '李小红',
      student_email: 'lixiaohong@example.com',
      student_phone: '13800138002',
      parent_name: '李大红',
      parent_phone: '13900139002',
      grade: '初三',
      message: '孩子对数学很感兴趣，希望能在贵校得到更好的发展。',
      status: 'approved',
      created_at: '2024-03-14T14:20:00Z',
      updated_at: '2024-03-14T16:45:00Z'
    },
    {
      id: 3,
      student_name: '王小强',
      student_email: 'wangxiaoqiang@example.com',
      student_phone: '13800138003',
      parent_name: '王大强',
      parent_phone: '13900139003',
      grade: '高二',
      message: '希望能够参加国际交流项目，提升英语水平。',
      status: 'pending',
      created_at: '2024-03-13T09:15:00Z',
      updated_at: '2024-03-13T09:15:00Z'
    },
    {
      id: 4,
      student_name: '赵小美',
      student_email: 'zhaoxiaomei@example.com',
      student_phone: '13800138004',
      parent_name: '赵大美',
      parent_phone: '13900139004',
      grade: '小学六年级',
      message: '孩子即将升入初中，希望能在贵校继续学习。',
      status: 'rejected',
      created_at: '2024-03-12T16:30:00Z',
      updated_at: '2024-03-12T18:00:00Z'
    }
  ];

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setEnrollments(mockEnrollments);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await enrollmentAPI.updateEnrollmentStatus(id.toString(), status);
      message.success('状态更新成功');
      fetchEnrollments();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const handleViewDetail = (record: Enrollment) => {
    setSelectedEnrollment(record);
    setDetailModalVisible(true);
  };

  const getFilteredEnrollments = () => {
    if (activeTab === 'all') return enrollments;
    return enrollments.filter(item => item.status === activeTab);
  };

  const getStatistics = () => {
    const total = enrollments.length;
    const pending = enrollments.filter(item => item.status === 'pending').length;
    const approved = enrollments.filter(item => item.status === 'approved').length;
    const rejected = enrollments.filter(item => item.status === 'rejected').length;
    
    return { total, pending, approved, rejected };
  };

  const columns = [
    {
      title: '学生姓名',
      dataIndex: 'student_name',
      key: 'student_name',
      width: 120,
    },
    {
      title: '申请年级',
      dataIndex: 'grade',
      key: 'grade',
      width: 120,
    },
    {
      title: '学生电话',
      dataIndex: 'student_phone',
      key: 'student_phone',
      width: 140,
    },
    {
      title: '家长姓名',
      dataIndex: 'parent_name',
      key: 'parent_name',
      width: 120,
    },
    {
      title: '家长电话',
      dataIndex: 'parent_phone',
      key: 'parent_phone',
      width: 140,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          pending: { color: 'orange', text: '待审核' },
          approved: { color: 'green', text: '已通过' },
          rejected: { color: 'red', text: '已拒绝' },
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '申请时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Enrollment) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="text"
                icon={<CheckOutlined />}
                style={{ color: '#52c41a' }}
                onClick={() => handleStatusChange(record.id, 'approved')}
              >
                通过
              </Button>
              <Button
                type="text"
                icon={<CloseOutlined />}
                danger
                onClick={() => handleStatusChange(record.id, 'rejected')}
              >
                拒绝
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const stats = getStatistics();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <Title level={2}>报名管理</Title>
          <Text type="secondary">管理学生报名申请，审核入学资格</Text>
        </div>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="总申请数"
                value={stats.total}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="待审核"
                value={stats.pending}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="已通过"
                value={stats.approved}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="已拒绝"
                value={stats.rejected}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="全部申请" key="all" />
            <TabPane tab={`待审核 (${stats.pending})`} key="pending" />
            <TabPane tab={`已通过 (${stats.approved})`} key="approved" />
            <TabPane tab={`已拒绝 (${stats.rejected})`} key="rejected" />
          </Tabs>

          <Table
            columns={columns}
            dataSource={getFilteredEnrollments()}
            loading={loading}
            rowKey="id"
            pagination={{
              total: getFilteredEnrollments().length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            }}
          />
        </Card>

        {/* 详情模态框 */}
        <Modal
          title="报名申请详情"
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={
            selectedEnrollment?.status === 'pending' ? [
              <Button key="reject" danger onClick={() => {
                handleStatusChange(selectedEnrollment.id, 'rejected');
                setDetailModalVisible(false);
              }}>
                拒绝申请
              </Button>,
              <Button key="approve" type="primary" onClick={() => {
                handleStatusChange(selectedEnrollment.id, 'approved');
                setDetailModalVisible(false);
              }}>
                通过申请
              </Button>
            ] : [
              <Button key="close" onClick={() => setDetailModalVisible(false)}>
                关闭
              </Button>
            ]
          }
          width={600}
        >
          {selectedEnrollment && (
            <div className="space-y-4">
              <Descriptions title="学生信息" bordered column={1}>
                <Descriptions.Item label="学生姓名">
                  <div className="flex items-center">
                    <UserOutlined className="mr-2" />
                    {selectedEnrollment.student_name}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="申请年级">
                  {selectedEnrollment.grade}
                </Descriptions.Item>
                <Descriptions.Item label="学生邮箱">
                  <div className="flex items-center">
                    <MailOutlined className="mr-2" />
                    {selectedEnrollment.student_email}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="学生电话">
                  <div className="flex items-center">
                    <PhoneOutlined className="mr-2" />
                    {selectedEnrollment.student_phone}
                  </div>
                </Descriptions.Item>
              </Descriptions>

              <Descriptions title="家长信息" bordered column={1}>
                <Descriptions.Item label="家长姓名">
                  <div className="flex items-center">
                    <UserOutlined className="mr-2" />
                    {selectedEnrollment.parent_name}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="家长电话">
                  <div className="flex items-center">
                    <PhoneOutlined className="mr-2" />
                    {selectedEnrollment.parent_phone}
                  </div>
                </Descriptions.Item>
              </Descriptions>

              <Descriptions title="申请信息" bordered column={1}>
                <Descriptions.Item label="申请状态">
                  <Tag color={
                    selectedEnrollment.status === 'pending' ? 'orange' :
                    selectedEnrollment.status === 'approved' ? 'green' : 'red'
                  }>
                    {selectedEnrollment.status === 'pending' ? '待审核' :
                     selectedEnrollment.status === 'approved' ? '已通过' : '已拒绝'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="申请时间">
                  <div className="flex items-center">
                    <CalendarOutlined className="mr-2" />
                    {new Date(selectedEnrollment.created_at).toLocaleString('zh-CN')}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="备注信息">
                  <div className="bg-gray-50 p-3 rounded">
                    {selectedEnrollment.message || '无备注信息'}
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default EnrollmentManagement;
