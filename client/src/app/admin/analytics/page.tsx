'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Typography,
  Select,
  DatePicker,
  Space,
  Table,
  Progress,
  Tag,
  Tabs
} from 'antd';
import { 
  UserOutlined,
  BookOutlined,
  TrophyOutlined,
  EyeOutlined,
  RiseOutlined,
  FallOutlined,
  TeamOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import AdminLayout from '@/components/Admin/AdminLayout';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface AnalyticsData {
  overview: {
    total_students: number;
    total_teachers: number;
    total_courses: number;
    total_enrollments: number;
    student_growth: number;
    teacher_growth: number;
    course_growth: number;
    enrollment_growth: number;
  };
  website: {
    total_visits: number;
    unique_visitors: number;
    page_views: number;
    bounce_rate: number;
    avg_session_duration: number;
    visit_growth: number;
  };
  academic: {
    average_score: number;
    pass_rate: number;
    excellent_rate: number;
    attendance_rate: number;
  };
  popular_pages: Array<{
    page: string;
    visits: number;
    growth: number;
  }>;
  grade_distribution: Array<{
    grade: string;
    student_count: number;
    percentage: number;
  }>;
  course_popularity: Array<{
    course: string;
    enrollment_count: number;
    rating: number;
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // TODO: 实际API调用
      const mockData: AnalyticsData = {
        overview: {
          total_students: 1234,
          total_teachers: 89,
          total_courses: 45,
          total_enrollments: 23,
          student_growth: 5.2,
          teacher_growth: 2.1,
          course_growth: 8.7,
          enrollment_growth: 15.3
        },
        website: {
          total_visits: 9280,
          unique_visitors: 6543,
          page_views: 18560,
          bounce_rate: 32.5,
          avg_session_duration: 245,
          visit_growth: 12.8
        },
        academic: {
          average_score: 85.6,
          pass_rate: 94.2,
          excellent_rate: 78.5,
          attendance_rate: 96.8
        },
        popular_pages: [
          { page: '首页', visits: 3245, growth: 8.5 },
          { page: '课程介绍', visits: 2156, growth: 12.3 },
          { page: '师资力量', visits: 1876, growth: -2.1 },
          { page: '招生信息', visits: 1654, growth: 25.6 },
          { page: '新闻动态', visits: 1432, growth: 5.8 }
        ],
        grade_distribution: [
          { grade: '高一', student_count: 456, percentage: 37.0 },
          { grade: '高二', student_count: 423, percentage: 34.3 },
          { grade: '高三', student_count: 355, percentage: 28.7 }
        ],
        course_popularity: [
          { course: '数学', enrollment_count: 1200, rating: 4.8 },
          { course: '英语', enrollment_count: 1180, rating: 4.6 },
          { course: '物理', enrollment_count: 980, rating: 4.5 },
          { course: '化学', enrollment_count: 876, rating: 4.4 },
          { course: '生物', enrollment_count: 765, rating: 4.3 }
        ]
      };
      
      setData(mockData);
    } catch (error) {
      console.error('获取分析数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds}秒`;
  };

  const popularPagesColumns = [
    {
      title: '页面',
      dataIndex: 'page',
      key: 'page',
    },
    {
      title: '访问量',
      dataIndex: 'visits',
      key: 'visits',
      render: (visits: number) => visits.toLocaleString(),
    },
    {
      title: '增长率',
      dataIndex: 'growth',
      key: 'growth',
      render: (growth: number) => (
        <span className={growth >= 0 ? 'text-green-600' : 'text-red-600'}>
          {growth >= 0 ? <RiseOutlined /> : <FallOutlined />}
          {Math.abs(growth)}%
        </span>
      ),
    },
  ];

  const coursePopularityColumns = [
    {
      title: '课程',
      dataIndex: 'course',
      key: 'course',
    },
    {
      title: '报名人数',
      dataIndex: 'enrollment_count',
      key: 'enrollment_count',
      render: (count: number) => count.toLocaleString(),
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <div className="flex items-center">
          <span className="mr-2">{rating}</span>
          <Progress 
            percent={rating * 20} 
            size="small" 
            showInfo={false}
            strokeColor="#faad14"
          />
        </div>
      ),
    },
  ];

  if (!data) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div>加载中...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Title level={2}>数据分析</Title>
            <Text type="secondary">查看学校运营数据和统计分析</Text>
          </div>
          <Space>
            <RangePicker
              value={dateRange}
              onChange={(dates) => dates && setDateRange(dates)}
              format="YYYY-MM-DD"
            />
            <Select defaultValue="30" style={{ width: 120 }}>
              <Option value="7">最近7天</Option>
              <Option value="30">最近30天</Option>
              <Option value="90">最近90天</Option>
              <Option value="365">最近一年</Option>
            </Select>
          </Space>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="总览" key="overview">
            {/* 核心指标 */}
            <Row gutter={[16, 16]} className="mb-6">
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="总学生数"
                    value={data.overview.total_students}
                    prefix={<UserOutlined />}
                    suffix="人"
                    valueStyle={{ color: '#3f8600' }}
                  />
                  <div className="mt-2 text-sm">
                    <span className={data.overview.student_growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {data.overview.student_growth >= 0 ? <RiseOutlined /> : <FallOutlined />}
                      {Math.abs(data.overview.student_growth)}%
                    </span>
                    <span className="text-gray-500 ml-2">较上月</span>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="总教师数"
                    value={data.overview.total_teachers}
                    prefix={<TeamOutlined />}
                    suffix="人"
                    valueStyle={{ color: '#1890ff' }}
                  />
                  <div className="mt-2 text-sm">
                    <span className={data.overview.teacher_growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {data.overview.teacher_growth >= 0 ? <RiseOutlined /> : <FallOutlined />}
                      {Math.abs(data.overview.teacher_growth)}%
                    </span>
                    <span className="text-gray-500 ml-2">较上月</span>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="活跃课程"
                    value={data.overview.total_courses}
                    prefix={<BookOutlined />}
                    suffix="门"
                    valueStyle={{ color: '#722ed1' }}
                  />
                  <div className="mt-2 text-sm">
                    <span className={data.overview.course_growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {data.overview.course_growth >= 0 ? <RiseOutlined /> : <FallOutlined />}
                      {Math.abs(data.overview.course_growth)}%
                    </span>
                    <span className="text-gray-500 ml-2">较上月</span>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="待处理报名"
                    value={data.overview.total_enrollments}
                    prefix={<FileTextOutlined />}
                    suffix="份"
                    valueStyle={{ color: '#fa8c16' }}
                  />
                  <div className="mt-2 text-sm">
                    <span className={data.overview.enrollment_growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {data.overview.enrollment_growth >= 0 ? <RiseOutlined /> : <FallOutlined />}
                      {Math.abs(data.overview.enrollment_growth)}%
                    </span>
                    <span className="text-gray-500 ml-2">较上月</span>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* 年级分布 */}
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title="年级学生分布" extra={<a href="#">查看详情</a>}>
                  <div className="space-y-4">
                    {data.grade_distribution.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span>{item.grade}</span>
                          <span>{item.student_count}人 ({item.percentage}%)</span>
                        </div>
                        <Progress 
                          percent={item.percentage} 
                          showInfo={false}
                          strokeColor={['#1890ff', '#52c41a', '#faad14'][index]}
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="学术表现指标">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="平均分"
                        value={data.academic.average_score}
                        precision={1}
                        suffix="分"
                        valueStyle={{ color: '#3f8600' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="及格率"
                        value={data.academic.pass_rate}
                        precision={1}
                        suffix="%"
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Col>
                  </Row>
                  <Row gutter={16} className="mt-4">
                    <Col span={12}>
                      <Statistic
                        title="优秀率"
                        value={data.academic.excellent_rate}
                        precision={1}
                        suffix="%"
                        valueStyle={{ color: '#722ed1' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="出勤率"
                        value={data.academic.attendance_rate}
                        precision={1}
                        suffix="%"
                        valueStyle={{ color: '#fa8c16' }}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="网站数据" key="website">
            {/* 网站访问数据 */}
            <Row gutter={[16, 16]} className="mb-6">
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="总访问量"
                    value={data.website.total_visits}
                    prefix={<EyeOutlined />}
                    valueStyle={{ color: '#3f8600' }}
                  />
                  <div className="mt-2 text-sm">
                    <span className="text-green-600">
                      <RiseOutlined />
                      {data.website.visit_growth}%
                    </span>
                    <span className="text-gray-500 ml-2">较上月</span>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="独立访客"
                    value={data.website.unique_visitors}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="页面浏览量"
                    value={data.website.page_views}
                    prefix={<FileTextOutlined />}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="跳出率"
                    value={data.website.bounce_rate}
                    precision={1}
                    suffix="%"
                    valueStyle={{ color: '#fa8c16' }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title="热门页面">
                  <Table
                    columns={popularPagesColumns}
                    dataSource={data.popular_pages}
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="访问统计">
                  <div className="space-y-4">
                    <div>
                      <Text strong>平均会话时长</Text>
                      <div className="text-2xl font-bold text-blue-600">
                        {formatDuration(data.website.avg_session_duration)}
                      </div>
                    </div>
                    <div>
                      <Text strong>访问来源</Text>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between">
                          <span>直接访问</span>
                          <span>45.2%</span>
                        </div>
                        <Progress percent={45.2} showInfo={false} />
                        <div className="flex justify-between">
                          <span>搜索引擎</span>
                          <span>32.8%</span>
                        </div>
                        <Progress percent={32.8} showInfo={false} strokeColor="#52c41a" />
                        <div className="flex justify-between">
                          <span>社交媒体</span>
                          <span>22.0%</span>
                        </div>
                        <Progress percent={22.0} showInfo={false} strokeColor="#faad14" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="课程数据" key="courses">
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Card title="课程受欢迎程度">
                  <Table
                    columns={coursePopularityColumns}
                    dataSource={data.course_popularity}
                    pagination={false}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
