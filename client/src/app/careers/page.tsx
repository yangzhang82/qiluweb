'use client';

import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  Button, 
  Card, 
  Typography, 
  Row, 
  Col, 
  Upload, 
  message, 
  Steps,
  Tag,
  Divider
} from 'antd';
import { 
  UploadOutlined, 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined,
  BookOutlined,
  BankOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import MainLayout from '@/components/Layout/MainLayout';
import { recruitmentAPI } from '@/lib/api';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CareersPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState<any[]>([]);

  // 职位信息
  const positions = [
    {
      title: '高中数学教师',
      department: '教学部',
      type: 'full-time',
      requirements: ['数学相关专业本科及以上学历', '3年以上教学经验', '熟悉高中数学课程体系'],
      description: '负责高中数学教学工作，制定教学计划，提升学生数学成绩'
    },
    {
      title: '英语教师',
      department: '国际部',
      type: 'full-time',
      requirements: ['英语相关专业本科及以上学历', '英语专业八级', '有海外学习或工作经验优先'],
      description: '负责英语教学工作，培养学生英语听说读写能力'
    },
    {
      title: '物理教师',
      department: '教学部',
      type: 'full-time',
      requirements: ['物理相关专业硕士及以上学历', '5年以上教学经验', '有实验教学经验'],
      description: '负责物理教学和实验指导工作，培养学生科学思维'
    },
    {
      title: '班主任',
      department: '学生处',
      type: 'full-time',
      requirements: ['教育相关专业本科及以上学历', '有班级管理经验', '责任心强，沟通能力佳'],
      description: '负责班级日常管理，学生思想教育和家校沟通工作'
    }
  ];

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // 添加表单数据
      Object.keys(values).forEach(key => {
        if (key !== 'resume' && values[key]) {
          if (Array.isArray(values[key])) {
            formData.append(key, values[key].join(','));
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      // 添加简历文件
      if (fileList.length > 0) {
        formData.append('resume', fileList[0].originFileObj);
      }

      await recruitmentAPI.submitResume(formData);
      message.success('简历提交成功！我们会在5个工作日内与您联系。');
      form.resetFields();
      setFileList([]);
      setCurrentStep(0);
    } catch (error) {
      console.error('Resume submission error:', error);
      message.error('提交失败，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: '基本信息',
      description: '填写个人基本信息'
    },
    {
      title: '教育背景',
      description: '填写教育和工作经历'
    },
    {
      title: '上传简历',
      description: '上传简历文件并确认'
    }
  ];

  const nextStep = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    }).catch(() => {
      message.error('请完善当前步骤的信息');
    });
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const uploadProps = {
    beforeUpload: (file: any) => {
      const isValidType = file.type === 'application/pdf' || 
                         file.type === 'application/msword' || 
                         file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      if (!isValidType) {
        message.error('只支持PDF、DOC、DOCX格式的文件！');
        return false;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('文件大小不能超过10MB！');
        return false;
      }
      return false; // 阻止自动上传
    },
    fileList,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList.slice(-1)); // 只保留最新的一个文件
    },
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Form.Item
              name="applicant_name"
              label="姓名"
              rules={[{ required: true, message: '请输入您的姓名' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="请输入您的姓名" 
                size="large"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="邮箱"
                  rules={[
                    { required: true, message: '请输入邮箱地址' },
                    { type: 'email', message: '请输入有效的邮箱地址' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />} 
                    placeholder="请输入邮箱地址" 
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="手机号码"
                  rules={[
                    { required: true, message: '请输入手机号码' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
                  ]}
                >
                  <Input 
                    prefix={<PhoneOutlined />} 
                    placeholder="请输入手机号码" 
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="position"
              label="应聘职位"
              rules={[{ required: true, message: '请选择应聘职位' }]}
            >
              <Select placeholder="请选择应聘职位" size="large">
                {positions.map((pos, index) => (
                  <Option key={index} value={pos.title}>
                    {pos.title} - {pos.department}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </>
        );

      case 1:
        return (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="education"
                  label="最高学历"
                  rules={[{ required: true, message: '请选择最高学历' }]}
                >
                  <Select placeholder="请选择最高学历" size="large">
                    <Option value="本科">本科</Option>
                    <Option value="硕士">硕士</Option>
                    <Option value="博士">博士</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="experience"
                  label="工作年限"
                  rules={[{ required: true, message: '请选择工作年限' }]}
                >
                  <Select placeholder="请选择工作年限" size="large">
                    <Option value="应届毕业生">应届毕业生</Option>
                    <Option value="1-3年">1-3年</Option>
                    <Option value="3-5年">3-5年</Option>
                    <Option value="5-10年">5-10年</Option>
                    <Option value="10年以上">10年以上</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="skills"
              label="专业技能"
              rules={[{ required: true, message: '请输入您的专业技能' }]}
            >
              <Select
                mode="tags"
                placeholder="请输入您的专业技能，按回车添加"
                size="large"
              >
                <Option value="教学设计">教学设计</Option>
                <Option value="课程开发">课程开发</Option>
                <Option value="班级管理">班级管理</Option>
                <Option value="学生辅导">学生辅导</Option>
                <Option value="多媒体教学">多媒体教学</Option>
                <Option value="英语教学">英语教学</Option>
                <Option value="数学教学">数学教学</Option>
                <Option value="科学实验">科学实验</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="self_introduction"
              label="自我介绍"
            >
              <TextArea
                rows={4}
                placeholder="请简要介绍您的教育背景、工作经历和个人优势"
              />
            </Form.Item>
          </>
        );

      case 2:
        return (
          <>
            <Form.Item
              name="resume"
              label="上传简历"
              rules={[{ required: true, message: '请上传您的简历' }]}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} size="large">
                  选择文件
                </Button>
              </Upload>
              <div className="mt-2 text-gray-500 text-sm">
                支持PDF、DOC、DOCX格式，文件大小不超过10MB
              </div>
            </Form.Item>

            <div className="bg-blue-50 p-4 rounded-lg">
              <Title level={5} className="text-blue-800 mb-2">
                <FileTextOutlined className="mr-2" />
                提交须知
              </Title>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• 请确保简历信息真实有效</li>
                <li>• 我们会在5个工作日内审核您的简历</li>
                <li>• 通过初审的候选人将收到面试通知</li>
                <li>• 如有疑问，请联系HR：hr@qilu.edu.cn</li>
              </ul>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <Title level={1} className="text-4xl font-bold text-gray-800 mb-4">
              加入我们
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
              齐鲁国际学校诚邀优秀教育工作者加入我们的团队，共同为学生提供优质的国际化教育。
            </Paragraph>
          </div>

          {/* 招聘职位 */}
          <div className="mb-12">
            <Title level={2} className="text-center mb-8">热招职位</Title>
            <Row gutter={[24, 24]}>
              {positions.map((position, index) => (
                <Col xs={24} md={12} key={index}>
                  <Card 
                    title={
                      <div className="flex justify-between items-center">
                        <span>{position.title}</span>
                        <Tag color="blue">{position.type === 'full-time' ? '全职' : '兼职'}</Tag>
                      </div>
                    }
                    extra={<Text type="secondary">{position.department}</Text>}
                  >
                    <Paragraph className="mb-3">{position.description}</Paragraph>
                    <div>
                      <Text strong>任职要求：</Text>
                      <ul className="mt-2 text-sm text-gray-600">
                        {position.requirements.map((req, idx) => (
                          <li key={idx}>• {req}</li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          <Divider />

          {/* 简历提交表单 */}
          <Row justify="center">
            <Col xs={24} md={16} lg={12}>
              <Card className="shadow-lg">
                <Title level={3} className="text-center mb-6">
                  <BankOutlined className="mr-2" />
                  在线申请
                </Title>

                {/* 步骤指示器 */}
                <Steps current={currentStep} className="mb-8">
                  {steps.map((step, index) => (
                    <Steps.Step
                      key={index}
                      title={step.title}
                      description={step.description}
                    />
                  ))}
                </Steps>

                {/* 表单 */}
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  size="large"
                >
                  {renderStepContent()}

                  {/* 按钮组 */}
                  <div className="flex justify-between mt-8">
                    {currentStep > 0 && (
                      <Button onClick={prevStep} size="large">
                        上一步
                      </Button>
                    )}
                    
                    <div className="ml-auto">
                      {currentStep < steps.length - 1 ? (
                        <Button type="primary" onClick={nextStep} size="large">
                          下一步
                        </Button>
                      ) : (
                        <Button 
                          type="primary" 
                          htmlType="submit" 
                          loading={loading}
                          size="large"
                        >
                          提交申请
                        </Button>
                      )}
                    </div>
                  </div>
                </Form>
              </Card>
            </Col>
          </Row>

          {/* 联系信息 */}
          <div className="text-center mt-12">
            <Card className="max-w-md mx-auto">
              <Title level={4} className="mb-4">联系我们</Title>
              <div className="space-y-2 text-gray-600">
                <div>HR邮箱：hr@qilu.edu.cn</div>
                <div>联系电话：400-123-4567</div>
                <div>工作时间：周一至周五 9:00-17:00</div>
                <div>学校地址：山东省济南市历下区齐鲁大道123号</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CareersPage;
