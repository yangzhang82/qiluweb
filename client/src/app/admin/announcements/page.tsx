'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Row, 
  Col, 
  Typography,
  message,
  Popconfirm,
  Switch,
  DatePicker,
  Tag,
  Tabs,
  Badge
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  BellOutlined,
  SendOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AdminLayout from '@/components/Admin/AdminLayout';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'notice' | 'urgent' | 'event' | 'system';
  target_audience: string[];
  status: 'draft' | 'published' | 'scheduled' | 'expired';
  is_pinned: boolean;
  is_popup: boolean;
  publish_at?: string;
  expire_at?: string;
  author: string;
  read_count: number;
  created_at: string;
  updated_at: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      // TODO: 实际API调用
      const mockAnnouncements: Announcement[] = [
        {
          id: '1',
          title: '春季开学典礼通知',
          content: '各位师生家长：\n\n我校将于2024年3月20日上午9:00在学校礼堂举行春季开学典礼，请全体师生准时参加。\n\n具体安排：\n1. 8:30-9:00 学生入场\n2. 9:00-9:30 开学典礼\n3. 9:30-10:00 校长致辞\n\n请各班主任提前组织学生，确保活动顺利进行。',
          type: 'event',
          target_audience: ['students', 'teachers', 'parents'],
          status: 'published',
          is_pinned: true,
          is_popup: false,
          publish_at: '2024-03-15T08:00:00Z',
          expire_at: '2024-03-20T18:00:00Z',
          author: '校长办公室',
          read_count: 1234,
          created_at: '2024-03-15T08:00:00Z',
          updated_at: '2024-03-15T08:00:00Z'
        },
        {
          id: '2',
          title: '系统维护通知',
          content: '为了提升系统性能，我们将于本周六晚上22:00-24:00进行系统维护，期间可能无法正常访问网站，请大家提前做好准备。',
          type: 'system',
          target_audience: ['all'],
          status: 'scheduled',
          is_pinned: false,
          is_popup: true,
          publish_at: '2024-03-18T22:00:00Z',
          expire_at: '2024-03-19T06:00:00Z',
          author: '技术部',
          read_count: 0,
          created_at: '2024-03-16T10:30:00Z',
          updated_at: '2024-03-16T10:30:00Z'
        },
        {
          id: '3',
          title: '期中考试安排',
          content: '各年级期中考试时间安排如下：\n\n高一年级：4月15-17日\n高二年级：4月18-20日\n高三年级：4月22-24日\n\n请各位老师和学生做好准备。',
          type: 'notice',
          target_audience: ['students', 'teachers'],
          status: 'draft',
          is_pinned: false,
          is_popup: false,
          author: '教务处',
          read_count: 0,
          created_at: '2024-03-14T14:20:00Z',
          updated_at: '2024-03-16T09:15:00Z'
        },
        {
          id: '4',
          title: '紧急停课通知',
          content: '由于恶劣天气影响，今日下午所有课程暂停，请学生注意安全，及时回家。',
          type: 'urgent',
          target_audience: ['students', 'teachers', 'parents'],
          status: 'expired',
          is_pinned: false,
          is_popup: true,
          publish_at: '2024-03-10T12:00:00Z',
          expire_at: '2024-03-10T18:00:00Z',
          author: '校长办公室',
          read_count: 2156,
          created_at: '2024-03-10T12:00:00Z',
          updated_at: '2024-03-10T12:00:00Z'
        }
      ];
      
      setAnnouncements(mockAnnouncements);
    } catch (error) {
      message.error('获取公告列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingAnnouncement(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    form.setFieldsValue({
      ...announcement,
      publish_expire_range: announcement.publish_at && announcement.expire_at ? [
        dayjs(announcement.publish_at),
        dayjs(announcement.expire_at)
      ] : undefined
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: 实际API调用
      message.success('删除成功');
      fetchAnnouncements();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        publish_at: values.publish_expire_range?.[0]?.toISOString(),
        expire_at: values.publish_expire_range?.[1]?.toISOString()
      };
      delete formData.publish_expire_range;

      if (editingAnnouncement) {
        // TODO: 更新公告
        message.success('更新成功');
      } else {
        // TODO: 创建公告
        message.success('创建成功');
      }
      
      setModalVisible(false);
      fetchAnnouncements();
    } catch (error) {
      message.error(editingAnnouncement ? '更新失败' : '创建失败');
    }
  };

  const handlePublish = async (id: string) => {
    try {
      // TODO: 发布公告
      message.success('发布成功');
      fetchAnnouncements();
    } catch (error) {
      message.error('发布失败');
    }
  };

  const handleTogglePin = async (id: string, isPinned: boolean) => {
    try {
      // TODO: 切换置顶状态
      message.success(isPinned ? '已置顶' : '已取消置顶');
      fetchAnnouncements();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      notice: 'blue',
      urgent: 'red',
      event: 'green',
      system: 'orange'
    };
    return colors[type as keyof typeof colors] || 'default';
  };

  const getTypeText = (type: string) => {
    const texts = {
      notice: '通知',
      urgent: '紧急',
      event: '活动',
      system: '系统'
    };
    return texts[type as keyof typeof texts] || type;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'default',
      published: 'green',
      scheduled: 'blue',
      expired: 'red'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts = {
      draft: '草稿',
      published: '已发布',
      scheduled: '定时发布',
      expired: '已过期'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getAudienceText = (audience: string[]) => {
    const texts: { [key: string]: string } = {
      all: '全部用户',
      students: '学生',
      teachers: '教师',
      parents: '家长',
      staff: '员工'
    };
    
    if (audience.includes('all')) return '全部用户';
    return audience.map(a => texts[a] || a).join(', ');
  };

  const getFilteredAnnouncements = () => {
    if (activeTab === 'all') return announcements;
    return announcements.filter(announcement => announcement.status === activeTab);
  };

  const columns: ColumnsType<Announcement> = [
    {
      title: '公告信息',
      key: 'announcement_info',
      width: 300,
      render: (_, record) => (
        <div>
          <div className="flex items-center mb-1">
            <span className={`font-medium text-lg ${record.is_pinned ? 'text-red-600' : ''}`}>
              {record.is_pinned && '📌 '}
              {record.title}
            </span>
          </div>
          <div className="text-sm text-gray-500 mb-2">
            {record.content.substring(0, 100)}...
          </div>
          <div className="flex items-center space-x-2">
            <Tag color={getTypeColor(record.type)}>
              {getTypeText(record.type)}
            </Tag>
            {record.is_popup && (
              <Tag color="purple">弹窗</Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: '目标用户',
      dataIndex: 'target_audience',
      key: 'target_audience',
      width: 120,
      render: (audience: string[]) => (
        <div className="text-sm">
          {getAudienceText(audience)}
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string, record) => (
        <div>
          <Tag color={getStatusColor(status)}>
            {getStatusText(status)}
          </Tag>
          <div className="text-xs text-gray-500 mt-1">
            阅读: {record.read_count}
          </div>
        </div>
      ),
    },
    {
      title: '发布时间',
      key: 'publish_time',
      width: 150,
      render: (_, record) => (
        <div>
          {record.publish_at ? (
            <div>
              <div>{dayjs(record.publish_at).format('YYYY-MM-DD')}</div>
              <div className="text-xs text-gray-500">
                {dayjs(record.publish_at).format('HH:mm')}
              </div>
            </div>
          ) : (
            <span className="text-gray-400">未设置</span>
          )}
        </div>
      ),
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      width: 100,
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small" direction="vertical">
          <Space size="small">
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              size="small"
            >
              预览
            </Button>
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
          </Space>
          <Space size="small">
            {record.status === 'draft' && (
              <Button 
                type="link" 
                icon={<SendOutlined />} 
                size="small"
                onClick={() => handlePublish(record.id)}
              >
                发布
              </Button>
            )}
            <Button 
              type="link" 
              size="small"
              onClick={() => handleTogglePin(record.id, !record.is_pinned)}
            >
              {record.is_pinned ? '取消置顶' : '置顶'}
            </Button>
            <Popconfirm
              title="确定要删除这个公告吗？"
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
        </Space>
      ),
    },
  ];

  const tabCounts = {
    all: announcements.length,
    draft: announcements.filter(a => a.status === 'draft').length,
    published: announcements.filter(a => a.status === 'published').length,
    scheduled: announcements.filter(a => a.status === 'scheduled').length,
    expired: announcements.filter(a => a.status === 'expired').length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Title level={2}>通知公告</Title>
            <Text type="secondary">发布和管理学校通知公告</Text>
          </div>
          <Space>
            <Button icon={<BellOutlined />}>
              推送设置
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新建公告
            </Button>
          </Space>
        </div>

        <Card>
          <div className="mb-4">
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane 
                tab={
                  <span>
                    全部公告
                    <Badge count={tabCounts.all} size="small" className="ml-2" />
                  </span>
                } 
                key="all" 
              />
              <TabPane 
                tab={
                  <span>
                    草稿
                    <Badge count={tabCounts.draft} size="small" className="ml-2" />
                  </span>
                } 
                key="draft" 
              />
              <TabPane 
                tab={
                  <span>
                    已发布
                    <Badge count={tabCounts.published} size="small" className="ml-2" />
                  </span>
                } 
                key="published" 
              />
              <TabPane 
                tab={
                  <span>
                    定时发布
                    <Badge count={tabCounts.scheduled} size="small" className="ml-2" />
                  </span>
                } 
                key="scheduled" 
              />
              <TabPane 
                tab={
                  <span>
                    已过期
                    <Badge count={tabCounts.expired} size="small" className="ml-2" />
                  </span>
                } 
                key="expired" 
              />
            </Tabs>
          </div>

          <Table
            columns={columns}
            dataSource={getFilteredAnnouncements()}
            loading={loading}
            rowKey="id"
            pagination={{
              total: getFilteredAnnouncements().length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            }}
          />
        </Card>

        <Modal
          title={editingAnnouncement ? '编辑公告' : '新建公告'}
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
              <Col span={16}>
                <Form.Item
                  name="title"
                  label="公告标题"
                  rules={[{ required: true, message: '请输入公告标题' }]}
                >
                  <Input placeholder="请输入公告标题" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="type"
                  label="公告类型"
                  rules={[{ required: true, message: '请选择公告类型' }]}
                >
                  <Select placeholder="请选择公告类型">
                    <Option value="notice">通知</Option>
                    <Option value="urgent">紧急</Option>
                    <Option value="event">活动</Option>
                    <Option value="system">系统</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="content"
              label="公告内容"
              rules={[{ required: true, message: '请输入公告内容' }]}
            >
              <TextArea 
                rows={8} 
                placeholder="请输入公告内容" 
                maxLength={2000}
                showCount
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="target_audience"
                  label="目标用户"
                  rules={[{ required: true, message: '请选择目标用户' }]}
                >
                  <Select mode="multiple" placeholder="请选择目标用户">
                    <Option value="all">全部用户</Option>
                    <Option value="students">学生</Option>
                    <Option value="teachers">教师</Option>
                    <Option value="parents">家长</Option>
                    <Option value="staff">员工</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="发布状态"
                  rules={[{ required: true, message: '请选择发布状态' }]}
                >
                  <Select placeholder="请选择发布状态">
                    <Option value="draft">保存为草稿</Option>
                    <Option value="published">立即发布</Option>
                    <Option value="scheduled">定时发布</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="publish_expire_range"
              label="发布时间范围"
            >
              <RangePicker 
                showTime
                format="YYYY-MM-DD HH:mm"
                placeholder={['发布时间', '过期时间']}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="is_pinned"
                  label="置顶显示"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="is_popup"
                  label="弹窗提醒"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item className="mb-0 text-right">
              <Space>
                <Button onClick={() => setModalVisible(false)}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingAnnouncement ? '更新' : '创建'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
