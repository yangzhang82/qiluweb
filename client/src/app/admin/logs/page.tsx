'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Input, 
  Select, 
  Row, 
  Col, 
  Typography,
  Tag,
  DatePicker,
  Tabs,
  Modal,
  Tooltip
} from 'antd';
import { 
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  FilterOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AdminLayout from '@/components/Admin/AdminLayout';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface LogEntry {
  id: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  context: string;
  user_id?: string;
  user_name?: string;
  ip_address: string;
  user_agent: string;
  url?: string;
  method?: string;
  status_code?: number;
  response_time?: number;
  created_at: string;
  details?: any;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    level: '',
    context: '',
    user: '',
    dateRange: null as [dayjs.Dayjs, dayjs.Dayjs] | null,
    search: ''
  });

  useEffect(() => {
    fetchLogs();
  }, [activeTab, filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // TODO: 实际API调用
      const mockLogs: LogEntry[] = [
        {
          id: '1',
          level: 'info',
          message: '用户登录成功',
          context: 'auth',
          user_id: '1',
          user_name: '张老师',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          url: '/admin/login',
          method: 'POST',
          status_code: 200,
          response_time: 245,
          created_at: '2024-03-15T10:30:00Z'
        },
        {
          id: '2',
          level: 'warning',
          message: '文件上传大小超出限制',
          context: 'upload',
          user_id: '2',
          user_name: '李老师',
          ip_address: '192.168.1.101',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          url: '/admin/media/upload',
          method: 'POST',
          status_code: 413,
          response_time: 156,
          created_at: '2024-03-15T10:25:00Z',
          details: {
            file_size: '15MB',
            max_size: '10MB',
            file_name: 'presentation.pdf'
          }
        },
        {
          id: '3',
          level: 'error',
          message: '数据库连接失败',
          context: 'database',
          ip_address: '192.168.1.1',
          user_agent: 'System',
          created_at: '2024-03-15T10:20:00Z',
          details: {
            error: 'Connection timeout',
            database: 'qilu_school',
            retry_count: 3
          }
        },
        {
          id: '4',
          level: 'info',
          message: '新闻文章发布',
          context: 'content',
          user_id: '3',
          user_name: '王编辑',
          ip_address: '192.168.1.102',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          url: '/admin/news/create',
          method: 'POST',
          status_code: 201,
          response_time: 892,
          created_at: '2024-03-15T10:15:00Z',
          details: {
            article_id: '123',
            title: '春季开学典礼通知',
            category: '学校新闻'
          }
        },
        {
          id: '5',
          level: 'debug',
          message: 'API请求调试信息',
          context: 'api',
          user_id: '1',
          user_name: '张老师',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          url: '/api/students',
          method: 'GET',
          status_code: 200,
          response_time: 45,
          created_at: '2024-03-15T10:10:00Z',
          details: {
            query_params: { page: 1, limit: 20 },
            result_count: 18
          }
        }
      ];
      
      setLogs(mockLogs);
    } catch (error) {
      console.error('获取日志失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (log: LogEntry) => {
    setSelectedLog(log);
    setDetailModalVisible(true);
  };

  const handleClearLogs = async () => {
    try {
      // TODO: 清空日志API调用
      setLogs([]);
    } catch (error) {
      console.error('清空日志失败:', error);
    }
  };

  const handleExportLogs = () => {
    // TODO: 导出日志功能
    console.log('导出日志');
  };

  const getLevelColor = (level: string) => {
    const colors = {
      info: 'blue',
      warning: 'orange',
      error: 'red',
      debug: 'green'
    };
    return colors[level as keyof typeof colors] || 'default';
  };

  const getLevelText = (level: string) => {
    const texts = {
      info: '信息',
      warning: '警告',
      error: '错误',
      debug: '调试'
    };
    return texts[level as keyof typeof texts] || level;
  };

  const getContextText = (context: string) => {
    const texts = {
      auth: '认证',
      upload: '上传',
      database: '数据库',
      content: '内容',
      api: 'API',
      system: '系统'
    };
    return texts[context as keyof typeof texts] || context;
  };

  const getFilteredLogs = () => {
    let filtered = logs;

    // 按标签页过滤
    if (activeTab !== 'all') {
      filtered = filtered.filter(log => log.level === activeTab);
    }

    // 按级别过滤
    if (filters.level) {
      filtered = filtered.filter(log => log.level === filters.level);
    }

    // 按上下文过滤
    if (filters.context) {
      filtered = filtered.filter(log => log.context === filters.context);
    }

    // 按用户过滤
    if (filters.user) {
      filtered = filtered.filter(log => 
        log.user_name?.toLowerCase().includes(filters.user.toLowerCase())
      );
    }

    // 按日期范围过滤
    if (filters.dateRange) {
      const [start, end] = filters.dateRange;
      filtered = filtered.filter(log => {
        const logDate = dayjs(log.created_at);
        return logDate.isAfter(start) && logDate.isBefore(end);
      });
    }

    // 按搜索关键词过滤
    if (filters.search) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.url?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    return filtered;
  };

  const columns: ColumnsType<LogEntry> = [
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: string) => (
        <Tag color={getLevelColor(level)}>
          {getLevelText(level)}
        </Tag>
      ),
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
      width: 300,
      ellipsis: true,
    },
    {
      title: '上下文',
      dataIndex: 'context',
      key: 'context',
      width: 100,
      render: (context: string) => (
        <Tag>{getContextText(context)}</Tag>
      ),
    },
    {
      title: '用户',
      key: 'user',
      width: 120,
      render: (_, record) => (
        record.user_name ? (
          <div>
            <div>{record.user_name}</div>
            <div className="text-xs text-gray-500">{record.ip_address}</div>
          </div>
        ) : (
          <span className="text-gray-500">系统</span>
        )
      ),
    },
    {
      title: '请求信息',
      key: 'request',
      width: 150,
      render: (_, record) => (
        record.url ? (
          <div>
            <div className="text-sm">
              <Tag size="small" color={record.status_code && record.status_code >= 400 ? 'red' : 'green'}>
                {record.method}
              </Tag>
              {record.status_code}
            </div>
            <div className="text-xs text-gray-500 truncate" title={record.url}>
              {record.url}
            </div>
            {record.response_time && (
              <div className="text-xs text-gray-500">
                {record.response_time}ms
              </div>
            )}
          </div>
        ) : '-'
      ),
    },
    {
      title: '时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (date: string) => (
        <div>
          <div>{dayjs(date).format('MM-DD HH:mm')}</div>
          <div className="text-xs text-gray-500">
            {dayjs(date).format('YYYY')}
          </div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const logCounts = {
    all: logs.length,
    info: logs.filter(log => log.level === 'info').length,
    warning: logs.filter(log => log.level === 'warning').length,
    error: logs.filter(log => log.level === 'error').length,
    debug: logs.filter(log => log.level === 'debug').length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Title level={2}>系统日志</Title>
            <Text type="secondary">查看系统运行日志和错误记录</Text>
          </div>
          <Space>
            <Button icon={<DownloadOutlined />} onClick={handleExportLogs}>
              导出日志
            </Button>
            <Button icon={<ReloadOutlined />} onClick={fetchLogs}>
              刷新
            </Button>
            <Button danger icon={<DeleteOutlined />} onClick={handleClearLogs}>
              清空日志
            </Button>
          </Space>
        </div>

        {/* 筛选器 */}
        <Card size="small">
          <Row gutter={16} align="middle">
            <Col>
              <Input.Search
                placeholder="搜索日志消息..."
                allowClear
                style={{ width: 250 }}
                onSearch={(value) => setFilters(prev => ({ ...prev, search: value }))}
              />
            </Col>
            <Col>
              <Select
                placeholder="级别"
                allowClear
                style={{ width: 100 }}
                onChange={(value) => setFilters(prev => ({ ...prev, level: value || '' }))}
              >
                <Option value="info">信息</Option>
                <Option value="warning">警告</Option>
                <Option value="error">错误</Option>
                <Option value="debug">调试</Option>
              </Select>
            </Col>
            <Col>
              <Select
                placeholder="上下文"
                allowClear
                style={{ width: 120 }}
                onChange={(value) => setFilters(prev => ({ ...prev, context: value || '' }))}
              >
                <Option value="auth">认证</Option>
                <Option value="upload">上传</Option>
                <Option value="database">数据库</Option>
                <Option value="content">内容</Option>
                <Option value="api">API</Option>
                <Option value="system">系统</Option>
              </Select>
            </Col>
            <Col>
              <Input
                placeholder="用户名"
                allowClear
                style={{ width: 120 }}
                onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
              />
            </Col>
            <Col>
              <RangePicker
                placeholder={['开始日期', '结束日期']}
                onChange={(dates) => setFilters(prev => ({ ...prev, dateRange: dates }))}
              />
            </Col>
          </Row>
        </Card>

        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab={`全部 (${logCounts.all})`} key="all" />
            <TabPane tab={`信息 (${logCounts.info})`} key="info" />
            <TabPane tab={`警告 (${logCounts.warning})`} key="warning" />
            <TabPane tab={`错误 (${logCounts.error})`} key="error" />
            <TabPane tab={`调试 (${logCounts.debug})`} key="debug" />
          </Tabs>

          <Table
            columns={columns}
            dataSource={getFilteredLogs()}
            loading={loading}
            rowKey="id"
            size="small"
            pagination={{
              total: getFilteredLogs().length,
              pageSize: 20,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            }}
          />
        </Card>

        {/* 日志详情模态框 */}
        <Modal
          title="日志详情"
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={null}
          width={800}
        >
          {selectedLog && (
            <div className="space-y-4">
              <Row gutter={16}>
                <Col span={12}>
                  <div>
                    <Text strong>级别:</Text>
                    <div className="mt-1">
                      <Tag color={getLevelColor(selectedLog.level)}>
                        {getLevelText(selectedLog.level)}
                      </Tag>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <Text strong>上下文:</Text>
                    <div className="mt-1">
                      <Tag>{getContextText(selectedLog.context)}</Tag>
                    </div>
                  </div>
                </Col>
              </Row>

              <div>
                <Text strong>消息:</Text>
                <div className="mt-1 p-3 bg-gray-50 rounded">
                  {selectedLog.message}
                </div>
              </div>

              {selectedLog.user_name && (
                <Row gutter={16}>
                  <Col span={12}>
                    <div>
                      <Text strong>用户:</Text>
                      <div className="mt-1">{selectedLog.user_name}</div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <Text strong>IP地址:</Text>
                      <div className="mt-1">{selectedLog.ip_address}</div>
                    </div>
                  </Col>
                </Row>
              )}

              {selectedLog.url && (
                <Row gutter={16}>
                  <Col span={8}>
                    <div>
                      <Text strong>请求方法:</Text>
                      <div className="mt-1">
                        <Tag color={selectedLog.status_code && selectedLog.status_code >= 400 ? 'red' : 'green'}>
                          {selectedLog.method}
                        </Tag>
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div>
                      <Text strong>状态码:</Text>
                      <div className="mt-1">{selectedLog.status_code}</div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div>
                      <Text strong>响应时间:</Text>
                      <div className="mt-1">{selectedLog.response_time}ms</div>
                    </div>
                  </Col>
                </Row>
              )}

              {selectedLog.url && (
                <div>
                  <Text strong>请求URL:</Text>
                  <div className="mt-1 p-2 bg-gray-50 rounded font-mono text-sm">
                    {selectedLog.url}
                  </div>
                </div>
              )}

              <div>
                <Text strong>时间:</Text>
                <div className="mt-1">
                  {dayjs(selectedLog.created_at).format('YYYY-MM-DD HH:mm:ss')}
                </div>
              </div>

              <div>
                <Text strong>User Agent:</Text>
                <div className="mt-1 p-2 bg-gray-50 rounded text-sm break-all">
                  {selectedLog.user_agent}
                </div>
              </div>

              {selectedLog.details && (
                <div>
                  <Text strong>详细信息:</Text>
                  <div className="mt-1 p-3 bg-gray-50 rounded">
                    <pre className="text-sm">
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
}
