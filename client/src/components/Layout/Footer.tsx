'use client';

import React from 'react';
import Link from 'next/link';
import { Row, Col, Space, Divider } from 'antd';
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined,
  WechatOutlined,
  WeiboOutlined,
  FacebookOutlined,
  TwitterOutlined
} from '@ant-design/icons';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* 主要内容区域 */}
      <div className="container mx-auto px-4 py-12">
        <Row gutter={[32, 32]}>
          {/* 学校信息 */}
          <Col xs={24} sm={12} lg={6}>
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">齐</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">齐鲁国际学校</h3>
                  <p className="text-sm text-gray-400">QiLu International School</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                致力于培养具有国际视野、创新精神和社会责任感的优秀人才，为学生提供优质的国际化教育服务。
              </p>
            </div>
          </Col>

          {/* 快速链接 */}
          <Col xs={24} sm={12} lg={6}>
            <h4 className="text-lg font-semibold mb-4">快速链接</h4>
            <Space direction="vertical" size="small" className="w-full">
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                学校概况
              </Link>
              <Link href="/academics" className="text-gray-300 hover:text-white transition-colors">
                教学教研
              </Link>
              <Link href="/admissions" className="text-gray-300 hover:text-white transition-colors">
                招生信息
              </Link>
              <Link href="/campus-life" className="text-gray-300 hover:text-white transition-colors">
                校园生活
              </Link>
              <Link href="/news" className="text-gray-300 hover:text-white transition-colors">
                新闻动态
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                联系我们
              </Link>
            </Space>
          </Col>

          {/* 教育服务 */}
          <Col xs={24} sm={12} lg={6}>
            <h4 className="text-lg font-semibold mb-4">教育服务</h4>
            <Space direction="vertical" size="small" className="w-full">
              <Link href="/academics/curriculum" className="text-gray-300 hover:text-white transition-colors">
                课程设置
              </Link>
              <Link href="/academics/faculty" className="text-gray-300 hover:text-white transition-colors">
                师资力量
              </Link>
              <Link href="/admissions/apply" className="text-gray-300 hover:text-white transition-colors">
                在线报名
              </Link>
              <Link href="/campus-life/activities" className="text-gray-300 hover:text-white transition-colors">
                校园活动
              </Link>
              <Link href="/careers" className="text-gray-300 hover:text-white transition-colors">
                招聘信息
              </Link>
              <Link href="/online-learning" className="text-gray-300 hover:text-white transition-colors">
                在线学习
              </Link>
            </Space>
          </Col>

          {/* 联系信息 */}
          <Col xs={24} sm={12} lg={6}>
            <h4 className="text-lg font-semibold mb-4">联系我们</h4>
            <Space direction="vertical" size="middle" className="w-full">
              <div className="flex items-start space-x-3">
                <EnvironmentOutlined className="text-blue-400 mt-1" />
                <div>
                  <p className="text-gray-300 text-sm">
                    山东省济南市历下区<br />
                    齐鲁国际学校
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <PhoneOutlined className="text-blue-400" />
                <span className="text-gray-300">400-123-4567</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <MailOutlined className="text-blue-400" />
                <span className="text-gray-300">info@qilu.edu.cn</span>
              </div>

              {/* 社交媒体 */}
              <div className="pt-4">
                <p className="text-sm text-gray-400 mb-3">关注我们</p>
                <Space size="large">
                  <WechatOutlined className="text-xl text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
                  <WeiboOutlined className="text-xl text-gray-400 hover:text-red-400 cursor-pointer transition-colors" />
                  <FacebookOutlined className="text-xl text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
                  <TwitterOutlined className="text-xl text-gray-400 hover:text-blue-300 cursor-pointer transition-colors" />
                </Space>
              </div>
            </Space>
          </Col>
        </Row>
      </div>

      <Divider className="border-gray-700 my-0" />

      {/* 版权信息 */}
      <div className="container mx-auto px-4 py-6">
        <Row justify="space-between" align="middle">
          <Col xs={24} md={12}>
            <p className="text-gray-400 text-sm mb-2 md:mb-0">
              © {currentYear} 齐鲁国际学校. 保留所有权利.
            </p>
          </Col>
          <Col xs={24} md={12}>
            <div className="flex flex-wrap justify-start md:justify-end space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                隐私政策
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                使用条款
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                网站地图
              </Link>
            </div>
          </Col>
        </Row>
      </div>
    </footer>
  );
};

export default Footer;
