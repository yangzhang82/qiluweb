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
  TimePicker,
  DatePicker,
  Tag,
  Tabs,
  Calendar,
  Badge
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BookOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AdminLayout from '@/components/Admin/AdminLayout';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface Schedule {
  id: string;
  course_name: string;
  teacher_name: string;
  class_name: string;
  classroom: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  semester: string;
  status: 'active' | 'suspended' | 'completed';
  created_at: string;
}

interface ClassSession {
  id: string;
  schedule_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  attendance_count?: number;
  notes?: string;
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedDate, setSelectedDate] = useState(dayjs());

  useEffect(() => {
    fetchSchedules();
    fetchSessions();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      // TODO: 实际API调用
      const mockSchedules: Schedule[] = [
        {
          id: '1',
          course_name: '高中数学',
          teacher_name: '张老师',
          class_name: '高一(1)班',
          classroom: 'A101',
          day_of_week: 1,
          start_time: '08:00',
          end_time: '09:40',
          semester: '2024春季',
          status: 'active',
          created_at: '2024-02-01T08:00:00Z'
        },
        {
          id: '2',
          course_name: '英语口语',
          teacher_name: '李老师',
          class_name: '高二(2)班',
          classroom: 'B205',
          day_of_week: 2,
          start_time: '10:00',
          end_time: '11:40',
          semester: '2024春季',
          status: 'active',
          created_at: '2024-02-01T08:00:00Z'
        },
        {
          id: '3',
          course_name: '物理实验',
          teacher_name: '王老师',
          class_name: '高三(1)班',
          classroom: '实验室1',
          day_of_week: 3,
          start_time: '14:00',
          end_time: '15:40',
          semester: '2024春季',
          status: 'active',
          created_at: '2024-02-01T08:00:00Z'
        }
      ];
      
      setSchedules(mockSchedules);
    } catch (error) {
      message.error('获取课程表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      // TODO: 实际API调用
      const mockSessions: ClassSession[] = [
        {
          id: '1',
          schedule_id: '1',
          date: '2024-03-18',
          start_time: '08:00',
          end_time: '09:40',
          status: 'completed',
          attendance_count: 28,
          notes: '完成第三章内容'
        },
        {
          id: '2',
          schedule_id: '2',
          date: '2024-03-19',
          start_time: '10:00',
          end_time: '11:40',
          status: 'scheduled'
        },
        {
          id: '3',
          schedule_id: '3',
          date: '2024-03-20',
          start_time: '14:00',
          end_time: '15:40',
          status: 'scheduled'
        }
      ];
      
      setSessions(mockSessions);
    } catch (error) {
      message.error('获取课程安排失败');
    }
  };

  const handleAdd = () => {
    setEditingSchedule(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    form.setFieldsValue({
      ...schedule,
      time_range: [
        dayjs(schedule.start_time, 'HH:mm'),
        dayjs(schedule.end_time, 'HH:mm')
      ]
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: 实际API调用
      message.success('删除成功');
      fetchSchedules();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        start_time: values.time_range[0].format('HH:mm'),
        end_time: values.time_range[1].format('HH:mm')
      };
      delete formData.time_range;

      if (editingSchedule) {
        // TODO: 更新课程表
        message.success('更新成功');
      } else {
        // TODO: 创建课程表
        message.success('创建成功');
      }
      
      setModalVisible(false);
      fetchSchedules();
    } catch (error) {
      message.error(editingSchedule ? '更新失败' : '创建失败');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'green',
      suspended: 'orange',
      completed: 'blue'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts = {
      active: '进行中',
      suspended: '暂停',
      completed: '已完成'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[dayOfWeek];
  };

  const getSessionStatusColor = (status: string) => {
    const colors = {
      scheduled: 'blue',
      completed: 'green',
      cancelled: 'red'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getSessionStatusText = (status: string) => {
    const texts = {
      scheduled: '待上课',
      completed: '已完成',
      cancelled: '已取消'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const scheduleColumns: ColumnsType<Schedule> = [
    {
      title: '课程信息',
      key: 'course_info',
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-medium text-lg">{record.course_name}</div>
          <div className="text-sm text-gray-500">
            <UserOutlined className="mr-1" />
            {record.teacher_name}
          </div>
          <div className="text-sm text-gray-500">
            <BookOutlined className="mr-1" />
            {record.class_name}
          </div>
        </div>
      ),
    },
    {
      title: '时间安排',
      key: 'time_info',
      width: 150,
      render: (_, record) => (
        <div>
          <div className="font-medium">{getDayName(record.day_of_week)}</div>
          <div className="text-sm text-gray-500">
            <ClockCircleOutlined className="mr-1" />
            {record.start_time} - {record.end_time}
          </div>
        </div>
      ),
    },
    {
      title: '教室',
      dataIndex: 'classroom',
      key: 'classroom',
      width: 100,
    },
    {
      title: '学期',
      dataIndex: 'semester',
      key: 'semester',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
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
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个课程安排吗？"
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

  const sessionColumns: ColumnsType<ClassSession> = [
    {
      title: '课程',
      key: 'course',
      render: (_, record) => {
        const schedule = schedules.find(s => s.id === record.schedule_id);
        return schedule ? (
          <div>
            <div className="font-medium">{schedule.course_name}</div>
            <div className="text-sm text-gray-500">{schedule.class_name}</div>
          </div>
        ) : '-';
      },
    },
    {
      title: '日期时间',
      key: 'datetime',
      render: (_, record) => (
        <div>
          <div>{dayjs(record.date).format('YYYY-MM-DD')}</div>
          <div className="text-sm text-gray-500">
            {record.start_time} - {record.end_time}
          </div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getSessionStatusColor(status)}>
          {getSessionStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '出勤',
      dataIndex: 'attendance_count',
      key: 'attendance_count',
      render: (count: number) => count ? `${count}人` : '-',
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes: string) => notes || '-',
    },
  ];

  const dateCellRender = (value: dayjs.Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    const daySessions = sessions.filter(session => session.date === dateStr);
    
    return (
      <div className="h-full">
        {daySessions.map(session => {
          const schedule = schedules.find(s => s.id === session.schedule_id);
          return (
            <div key={session.id} className="mb-1">
              <Badge 
                status={session.status === 'completed' ? 'success' : 
                       session.status === 'cancelled' ? 'error' : 'processing'} 
                text={
                  <span className="text-xs">
                    {schedule?.course_name} {session.start_time}
                  </span>
                }
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Title level={2}>排课管理</Title>
            <Text type="secondary">管理课程时间安排和教室分配</Text>
          </div>
          <Space>
            <Button icon={<CalendarOutlined />}>
              批量排课
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新建课程安排
            </Button>
          </Space>
        </div>

        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="课程表" key="schedule">
              <Table
                columns={scheduleColumns}
                dataSource={schedules}
                loading={loading}
                rowKey="id"
                pagination={{
                  total: schedules.length,
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                }}
              />
            </TabPane>
            
            <TabPane tab="课程安排" key="sessions">
              <Table
                columns={sessionColumns}
                dataSource={sessions}
                loading={loading}
                rowKey="id"
                pagination={{
                  total: sessions.length,
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                }}
              />
            </TabPane>
            
            <TabPane tab="日历视图" key="calendar">
              <Calendar 
                dateCellRender={dateCellRender}
                value={selectedDate}
                onSelect={setSelectedDate}
              />
            </TabPane>
          </Tabs>
        </Card>

        <Modal
          title={editingSchedule ? '编辑课程安排' : '新建课程安排'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={600}
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
                  name="course_name"
                  label="课程名称"
                  rules={[{ required: true, message: '请输入课程名称' }]}
                >
                  <Input placeholder="请输入课程名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="teacher_name"
                  label="授课教师"
                  rules={[{ required: true, message: '请选择授课教师' }]}
                >
                  <Select placeholder="请选择授课教师">
                    <Option value="张老师">张老师</Option>
                    <Option value="李老师">李老师</Option>
                    <Option value="王老师">王老师</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="class_name"
                  label="班级"
                  rules={[{ required: true, message: '请选择班级' }]}
                >
                  <Select placeholder="请选择班级">
                    <Option value="高一(1)班">高一(1)班</Option>
                    <Option value="高一(2)班">高一(2)班</Option>
                    <Option value="高二(1)班">高二(1)班</Option>
                    <Option value="高二(2)班">高二(2)班</Option>
                    <Option value="高三(1)班">高三(1)班</Option>
                    <Option value="高三(2)班">高三(2)班</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="classroom"
                  label="教室"
                  rules={[{ required: true, message: '请输入教室' }]}
                >
                  <Input placeholder="请输入教室" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="day_of_week"
                  label="星期"
                  rules={[{ required: true, message: '请选择星期' }]}
                >
                  <Select placeholder="请选择星期">
                    <Option value={1}>周一</Option>
                    <Option value={2}>周二</Option>
                    <Option value={3}>周三</Option>
                    <Option value={4}>周四</Option>
                    <Option value={5}>周五</Option>
                    <Option value={6}>周六</Option>
                    <Option value={0}>周日</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="time_range"
                  label="上课时间"
                  rules={[{ required: true, message: '请选择上课时间' }]}
                >
                  <TimePicker.RangePicker 
                    format="HH:mm"
                    placeholder={['开始时间', '结束时间']}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="semester"
                  label="学期"
                  rules={[{ required: true, message: '请输入学期' }]}
                >
                  <Input placeholder="如：2024春季" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="状态"
                  rules={[{ required: true, message: '请选择状态' }]}
                >
                  <Select placeholder="请选择状态">
                    <Option value="active">进行中</Option>
                    <Option value="suspended">暂停</Option>
                    <Option value="completed">已完成</Option>
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
                  {editingSchedule ? '更新' : '创建'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
