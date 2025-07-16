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
  Typography,
  message,
  Popconfirm,
  Switch,
  Tabs
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  CopyOutlined,
  SettingOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AdminLayout from '@/components/Admin/AdminLayout';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft' | 'archived';
  template: string;
  meta_title?: string;
  meta_description?: string;
  featured_image?: string;
  author: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      // TODO: 实际API调用
      const mockPages: Page[] = [
        {
          id: '1',
          title: '关于我们',
          slug: 'about-us',
          content: '<p>齐鲁国际学校是一所...</p>',
          status: 'published',
          template: 'default',
          meta_title: '关于我们 - 齐鲁国际学校',
          meta_description: '了解齐鲁国际学校的历史、使命和愿景',
          author: '管理员',
          created_at: '2024-01-15T08:00:00Z',
          updated_at: '2024-03-15T10:30:00Z',
          published_at: '2024-01-15T08:00:00Z'
        },
        {
          id: '2',
          title: '联系我们',
          slug: 'contact',
          content: '<p>联系方式...</p>',
          status: 'published',
          template: 'contact',
          meta_title: '联系我们 - 齐鲁国际学校',
          meta_description: '齐鲁国际学校联系方式和地址信息',
          author: '管理员',
          created_at: '2024-01-20T08:00:00Z',
          updated_at: '2024-02-10T14:20:00Z',
          published_at: '2024-01-20T08:00:00Z'
        },
        {
          id: '3',
          title: '招生简章',
          slug: 'admissions',
          content: '<p>招生信息...</p>',
          status: 'draft',
          template: 'default',
          meta_title: '招生简章 - 齐鲁国际学校',
          meta_description: '2024年齐鲁国际学校招生简章',
          author: '编辑',
          created_at: '2024-03-01T08:00:00Z',
          updated_at: '2024-03-15T16:45:00Z'
        }
      ];
      
      setPages(mockPages);
    } catch (error) {
      message.error('获取页面列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingPage(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    form.setFieldsValue(page);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: 实际API调用
      message.success('删除成功');
      fetchPages();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingPage) {
        // TODO: 更新页面
        message.success('更新成功');
      } else {
        // TODO: 创建页面
        message.success('创建成功');
      }
      
      setModalVisible(false);
      fetchPages();
    } catch (error) {
      message.error(editingPage ? '更新失败' : '创建失败');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      // TODO: 更新状态
      message.success('状态更新成功');
      fetchPages();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      published: 'green',
      draft: 'orange',
      archived: 'red'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts = {
      published: '已发布',
      draft: '草稿',
      archived: '已归档'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getFilteredPages = () => {
    if (activeTab === 'all') return pages;
    return pages.filter(page => page.status === activeTab);
  };

  const columns: ColumnsType<Page> = [
    {
      title: '页面信息',
      key: 'page_info',
      width: 300,
      render: (_, record) => (
        <div>
          <div className="font-medium text-lg">{record.title}</div>
          <div className="text-sm text-gray-500">/{record.slug}</div>
          <div className="text-xs text-gray-400 mt-1">
            模板: {record.template}
          </div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string, record) => (
        <div>
          <Tag color={getStatusColor(status)}>
            {getStatusText(status)}
          </Tag>
          <div className="text-xs text-gray-500 mt-1">
            {record.author}
          </div>
        </div>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 150,
      render: (date: string) => (
        <div>
          <div>{dayjs(date).format('YYYY-MM-DD')}</div>
          <div className="text-xs text-gray-500">
            {dayjs(date).format('HH:mm')}
          </div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => window.open(`/${record.slug}`, '_blank')}
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
          <Button 
            type="link" 
            icon={<CopyOutlined />} 
            size="small"
            onClick={() => {/* TODO: 复制页面 */}}
          >
            复制
          </Button>
          <Popconfirm
            title="确定要删除这个页面吗？"
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
            <Title level={2}>页面管理</Title>
            <Text type="secondary">管理网站静态页面内容</Text>
          </div>
          <Space>
            <Button icon={<SettingOutlined />}>
              页面设置
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新建页面
            </Button>
          </Space>
        </div>

        <Card>
          <div className="mb-4">
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="全部页面" key="all" />
              <TabPane tab="已发布" key="published" />
              <TabPane tab="草稿" key="draft" />
              <TabPane tab="已归档" key="archived" />
            </Tabs>
          </div>

          <Table
            columns={columns}
            dataSource={getFilteredPages()}
            loading={loading}
            rowKey="id"
            pagination={{
              total: getFilteredPages().length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            }}
          />
        </Card>

        <Modal
          title={editingPage ? '编辑页面' : '新建页面'}
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
                  label="页面标题"
                  rules={[{ required: true, message: '请输入页面标题' }]}
                >
                  <Input placeholder="请输入页面标题" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="status"
                  label="状态"
                  rules={[{ required: true, message: '请选择状态' }]}
                >
                  <Select placeholder="请选择状态">
                    <Option value="published">已发布</Option>
                    <Option value="draft">草稿</Option>
                    <Option value="archived">已归档</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="slug"
                  label="页面路径"
                  rules={[{ required: true, message: '请输入页面路径' }]}
                >
                  <Input placeholder="page-url" addonBefore="/" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="template"
                  label="页面模板"
                  rules={[{ required: true, message: '请选择页面模板' }]}
                >
                  <Select placeholder="请选择页面模板">
                    <Option value="default">默认模板</Option>
                    <Option value="contact">联系页面</Option>
                    <Option value="about">关于页面</Option>
                    <Option value="landing">着陆页</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="content"
              label="页面内容"
              rules={[{ required: true, message: '请输入页面内容' }]}
            >
              <TextArea 
                rows={8} 
                placeholder="请输入页面内容（支持HTML）" 
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="meta_title"
                  label="SEO标题"
                >
                  <Input placeholder="页面SEO标题" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="featured_image"
                  label="特色图片"
                >
                  <Input placeholder="图片URL" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="meta_description"
              label="SEO描述"
            >
              <TextArea 
                rows={3} 
                placeholder="页面SEO描述" 
                maxLength={160}
                showCount
              />
            </Form.Item>

            <Form.Item className="mb-0 text-right">
              <Space>
                <Button onClick={() => setModalVisible(false)}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingPage ? '更新' : '创建'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
