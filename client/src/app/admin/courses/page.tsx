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
  DatePicker, 
  InputNumber,
  message,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Popconfirm
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  UserOutlined,
  BookOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import AdminLayout from '@/components/Admin/AdminLayout';
import { courseAPI } from '@/lib/api';
import type { Course } from '@/types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();

  // 模拟课程数据
  const mockCourses: Course[] = [
    {
      id: 1,
      title: '高中数学强化班',
      description: '针对高中生的数学强化训练课程，提升数学思维能力和解题技巧',
      teacher_id: 1,
      category: '数学',
      level: 'intermediate',
      duration: 120,
      max_students: 25,
      current_students: 18,
      price: 2000.00,
      status: 'active',
      start_date: '2024-03-01T09:00:00Z',
      end_date: '2024-06-30T17:00:00Z',
      created_at: '2024-02-15T10:00:00Z',
      updated_at: '2024-02-15T10:00:00Z'
    },
    {
      id: 2,
      title: '英语口语提升班',
      description: '专注于提升学生英语口语表达能力的课程，包含日常对话和学术讨论',
      teacher_id: 2,
      category: '英语',
      level: 'beginner',
      duration: 90,
      max_students: 20,
      current_students: 15,
      price: 1500.00,
      status: 'active',
      start_date: '2024-03-15T14:00:00Z',
      end_date: '2024-05-15T16:00:00Z',
      created_at: '2024-02-20T14:00:00Z',
      updated_at: '2024-02-20T14:00:00Z'
    },
    {
      id: 3,
      title: '科学实验探索课',
      description: '通过实验培养学生的科学思维和动手能力，涵盖物理、化学、生物实验',
      teacher_id: 3,
      category: '科学',
      level: 'intermediate',
      duration: 150,
      max_students: 15,
      current_students: 12,
      price: 2500.00,
      status: 'active',
      start_date: '2024-04-01T10:00:00Z',
      end_date: '2024-07-31T12:00:00Z',
      created_at: '2024-03-01T09:00:00Z',
      updated_at: '2024-03-01T09:00:00Z'
    },
    {
      id: 4,
      title: 'AP物理预备课程',
      description: 'AP物理考试预备课程，帮助学生掌握AP物理考试要点',
      teacher_id: 1,
      category: '物理',
      level: 'advanced',
      duration: 180,
      max_students: 12,
      current_students: 8,
      price: 3000.00,
      status: 'inactive',
      start_date: '2024-05-01T09:00:00Z',
      end_date: '2024-08-31T17:00:00Z',
      created_at: '2024-03-10T11:00:00Z',
      updated_at: '2024-03-10T11:00:00Z'
    }
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setCourses(mockCourses);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCourse(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Course) => {
    setEditingCourse(record);
    form.setFieldsValue({
      ...record,
      dateRange: [dayjs(record.start_date), dayjs(record.end_date)]
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await courseAPI.deleteCourse(id.toString());
      message.success('删除成功');
      fetchCourses();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const courseData = {
        ...values,
        start_date: values.dateRange[0].toISOString(),
        end_date: values.dateRange[1].toISOString(),
      };
      delete courseData.dateRange;

      if (editingCourse) {
        await courseAPI.updateCourse(editingCourse.id.toString(), courseData);
        message.success('更新成功');
      } else {
        await courseAPI.createCourse(courseData);
        message.success('创建成功');
      }

      setModalVisible(false);
      fetchCourses();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const getStatistics = () => {
    const total = courses.length;
    const active = courses.filter(c => c.status === 'active').length;
    const totalStudents = courses.reduce((sum, c) => sum + c.current_students, 0);
    const avgEnrollment = courses.length > 0 ? 
      courses.reduce((sum, c) => sum + (c.current_students / c.max_students), 0) / courses.length * 100 : 0;
    
    return { total, active, totalStudents, avgEnrollment };
  };

  const columns = [
    {
      title: '课程名称',
      dataIndex: 'title',
      key: 'title',
      width: 200,
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
      width: 100,
      render: (category: string) => {
        const colors: Record<string, string> = {
          '数学': 'blue',
          '英语': 'green',
          '科学': 'purple',
          '物理': 'orange',
          '化学': 'red',
          '生物': 'cyan',
        };
        return <Tag color={colors[category] || 'default'}>{category}</Tag>;
      },
    },
    {
      title: '难度',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level: string) => {
        const levelMap = {
          beginner: { color: 'green', text: '初级' },
          intermediate: { color: 'orange', text: '中级' },
          advanced: { color: 'red', text: '高级' },
        };
        const config = levelMap[level as keyof typeof levelMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '学生人数',
      key: 'students',
      width: 120,
      render: (_: any, record: Course) => (
        <div>
          <div>{record.current_students}/{record.max_students}</div>
          <Progress 
            percent={(record.current_students / record.max_students) * 100} 
            size="small" 
            showInfo={false}
          />
        </div>
      ),
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price: number) => `¥${price.toLocaleString()}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          active: { color: 'green', text: '进行中' },
          inactive: { color: 'orange', text: '未开始' },
          completed: { color: 'blue', text: '已完成' },
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '开始时间',
      dataIndex: 'start_date',
      key: 'start_date',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Course) => (
        <Space size="small">
          <Button
            type="text"
            icon={<PlayCircleOutlined />}
            onClick={() => window.open(`/courses/${record.id}/live`, '_blank')}
          >
            直播
          </Button>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => window.open(`/courses/${record.id}`, '_blank')}
          >
            查看
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这门课程吗？"
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

  const stats = getStatistics();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Title level={2}>课程管理</Title>
            <Text type="secondary">管理在线课程，安排教学计划</Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            新建课程
          </Button>
        </div>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="总课程数"
                value={stats.total}
                prefix={<BookOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="进行中"
                value={stats.active}
                prefix={<PlayCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="总学生数"
                value={stats.totalStudents}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="平均报名率"
                value={stats.avgEnrollment}
                precision={1}
                suffix="%"
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <Table
            columns={columns}
            dataSource={courses}
            loading={loading}
            rowKey="id"
            pagination={{
              total: courses.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            }}
          />
        </Card>

        <Modal
          title={editingCourse ? '编辑课程' : '新建课程'}
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
              <Col span={24}>
                <Form.Item
                  name="title"
                  label="课程名称"
                  rules={[{ required: true, message: '请输入课程名称' }]}
                >
                  <Input placeholder="请输入课程名称" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="category"
                  label="课程分类"
                  rules={[{ required: true, message: '请选择课程分类' }]}
                >
                  <Select placeholder="请选择课程分类">
                    <Option value="数学">数学</Option>
                    <Option value="英语">英语</Option>
                    <Option value="物理">物理</Option>
                    <Option value="化学">化学</Option>
                    <Option value="生物">生物</Option>
                    <Option value="科学">科学</Option>
                    <Option value="艺术">艺术</Option>
                    <Option value="体育">体育</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="level"
                  label="难度等级"
                  rules={[{ required: true, message: '请选择难度等级' }]}
                >
                  <Select placeholder="请选择难度等级">
                    <Option value="beginner">初级</Option>
                    <Option value="intermediate">中级</Option>
                    <Option value="advanced">高级</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="description"
                  label="课程描述"
                  rules={[{ required: true, message: '请输入课程描述' }]}
                >
                  <TextArea
                    rows={4}
                    placeholder="请输入课程描述"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="duration"
                  label="课程时长(分钟)"
                  rules={[{ required: true, message: '请输入课程时长' }]}
                >
                  <InputNumber
                    min={30}
                    max={300}
                    placeholder="分钟"
                    className="w-full"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="max_students"
                  label="最大学生数"
                  rules={[{ required: true, message: '请输入最大学生数' }]}
                >
                  <InputNumber
                    min={1}
                    max={100}
                    placeholder="人数"
                    className="w-full"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="price"
                  label="课程价格(元)"
                  rules={[{ required: true, message: '请输入课程价格' }]}
                >
                  <InputNumber
                    min={0}
                    step={100}
                    placeholder="元"
                    className="w-full"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="dateRange"
                  label="课程时间"
                  rules={[{ required: true, message: '请选择课程时间' }]}
                >
                  <RangePicker
                    showTime
                    format="YYYY-MM-DD HH:mm"
                    className="w-full"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="status"
                  label="课程状态"
                  rules={[{ required: true, message: '请选择课程状态' }]}
                >
                  <Select placeholder="请选择课程状态">
                    <Option value="inactive">未开始</Option>
                    <Option value="active">进行中</Option>
                    <Option value="completed">已完成</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item className="mb-0 mt-6">
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingCourse ? '更新' : '创建'}
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

export default CourseManagement;
