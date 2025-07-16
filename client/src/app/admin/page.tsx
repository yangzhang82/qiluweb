'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Table, Tag, Progress, List, Avatar } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  FileTextOutlined,
  TeamOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  EyeOutlined,
  MessageOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import AdminLayout from '@/components/Admin/AdminLayout';

const { Title, Text } = Typography;

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // 统计数据
  const stats = [
    {
      title: '总学生数',
      value: 1234,
      prefix: <UserOutlined />,
      suffix: '人',
      valueStyle: { color: '#3f8600' },
      precision: 0,
    },
    {
      title: '总教师数',
      value: 89,
      prefix: <TeamOutlined />,
      suffix: '人',
      valueStyle: { color: '#1890ff' },
      precision: 0,
    },
    {
      title: '活跃课程',
      value: 45,
      prefix: <BookOutlined />,
      suffix: '门',
      valueStyle: { color: '#722ed1' },
      precision: 0,
    },
    {
      title: '待处理报名',
      value: 23,
      prefix: <FileTextOutlined />,
      suffix: '份',
      valueStyle: { color: '#fa8c16' },
      precision: 0,
    },
  ];

  // 最新报名数据
  const recentEnrollments = [
    {
      key: '1',
      name: '张小明',
      grade: '高一',
      phone: '138****1234',
      status: 'pending',
      time: '2024-03-15 10:30',
    },
    {
      key: '2',
      name: '李小红',
      grade: '初三',
      phone: '139****5678',
      status: 'approved',
      time: '2024-03-15 09:15',
    },
    {
      key: '3',
      name: '王小强',
      grade: '高二',
      phone: '137****9012',
      status: 'pending',
      time: '2024-03-14 16:45',
    },
  ];

  const enrollmentColumns = [
    {
      title: '学生姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '申请年级',
      dataIndex: 'grade',
      key: 'grade',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
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
      dataIndex: 'time',
      key: 'time',
    },
  ];

  // 最新新闻
  const recentNews = [
    {
      title: '齐鲁国际学校2024年春季开学典礼圆满举行',
      time: '2024-03-15',
      views: 1234,
      status: 'published',
    },
    {
      title: '我校学生在全国数学竞赛中获得优异成绩',
      time: '2024-03-14',
      views: 856,
      status: 'published',
    },
    {
      title: '国际交流项目：与美国姐妹学校签署合作协议',
      time: '2024-03-13',
      views: 672,
      status: 'published',
    },
  ];

  // 系统活动日志
  const activityLogs = [
    {
      user: '张老师',
      action: '发布了新闻',
      target: '春季开学典礼',
      time: '10分钟前',
      avatar: <Avatar icon={<UserOutlined />} />,
    },
    {
      user: '李管理员',
      action: '审核通过报名申请',
      target: '学生李小红',
      time: '30分钟前',
      avatar: <Avatar icon={<UserOutlined />} />,
    },
    {
      user: '王老师',
      action: '创建了新课程',
      target: '高中数学强化班',
      time: '1小时前',
      avatar: <Avatar icon={<UserOutlined />} />,
    },
    {
      user: '系统',
      action: '自动备份数据库',
      target: '数据库备份',
      time: '2小时前',
      avatar: <Avatar icon={<TeamOutlined />} />,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <Title level={2} className="mb-2">仪表盘</Title>
          <Text type="secondary">欢迎回来！这里是您的管理概览。</Text>
        </div>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]}>
          {stats.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  valueStyle={stat.valueStyle}
                  precision={stat.precision}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* 图表和数据 */}
        <Row gutter={[16, 16]}>
          {/* 学生分布 */}
          <Col xs={24} lg={12}>
            <Card title="年级学生分布" extra={<a href="#">查看详情</a>}>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>高中部</span>
                    <span>45%</span>
                  </div>
                  <Progress percent={45} strokeColor="#1890ff" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>初中部</span>
                    <span>35%</span>
                  </div>
                  <Progress percent={35} strokeColor="#52c41a" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>小学部</span>
                    <span>20%</span>
                  </div>
                  <Progress percent={20} strokeColor="#faad14" />
                </div>
              </div>
            </Card>
          </Col>

          {/* 月度趋势 */}
          <Col xs={24} lg={12}>
            <Card title="本月关键指标">
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="新增学生"
                    value={28}
                    prefix={<RiseOutlined />}
                    valueStyle={{ color: '#3f8600' }}
                    suffix="人"
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="网站访问量"
                    value={9280}
                    prefix={<EyeOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                    suffix="次"
                  />
                </Col>
              </Row>
              <Row gutter={16} className="mt-4">
                <Col span={12}>
                  <Statistic
                    title="新发布新闻"
                    value={12}
                    prefix={<FileTextOutlined />}
                    valueStyle={{ color: '#722ed1' }}
                    suffix="篇"
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="活跃教师"
                    value={76}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: '#fa8c16' }}
                    suffix="人"
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* 数据表格和列表 */}
        <Row gutter={[16, 16]}>
          {/* 最新报名 */}
          <Col xs={24} lg={14}>
            <Card title="最新报名申请" extra={<a href="/admin/enrollment">查看全部</a>}>
              <Table
                columns={enrollmentColumns}
                dataSource={recentEnrollments}
                pagination={false}
                size="small"
              />
            </Card>
          </Col>

          {/* 系统活动 */}
          <Col xs={24} lg={10}>
            <Card title="系统活动" extra={<a href="#">查看全部</a>}>
              <List
                itemLayout="horizontal"
                dataSource={activityLogs}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={item.avatar}
                      title={
                        <div className="text-sm">
                          <span className="font-medium">{item.user}</span>
                          <span className="text-gray-600 ml-1">{item.action}</span>
                          <span className="text-blue-600 ml-1">{item.target}</span>
                        </div>
                      }
                      description={
                        <div className="text-xs text-gray-500">{item.time}</div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        {/* 最新新闻 */}
        <Row>
          <Col span={24}>
            <Card title="最新发布新闻" extra={<a href="/admin/news">管理新闻</a>}>
              <List
                itemLayout="horizontal"
                dataSource={recentNews}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <div key="views" className="flex items-center text-gray-500">
                        <EyeOutlined className="mr-1" />
                        {item.views}
                      </div>,
                      <div key="time" className="flex items-center text-gray-500">
                        <CalendarOutlined className="mr-1" />
                        {item.time}
                      </div>,
                    ]}
                  >
                    <List.Item.Meta
                      title={<a href="#">{item.title}</a>}
                      description={
                        <Tag color="green">已发布</Tag>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
