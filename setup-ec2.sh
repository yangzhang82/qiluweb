#!/bin/bash

# AWS EC2 自动化设置脚本
# 在新的 Ubuntu 22.04 EC2 实例上运行此脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 函数定义
print_step() {
    echo -e "\n${BLUE}==== $1 ====${NC}\n"
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

# 检查是否为 Ubuntu
if [ ! -f /etc/lsb-release ]; then
    print_error "此脚本仅支持 Ubuntu 系统"
    exit 1
fi

print_step "开始设置 AWS EC2 环境"

# 1. 更新系统
print_step "更新系统包"
sudo apt update && sudo apt upgrade -y
print_success "系统更新完成"

# 2. 安装基础工具
print_step "安装基础工具"
sudo apt install -y curl wget git unzip htop ufw
print_success "基础工具安装完成"

# 3. 安装 Node.js 18.x
print_step "安装 Node.js 18.x"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
print_success "Node.js $NODE_VERSION 和 npm $NPM_VERSION 安装完成"

# 4. 安装 PM2
print_step "安装 PM2"
sudo npm install -g pm2
print_success "PM2 安装完成"

# 5. 安装 Nginx
print_step "安装和配置 Nginx"
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
print_success "Nginx 安装完成"

# 6. 配置防火墙
print_step "配置防火墙"
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
print_success "防火墙配置完成"

# 7. 创建项目目录
print_step "创建项目目录"
sudo mkdir -p /var/www/qilu-school
sudo chown $USER:$USER /var/www/qilu-school
sudo mkdir -p /var/log/pm2
sudo chown $USER:$USER /var/log/pm2
print_success "项目目录创建完成"

# 8. 创建交换文件（如果内存小于 2GB）
MEMORY=$(free -m | awk 'NR==2{printf "%.0f", $2}')
if [ $MEMORY -lt 2048 ]; then
    print_step "创建交换文件（内存不足 2GB）"
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    print_success "交换文件创建完成"
fi

# 9. 安装 SSL 证书工具
print_step "安装 Certbot（SSL 证书工具）"
sudo apt install -y certbot python3-certbot-nginx
print_success "Certbot 安装完成"

# 10. 优化系统设置
print_step "优化系统设置"
# 增加文件描述符限制
echo "* soft nofile 65536" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 65536" | sudo tee -a /etc/security/limits.conf

# 优化网络设置
echo "net.core.somaxconn = 65536" | sudo tee -a /etc/sysctl.conf
echo "net.ipv4.tcp_max_syn_backlog = 65536" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

print_success "系统优化完成"

# 11. 创建部署用户（可选）
print_step "设置部署环境"
# 将当前用户添加到 www-data 组
sudo usermod -a -G www-data $USER

print_success "部署环境设置完成"

# 显示系统信息
print_step "系统信息"
echo "操作系统: $(lsb_release -d | cut -f2)"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "PM2: $(pm2 --version)"
echo "Nginx: $(nginx -v 2>&1)"
echo "内存: ${MEMORY}MB"
echo "磁盘空间: $(df -h / | awk 'NR==2 {print $4}') 可用"

print_step "设置完成！"
print_success "EC2 环境已准备就绪"

echo -e "\n${YELLOW}下一步操作：${NC}"
echo "1. 上传你的项目代码到 /var/www/qilu-school/"
echo "2. 运行项目部署脚本"
echo "3. 配置域名和 SSL 证书"

echo -e "\n${YELLOW}有用的命令：${NC}"
echo "- 查看系统状态: htop"
echo "- 查看 PM2 状态: pm2 status"
echo "- 查看 Nginx 状态: sudo systemctl status nginx"
echo "- 查看防火墙状态: sudo ufw status"

print_warning "请重新登录以使组权限生效，或运行: newgrp www-data"
