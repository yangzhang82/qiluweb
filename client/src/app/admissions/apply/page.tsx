'use client';

import React, { useState } from 'react';
import { Form, Input, Select, Button, Card, Typography, Row, Col, message, Steps } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, HomeOutlined } from '@ant-design/icons';
import MainLayout from '@/components/Layout/MainLayout';
import { enrollmentAPI } from '@/lib/api';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const EnrollmentPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await enrollmentAPI.submitEnrollment(values);
      message.success('报名申请提交成功！我们会在3个工作日内与您联系。');
      form.resetFields();
      setCurrentStep(0);
    } catch (error) {
      console.error('Enrollment submission error:', error);
      message.error('提交失败，请稍后重试或联系客服。');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: '学生信息',
      description: '填写学生基本信息'
    },
    {
      title: '家长信息',
      description: '填写家长联系方式'
    },
    {
      title: '其他信息',
      description: '补充说明和确认'
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Form.Item
              name="student_name"
              label="学生姓名"
              rules={[{ required: true, message: '请输入学生姓名' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="请输入学生姓名" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="student_email"
              label="学生邮箱"
              rules={[
                { required: true, message: '请输入学生邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="请输入学生邮箱" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="student_phone"
              label="学生电话"
              rules={[
                { required: true, message: '请输入学生电话' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
              ]}
            >
              <Input 
                prefix={<PhoneOutlined />} 
                placeholder="请输入学生电话" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="grade"
              label="申请年级"
              rules={[{ required: true, message: '请选择申请年级' }]}
            >
              <Select placeholder="请选择申请年级" size="large">
                <Option value="小学一年级">小学一年级</Option>
                <Option value="小学二年级">小学二年级</Option>
                <Option value="小学三年级">小学三年级</Option>
                <Option value="小学四年级">小学四年级</Option>
                <Option value="小学五年级">小学五年级</Option>
                <Option value="小学六年级">小学六年级</Option>
                <Option value="初中一年级">初中一年级</Option>
                <Option value="初中二年级">初中二年级</Option>
                <Option value="初中三年级">初中三年级</Option>
                <Option value="高中一年级">高中一年级</Option>
                <Option value="高中二年级">高中二年级</Option>
                <Option value="高中三年级">高中三年级</Option>
              </Select>
            </Form.Item>
          </>
        );

      case 1:
        return (
          <>
            <Form.Item
              name="parent_name"
              label="家长姓名"
              rules={[{ required: true, message: '请输入家长姓名' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="请输入家长姓名" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="parent_phone"
              label="家长电话"
              rules={[
                { required: true, message: '请输入家长电话' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
              ]}
            >
              <Input 
                prefix={<PhoneOutlined />} 
                placeholder="请输入家长电话" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="address"
              label="家庭地址"
            >
              <Input 
                prefix={<HomeOutlined />} 
                placeholder="请输入家庭地址（选填）" 
                size="large"
              />
            </Form.Item>
          </>
        );

      case 2:
        return (
          <>
            <Form.Item
              name="message"
              label="备注信息"
            >
              <TextArea
                rows={4}
                placeholder="请填写其他需要说明的信息，如特殊需求、兴趣爱好等（选填）"
              />
            </Form.Item>

            <div className="bg-blue-50 p-4 rounded-lg">
              <Title level={5} className="text-blue-800 mb-2">
                温馨提示
              </Title>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• 提交申请后，我们会在3个工作日内与您联系</li>
                <li>• 请确保联系方式准确无误，以便我们及时与您沟通</li>
                <li>• 如有疑问，可拨打招生热线：400-123-4567</li>
                <li>• 报名费用和入学要求请咨询招生办公室</li>
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
              在线报名申请
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
              欢迎申请齐鲁国际学校！请填写以下信息，我们会尽快与您联系。
            </Paragraph>
          </div>

          <Row justify="center">
            <Col xs={24} md={16} lg={12}>
              <Card className="shadow-lg">
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
              <Title level={4} className="mb-4">需要帮助？</Title>
              <div className="space-y-2 text-gray-600">
                <div>招生热线：400-123-4567</div>
                <div>招生邮箱：admission@qilu.edu.cn</div>
                <div>工作时间：周一至周五 9:00-17:00</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EnrollmentPage;
