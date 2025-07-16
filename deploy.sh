#!/bin/bash

# 齐鲁国际学校网站部署脚本
# 使用方法: ./deploy.sh

set -e  # 遇到错误立即退出

echo "🚀 开始部署齐鲁国际学校网站..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置变量
PROJECT_DIR="/var/www/qilu-school"
BACKUP_DIR="/var/backups/qilu-school"
NGINX_SITE="/etc/nginx/sites-available/qilu-school"
NGINX_ENABLED="/etc/nginx/sites-enabled/qilu-school"

# 函数：打印彩色消息
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    print_error "请使用 sudo 运行此脚本"
    exit 1
fi

# 创建备份
if [ -d "$PROJECT_DIR" ]; then
    print_message "创建备份..."
    mkdir -p "$BACKUP_DIR"
    cp -r "$PROJECT_DIR" "$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S)"
fi

# 创建项目目录
print_message "创建项目目录..."
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# 如果是首次部署，克隆代码（这里假设你已经上传了代码）
# git clone https://github.com/your-username/qilu-school.git .

print_message "进入客户端目录..."
cd client

# 安装依赖
print_message "安装 Node.js 依赖..."
npm ci --production

# 构建项目
print_message "构建 Next.js 项目..."
npm run build

# 设置权限
print_message "设置文件权限..."
chown -R www-data:www-data "$PROJECT_DIR"
chmod -R 755 "$PROJECT_DIR"

# 配置 Nginx
print_message "配置 Nginx..."
cp "$PROJECT_DIR/nginx.conf" "$NGINX_SITE"

# 启用站点
if [ ! -L "$NGINX_ENABLED" ]; then
    ln -s "$NGINX_SITE" "$NGINX_ENABLED"
fi

# 测试 Nginx 配置
print_message "测试 Nginx 配置..."
nginx -t

# 重启服务
print_message "重启 PM2 应用..."
pm2 delete qilu-school 2>/dev/null || true
pm2 start "$PROJECT_DIR/client/ecosystem.config.js"
pm2 save

print_message "重新加载 Nginx..."
systemctl reload nginx

# 设置开机自启
print_message "设置服务开机自启..."
systemctl enable nginx
pm2 startup
pm2 save

print_message "✅ 部署完成！"
print_message "网站应该已经在运行了"
print_message "你可以通过以下命令检查状态："
echo "  - pm2 status"
echo "  - systemctl status nginx"
echo "  - curl http://localhost:3000"

print_warning "请记得："
echo "  1. 在 nginx.conf 中替换域名"
echo "  2. 配置 SSL 证书（如果需要）"
echo "  3. 配置防火墙规则"
echo "  4. 设置定期备份"
