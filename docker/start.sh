#!/bin/sh

echo "🚀 Starting Qilu International School Application..."

# 等待数据库连接
echo "⏳ Waiting for database connection..."
until nc -z postgres 5432; do
  echo "Database is unavailable - sleeping"
  sleep 1
done
echo "✅ Database is ready!"

# 等待Redis连接
echo "⏳ Waiting for Redis connection..."
until nc -z redis 6379; do
  echo "Redis is unavailable - sleeping"
  sleep 1
done
echo "✅ Redis is ready!"

# 运行数据库迁移（如果需要）
echo "🔄 Running database migrations..."
cd /app/server && npm run migrate || echo "⚠️ Migration failed or not needed"

# 启动后端服务
echo "🖥️ Starting backend server..."
cd /app/server && node dist/index.js &
BACKEND_PID=$!

# 等待后端启动
sleep 5

# 启动前端服务
echo "🌐 Starting frontend server..."
cd /app/client && node server.js &
FRONTEND_PID=$!

# 等待服务启动
sleep 10

echo "✅ Application started successfully!"
echo "📊 Backend running on port 3001"
echo "🌐 Frontend running on port 3000"

# 保持容器运行
wait $BACKEND_PID $FRONTEND_PID
