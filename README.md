# 齐鲁国际学校AI官网系统

## 项目概述

这是一个现代化的教育类网站系统，集成了AI智能功能、在线授课、招聘管理等模块，旨在为齐鲁国际学校提供全面的数字化解决方案。

## 技术栈

### 前端
- React 18
- Next.js 14
- TypeScript
- Tailwind CSS
- Ant Design

### 后端
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Redis
- JWT认证

### AI服务
- OpenAI API集成
- 自然语言处理
- 内容分析与推荐

## 功能模块

### 1. 基础功能模块
- 首页内容展示
- 多语言切换（中/英文）
- 新闻公告管理
- 栏目管理
- 媒体管理
- 招生简章/流程
- 咨询/报名/反馈表单
- 数据风采展示
- 校内与家校互动

### 2. AI智能功能模块
- 自动内容分类
- 标签自动生成
- 摘要生成
- 智能内容联想
- AI问答机器人
- 内容智能推荐
- 用户行为分析
- 用户分群与描述生成

### 3. 后台管理模块
- 用户/权限管理
- 网站配置管理
- 数据统计与分析
- 在线数据汇总

### 4. 在线授课模块
- 实时授课嵌入
- 教务排课管理
- 教学资源管理
- 线上考试/测评
- 成绩查询

### 5. AI招聘管理模块
- 简历上传与解析
- 智能筛选/匹配师资
- 应聘者匹配度分析

## 项目结构

```
qilu-school-website/
├── client/                 # 前端应用
│   ├── src/
│   │   ├── components/     # 组件
│   │   ├── pages/         # 页面
│   │   ├── hooks/         # 自定义hooks
│   │   ├── utils/         # 工具函数
│   │   ├── types/         # TypeScript类型定义
│   │   └── styles/        # 样式文件
│   ├── public/            # 静态资源
│   └── package.json
├── server/                # 后端应用
│   ├── src/
│   │   ├── controllers/   # 控制器
│   │   ├── models/        # 数据模型
│   │   ├── routes/        # 路由
│   │   ├── middleware/    # 中间件
│   │   ├── services/      # 服务层
│   │   ├── utils/         # 工具函数
│   │   └── types/         # TypeScript类型定义
│   ├── config/            # 配置文件
│   └── package.json
├── docs/                  # 文档
├── scripts/               # 脚本文件
└── README.md
```

## 安装与运行

### 1. 安装依赖
```bash
npm run install:all
```

### 2. 环境配置
复制 `.env.example` 到 `.env` 并配置相关环境变量

### 3. 数据库设置
```bash
# 创建数据库
createdb qilu_school_db

# 运行迁移
cd server && npm run migrate
```

### 4. 启动开发服务器
```bash
npm run dev
```

## 部署

### 生产环境构建
```bash
npm run build
```

### 启动生产服务器
```bash
npm start
```

## 开发规范

- 使用TypeScript进行类型安全开发
- 遵循ESLint和Prettier代码规范
- 组件采用函数式组件 + Hooks
- API接口遵循RESTful设计原则
- 数据库操作使用ORM（Prisma或TypeORM）

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

MIT License
