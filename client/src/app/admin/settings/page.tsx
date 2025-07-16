'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Space, 
  Row, 
  Col, 
  Typography,
  message,
  Switch,
  Select,
  Upload,
  Tabs,
  Divider,
  InputNumber
} from 'antd';
import { 
  SaveOutlined,
  UploadOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SettingOutlined
} from '@ant-design/icons';
import AdminLayout from '@/components/Admin/AdminLayout';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface SiteSettings {
  basic: {
    site_name: string;
    site_description: string;
    site_keywords: string;
    site_logo: string;
    favicon: string;
    contact_email: string;
    contact_phone: string;
    address: string;
    icp_number: string;
  };
  seo: {
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    google_analytics: string;
    baidu_analytics: string;
    enable_sitemap: boolean;
    robots_txt: string;
  };
  email: {
    smtp_host: string;
    smtp_port: number;
    smtp_username: string;
    smtp_password: string;
    smtp_encryption: string;
    from_email: string;
    from_name: string;
    enable_email: boolean;
  };
  system: {
    timezone: string;
    date_format: string;
    time_format: string;
    language: string;
    enable_registration: boolean;
    enable_comments: boolean;
    max_upload_size: number;
    allowed_file_types: string[];
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // TODO: 实际API调用
      const mockSettings: SiteSettings = {
        basic: {
          site_name: '齐鲁国际学校',
          site_description: '齐鲁国际学校是一所提供优质国际教育的现代化学校',
          site_keywords: '国际学校,教育,齐鲁,双语教学',
          site_logo: '/images/logo.png',
          favicon: '/favicon.ico',
          contact_email: 'info@qilu.edu.cn',
          contact_phone: '0531-88888888',
          address: '山东省济南市历下区经十路12345号',
          icp_number: '鲁ICP备12345678号'
        },
        seo: {
          meta_title: '齐鲁国际学校 - 优质国际教育',
          meta_description: '齐鲁国际学校提供从小学到高中的完整国际教育体系，培养具有国际视野的优秀人才',
          meta_keywords: '国际学校,双语教育,IB课程,AP课程,国际高中',
          google_analytics: 'UA-XXXXXXXXX-X',
          baidu_analytics: '',
          enable_sitemap: true,
          robots_txt: 'User-agent: *\nDisallow: /admin/\nSitemap: https://qilu.edu.cn/sitemap.xml'
        },
        email: {
          smtp_host: 'smtp.qilu.edu.cn',
          smtp_port: 587,
          smtp_username: 'noreply@qilu.edu.cn',
          smtp_password: '',
          smtp_encryption: 'tls',
          from_email: 'noreply@qilu.edu.cn',
          from_name: '齐鲁国际学校',
          enable_email: true
        },
        system: {
          timezone: 'Asia/Shanghai',
          date_format: 'YYYY-MM-DD',
          time_format: 'HH:mm:ss',
          language: 'zh-CN',
          enable_registration: true,
          enable_comments: false,
          max_upload_size: 10,
          allowed_file_types: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx']
        }
      };
      
      setSettings(mockSettings);
      form.setFieldsValue(mockSettings);
    } catch (error) {
      message.error('获取设置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: any) => {
    setSaving(true);
    try {
      // TODO: 实际API调用
      console.log('保存设置:', values);
      message.success('设置保存成功');
    } catch (error) {
      message.error('设置保存失败');
    } finally {
      setSaving(false);
    }
  };

  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
  };

  if (!settings) {
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
            <Title level={2}>网站设置</Title>
            <Text type="secondary">配置网站基本信息和系统参数</Text>
          </div>
          <Button 
            type="primary" 
            icon={<SaveOutlined />}
            loading={saving}
            onClick={() => form.submit()}
          >
            保存设置
          </Button>
        </div>

        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={settings}
          >
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="基本设置" key="basic">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name={['basic', 'site_name']}
                      label="网站名称"
                      rules={[{ required: true, message: '请输入网站名称' }]}
                    >
                      <Input placeholder="请输入网站名称" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={['basic', 'contact_email']}
                      label="联系邮箱"
                      rules={[
                        { required: true, message: '请输入联系邮箱' },
                        { type: 'email', message: '请输入有效的邮箱地址' }
                      ]}
                    >
                      <Input prefix={<MailOutlined />} placeholder="请输入联系邮箱" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name={['basic', 'site_description']}
                  label="网站描述"
                  rules={[{ required: true, message: '请输入网站描述' }]}
                >
                  <TextArea rows={3} placeholder="请输入网站描述" />
                </Form.Item>

                <Form.Item
                  name={['basic', 'site_keywords']}
                  label="网站关键词"
                >
                  <Input placeholder="请输入网站关键词，用逗号分隔" />
                </Form.Item>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name={['basic', 'contact_phone']}
                      label="联系电话"
                    >
                      <Input prefix={<PhoneOutlined />} placeholder="请输入联系电话" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={['basic', 'icp_number']}
                      label="ICP备案号"
                    >
                      <Input placeholder="请输入ICP备案号" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name={['basic', 'address']}
                  label="学校地址"
                >
                  <Input prefix={<EnvironmentOutlined />} placeholder="请输入学校地址" />
                </Form.Item>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name={['basic', 'site_logo']}
                      label="网站Logo"
                    >
                      <div className="space-y-2">
                        <Input placeholder="Logo文件路径" />
                        <Upload {...uploadProps}>
                          <Button icon={<UploadOutlined />}>上传Logo</Button>
                        </Upload>
                      </div>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={['basic', 'favicon']}
                      label="网站图标"
                    >
                      <div className="space-y-2">
                        <Input placeholder="Favicon文件路径" />
                        <Upload {...uploadProps}>
                          <Button icon={<UploadOutlined />}>上传图标</Button>
                        </Upload>
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab="SEO设置" key="seo">
                <Form.Item
                  name={['seo', 'meta_title']}
                  label="SEO标题"
                >
                  <Input placeholder="请输入SEO标题" />
                </Form.Item>

                <Form.Item
                  name={['seo', 'meta_description']}
                  label="SEO描述"
                >
                  <TextArea rows={3} placeholder="请输入SEO描述" maxLength={160} showCount />
                </Form.Item>

                <Form.Item
                  name={['seo', 'meta_keywords']}
                  label="SEO关键词"
                >
                  <Input placeholder="请输入SEO关键词，用逗号分隔" />
                </Form.Item>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name={['seo', 'google_analytics']}
                      label="Google Analytics ID"
                    >
                      <Input placeholder="UA-XXXXXXXXX-X" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={['seo', 'baidu_analytics']}
                      label="百度统计代码"
                    >
                      <Input placeholder="请输入百度统计代码" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name={['seo', 'enable_sitemap']}
                  label="启用站点地图"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  name={['seo', 'robots_txt']}
                  label="Robots.txt内容"
                >
                  <TextArea rows={6} placeholder="请输入robots.txt内容" />
                </Form.Item>
              </TabPane>

              <TabPane tab="邮件设置" key="email">
                <Form.Item
                  name={['email', 'enable_email']}
                  label="启用邮件功能"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Divider />

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name={['email', 'smtp_host']}
                      label="SMTP服务器"
                    >
                      <Input placeholder="请输入SMTP服务器地址" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={['email', 'smtp_port']}
                      label="SMTP端口"
                    >
                      <InputNumber placeholder="587" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name={['email', 'smtp_username']}
                      label="SMTP用户名"
                    >
                      <Input placeholder="请输入SMTP用户名" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={['email', 'smtp_password']}
                      label="SMTP密码"
                    >
                      <Input.Password placeholder="请输入SMTP密码" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name={['email', 'smtp_encryption']}
                      label="加密方式"
                    >
                      <Select placeholder="请选择加密方式">
                        <Option value="none">无</Option>
                        <Option value="ssl">SSL</Option>
                        <Option value="tls">TLS</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={['email', 'from_name']}
                      label="发件人名称"
                    >
                      <Input placeholder="请输入发件人名称" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name={['email', 'from_email']}
                  label="发件人邮箱"
                  rules={[{ type: 'email', message: '请输入有效的邮箱地址' }]}
                >
                  <Input placeholder="请输入发件人邮箱" />
                </Form.Item>
              </TabPane>

              <TabPane tab="系统设置" key="system">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name={['system', 'timezone']}
                      label="时区"
                    >
                      <Select placeholder="请选择时区">
                        <Option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</Option>
                        <Option value="UTC">UTC (UTC+0)</Option>
                        <Option value="America/New_York">America/New_York (UTC-5)</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={['system', 'language']}
                      label="默认语言"
                    >
                      <Select placeholder="请选择默认语言">
                        <Option value="zh-CN">简体中文</Option>
                        <Option value="en-US">English</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name={['system', 'date_format']}
                      label="日期格式"
                    >
                      <Select placeholder="请选择日期格式">
                        <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                        <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                        <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={['system', 'time_format']}
                      label="时间格式"
                    >
                      <Select placeholder="请选择时间格式">
                        <Option value="HH:mm:ss">24小时制</Option>
                        <Option value="hh:mm:ss A">12小时制</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name={['system', 'enable_registration']}
                      label="允许用户注册"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={['system', 'enable_comments']}
                      label="允许评论"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name={['system', 'max_upload_size']}
                      label="最大上传文件大小 (MB)"
                    >
                      <InputNumber min={1} max={100} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={['system', 'allowed_file_types']}
                      label="允许的文件类型"
                    >
                      <Select mode="tags" placeholder="请输入允许的文件扩展名">
                        <Option value="jpg">jpg</Option>
                        <Option value="jpeg">jpeg</Option>
                        <Option value="png">png</Option>
                        <Option value="gif">gif</Option>
                        <Option value="pdf">pdf</Option>
                        <Option value="doc">doc</Option>
                        <Option value="docx">docx</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Form>
        </Card>
      </div>
    </AdminLayout>
  );
}
