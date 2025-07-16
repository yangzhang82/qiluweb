'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Tag, Input, Select, Pagination, Skeleton } from 'antd';
import { CalendarOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';
import MainLayout from '@/components/Layout/MainLayout';
import { newsAPI } from '@/lib/api';
import type { News } from '@/types';

const { Title, Paragraph } = Typography;
const { Meta } = Card;
const { Search } = Input;
const { Option } = Select;

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // 模拟新闻数据
  const mockNews: News[] = [
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
    },
    {
      id: 4,
      title: '2024年艺术节精彩纷呈，展现学生才华',
      content: '我校第十届艺术节于近日成功举办，学生们通过音乐、舞蹈、绘画等形式展现才华...',
      summary: '第十届艺术节成功举办，学生们展现了多样化的艺术才华。',
      author_id: 1,
      category: '校园活动',
      tags: ['艺术节', '学生才华', '文艺表演'],
      featured_image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      status: 'published',
      published_at: '2024-02-10T16:00:00Z',
      created_at: '2024-02-10T16:00:00Z',
      updated_at: '2024-02-10T16:00:00Z'
    },
    {
      id: 5,
      title: '优秀教师风采：张老师荣获省级教学能手称号',
      content: '我校数学教师张老师凭借出色的教学能力和创新的教学方法，荣获省级教学能手称号...',
      summary: '张老师荣获省级教学能手称号，展现了我校优秀的师资力量。',
      author_id: 1,
      category: '师资风采',
      tags: ['优秀教师', '教学能手', '师资力量'],
      featured_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      status: 'published',
      published_at: '2024-02-05T11:00:00Z',
      created_at: '2024-02-05T11:00:00Z',
      updated_at: '2024-02-05T11:00:00Z'
    },
    {
      id: 6,
      title: '科技创新大赛：我校机器人团队勇夺冠军',
      content: '在刚刚结束的全市青少年科技创新大赛中，我校机器人团队表现出色，勇夺冠军...',
      summary: '我校机器人团队在科技创新大赛中勇夺冠军，展现了学生的创新能力。',
      author_id: 1,
      category: '科技创新',
      tags: ['科技创新', '机器人', '学生竞赛'],
      featured_image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      status: 'published',
      published_at: '2024-01-30T13:00:00Z',
      created_at: '2024-01-30T13:00:00Z',
      updated_at: '2024-01-30T13:00:00Z'
    }
  ];

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // 模拟API调用
        setTimeout(() => {
          let filteredNews = mockNews;
          
          // 按分类筛选
          if (selectedCategory) {
            filteredNews = filteredNews.filter(item => item.category === selectedCategory);
          }
          
          // 按关键词搜索
          if (searchKeyword) {
            filteredNews = filteredNews.filter(item => 
              item.title.includes(searchKeyword) || 
              item.content.includes(searchKeyword) ||
              item.tags.some(tag => tag.includes(searchKeyword))
            );
          }
          
          setTotal(filteredNews.length);
          
          // 分页
          const startIndex = (currentPage - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          setNews(filteredNews.slice(startIndex, endIndex));
          
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Failed to fetch news:', error);
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage, searchKeyword, selectedCategory]);

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
      '校园活动': 'orange',
      '师资风采': 'cyan',
      '科技创新': 'magenta'
    };
    return colors[category] || 'default';
  };

  const categories = ['校园新闻', '学术成就', '国际交流', '校园活动', '师资风采', '科技创新'];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <Title level={1} className="text-4xl font-bold text-gray-800 mb-4">
              新闻动态
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
              了解学校最新资讯，掌握教育动态，与我们一起见证每一个精彩时刻。
            </Paragraph>
          </div>

          {/* 搜索和筛选 */}
          <Row gutter={[16, 16]} className="mb-8">
            <Col xs={24} md={12}>
              <Search
                placeholder="搜索新闻标题、内容或标签"
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={setSearchKeyword}
              />
            </Col>
            <Col xs={24} md={12}>
              <Select
                placeholder="选择新闻分类"
                allowClear
                size="large"
                className="w-full"
                onChange={setSelectedCategory}
              >
                {categories.map(category => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>

          {/* 新闻列表 */}
          <Row gutter={[24, 24]}>
            {loading ? (
              // 加载状态
              Array.from({ length: pageSize }).map((_, index) => (
                <Col xs={24} md={8} key={index}>
                  <Card>
                    <Skeleton.Image className="w-full h-48" />
                    <div className="p-4">
                      <Skeleton active paragraph={{ rows: 3 }} />
                    </div>
                  </Card>
                </Col>
              ))
            ) : news.length > 0 ? (
              news.map((item) => (
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
                        <span className="flex items-center justify-center text-blue-600 hover:text-blue-800">
                          <EyeOutlined className="mr-1" />
                          阅读全文
                        </span>
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
            ) : (
              <Col span={24}>
                <div className="text-center py-12">
                  <Title level={4} className="text-gray-500">
                    暂无相关新闻
                  </Title>
                  <Paragraph className="text-gray-400">
                    请尝试调整搜索条件或浏览其他分类
                  </Paragraph>
                </div>
              </Col>
            )}
          </Row>

          {/* 分页 */}
          {total > pageSize && (
            <div className="text-center mt-12">
              <Pagination
                current={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={setCurrentPage}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) => 
                  `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                }
              />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default NewsPage;
