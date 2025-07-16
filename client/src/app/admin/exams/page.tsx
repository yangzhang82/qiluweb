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
  Tabs,
  List,
  Avatar,
  Progress
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BarChartOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import AdminLayout from '@/components/Admin/AdminLayout';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface Exam {
  id: number;
  title: string;
  description: string;
  course_id: number;
  course_name: string;
  duration: number; // 分钟
  total_questions: number;
  total_points: number;
  start_time: string;
  end_time: string;
  status: 'draft' | 'published' | 'ongoing' | 'completed';
  participants: number;
  submitted: number;
  created_at: string;
}

interface ExamResult {
  id: number;
  student_name: string;
  student_id: string;
  score: number;
  total_score: number;
  percentage: number;
  time_spent: number; // 分钟
  submitted_at: string;
  status: 'completed' | 'in_progress' | 'not_started';
}

const ExamManagement: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [resultsModalVisible, setResultsModalVisible] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [form] = Form.useForm();

  // 模拟考试数据
  const mockExams: Exam[] = [
    {
      id: 1,
      title: '高中数学期中考试',
      description: '涵盖函数、几何、代数等内容的综合测试',
      course_id: 1,
      course_name: '高中数学强化班',
      duration: 120,
      total_questions: 25,
      total_points: 100,
      start_time: '2024-04-15T09:00:00Z',
      end_time: '2024-04-15T11:00:00Z',
      status: 'completed',
      participants: 18,
      submitted: 16,
      created_at: '2024-04-01T10:00:00Z'
    },
    {
      id: 2,
      title: '英语口语测试',
      description: '评估学生英语口语表达能力和发音准确性',
      course_id: 2,
      course_name: '英语口语提升班',
      duration: 30,
      total_questions: 10,
      total_points: 50,
      start_time: '2024-04-20T14:00:00Z',
      end_time: '2024-04-20T14:30:00Z',
      status: 'published',
      participants: 15,
      submitted: 0,
      created_at: '2024-04-10T14:00:00Z'
    },
    {
      id: 3,
      title: '物理实验报告评估',
      description: '基于实验操作和报告撰写的综合评估',
      course_id: 3,
      course_name: '科学实验探索课',
      duration: 90,
      total_questions: 15,
      total_points: 75,
      start_time: '2024-04-25T10:00:00Z',
      end_time: '2024-04-25T11:30:00Z',
      status: 'draft',
      participants: 0,
      submitted: 0,
      created_at: '2024-04-12T09:00:00Z'
    }
  ];

  // 模拟考试结果数据
  const mockExamResults: ExamResult[] = [
    {
      id: 1,
      student_name: '张小明',
      student_id: 'S001',
      score: 85,
      total_score: 100,
      percentage: 85,
      time_spent: 105,
      submitted_at: '2024-04-15T10:45:00Z',
      status: 'completed'
    },
    {
      id: 2,
      student_name: '李小红',
      student_id: 'S002',
      score: 92,
      total_score: 100,
      percentage: 92,
      time_spent: 110,
      submitted_at: '2024-04-15T10:50:00Z',
      status: 'completed'
    },
    {
      id: 3,
      student_name: '王小强',
      student_id: 'S003',
      score: 78,
      total_score: 100,
      percentage: 78,
      time_spent: 115,
      submitted_at: '2024-04-15T10:55:00Z',
      status: 'completed'
    }
  ];

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setExams(mockExams);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch exams:', error);
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingExam(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Exam) => {
    setEditingExam(record);
    form.setFieldsValue({
      ...record,
      exam_time: [dayjs(record.start_time), dayjs(record.end_time)]
    });
    setModalVisible(true);
  };

  const handleViewResults = (exam: Exam) => {
    setSelectedExam(exam);
    setExamResults(mockExamResults);
    setResultsModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      const examData = {
        ...values,
        start_time: values.exam_time[0].toISOString(),
        end_time: values.exam_time[1].toISOString(),
      };
      delete examData.exam_time;

      if (editingExam) {
        message.success('考试更新成功');
      } else {
        message.success('考试创建成功');
      }

      setModalVisible(false);
      fetchExams();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const getStatistics = () => {
    const total = exams.length;
    const ongoing = exams.filter(e => e.status === 'ongoing').length;
    const completed = exams.filter(e => e.status === 'completed').length;
    const totalParticipants = exams.reduce((sum, e) => sum + e.participants, 0);
    
    return { total, ongoing, completed, totalParticipants };
  };

  const examColumns = [
    {
      title: '考试名称',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: '所属课程',
      dataIndex: 'course_name',
      key: 'course_name',
      width: 150,
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
      width: 80,
      render: (duration: number) => `${duration}分钟`,
    },
    {
      title: '题目数',
      dataIndex: 'total_questions',
      key: 'total_questions',
      width: 80,
    },
    {
      title: '总分',
      dataIndex: 'total_points',
      key: 'total_points',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          draft: { color: 'orange', text: '草稿' },
          published: { color: 'blue', text: '已发布' },
          ongoing: { color: 'green', text: '进行中' },
          completed: { color: 'purple', text: '已完成' },
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '参与/提交',
      key: 'participation',
      width: 120,
      render: (_: any, record: Exam) => (
        <div>
          <div>{record.submitted}/{record.participants}</div>
          <Progress 
            percent={record.participants > 0 ? (record.submitted / record.participants) * 100 : 0} 
            size="small" 
            showInfo={false}
          />
        </div>
      ),
    },
    {
      title: '考试时间',
      dataIndex: 'start_time',
      key: 'start_time',
      width: 150,
      render: (date: string) => dayjs(date).format('MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Exam) => (
        <Space size="small">
          <Button
            type="text"
            icon={<BarChartOutlined />}
            onClick={() => handleViewResults(record)}
            disabled={record.status === 'draft'}
          >
            结果
          </Button>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => window.open(`/exams/${record.id}`, '_blank')}
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
        </Space>
      ),
    },
  ];

  const resultColumns = [
    {
      title: '学生',
      key: 'student',
      render: (_: any, record: ExamResult) => (
        <div className="flex items-center">
          <Avatar icon={<UserOutlined />} className="mr-2" />
          <div>
            <div className="font-medium">{record.student_name}</div>
            <div className="text-gray-500 text-sm">{record.student_id}</div>
          </div>
        </div>
      ),
    },
    {
      title: '得分',
      key: 'score',
      render: (_: any, record: ExamResult) => (
        <div>
          <div className="font-medium">{record.score}/{record.total_score}</div>
          <div className="text-gray-500 text-sm">{record.percentage}%</div>
        </div>
      ),
    },
    {
      title: '用时',
      dataIndex: 'time_spent',
      key: 'time_spent',
      render: (time: number) => `${time}分钟`,
    },
    {
      title: '提交时间',
      dataIndex: 'submitted_at',
      key: 'submitted_at',
      render: (date: string) => dayjs(date).format('MM-DD HH:mm'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          completed: { color: 'green', text: '已完成' },
          in_progress: { color: 'blue', text: '进行中' },
          not_started: { color: 'orange', text: '未开始' },
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
  ];

  const stats = getStatistics();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Title level={2}>考试管理</Title>
            <Text type="secondary">创建和管理在线考试，查看考试结果</Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            新建考试
          </Button>
        </div>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="总考试数"
                value={stats.total}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="进行中"
                value={stats.ongoing}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="已完成"
                value={stats.completed}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="总参与人数"
                value={stats.totalParticipants}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <Table
            columns={examColumns}
            dataSource={exams}
            loading={loading}
            rowKey="id"
            pagination={{
              total: exams.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            }}
          />
        </Card>

        {/* 创建/编辑考试模态框 */}
        <Modal
          title={editingExam ? '编辑考试' : '新建考试'}
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
                  label="考试名称"
                  rules={[{ required: true, message: '请输入考试名称' }]}
                >
                  <Input placeholder="请输入考试名称" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="course_id"
                  label="所属课程"
                  rules={[{ required: true, message: '请选择所属课程' }]}
                >
                  <Select placeholder="请选择所属课程">
                    <Option value={1}>高中数学强化班</Option>
                    <Option value={2}>英语口语提升班</Option>
                    <Option value={3}>科学实验探索课</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="status"
                  label="考试状态"
                  rules={[{ required: true, message: '请选择考试状态' }]}
                >
                  <Select placeholder="请选择考试状态">
                    <Option value="draft">草稿</Option>
                    <Option value="published">已发布</Option>
                    <Option value="ongoing">进行中</Option>
                    <Option value="completed">已完成</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="description"
                  label="考试描述"
                  rules={[{ required: true, message: '请输入考试描述' }]}
                >
                  <TextArea
                    rows={3}
                    placeholder="请输入考试描述"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="duration"
                  label="考试时长(分钟)"
                  rules={[{ required: true, message: '请输入考试时长' }]}
                >
                  <InputNumber
                    min={10}
                    max={300}
                    placeholder="分钟"
                    className="w-full"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="total_questions"
                  label="题目总数"
                  rules={[{ required: true, message: '请输入题目总数' }]}
                >
                  <InputNumber
                    min={1}
                    max={100}
                    placeholder="题目数"
                    className="w-full"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="total_points"
                  label="总分"
                  rules={[{ required: true, message: '请输入总分' }]}
                >
                  <InputNumber
                    min={1}
                    max={1000}
                    placeholder="分数"
                    className="w-full"
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="exam_time"
                  label="考试时间"
                  rules={[{ required: true, message: '请选择考试时间' }]}
                >
                  <DatePicker.RangePicker
                    showTime
                    format="YYYY-MM-DD HH:mm"
                    className="w-full"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item className="mb-0 mt-6">
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingExam ? '更新' : '创建'}
                </Button>
                <Button onClick={() => setModalVisible(false)}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* 考试结果模态框 */}
        <Modal
          title={`考试结果 - ${selectedExam?.title}`}
          open={resultsModalVisible}
          onCancel={() => setResultsModalVisible(false)}
          footer={null}
          width={800}
        >
          {selectedExam && (
            <div className="space-y-4">
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic title="参与人数" value={selectedExam.participants} />
                </Col>
                <Col span={6}>
                  <Statistic title="提交人数" value={selectedExam.submitted} />
                </Col>
                <Col span={6}>
                  <Statistic 
                    title="平均分" 
                    value={examResults.length > 0 ? 
                      examResults.reduce((sum, r) => sum + r.percentage, 0) / examResults.length : 0
                    } 
                    precision={1}
                    suffix="%" 
                  />
                </Col>
                <Col span={6}>
                  <Statistic 
                    title="及格率" 
                    value={examResults.length > 0 ? 
                      (examResults.filter(r => r.percentage >= 60).length / examResults.length) * 100 : 0
                    } 
                    precision={1}
                    suffix="%" 
                  />
                </Col>
              </Row>

              <Table
                columns={resultColumns}
                dataSource={examResults}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default ExamManagement;
