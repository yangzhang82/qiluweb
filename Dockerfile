# 多阶段构建 - 后端
FROM node:18-alpine AS server-builder

WORKDIR /app/server

# 复制后端依赖文件
COPY server/package*.json ./
RUN npm ci --only=production

# 复制后端源代码
COPY server/ ./

# 构建后端
RUN npm run build

# 多阶段构建 - 前端
FROM node:18-alpine AS client-builder

WORKDIR /app/client

# 复制前端依赖文件
COPY client/package*.json ./
RUN npm ci

# 复制前端源代码
COPY client/ ./

# 构建前端
RUN npm run build

# 生产环境镜像
FROM node:18-alpine AS production

# 安装必要的系统依赖
RUN apk add --no-cache \
    postgresql-client \
    curl \
    && rm -rf /var/cache/apk/*

# 创建应用用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 设置工作目录
WORKDIR /app

# 复制后端构建结果
COPY --from=server-builder --chown=nextjs:nodejs /app/server/dist ./server/dist
COPY --from=server-builder --chown=nextjs:nodejs /app/server/node_modules ./server/node_modules
COPY --from=server-builder --chown=nextjs:nodejs /app/server/package.json ./server/

# 复制前端构建结果
COPY --from=client-builder --chown=nextjs:nodejs /app/client/.next/standalone ./client/
COPY --from=client-builder --chown=nextjs:nodejs /app/client/.next/static ./client/.next/static
COPY --from=client-builder --chown=nextjs:nodejs /app/client/public ./client/public

# 创建必要的目录
RUN mkdir -p /app/server/uploads/resumes /app/server/uploads/media /app/server/logs
RUN chown -R nextjs:nodejs /app

# 复制启动脚本
COPY --chown=nextjs:nodejs docker/start.sh ./
RUN chmod +x start.sh

# 切换到非root用户
USER nextjs

# 暴露端口
EXPOSE 3000 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# 启动应用
CMD ["./start.sh"]
