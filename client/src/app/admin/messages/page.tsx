'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  List, 
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
  Avatar,
  Badge,
  Tag,
  Tabs,
  Divider,
  Empty
} from 'antd';
import { 
  PlusOutlined, 
  SendOutlined, 
  DeleteOutlined, 
  UserOutlined,
  MessageOutlined,
  BellOutlined,
  MailOutlined,
  SearchOutlined
} from '@ant-design/icons';
import AdminLayout from '@/components/Admin/AdminLayout';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface Message {
  id: string;
  type: 'inbox' | 'sent' | 'draft';
  subject: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  recipient: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  is_read: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
  read_at?: string;
}

interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    role: string;
  }>;
  last_message: {
    content: string;
    sender_name: string;
    created_at: string;
  };
  unread_count: number;
  created_at: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [composeModalVisible, setComposeModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('inbox');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchMessages();
    fetchConversations();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      // TODO: 实际API调用
      const mockMessages: Message[] = [
        {
          id: '1',
          type: 'inbox',
          subject: '关于春季开学典礼的安排',
          content: '各位老师好，春季开学典礼定于3月20日上午9点在学校礼堂举行，请各班主任组织学生准时参加...',
          sender: {
            id: '1',
            name: '校长办公室',
            role: '管理员'
          },
          recipient: {
            id: '2',
            name: '全体教师',
            role: '教师'
          },
          is_read: false,
          priority: 'high',
          created_at: '2024-03-15T10:30:00Z'
        },
        {
          id: '2',
          type: 'inbox',
          subject: '学生成绩录入提醒',
          content: '请各位任课教师在本周五前完成期中考试成绩录入，如有问题请及时联系教务处...',
          sender: {
            id: '3',
            name: '教务处',
            role: '管理员'
          },
          recipient: {
            id: '2',
            name: '任课教师',
            role: '教师'
          },
          is_read: true,
          priority: 'normal',
          created_at: '2024-03-14T14:20:00Z',
          read_at: '2024-03-14T15:30:00Z'
        },
        {
          id: '3',
          type: 'sent',
          subject: '家长会通知',
          content: '尊敬的家长，我校将于本月底举行家长会，请您安排时间参加...',
          sender: {
            id: '2',
            name: '张老师',
            role: '教师'
          },
          recipient: {
            id: '4',
            name: '高一(1)班家长',
            role: '家长'
          },
          is_read: true,
          priority: 'normal',
          created_at: '2024-03-13T09:15:00Z'
        }
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      message.error('获取消息失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      // TODO: 实际API调用
      const mockConversations: Conversation[] = [
        {
          id: '1',
          participants: [
            { id: '1', name: '张老师', role: '教师' },
            { id: '2', name: '李家长', role: '家长' }
          ],
          last_message: {
            content: '孩子最近的学习情况如何？',
            sender_name: '李家长',
            created_at: '2024-03-15T16:45:00Z'
          },
          unread_count: 2,
          created_at: '2024-03-10T08:00:00Z'
        },
        {
          id: '2',
          participants: [
            { id: '3', name: '王老师', role: '教师' },
            { id: '4', name: '教务处', role: '管理员' }
          ],
          last_message: {
            content: '课程安排已经更新',
            sender_name: '教务处',
            created_at: '2024-03-15T11:20:00Z'
          },
          unread_count: 0,
          created_at: '2024-03-12T10:30:00Z'
        }
      ];
      
      setConversations(mockConversations);
    } catch (error) {
      message.error('获取对话失败');
    }
  };

  const handleCompose = () => {
    form.resetFields();
    setComposeModalVisible(true);
  };

  const handleSendMessage = async (values: any) => {
    try {
      // TODO: 发送消息API调用
      message.success('消息发送成功');
      setComposeModalVisible(false);
      fetchMessages();
    } catch (error) {
      message.error('消息发送失败');
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      // TODO: 标记为已读API调用
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, is_read: true, read_at: new Date().toISOString() } : msg
        )
      );
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      // TODO: 删除消息API调用
      message.success('删除成功');
      fetchMessages();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'blue',
      normal: 'default',
      high: 'orange',
      urgent: 'red'
    };
    return colors[priority as keyof typeof colors] || 'default';
  };

  const getPriorityText = (priority: string) => {
    const texts = {
      low: '低',
      normal: '普通',
      high: '重要',
      urgent: '紧急'
    };
    return texts[priority as keyof typeof texts] || priority;
  };

  const getFilteredMessages = () => {
    let filtered = messages.filter(msg => msg.type === activeTab);
    
    if (searchText) {
      filtered = filtered.filter(msg => 
        msg.subject.toLowerCase().includes(searchText.toLowerCase()) ||
        msg.content.toLowerCase().includes(searchText.toLowerCase()) ||
        msg.sender.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    return filtered;
  };

  const unreadCount = messages.filter(msg => msg.type === 'inbox' && !msg.is_read).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Title level={2}>消息中心</Title>
            <Text type="secondary">管理系统消息和用户沟通</Text>
          </div>
          <Space>
            <Button icon={<BellOutlined />}>
              通知设置
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCompose}>
              写消息
            </Button>
          </Space>
        </div>

        <Row gutter={24}>
          <Col span={16}>
            <Card>
              <div className="mb-4">
                <Row justify="space-between" align="middle">
                  <Col>
                    <Tabs activeKey={activeTab} onChange={setActiveTab}>
                      <TabPane 
                        tab={
                          <span>
                            <MailOutlined />
                            收件箱
                            {unreadCount > 0 && (
                              <Badge count={unreadCount} size="small" className="ml-2" />
                            )}
                          </span>
                        } 
                        key="inbox" 
                      />
                      <TabPane 
                        tab={
                          <span>
                            <SendOutlined />
                            已发送
                          </span>
                        } 
                        key="sent" 
                      />
                      <TabPane 
                        tab={
                          <span>
                            <MessageOutlined />
                            草稿箱
                          </span>
                        } 
                        key="draft" 
                      />
                    </Tabs>
                  </Col>
                  <Col>
                    <Input.Search
                      placeholder="搜索消息..."
                      allowClear
                      style={{ width: 250 }}
                      onSearch={setSearchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </Col>
                </Row>
              </div>

              <List
                loading={loading}
                dataSource={getFilteredMessages()}
                renderItem={(item) => (
                  <List.Item
                    key={item.id}
                    className={`cursor-pointer hover:bg-gray-50 ${!item.is_read ? 'bg-blue-50' : ''}`}
                    onClick={() => {
                      setSelectedMessage(item);
                      if (!item.is_read && item.type === 'inbox') {
                        handleMarkAsRead(item.id);
                      }
                    }}
                    actions={[
                      <Button 
                        type="link" 
                        danger 
                        icon={<DeleteOutlined />} 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(item.id);
                        }}
                      >
                        删除
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar icon={<UserOutlined />} />
                      }
                      title={
                        <div className="flex items-center justify-between">
                          <span className={!item.is_read ? 'font-bold' : ''}>
                            {item.subject}
                          </span>
                          <div className="flex items-center space-x-2">
                            {item.priority !== 'normal' && (
                              <Tag color={getPriorityColor(item.priority)} size="small">
                                {getPriorityText(item.priority)}
                              </Tag>
                            )}
                            {!item.is_read && item.type === 'inbox' && (
                              <Badge status="processing" />
                            )}
                          </div>
                        </div>
                      }
                      description={
                        <div>
                          <div className="text-sm text-gray-600 mb-1">
                            {item.type === 'inbox' ? `来自: ${item.sender.name}` : `发送给: ${item.recipient.name}`}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {item.content}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {dayjs(item.created_at).format('YYYY-MM-DD HH:mm')}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
                locale={{
                  emptyText: <Empty description="暂无消息" />
                }}
              />
            </Card>
          </Col>

          <Col span={8}>
            {selectedMessage ? (
              <Card title="消息详情">
                <div className="space-y-4">
                  <div>
                    <Text strong>主题:</Text>
                    <div className="mt-1">{selectedMessage.subject}</div>
                  </div>
                  
                  <div>
                    <Text strong>
                      {selectedMessage.type === 'inbox' ? '发件人:' : '收件人:'}
                    </Text>
                    <div className="mt-1 flex items-center">
                      <Avatar size="small" icon={<UserOutlined />} className="mr-2" />
                      <span>
                        {selectedMessage.type === 'inbox' 
                          ? selectedMessage.sender.name 
                          : selectedMessage.recipient.name}
                      </span>
                      <Tag size="small" className="ml-2">
                        {selectedMessage.type === 'inbox' 
                          ? selectedMessage.sender.role 
                          : selectedMessage.recipient.role}
                      </Tag>
                    </div>
                  </div>

                  <div>
                    <Text strong>优先级:</Text>
                    <div className="mt-1">
                      <Tag color={getPriorityColor(selectedMessage.priority)}>
                        {getPriorityText(selectedMessage.priority)}
                      </Tag>
                    </div>
                  </div>

                  <div>
                    <Text strong>发送时间:</Text>
                    <div className="mt-1">
                      {dayjs(selectedMessage.created_at).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                  </div>

                  {selectedMessage.read_at && (
                    <div>
                      <Text strong>阅读时间:</Text>
                      <div className="mt-1">
                        {dayjs(selectedMessage.read_at).format('YYYY-MM-DD HH:mm:ss')}
                      </div>
                    </div>
                  )}

                  <Divider />

                  <div>
                    <Text strong>内容:</Text>
                    <div className="mt-2 p-3 bg-gray-50 rounded">
                      <Paragraph>{selectedMessage.content}</Paragraph>
                    </div>
                  </div>

                  {selectedMessage.type === 'inbox' && (
                    <div className="text-center">
                      <Button type="primary" icon={<SendOutlined />}>
                        回复
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card title="对话列表">
                <List
                  dataSource={conversations}
                  renderItem={(item) => (
                    <List.Item className="cursor-pointer hover:bg-gray-50">
                      <List.Item.Meta
                        avatar={
                          <Badge count={item.unread_count} size="small">
                            <Avatar icon={<UserOutlined />} />
                          </Badge>
                        }
                        title={
                          <div className="flex items-center justify-between">
                            <span>
                              {item.participants.map(p => p.name).join(', ')}
                            </span>
                            <span className="text-xs text-gray-400">
                              {dayjs(item.last_message.created_at).format('MM-DD HH:mm')}
                            </span>
                          </div>
                        }
                        description={
                          <div className="text-sm text-gray-600 truncate">
                            {item.last_message.sender_name}: {item.last_message.content}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                  locale={{
                    emptyText: <Empty description="暂无对话" />
                  }}
                />
              </Card>
            )}
          </Col>
        </Row>

        <Modal
          title="写消息"
          open={composeModalVisible}
          onCancel={() => setComposeModalVisible(false)}
          footer={null}
          width={600}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSendMessage}
          >
            <Row gutter={16}>
              <Col span={16}>
                <Form.Item
                  name="recipient"
                  label="收件人"
                  rules={[{ required: true, message: '请选择收件人' }]}
                >
                  <Select placeholder="请选择收件人" mode="multiple">
                    <Option value="all_teachers">全体教师</Option>
                    <Option value="all_parents">全体家长</Option>
                    <Option value="all_students">全体学生</Option>
                    <Option value="grade_1">高一年级</Option>
                    <Option value="grade_2">高二年级</Option>
                    <Option value="grade_3">高三年级</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="priority"
                  label="优先级"
                  rules={[{ required: true, message: '请选择优先级' }]}
                >
                  <Select placeholder="请选择优先级">
                    <Option value="low">低</Option>
                    <Option value="normal">普通</Option>
                    <Option value="high">重要</Option>
                    <Option value="urgent">紧急</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="subject"
              label="主题"
              rules={[{ required: true, message: '请输入主题' }]}
            >
              <Input placeholder="请输入消息主题" />
            </Form.Item>

            <Form.Item
              name="content"
              label="内容"
              rules={[{ required: true, message: '请输入消息内容' }]}
            >
              <TextArea 
                rows={8} 
                placeholder="请输入消息内容" 
                maxLength={1000}
                showCount
              />
            </Form.Item>

            <Form.Item className="mb-0 text-right">
              <Space>
                <Button onClick={() => setComposeModalVisible(false)}>
                  取消
                </Button>
                <Button>
                  保存草稿
                </Button>
                <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                  发送
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
