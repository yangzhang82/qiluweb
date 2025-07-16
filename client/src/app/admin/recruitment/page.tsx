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
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Tabs,
  Rate,
  Descriptions,
  Timeline
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  DownloadOutlined,
  UserOutlined,
  CalendarOutlined,
  StarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import AdminLayout from '@/components/Admin/AdminLayout';
import { recruitmentAPI, aiAPI } from '@/lib/api';
import type { Resume } from '@/types';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface Interview {
  id: number;
  resume_id: number;
  candidate_name: string;
  position: string;
  interviewer: string;
  scheduled_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  score?: number;
  feedback?: string;
}

const RecruitmentManagement: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [interviewModalVisible, setInterviewModalVisible] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [activeTab, setActiveTab] = useState('resumes');
  const [form] = Form.useForm();

  // 模拟简历数据
  const mockResumes: Resume[] = [
    {
      id: 1,
      name: '张教师',
      email: 'zhang.teacher@example.com',
      phone: '13800138001',
      position: '高中数学教师',
      experience: 5,
      education: '硕士',
      skills: ['数学教学', '班级管理', '课程设计'],
      file_path: '/uploads/resume_zhang.pdf',
      ai_score: 8.5,
      ai_analysis: '候选人具有丰富的数学教学经验，教学方法创新，学生评价良好。建议进入面试环节。',
      status: 'reviewed',
      created_at: '2024-03-15T10:00:00Z',
      updated_at: '2024-03-15T10:00:00Z'
    },
    {
      id: 2,
      name: '李老师',
      email: 'li.teacher@example.com',
      phone: '13800138002',
      position: '英语教师',
      experience: 3,
      education: '本科',
      skills: ['英语教学', '口语训练', '国际交流'],
      file_path: '/uploads/resume_li.pdf',
      ai_score: 7.2,
      ai_analysis: '候选人英语基础扎实，有海外学习经历，适合国际化教学环境。',
      status: 'pending',
      created_at: '2024-03-14T14:00:00Z',
      updated_at: '2024-03-14T14:00:00Z'
    },
    {
      id: 3,
      name: '王博士',
      email: 'wang.doctor@example.com',
      phone: '13800138003',
      position: '物理教师',
      experience: 8,
      education: '博士',
      skills: ['物理教学', '实验设计', '科研指导'],
      file_path: '/uploads/resume_wang.pdf',
      ai_score: 9.1,
      ai_analysis: '候选人学术背景优秀，具有丰富的教学和科研经验，强烈推荐录用。',
      status: 'approved',
      created_at: '2024-03-13T09:00:00Z',
      updated_at: '2024-03-13T16:00:00Z'
    }
  ];

  // 模拟面试数据
  const mockInterviews: Interview[] = [
    {
      id: 1,
      resume_id: 1,
      candidate_name: '张教师',
      position: '高中数学教师',
      interviewer: '教务主任',
      scheduled_time: '2024-03-20T14:00:00Z',
      status: 'scheduled'
    },
    {
      id: 2,
      resume_id: 3,
      candidate_name: '王博士',
      position: '物理教师',
      interviewer: '校长',
      scheduled_time: '2024-03-18T10:00:00Z',
      status: 'completed',
      score: 9,
      feedback: '候选人表现优秀，专业知识扎实，教学理念先进，建议录用。'
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setResumes(mockResumes);
        setInterviews(mockInterviews);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  const handleViewDetail = (record: Resume) => {
    setSelectedResume(record);
    setDetailModalVisible(true);
  };

  const handleScheduleInterview = (record: Resume) => {
    setSelectedResume(record);
    form.setFieldsValue({
      candidate_name: record.name,
      position: record.position,
      scheduled_time: dayjs().add(1, 'week')
    });
    setInterviewModalVisible(true);
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await recruitmentAPI.updateResumeStatus(id.toString(), status);
      message.success('状态更新成功');
      fetchData();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const handleAIAnalysis = async (id: number) => {
    try {
      setLoading(true);
      const response = await aiAPI.analyzeResume(id.toString());
      message.success('AI分析完成');
      fetchData();
    } catch (error) {
      message.error('AI分析失败');
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewSubmit = async (values: any) => {
    try {
      const interviewData = {
        ...values,
        resume_id: selectedResume?.id,
        scheduled_time: values.scheduled_time.toISOString(),
      };
      
      message.success('面试安排成功');
      setInterviewModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('面试安排失败');
    }
  };

  const getStatistics = () => {
    const totalResumes = resumes.length;
    const pendingResumes = resumes.filter(r => r.status === 'pending').length;
    const approvedResumes = resumes.filter(r => r.status === 'approved').length;
    const avgScore = resumes.length > 0 ? 
      resumes.reduce((sum, r) => sum + (r.ai_score || 0), 0) / resumes.length : 0;
    
    return { totalResumes, pendingResumes, approvedResumes, avgScore };
  };

  const resumeColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '应聘职位',
      dataIndex: 'position',
      key: 'position',
      width: 150,
    },
    {
      title: '工作经验',
      dataIndex: 'experience',
      key: 'experience',
      width: 100,
      render: (exp: number) => `${exp}年`,
    },
    {
      title: '学历',
      dataIndex: 'education',
      key: 'education',
      width: 80,
    },
    {
      title: 'AI评分',
      dataIndex: 'ai_score',
      key: 'ai_score',
      width: 120,
      render: (score: number) => (
        <div>
          <div className="font-medium">{score?.toFixed(1) || '-'}</div>
          <Progress 
            percent={score * 10} 
            size="small" 
            showInfo={false}
            strokeColor={score >= 8 ? '#52c41a' : score >= 6 ? '#faad14' : '#f5222d'}
          />
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          pending: { color: 'orange', text: '待审核' },
          reviewed: { color: 'blue', text: '已审核' },
          approved: { color: 'green', text: '已通过' },
          rejected: { color: 'red', text: '已拒绝' },
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '提交时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (date: string) => dayjs(date).format('MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_: any, record: Resume) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          <Button
            type="text"
            icon={<StarOutlined />}
            onClick={() => handleAIAnalysis(record.id)}
            loading={loading}
          >
            AI分析
          </Button>
          <Button
            type="text"
            icon={<CalendarOutlined />}
            onClick={() => handleScheduleInterview(record)}
            disabled={record.status === 'rejected'}
          >
            安排面试
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="text"
                style={{ color: '#52c41a' }}
                onClick={() => handleStatusChange(record.id, 'approved')}
              >
                通过
              </Button>
              <Button
                type="text"
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

  const interviewColumns = [
    {
      title: '候选人',
      dataIndex: 'candidate_name',
      key: 'candidate_name',
      width: 120,
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
      width: 150,
    },
    {
      title: '面试官',
      dataIndex: 'interviewer',
      key: 'interviewer',
      width: 120,
    },
    {
      title: '面试时间',
      dataIndex: 'scheduled_time',
      key: 'scheduled_time',
      width: 150,
      render: (date: string) => dayjs(date).format('MM-DD HH:mm'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          scheduled: { color: 'blue', text: '已安排' },
          completed: { color: 'green', text: '已完成' },
          cancelled: { color: 'red', text: '已取消' },
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '评分',
      dataIndex: 'score',
      key: 'score',
      width: 100,
      render: (score: number) => score ? <Rate disabled value={score / 2} /> : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Interview) => (
        <Space size="small">
          <Button type="text" icon={<EyeOutlined />}>
            查看
          </Button>
          {record.status === 'scheduled' && (
            <Button type="text" icon={<EditOutlined />}>
              编辑
            </Button>
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
          <Title level={2}>招聘管理</Title>
          <Text type="secondary">管理教师招聘流程，AI智能筛选简历</Text>
        </div>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="总简历数"
                value={stats.totalResumes}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="待审核"
                value={stats.pendingResumes}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="已通过"
                value={stats.approvedResumes}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="平均AI评分"
                value={stats.avgScore}
                precision={1}
                prefix={<StarOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab={`简历管理 (${stats.totalResumes})`} key="resumes">
              <Table
                columns={resumeColumns}
                dataSource={resumes}
                loading={loading}
                rowKey="id"
                pagination={{
                  total: resumes.length,
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                }}
              />
            </TabPane>

            <TabPane tab={`面试安排 (${interviews.length})`} key="interviews">
              <Table
                columns={interviewColumns}
                dataSource={interviews}
                loading={loading}
                rowKey="id"
                pagination={{
                  total: interviews.length,
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                }}
              />
            </TabPane>
          </Tabs>
        </Card>

        {/* 简历详情模态框 */}
        <Modal
          title="简历详情"
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={null}
          width={800}
        >
          {selectedResume && (
            <div className="space-y-6">
              <Descriptions title="基本信息" bordered column={2}>
                <Descriptions.Item label="姓名">{selectedResume.name}</Descriptions.Item>
                <Descriptions.Item label="应聘职位">{selectedResume.position}</Descriptions.Item>
                <Descriptions.Item label="邮箱">{selectedResume.email}</Descriptions.Item>
                <Descriptions.Item label="电话">{selectedResume.phone}</Descriptions.Item>
                <Descriptions.Item label="工作经验">{selectedResume.experience}年</Descriptions.Item>
                <Descriptions.Item label="学历">{selectedResume.education}</Descriptions.Item>
              </Descriptions>

              <div>
                <Title level={5}>技能标签</Title>
                <div className="flex flex-wrap gap-2">
                  {selectedResume.skills.map((skill, index) => (
                    <Tag key={index} color="blue">{skill}</Tag>
                  ))}
                </div>
              </div>

              <div>
                <Title level={5}>AI分析结果</Title>
                <div className="bg-gray-50 p-4 rounded">
                  <div className="flex items-center mb-2">
                    <span className="font-medium mr-2">AI评分：</span>
                    <Rate disabled value={selectedResume.ai_score / 2} />
                    <span className="ml-2 text-lg font-bold text-blue-600">
                      {selectedResume.ai_score?.toFixed(1)}
                    </span>
                  </div>
                  <Paragraph>{selectedResume.ai_analysis}</Paragraph>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  icon={<DownloadOutlined />}
                  onClick={() => window.open(selectedResume.file_path)}
                >
                  下载简历
                </Button>
                <Button 
                  type="primary" 
                  icon={<CalendarOutlined />}
                  onClick={() => {
                    setDetailModalVisible(false);
                    handleScheduleInterview(selectedResume);
                  }}
                >
                  安排面试
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* 面试安排模态框 */}
        <Modal
          title="安排面试"
          open={interviewModalVisible}
          onCancel={() => setInterviewModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleInterviewSubmit}
          >
            <Form.Item
              name="candidate_name"
              label="候选人姓名"
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="position"
              label="应聘职位"
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="interviewer"
              label="面试官"
              rules={[{ required: true, message: '请选择面试官' }]}
            >
              <Select placeholder="请选择面试官">
                <Option value="校长">校长</Option>
                <Option value="教务主任">教务主任</Option>
                <Option value="学科主任">学科主任</Option>
                <Option value="人事主管">人事主管</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="scheduled_time"
              label="面试时间"
              rules={[{ required: true, message: '请选择面试时间' }]}
            >
              <Input type="datetime-local" />
            </Form.Item>

            <Form.Item
              name="notes"
              label="备注"
            >
              <TextArea rows={3} placeholder="面试相关备注信息" />
            </Form.Item>

            <Form.Item className="mb-0">
              <Space>
                <Button type="primary" htmlType="submit">
                  确认安排
                </Button>
                <Button onClick={() => setInterviewModalVisible(false)}>
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

export default RecruitmentManagement;
