#!/bin/bash

# 齐鲁国际学校网站一键部署脚本
# 使用方法: ./quick-deploy.sh [domain-name]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 配置变量
DOMAIN=${1:-"your-domain.com"}
PROJECT_DIR="/var/www/qilu-school"
NGINX_SITE="/etc/nginx/sites-available/qilu-school"

print_header() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    齐鲁国际学校网站部署                        ║"
    echo "║                      一键部署脚本                            ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"
}

print_step() {
    echo -e "\n${BLUE}🚀 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查参数
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    echo "使用方法: $0 [domain-name]"
    echo "示例: $0 qilu-school.com"
    echo "如果不提供域名，将使用默认配置"
    exit 0
fi

print_header

# 检查是否为 root 或有 sudo 权限
if [ "$EUID" -eq 0 ]; then
    print_warning "检测到 root 用户，建议使用普通用户 + sudo"
elif ! sudo -n true 2>/dev/null; then
    print_error "需要 sudo 权限才能运行此脚本"
    exit 1
fi

print_step "检查系统环境"

# 检查必要的命令
for cmd in node npm pm2 nginx; do
    if ! command -v $cmd &> /dev/null; then
        print_error "$cmd 未安装，请先运行 setup-ec2.sh"
        exit 1
    fi
done

print_success "系统环境检查通过"

print_step "准备项目目录"
sudo mkdir -p $PROJECT_DIR
sudo chown $USER:www-data $PROJECT_DIR
cd $PROJECT_DIR

print_step "安装项目依赖"
cd client
npm ci --production
print_success "依赖安装完成"

print_step "构建项目"
npm run build
print_success "项目构建完成"

print_step "配置环境变量"
# 更新生产环境配置
sed -i "s/your-domain.com/$DOMAIN/g" .env.production
print_success "环境变量配置完成"

print_step "配置 Nginx"
# 更新 Nginx 配置中的域名
sudo cp ../nginx.conf $NGINX_SITE
sudo sed -i "s/your-domain.com/$DOMAIN/g" $NGINX_SITE

# 启用站点
sudo ln -sf $NGINX_SITE /etc/nginx/sites-enabled/qilu-school

# 禁用默认站点
sudo rm -f /etc/nginx/sites-enabled/default

# 测试 Nginx 配置
if sudo nginx -t; then
    print_success "Nginx 配置验证通过"
else
    print_error "Nginx 配置有误"
    exit 1
fi

print_step "启动应用服务"
# 停止可能存在的旧进程
pm2 delete qilu-school 2>/dev/null || true

# 启动新进程
pm2 start ecosystem.config.js
pm2 save

print_success "应用服务启动完成"

print_step "重启 Nginx"
sudo systemctl reload nginx
print_success "Nginx 重启完成"

print_step "设置开机自启"
sudo systemctl enable nginx
pm2 startup ubuntu -u $USER --hp /home/$USER
print_success "开机自启设置完成"

print_step "设置文件权限"
sudo chown -R www-data:www-data $PROJECT_DIR
sudo chmod -R 755 $PROJECT_DIR
print_success "文件权限设置完成"

# 健康检查
print_step "执行健康检查"
sleep 5

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "应用健康检查通过"
else
    print_warning "应用可能未正常启动，请检查日志"
fi

if curl -f http://localhost > /dev/null 2>&1; then
    print_success "Nginx 健康检查通过"
else
    print_warning "Nginx 可能未正常工作，请检查配置"
fi

print_step "部署完成！"

echo -e "\n${GREEN}🎉 齐鲁国际学校网站部署成功！${NC}\n"

echo -e "${YELLOW}访问信息：${NC}"
echo "• 网站地址: http://$DOMAIN"
echo "• 服务器 IP: $(curl -s ifconfig.me 2>/dev/null || echo '请手动获取')"

echo -e "\n${YELLOW}管理命令：${NC}"
echo "• 查看应用状态: pm2 status"
echo "• 查看应用日志: pm2 logs qilu-school"
echo "• 重启应用: pm2 restart qilu-school"
echo "• 查看 Nginx 状态: sudo systemctl status nginx"
echo "• 查看 Nginx 日志: sudo tail -f /var/log/nginx/access.log"

echo -e "\n${YELLOW}下一步建议：${NC}"
echo "1. 配置域名 DNS 指向此服务器"
echo "2. 申请 SSL 证书: sudo certbot --nginx -d $DOMAIN"
echo "3. 设置定期备份"
echo "4. 配置监控和告警"

if [ "$DOMAIN" = "your-domain.com" ]; then
    print_warning "请记得将域名配置替换为实际域名"
    echo "   运行: sudo nano $NGINX_SITE"
fi

echo -e "\n${GREEN}部署日志已保存，如有问题请检查相关日志文件${NC}"
