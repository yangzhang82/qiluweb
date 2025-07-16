'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Space, 
  Modal, 
  Upload, 
  Row, 
  Col, 
  Typography,
  message,
  Popconfirm,
  Input,
  Select,
  Image,
  Tabs,
  Progress,
  Tag
} from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  DownloadOutlined,
  UploadOutlined,
  FolderOutlined,
  FileImageOutlined,
  FileOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  SearchOutlined
} from '@ant-design/icons';
import AdminLayout from '@/components/Admin/AdminLayout';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Dragger } = Upload;

interface MediaFile {
  id: string;
  name: string;
  original_name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  mime_type: string;
  size: number;
  url: string;
  thumbnail?: string;
  folder: string;
  alt_text?: string;
  description?: string;
  uploaded_by: string;
  created_at: string;
}

interface MediaFolder {
  id: string;
  name: string;
  parent_id?: string;
  file_count: number;
  created_at: string;
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [currentFolder, setCurrentFolder] = useState<string>('');
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchMedia();
    fetchFolders();
  }, [currentFolder]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      // TODO: 实际API调用
      const mockFiles: MediaFile[] = [
        {
          id: '1',
          name: 'school-building.jpg',
          original_name: '学校建筑.jpg',
          type: 'image',
          mime_type: 'image/jpeg',
          size: 2048576,
          url: '/images/school-building.jpg',
          thumbnail: '/images/school-building-thumb.jpg',
          folder: '',
          alt_text: '学校主楼',
          description: '齐鲁国际学校主教学楼外观',
          uploaded_by: '管理员',
          created_at: '2024-03-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'graduation-ceremony.mp4',
          original_name: '毕业典礼.mp4',
          type: 'video',
          mime_type: 'video/mp4',
          size: 52428800,
          url: '/videos/graduation-ceremony.mp4',
          thumbnail: '/images/graduation-thumb.jpg',
          folder: 'events',
          description: '2023年毕业典礼视频',
          uploaded_by: '编辑',
          created_at: '2024-03-10T14:20:00Z'
        },
        {
          id: '3',
          name: 'school-brochure.pdf',
          original_name: '学校宣传册.pdf',
          type: 'document',
          mime_type: 'application/pdf',
          size: 5242880,
          url: '/documents/school-brochure.pdf',
          folder: 'documents',
          description: '学校宣传册PDF文件',
          uploaded_by: '管理员',
          created_at: '2024-03-05T09:15:00Z'
        }
      ];
      
      setFiles(mockFiles);
    } catch (error) {
      message.error('获取媒体文件失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const mockFolders: MediaFolder[] = [
        {
          id: '1',
          name: 'events',
          file_count: 15,
          created_at: '2024-01-15T08:00:00Z'
        },
        {
          id: '2',
          name: 'documents',
          file_count: 8,
          created_at: '2024-01-20T08:00:00Z'
        },
        {
          id: '3',
          name: 'photos',
          file_count: 32,
          created_at: '2024-02-01T08:00:00Z'
        }
      ];
      
      setFolders(mockFolders);
    } catch (error) {
      message.error('获取文件夹失败');
    }
  };

  const handleUpload = async (file: File) => {
    try {
      // TODO: 实际文件上传
      message.success('文件上传成功');
      fetchMedia();
      return false; // 阻止默认上传行为
    } catch (error) {
      message.error('文件上传失败');
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: 实际API调用
      message.success('删除成功');
      fetchMedia();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleViewDetail = (file: MediaFile) => {
    setSelectedFile(file);
    setDetailModalVisible(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string, mimeType: string) => {
    switch (type) {
      case 'image':
        return <FileImageOutlined className="text-green-500" />;
      case 'video':
        return <VideoCameraOutlined className="text-blue-500" />;
      case 'audio':
        return <AudioOutlined className="text-purple-500" />;
      default:
        return <FileOutlined className="text-gray-500" />;
    }
  };

  const getFilteredFiles = () => {
    let filtered = files;
    
    if (currentFolder) {
      filtered = filtered.filter(file => file.folder === currentFolder);
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(file => file.type === filterType);
    }
    
    if (searchText) {
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(searchText.toLowerCase()) ||
        file.original_name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    return filtered;
  };

  const uploadProps = {
    name: 'file',
    multiple: true,
    beforeUpload: handleUpload,
    showUploadList: false,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Title level={2}>媒体库</Title>
            <Text type="secondary">管理网站媒体文件和资源</Text>
          </div>
          <Space>
            <Button icon={<FolderOutlined />}>
              新建文件夹
            </Button>
            <Button 
              type="primary" 
              icon={<UploadOutlined />} 
              onClick={() => setUploadModalVisible(true)}
            >
              上传文件
            </Button>
          </Space>
        </div>

        {/* 文件夹导航 */}
        <Card size="small">
          <div className="flex items-center space-x-4">
            <Text strong>当前位置:</Text>
            <Button 
              type="link" 
              onClick={() => setCurrentFolder('')}
              className={!currentFolder ? 'text-blue-600' : ''}
            >
              根目录
            </Button>
            {currentFolder && (
              <>
                <span>/</span>
                <Text className="text-blue-600">{currentFolder}</Text>
              </>
            )}
          </div>
        </Card>

        {/* 文件夹列表 */}
        {!currentFolder && (
          <Card title="文件夹" size="small">
            <Row gutter={[16, 16]}>
              {folders.map(folder => (
                <Col xs={24} sm={12} md={8} lg={6} key={folder.id}>
                  <Card 
                    hoverable
                    size="small"
                    onClick={() => setCurrentFolder(folder.name)}
                    className="text-center"
                  >
                    <FolderOutlined className="text-4xl text-yellow-500 mb-2" />
                    <div className="font-medium">{folder.name}</div>
                    <div className="text-xs text-gray-500">
                      {folder.file_count} 个文件
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        )}

        {/* 筛选和搜索 */}
        <Card size="small">
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Input.Search
                placeholder="搜索文件名..."
                allowClear
                onSearch={setSearchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
              />
            </Col>
            <Col>
              <Select
                value={filterType}
                onChange={setFilterType}
                style={{ width: 120 }}
              >
                <Option value="all">全部类型</Option>
                <Option value="image">图片</Option>
                <Option value="video">视频</Option>
                <Option value="audio">音频</Option>
                <Option value="document">文档</Option>
              </Select>
            </Col>
            <Col>
              <Button.Group>
                <Button 
                  type={viewMode === 'grid' ? 'primary' : 'default'}
                  onClick={() => setViewMode('grid')}
                >
                  网格
                </Button>
                <Button 
                  type={viewMode === 'list' ? 'primary' : 'default'}
                  onClick={() => setViewMode('list')}
                >
                  列表
                </Button>
              </Button.Group>
            </Col>
          </Row>
        </Card>

        {/* 文件列表 */}
        <Card loading={loading}>
          {viewMode === 'grid' ? (
            <Row gutter={[16, 16]}>
              {getFilteredFiles().map(file => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4} key={file.id}>
                  <Card 
                    hoverable
                    size="small"
                    cover={
                      file.type === 'image' ? (
                        <div className="h-32 overflow-hidden">
                          <Image
                            src={file.thumbnail || file.url}
                            alt={file.alt_text || file.name}
                            className="w-full h-full object-cover"
                            preview={false}
                          />
                        </div>
                      ) : (
                        <div className="h-32 flex items-center justify-center bg-gray-50">
                          {getFileIcon(file.type, file.mime_type)}
                          <div className="text-4xl ml-2">
                            {getFileIcon(file.type, file.mime_type)}
                          </div>
                        </div>
                      )
                    }
                    actions={[
                      <EyeOutlined 
                        key="view" 
                        onClick={() => handleViewDetail(file)}
                      />,
                      <DownloadOutlined 
                        key="download"
                        onClick={() => window.open(file.url, '_blank')}
                      />,
                      <Popconfirm
                        key="delete"
                        title="确定要删除这个文件吗？"
                        onConfirm={() => handleDelete(file.id)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <DeleteOutlined className="text-red-500" />
                      </Popconfirm>
                    ]}
                  >
                    <Card.Meta
                      title={
                        <div className="truncate" title={file.original_name}>
                          {file.original_name}
                        </div>
                      }
                      description={
                        <div>
                          <Tag size="small">{file.type}</Tag>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="space-y-2">
              {getFilteredFiles().map(file => (
                <Card key={file.id} size="small">
                  <Row align="middle" gutter={16}>
                    <Col flex="none">
                      {file.type === 'image' ? (
                        <Image
                          src={file.thumbnail || file.url}
                          alt={file.alt_text || file.name}
                          width={48}
                          height={48}
                          className="object-cover rounded"
                          preview={false}
                        />
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded">
                          {getFileIcon(file.type, file.mime_type)}
                        </div>
                      )}
                    </Col>
                    <Col flex="auto">
                      <div className="font-medium">{file.original_name}</div>
                      <div className="text-sm text-gray-500">
                        {formatFileSize(file.size)} • {file.uploaded_by} • {dayjs(file.created_at).format('YYYY-MM-DD HH:mm')}
                      </div>
                    </Col>
                    <Col flex="none">
                      <Space>
                        <Button 
                          type="link" 
                          icon={<EyeOutlined />} 
                          size="small"
                          onClick={() => handleViewDetail(file)}
                        >
                          查看
                        </Button>
                        <Button 
                          type="link" 
                          icon={<DownloadOutlined />} 
                          size="small"
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          下载
                        </Button>
                        <Popconfirm
                          title="确定要删除这个文件吗？"
                          onConfirm={() => handleDelete(file.id)}
                          okText="确定"
                          cancelText="取消"
                        >
                          <Button 
                            type="link" 
                            danger 
                            icon={<DeleteOutlined />} 
                            size="small"
                          >
                            删除
                          </Button>
                        </Popconfirm>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* 上传模态框 */}
        <Modal
          title="上传文件"
          open={uploadModalVisible}
          onCancel={() => setUploadModalVisible(false)}
          footer={null}
          width={600}
        >
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持单个或批量上传。支持图片、视频、音频和文档格式。
            </p>
          </Dragger>
        </Modal>

        {/* 文件详情模态框 */}
        <Modal
          title="文件详情"
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={null}
          width={800}
        >
          {selectedFile && (
            <div className="space-y-4">
              <Row gutter={16}>
                <Col span={12}>
                  {selectedFile.type === 'image' ? (
                    <Image
                      src={selectedFile.url}
                      alt={selectedFile.alt_text || selectedFile.name}
                      className="w-full"
                    />
                  ) : (
                    <div className="h-48 flex items-center justify-center bg-gray-50 rounded">
                      <div className="text-center">
                        <div className="text-6xl mb-4">
                          {getFileIcon(selectedFile.type, selectedFile.mime_type)}
                        </div>
                        <div className="font-medium">{selectedFile.original_name}</div>
                      </div>
                    </div>
                  )}
                </Col>
                <Col span={12}>
                  <div className="space-y-3">
                    <div>
                      <Text strong>文件名:</Text>
                      <div>{selectedFile.original_name}</div>
                    </div>
                    <div>
                      <Text strong>文件大小:</Text>
                      <div>{formatFileSize(selectedFile.size)}</div>
                    </div>
                    <div>
                      <Text strong>文件类型:</Text>
                      <div>{selectedFile.mime_type}</div>
                    </div>
                    <div>
                      <Text strong>上传者:</Text>
                      <div>{selectedFile.uploaded_by}</div>
                    </div>
                    <div>
                      <Text strong>上传时间:</Text>
                      <div>{dayjs(selectedFile.created_at).format('YYYY-MM-DD HH:mm:ss')}</div>
                    </div>
                    <div>
                      <Text strong>文件URL:</Text>
                      <Input.TextArea 
                        value={selectedFile.url} 
                        rows={2} 
                        readOnly 
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              
              {selectedFile.description && (
                <div>
                  <Text strong>描述:</Text>
                  <div>{selectedFile.description}</div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
}
