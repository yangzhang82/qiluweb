'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Card, Avatar, Space, Spin, FloatButton } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, MessageOutlined, CloseOutlined } from '@ant-design/icons';
import { aiAPI } from '@/lib/api';
import type { ChatMessage } from '@/types';

const { TextArea } = Input;

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: '',
      response: '您好！我是齐鲁国际学校的AI助手。我可以帮您了解学校信息、招生政策、课程设置等。请问有什么可以帮助您的吗？',
      timestamp: new Date().toISOString(),
      isUser: false,
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      response: '',
      timestamp: new Date().toISOString(),
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await aiAPI.chat(inputMessage);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: inputMessage,
        response: response.data.response,
        timestamp: new Date().toISOString(),
        isUser: false,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: inputMessage,
        response: '抱歉，我暂时无法回答您的问题。请稍后再试或联系人工客服：400-123-4567',
        timestamp: new Date().toISOString(),
        isUser: false,
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    '招生要求是什么？',
    '学费多少钱？',
    '有哪些课程？',
    '师资力量如何？',
    '学校地址在哪里？',
    '如何联系学校？'
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  if (!isOpen) {
    return (
      <FloatButton
        icon={<MessageOutlined />}
        type="primary"
        style={{ right: 24, bottom: 24 }}
        onClick={() => setIsOpen(true)}
        tooltip="AI助手"
      />
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card
        title={
          <div className="flex items-center justify-between">
            <Space>
              <Avatar icon={<RobotOutlined />} className="bg-blue-500" />
              <span>AI助手</span>
            </Space>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setIsOpen(false)}
              size="small"
            />
          </div>
        }
        className="w-80 h-96 shadow-lg"
        styles={{ body: { padding: 0, height: '300px', display: 'flex', flexDirection: 'column' } }}
      >
        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-2 max-w-[80%] ${msg.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Avatar 
                  icon={msg.isUser ? <UserOutlined /> : <RobotOutlined />} 
                  size="small"
                  className={msg.isUser ? 'bg-green-500' : 'bg-blue-500'}
                />
                <div
                  className={`px-3 py-2 rounded-lg text-sm ${
                    msg.isUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.isUser ? msg.message : msg.response}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <Avatar icon={<RobotOutlined />} size="small" className="bg-blue-500" />
                <div className="bg-gray-100 px-3 py-2 rounded-lg">
                  <Spin size="small" />
                  <span className="ml-2 text-sm text-gray-600">正在思考...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* 快捷问题 */}
        {messages.length === 1 && (
          <div className="px-4 py-2 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2">常见问题：</div>
            <div className="flex flex-wrap gap-1">
              {quickQuestions.slice(0, 3).map((question, index) => (
                <Button
                  key={index}
                  size="small"
                  type="text"
                  className="text-xs h-6 px-2 border border-gray-300 hover:border-blue-400"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* 输入框 */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <TextArea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="请输入您的问题..."
              autoSize={{ minRows: 1, maxRows: 3 }}
              disabled={isLoading}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              loading={isLoading}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatBot;
