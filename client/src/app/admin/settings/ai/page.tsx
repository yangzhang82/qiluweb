'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Switch, 
  Button, 
  Space, 
  Typography, 
  Divider,
  Row,
  Col,
  Slider,
  Select,
  message,
  Alert,
  Tabs,
  TextArea
} from 'antd';
import {
  RobotOutlined,
  SettingOutlined,
  ExperimentOutlined,
  MessageOutlined,
  FileTextOutlined,
  TagsOutlined
} from '@ant-design/icons';
import AdminLayout from '@/components/Admin/AdminLayout';
import { aiAPI } from '@/lib/api';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const AISettings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  const [aiSettings, setAiSettings] = useState({
    chatbot: {
      enabled: true,
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 500,
      systemPrompt: '你是齐鲁国际学校的AI助手，请用友好、专业的语气回答用户关于学校的问题。',
    },
    contentAnalysis: {
      enabled: true,
      autoClassify: true,
      autoTags: true,
      autoSummary: true,
      confidenceThreshold: 0.8,
    },
    recruitment: {
      enabled: true,
      autoScore: true,
      scoreThreshold: 7.0,
      analysisDepth: 'detailed',
    },
    general: {
      apiKey: '',
      apiEndpoint: 'https://api.openai.com/v1',
      timeout: 30,
      retryAttempts: 3,
      cacheEnabled: true,
      cacheDuration: 3600,
    }
  });

  useEffect(() => {
    // 加载AI设置
    loadAISettings();
  }, []);

  const loadAISettings = async () => {
    try {
      // 这里应该从API加载设置
      // const settings = await aiAPI.getSettings();
      // setAiSettings(settings);
      form.setFieldsValue(aiSettings);
    } catch (error) {
      console.error('Failed to load AI settings:', error);
    }
  };

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      // 这里应该保存到API
      // await aiAPI.updateSettings(values);
      setAiSettings(values);
      message.success('AI设置保存成功');
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleTestChatbot = async () => {
    setTestLoading(true);
    try {
      const response = await aiAPI.chat('你好，请介绍一下学校的基本情况');
      setTestResult(response.data.response);
      message.success('聊天机器人测试成功');
    } catch (error) {
      message.error('聊天机器人测试失败');
      setTestResult('测试失败：' + error);
    } finally {
      setTestLoading(false);
    }
  };

  const handleTestContentAnalysis = async () => {
    setTestLoading(true);
    try {
      const testContent = '齐鲁国际学校2024年春季开学典礼在学校体育馆隆重举行，全校师生共同迎接新学期的到来。';
      
      const [classification, summary, tags] = await Promise.all([
        aiAPI.classifyContent(testContent),
        aiAPI.generateSummary(testContent),
        aiAPI.generateTags(testContent)
      ]);

      const result = `
分类结果: ${classification.data.category}
摘要: ${summary.data.summary}
标签: ${tags.data.tags.join(', ')}
      `;
      
      setTestResult(result);
      message.success('内容分析测试成功');
    } catch (error) {
      message.error('内容分析测试失败');
      setTestResult('测试失败：' + error);
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <Title level={2}>AI设置</Title>
          <Text type="secondary">配置AI功能参数，优化智能服务体验</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={aiSettings}
        >
          <Tabs defaultActiveKey="chatbot">
            {/* 聊天机器人设置 */}
            <TabPane 
              tab={
                <span>
                  <MessageOutlined />
                  聊天机器人
                </span>
              } 
              key="chatbot"
            >
              <Card>
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <Form.Item
                      name={['chatbot', 'enabled']}
                      label="启用聊天机器人"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['chatbot', 'model']}
                      label="AI模型"
                    >
                      <Select>
                        <Option value="gpt-3.5-turbo">GPT-3.5 Turbo</Option>
                        <Option value="gpt-4">GPT-4</Option>
                        <Option value="claude-3">Claude-3</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['chatbot', 'temperature']}
                      label="创造性 (Temperature)"
                    >
                      <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        marks={{
                          0: '保守',
                          0.5: '平衡',
                          1: '创新'
                        }}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['chatbot', 'maxTokens']}
                      label="最大回复长度"
                    >
                      <Slider
                        min={100}
                        max={1000}
                        step={50}
                        marks={{
                          100: '简短',
                          500: '适中',
                          1000: '详细'
                        }}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      name={['chatbot', 'systemPrompt']}
                      label="系统提示词"
                    >
                      <TextArea
                        rows={4}
                        placeholder="定义AI助手的角色和回答风格"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Space>
                      <Button 
                        type="primary" 
                        icon={<ExperimentOutlined />}
                        onClick={handleTestChatbot}
                        loading={testLoading}
                      >
                        测试聊天机器人
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Card>
            </TabPane>

            {/* 内容分析设置 */}
            <TabPane 
              tab={
                <span>
                  <FileTextOutlined />
                  内容分析
                </span>
              } 
              key="content"
            >
              <Card>
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <Form.Item
                      name={['contentAnalysis', 'enabled']}
                      label="启用内容分析"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      name={['contentAnalysis', 'autoClassify']}
                      label="自动分类"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      name={['contentAnalysis', 'autoTags']}
                      label="自动标签"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      name={['contentAnalysis', 'autoSummary']}
                      label="自动摘要"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['contentAnalysis', 'confidenceThreshold']}
                      label="置信度阈值"
                    >
                      <Slider
                        min={0.5}
                        max={1}
                        step={0.05}
                        marks={{
                          0.5: '宽松',
                          0.8: '标准',
                          1: '严格'
                        }}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Space>
                      <Button 
                        type="primary" 
                        icon={<ExperimentOutlined />}
                        onClick={handleTestContentAnalysis}
                        loading={testLoading}
                      >
                        测试内容分析
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Card>
            </TabPane>

            {/* 招聘分析设置 */}
            <TabPane 
              tab={
                <span>
                  <TagsOutlined />
                  招聘分析
                </span>
              } 
              key="recruitment"
            >
              <Card>
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <Form.Item
                      name={['recruitment', 'enabled']}
                      label="启用招聘分析"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['recruitment', 'autoScore']}
                      label="自动评分"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['recruitment', 'scoreThreshold']}
                      label="推荐分数线"
                    >
                      <Slider
                        min={5}
                        max={10}
                        step={0.5}
                        marks={{
                          5: '5分',
                          7: '7分',
                          10: '10分'
                        }}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['recruitment', 'analysisDepth']}
                      label="分析深度"
                    >
                      <Select>
                        <Option value="basic">基础分析</Option>
                        <Option value="standard">标准分析</Option>
                        <Option value="detailed">详细分析</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </TabPane>

            {/* 通用设置 */}
            <TabPane 
              tab={
                <span>
                  <SettingOutlined />
                  通用设置
                </span>
              } 
              key="general"
            >
              <Card>
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <Alert
                      message="API密钥安全提示"
                      description="请妥善保管您的API密钥，不要在公共场所或不安全的网络环境中输入。"
                      type="warning"
                      showIcon
                      className="mb-4"
                    />
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      name={['general', 'apiKey']}
                      label="API密钥"
                    >
                      <Input.Password placeholder="请输入您的AI服务API密钥" />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      name={['general', 'apiEndpoint']}
                      label="API端点"
                    >
                      <Input placeholder="https://api.openai.com/v1" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      name={['general', 'timeout']}
                      label="请求超时(秒)"
                    >
                      <Slider
                        min={10}
                        max={60}
                        marks={{
                          10: '10s',
                          30: '30s',
                          60: '60s'
                        }}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      name={['general', 'retryAttempts']}
                      label="重试次数"
                    >
                      <Slider
                        min={1}
                        max={5}
                        marks={{
                          1: '1次',
                          3: '3次',
                          5: '5次'
                        }}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      name={['general', 'cacheEnabled']}
                      label="启用缓存"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['general', 'cacheDuration']}
                      label="缓存时长(秒)"
                    >
                      <Slider
                        min={300}
                        max={7200}
                        step={300}
                        marks={{
                          300: '5分钟',
                          3600: '1小时',
                          7200: '2小时'
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </TabPane>
          </Tabs>

          {/* 测试结果 */}
          {testResult && (
            <Card title="测试结果" className="mt-6">
              <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
                {testResult}
              </pre>
            </Card>
          )}

          {/* 保存按钮 */}
          <div className="flex justify-end mt-6">
            <Space>
              <Button onClick={() => form.resetFields()}>
                重置
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存设置
              </Button>
            </Space>
          </div>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default AISettings;
