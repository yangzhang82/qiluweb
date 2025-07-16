'use client';

import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { 
  BookOutlined, 
  GlobalOutlined, 
  TeamOutlined, 
  TrophyOutlined,
  ExperimentOutlined,
  HeartOutlined 
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color }) => (
  <Card 
    className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md"
    styles={{ body: { padding: '2rem' } }}
  >
    <div className="text-center">
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${color} mb-4`}>
        <span className="text-2xl text-white">{icon}</span>
      </div>
      <Title level={4} className="mb-3 text-gray-800">
        {title}
      </Title>
      <Paragraph className="text-gray-600 leading-relaxed">
        {description}
      </Paragraph>
    </div>
  </Card>
);

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <BookOutlined />,
      title: '优质课程体系',
      description: '融合中西方教育精华，提供多元化的课程选择，培养学生的学术能力和综合素养。',
      color: 'bg-blue-500'
    },
    {
      icon: <GlobalOutlined />,
      title: '国际化视野',
      description: '与多个国家的知名学校建立合作关系，为学生提供丰富的国际交流机会。',
      color: 'bg-green-500'
    },
    {
      icon: <TeamOutlined />,
      title: '优秀师资团队',
      description: '汇聚海内外优秀教师，具有丰富的教学经验和国际化教育背景。',
      color: 'bg-purple-500'
    },
    {
      icon: <TrophyOutlined />,
      title: '卓越成就',
      description: '学生在各类竞赛和升学考试中屡获佳绩，升学率和满意度持续领先。',
      color: 'bg-yellow-500'
    },
    {
      icon: <ExperimentOutlined />,
      title: '创新教学',
      description: '采用先进的教学方法和技术，激发学生的创造力和批判性思维能力。',
      color: 'bg-red-500'
    },
    {
      icon: <HeartOutlined />,
      title: '全人教育',
      description: '注重学生的品格培养和心理健康，促进学生的全面发展和个性成长。',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* 标题部分 */}
        <div className="text-center mb-16">
          <Title level={2} className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            为什么选择齐鲁国际学校
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            我们以卓越的教育质量、国际化的教学环境和全面的学生发展支持，
            为每一位学生提供最优质的教育体验。
          </Paragraph>
        </div>

        {/* 特色卡片 */}
        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <FeatureCard {...feature} />
            </Col>
          ))}
        </Row>

        {/* 统计数据 */}
        <div className="mt-20">
          <Row gutter={[24, 24]} className="text-center">
            <Col xs={12} sm={6}>
              <div className="p-6">
                <Title level={2} className="text-blue-600 mb-2">
                  15+
                </Title>
                <Paragraph className="text-gray-600 font-medium">
                  办学年限
                </Paragraph>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="p-6">
                <Title level={2} className="text-green-600 mb-2">
                  2000+
                </Title>
                <Paragraph className="text-gray-600 font-medium">
                  在校学生
                </Paragraph>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="p-6">
                <Title level={2} className="text-purple-600 mb-2">
                  200+
                </Title>
                <Paragraph className="text-gray-600 font-medium">
                  优秀教师
                </Paragraph>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="p-6">
                <Title level={2} className="text-yellow-600 mb-2">
                  98%
                </Title>
                <Paragraph className="text-gray-600 font-medium">
                  升学率
                </Paragraph>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
