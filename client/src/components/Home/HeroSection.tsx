'use client';

import React from 'react';
import { Button, Row, Col, Typography } from 'antd';
import { ArrowRightOutlined, PlayCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 背景图片 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
        }}
      />
      
      {/* 内容 */}
      <div className="relative z-10 container mx-auto px-4">
        <Row justify="center" align="middle" className="min-h-screen">
          <Col xs={24} lg={16} xl={14} className="text-center">
            <div className="text-white">
              <Title level={1} className="text-white mb-6 text-4xl md:text-5xl lg:text-6xl font-bold">
                齐鲁国际学校
              </Title>
              <Title level={2} className="text-blue-200 mb-6 text-xl md:text-2xl lg:text-3xl font-light">
                培养具有国际视野的未来领袖
              </Title>
              <Paragraph className="text-gray-200 text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
                我们致力于为学生提供优质的国际化教育，融合中西方教育精华，
                培养具有创新精神、批判思维和全球视野的优秀人才。
              </Paragraph>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/admissions/apply">
                  <Button 
                    type="primary" 
                    size="large" 
                    icon={<ArrowRightOutlined />}
                    className="bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700 h-12 px-8 text-lg font-medium"
                  >
                    立即报名
                  </Button>
                </Link>
                
                <Button 
                  type="default" 
                  size="large" 
                  icon={<PlayCircleOutlined />}
                  className="bg-transparent border-white text-white hover:bg-white hover:text-gray-800 h-12 px-8 text-lg font-medium"
                >
                  观看视频
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* 滚动指示器 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2">向下滚动</span>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* 装饰性元素 */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-20 w-12 h-12 bg-green-400 rounded-full opacity-20 animate-pulse delay-500"></div>
    </section>
  );
};

export default HeroSection;
