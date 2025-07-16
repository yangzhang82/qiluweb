'use client';

import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Space, Badge } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
  BookOutlined,
  TeamOutlined,
  BarChartOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GlobalOutlined,
  MessageOutlined,
  CalendarOutlined,
  FileOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const { Header, Sider, Content } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/admin">仪表盘</Link>,
    },
    {
      key: 'content',
      icon: <FileTextOutlined />,
      label: '内容管理',
      children: [
        {
          key: 'news',
          icon: <FileOutlined />,
          label: <Link href="/admin/news">新闻管理</Link>,
        },
        {
          key: 'pages',
          icon: <GlobalOutlined />,
          label: <Link href="/admin/pages">页面管理</Link>,
        },
        {
          key: 'media',
          icon: <FileOutlined />,
          label: <Link href="/admin/media">媒体库</Link>,
        },
      ],
    },
    {
      key: 'academic',
      icon: <BookOutlined />,
      label: '教学管理',
      children: [
        {
          key: 'courses',
          icon: <BookOutlined />,
          label: <Link href="/admin/courses">课程管理</Link>,
        },
        {
          key: 'schedule',
          icon: <CalendarOutlined />,
          label: <Link href="/admin/schedule">排课管理</Link>,
        },
        {
          key: 'exams',
          icon: <FileTextOutlined />,
          label: <Link href="/admin/exams">考试管理</Link>,
        },
      ],
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: '用户管理',
      children: [
        {
          key: 'students',
          icon: <UserOutlined />,
          label: <Link href="/admin/students">学生管理</Link>,
        },
        {
          key: 'teachers',
          icon: <TeamOutlined />,
          label: <Link href="/admin/teachers">教师管理</Link>,
        },
        {
          key: 'parents',
          icon: <UserOutlined />,
          label: <Link href="/admin/parents">家长管理</Link>,
        },
      ],
    },
    {
      key: 'enrollment',
      icon: <FileTextOutlined />,
      label: <Link href="/admin/enrollment">报名管理</Link>,
    },
    {
      key: 'recruitment',
      icon: <TeamOutlined />,
      label: <Link href="/admin/recruitment">招聘管理</Link>,
    },
    {
      key: 'communication',
      icon: <MessageOutlined />,
      label: '沟通交流',
      children: [
        {
          key: 'messages',
          icon: <MessageOutlined />,
          label: <Link href="/admin/messages">消息中心</Link>,
        },
        {
          key: 'notifications',
          icon: <BellOutlined />,
          label: <Link href="/admin/notifications">通知公告</Link>,
        },
      ],
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: <Link href="/admin/analytics">数据分析</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      children: [
        {
          key: 'site-settings',
          icon: <SettingOutlined />,
          label: <Link href="/admin/settings/site">网站设置</Link>,
        },
        {
          key: 'ai-settings',
          icon: <SettingOutlined />,
          label: <Link href="/admin/settings/ai">AI设置</Link>,
        },
        {
          key: 'system-logs',
          icon: <FileTextOutlined />,
          label: <Link href="/admin/settings/logs">系统日志</Link>,
        },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/admin/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账户设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className="bg-white shadow-lg"
        width={256}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">齐</span>
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-gray-800">管理后台</h1>
                <p className="text-xs text-gray-500">齐鲁国际学校</p>
              </div>
            )}
          </div>
        </div>
        
        <Menu
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
          className="border-none"
        />
      </Sider>

      <Layout>
        <Header className="bg-white shadow-sm px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-lg"
            />
          </div>

          <div className="flex items-center space-x-4">
            <Badge count={5} size="small">
              <Button type="text" icon={<BellOutlined />} size="large" />
            </Badge>
            
            <Badge count={3} size="small">
              <Button type="text" icon={<MessageOutlined />} size="large" />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg">
                <Avatar icon={<UserOutlined />} />
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-800">管理员</div>
                  <div className="text-xs text-gray-500">admin@qilu.edu.cn</div>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="p-6 bg-gray-50">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
