'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Tag, Skeleton } from 'antd';
import { CalendarOutlined, EyeOutlined, ArrowRightOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { newsAPI } from '@/lib/api';
import type { News } from '@/types';

const { Title, Paragraph } = Typography;
const { Meta } = Card;

const NewsSection: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await newsAPI.getNews({ limit: 6 });
        setNews(response.data || []);
      } catch (error) {
        console.error('Failed to fetch news:', error);
        // 使用模拟数据
        setNews([
          {
            id: 1,
            title: '齐鲁国际学校2024年春季开学典礼圆满举行',
            content: '2024年2月26日，齐鲁国际学校2024年春季开学典礼在学校体育馆隆重举行...',
            summary: '我校2024年春季开学典礼圆满举行，全校师生共同迎接新学期的到来。',
            author_id: 1,
            category: '校园新闻',
            tags: ['开学典礼', '新学期', '校园活动'],
            featured_image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            status: 'published',
            published_at: '2024-02-26T10:00:00Z',
            created_at: '2024-02-26T10:00:00Z',
            updated_at: '2024-02-26T10:00:00Z'
          },
          {
            id: 2,
            title: '我校学生在全国数学竞赛中获得优异成绩',
            content: '近日，全国中学生数学竞赛结果揭晓，我校多名学生获得优异成绩...',
            summary: '我校学生在全国数学竞赛中表现出色，多人获奖。',
            author_id: 1,
            category: '学术成就',
            tags: ['数学竞赛', '学生获奖', '学术成就'],
            featured_image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            status: 'published',
            published_at: '2024-02-20T14:30:00Z',
            created_at: '2024-02-20T14:30:00Z',
            updated_at: '2024-02-20T14:30:00Z'
          },
          {
            id: 3,
            title: '国际交流项目：与美国姐妹学校签署合作协议',
            content: '为进一步推进国际化教育，我校与美国加州某知名高中签署了友好合作协议...',
            summary: '我校与美国姐妹学校签署合作协议，推进国际化教育发展。',
            author_id: 1,
            category: '国际交流',
            tags: ['国际交流', '合作协议', '国际化教育'],
            featured_image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            status: 'published',
            published_at: '2024-02-15T09:00:00Z',
            created_at: '2024-02-15T09:00:00Z',
            updated_at: '2024-02-15T09:00:00Z'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '校园新闻': 'blue',
      '学术成就': 'green',
      '国际交流': 'purple',
      '招生信息': 'orange',
      '师资介绍': 'cyan',
      '课程介绍': 'magenta'
    };
    return colors[category] || 'default';
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* 标题部分 */}
        <div className="text-center mb-16">
          <Title level={2} className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            最新动态
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            了解学校最新资讯，掌握教育动态，与我们一起见证每一个精彩时刻。
          </Paragraph>
        </div>

        {/* 新闻列表 */}
        <Row gutter={[24, 24]}>
          {loading ? (
            // 加载状态
            Array.from({ length: 3 }).map((_, index) => (
              <Col xs={24} md={8} key={index}>
                <Card>
                  <Skeleton.Image className="w-full h-48" />
                  <div className="p-4">
                    <Skeleton active paragraph={{ rows: 3 }} />
                  </div>
                </Card>
              </Col>
            ))
          ) : (
            news.slice(0, 3).map((item) => (
              <Col xs={24} md={8} key={item.id}>
                <Card
                  hoverable
                  className="h-full overflow-hidden"
                  cover={
                    <div className="relative overflow-hidden h-48">
                      <img
                        alt={item.title}
                        src={item.featured_image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <Tag color={getCategoryColor(item.category)}>
                          {item.category}
                        </Tag>
                      </div>
                    </div>
                  }
                  actions={[
                    <div key="date" className="flex items-center justify-center text-gray-500">
                      <CalendarOutlined className="mr-1" />
                      {formatDate(item.published_at || item.created_at)}
                    </div>,
                    <Link href={`/news/${item.id}`} key="read">
                      <Button type="text" icon={<EyeOutlined />}>
                        阅读全文
                      </Button>
                    </Link>
                  ]}
                >
                  <Meta
                    title={
                      <Link href={`/news/${item.id}`} className="hover:text-blue-600 transition-colors">
                        {item.title}
                      </Link>
                    }
                    description={
                      <div>
                        <Paragraph 
                          ellipsis={{ rows: 2 }} 
                          className="text-gray-600 mb-3"
                        >
                          {item.summary || item.content}
                        </Paragraph>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 3).map((tag, index) => (
                            <Tag key={index} size="small">
                              {tag}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))
          )}
        </Row>

        {/* 查看更多按钮 */}
        <div className="text-center mt-12">
          <Link href="/news">
            <Button 
              type="primary" 
              size="large" 
              icon={<ArrowRightOutlined />}
              className="bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700"
            >
              查看更多新闻
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
