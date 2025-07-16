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
  Upload, 
  message,
  Popconfirm,
  Typography,
  Card,
  Row,
  Col
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  SearchOutlined
} from '@ant-design/icons';
import AdminLayout from '@/components/Admin/AdminLayout';
import { newsAPI, aiAPI } from '@/lib/api';
import type { News } from '@/types';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const NewsManagement: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [form] = Form.useForm();

  // 模拟新闻数据
  const mockNews: News[] = [
    {
      id: 1,
      title: '齐鲁国际学校2024年春季开学典礼圆满举行',
      content: '2024年2月26日，齐鲁国际学校2024年春季开学典礼在学校体育馆隆重举行...',
      summary: '我校2024年春季开学典礼圆满举行，全校师生共同迎接新学期的到来。',
      author_id: 1,
      category: '校园新闻',
      tags: ['开学典礼', '新学期', '校园活动'],
      featured_image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
      status: 'published',
      published_at: '2024-02-26T10:00:00Z',
      created_at: '2024-02-26T10:00:00Z',
      updated_at: '2024-02-26T10:00:00Z'
    },
    {
      id: 2,
      title: '我校学生在全国数学竞赛中获得优异成绩',
      content: '近日，全国中学生数学竞赛结果揭晓，我校多名学生获得优异成绩...',
      summary: '我校学生在全国数学竞赛中表现出色，多人获奖。',
      author_id: 1,
      category: '学术成就',
      tags: ['数学竞赛', '学生获奖', '学术成就'],
      featured_image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904',
      status: 'published',
      published_at: '2024-02-20T14:30:00Z',
      created_at: '2024-02-20T14:30:00Z',
      updated_at: '2024-02-20T14:30:00Z'
    },
    {
      id: 3,
      title: '国际交流项目草稿',
      content: '为进一步推进国际化教育，我校与美国加州某知名高中签署了友好合作协议...',
      summary: '我校与美国姐妹学校签署合作协议，推进国际化教育发展。',
      author_id: 1,
      category: '国际交流',
      tags: ['国际交流', '合作协议', '国际化教育'],
      featured_image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846',
      status: 'draft',
      published_at: '',
      created_at: '2024-02-15T09:00:00Z',
      updated_at: '2024-02-15T09:00:00Z'
    }
  ];

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      setTimeout(() => {
        setNews(mockNews);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch news:', error);
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingNews(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: News) => {
    setEditingNews(record);
    form.setFieldsValue({
      ...record,
      tags: record.tags.join(', ')
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await newsAPI.deleteNews(id.toString());
      message.success('删除成功');
      fetchNews();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const newsData = {
        ...values,
        tags: values.tags ? values.tags.split(',').map((tag: string) => tag.trim()) : [],
      };

      if (editingNews) {
        await newsAPI.updateNews(editingNews.id.toString(), newsData);
        message.success('更新成功');
      } else {
        await newsAPI.createNews(newsData);
        message.success('创建成功');
      }

      setModalVisible(false);
      fetchNews();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleGenerateAI = async (field: string) => {
    const content = form.getFieldValue('content');
    if (!content) {
      message.warning('请先输入新闻内容');
      return;
    }

    try {
      let result;
      if (field === 'summary') {
        result = await aiAPI.generateSummary(content);
        form.setFieldsValue({ summary: result.data.summary });
      } else if (field === 'tags') {
        result = await aiAPI.generateTags(content);
        form.setFieldsValue({ tags: result.data.tags.join(', ') });
      } else if (field === 'category') {
        result = await aiAPI.classifyContent(content);
        form.setFieldsValue({ category: result.data.category });
      }
      message.success('AI生成成功');
    } catch (error) {
      message.error('AI生成失败');
    }
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (text: string) => (
        <div className="max-w-xs truncate" title={text}>
          {text}
        </div>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => {
        const colors: Record<string, string> = {
          '校园新闻': 'blue',
          '学术成就': 'green',
          '国际交流': 'purple',
          '校园活动': 'orange',
        };
        return <Tag color={colors[category] || 'default'}>{category}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          published: { color: 'green', text: '已发布' },
          draft: { color: 'orange', text: '草稿' },
          archived: { color: 'red', text: '已归档' },
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '发布时间',
      dataIndex: 'published_at',
      key: 'published_at',
      width: 150,
      render: (date: string) => date ? new Date(date).toLocaleDateString('zh-CN') : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: News) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => window.open(`/news/${record.id}`, '_blank')}
          >
            预览
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条新闻吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
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
          <Title level={2}>新闻管理</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            新建新闻
          </Button>
        </div>

        <Card>
          <Table
            columns={columns}
            dataSource={news}
            loading={loading}
            rowKey="id"
            pagination={{
              total: news.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            }}
          />
        </Card>

        <Modal
          title={editingNews ? '编辑新闻' : '新建新闻'}
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
            <Form.Item
              name="title"
              label="新闻标题"
              rules={[{ required: true, message: '请输入新闻标题' }]}
            >
              <Input placeholder="请输入新闻标题" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="category"
                  label="新闻分类"
                  rules={[{ required: true, message: '请选择新闻分类' }]}
                >
                  <Select placeholder="请选择新闻分类">
                    <Option value="校园新闻">校园新闻</Option>
                    <Option value="学术成就">学术成就</Option>
                    <Option value="国际交流">国际交流</Option>
                    <Option value="校园活动">校园活动</Option>
                    <Option value="师资风采">师资风采</Option>
                    <Option value="科技创新">科技创新</Option>
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
                    <Option value="draft">草稿</Option>
                    <Option value="published">发布</Option>
                    <Option value="archived">归档</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="content"
              label="新闻内容"
              rules={[{ required: true, message: '请输入新闻内容' }]}
            >
              <TextArea
                rows={8}
                placeholder="请输入新闻内容"
              />
            </Form.Item>

            <Form.Item
              name="summary"
              label={
                <div className="flex items-center justify-between w-full">
                  <span>新闻摘要</span>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => handleGenerateAI('summary')}
                  >
                    AI生成摘要
                  </Button>
                </div>
              }
            >
              <TextArea
                rows={3}
                placeholder="请输入新闻摘要或点击AI生成"
              />
            </Form.Item>

            <Form.Item
              name="tags"
              label={
                <div className="flex items-center justify-between w-full">
                  <span>标签（用逗号分隔）</span>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => handleGenerateAI('tags')}
                  >
                    AI生成标签
                  </Button>
                </div>
              }
            >
              <Input placeholder="请输入标签，用逗号分隔" />
            </Form.Item>

            <Form.Item
              name="featured_image"
              label="特色图片"
            >
              <Input placeholder="请输入图片URL" />
            </Form.Item>

            <Form.Item className="mb-0">
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingNews ? '更新' : '创建'}
                </Button>
                <Button onClick={() => setModalVisible(false)}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default NewsManagement;
