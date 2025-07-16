'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, Button, Drawer, Space } from 'antd';
import { MenuOutlined, GlobalOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import type { MenuItem } from '@/types';

const menuItems: MenuItem[] = [
  { key: 'home', label: '首页', href: '/' },
  { 
    key: 'about', 
    label: '学校概况', 
    href: '/about',
    children: [
      { key: 'about-school', label: '学校简介', href: '/about/school' },
      { key: 'about-history', label: '学校历史', href: '/about/history' },
      { key: 'about-leadership', label: '学校领导', href: '/about/leadership' },
      { key: 'about-facilities', label: '校园设施', href: '/about/facilities' },
    ]
  },
  { 
    key: 'academics', 
    label: '教学教研', 
    href: '/academics',
    children: [
      { key: 'academics-curriculum', label: '课程设置', href: '/academics/curriculum' },
      { key: 'academics-faculty', label: '师资力量', href: '/academics/faculty' },
      { key: 'academics-programs', label: '特色项目', href: '/academics/programs' },
    ]
  },
  { 
    key: 'admissions', 
    label: '招生信息', 
    href: '/admissions',
    children: [
      { key: 'admissions-process', label: '招生流程', href: '/admissions/process' },
      { key: 'admissions-requirements', label: '入学要求', href: '/admissions/requirements' },
      { key: 'admissions-apply', label: '在线报名', href: '/admissions/apply' },
    ]
  },
  { 
    key: 'campus-life', 
    label: '校园生活', 
    href: '/campus-life',
    children: [
      { key: 'campus-activities', label: '校园活动', href: '/campus-life/activities' },
      { key: 'campus-clubs', label: '学生社团', href: '/campus-life/clubs' },
      { key: 'campus-sports', label: '体育运动', href: '/campus-life/sports' },
    ]
  },
  { key: 'news', label: '新闻动态', href: '/news' },
  { key: 'contact', label: '联系我们', href: '/contact' },
];

const Header: React.FC = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  const renderMenuItem = (item: MenuItem) => {
    if (item.children) {
      return {
        key: item.key,
        label: item.label,
        children: item.children.map(child => ({
          key: child.key,
          label: <Link href={child.href}>{child.label}</Link>,
        })),
      };
    }
    return {
      key: item.key,
      label: <Link href={item.href}>{item.label}</Link>,
    };
  };

  return (
    <>
      {/* 顶部联系信息栏 */}
      <div className="bg-blue-900 text-white py-2 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <span className="flex items-center">
                <PhoneOutlined className="mr-2" />
                400-123-4567
              </span>
              <span className="flex items-center">
                <MailOutlined className="mr-2" />
                info@qilu.edu.cn
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                type="text" 
                size="small" 
                icon={<GlobalOutlined />}
                onClick={toggleLanguage}
                className="text-white hover:text-blue-200"
              >
                {language === 'zh' ? 'EN' : '中文'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 主导航栏 */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">齐</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-800">齐鲁国际学校</h1>
                <p className="text-xs text-gray-500">QiLu International School</p>
              </div>
            </Link>

            {/* 桌面端导航菜单 */}
            <nav className="hidden lg:block">
              <Menu
                mode="horizontal"
                items={menuItems.map(renderMenuItem)}
                className="border-none"
                style={{ backgroundColor: 'transparent' }}
              />
            </nav>

            {/* 移动端菜单按钮 */}
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuVisible(true)}
              className="lg:hidden"
            />
          </div>
        </div>
      </header>

      {/* 移动端抽屉菜单 */}
      <Drawer
        title="菜单"
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={280}
      >
        <Menu
          mode="inline"
          items={menuItems.map(renderMenuItem)}
          onClick={() => setMobileMenuVisible(false)}
        />
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <Space direction="vertical" className="w-full">
            <div className="flex items-center text-gray-600">
              <PhoneOutlined className="mr-2" />
              400-123-4567
            </div>
            <div className="flex items-center text-gray-600">
              <MailOutlined className="mr-2" />
              info@qilu.edu.cn
            </div>
            <Button 
              type="primary" 
              block 
              icon={<GlobalOutlined />}
              onClick={toggleLanguage}
            >
              {language === 'zh' ? 'English' : '中文'}
            </Button>
          </Space>
        </div>
      </Drawer>
    </>
  );
};

export default Header;
