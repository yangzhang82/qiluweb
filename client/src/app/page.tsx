'use client';

import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import HeroSection from '@/components/Home/HeroSection';
import FeaturesSection from '@/components/Home/FeaturesSection';
import NewsSection from '@/components/Home/NewsSection';
import ChatBot from '@/components/ChatBot/ChatBot';

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
      <NewsSection />
      <ChatBot />
    </MainLayout>
  );
}
