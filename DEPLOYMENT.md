# 齐鲁国际学校网站 AWS EC2 部署指南

## 🎯 快速开始（推荐）

如果你想快速部署，可以使用我们提供的自动化脚本：

### 方法一：一键部署（最简单）
```bash
# 1. 上传项目到 EC2
scp -i your-key.pem -r "QiLu website" ubuntu@your-ec2-ip:/tmp/

# 2. 连接到 EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# 3. 运行环境设置脚本
sudo cp -r /tmp/"QiLu website"/* /var/www/qilu-school/
cd /var/www/qilu-school
chmod +x setup-ec2.sh quick-deploy.sh
./setup-ec2.sh

# 4. 重新登录并运行部署脚本
exit
ssh -i your-key.pem ubuntu@your-ec2-ip
cd /var/www/qilu-school
./quick-deploy.sh your-domain.com
```

### 方法二：手动部署（详细控制）
按照下面的详细步骤进行手动部署。

## 📋 部署前准备

### 1. AWS EC2 实例要求
- **实例类型**: t3.small 或更高 (推荐 t3.medium)
- **操作系统**: Ubuntu 22.04 LTS
- **存储**: 至少 20GB SSD
- **内存**: 至少 2GB RAM
- **网络**: 配置安全组开放 80, 443, 22 端口

### 2. 域名准备
- 购买域名并配置 DNS 指向 EC2 实例的公网 IP
- 如果使用 Route 53，配置 A 记录指向实例

## 🚀 部署步骤

### 第一步：创建和配置 EC2 实例

1. **登录 AWS 控制台**
   ```bash
   # 访问 https://console.aws.amazon.com/
   # 选择 EC2 服务
   ```

2. **启动新实例**
   - 选择 Ubuntu 22.04 LTS AMI
   - 选择实例类型 (推荐 t3.medium)
   - 配置安全组：
     ```
     SSH (22) - 你的 IP
     HTTP (80) - 0.0.0.0/0
     HTTPS (443) - 0.0.0.0/0
     ```
   - 创建或选择密钥对

3. **连接到实例**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-public-ip
   ```

### 第二步：系统环境准备

1. **更新系统**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **安装 Node.js 18.x**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # 验证安装
   node --version
   npm --version
   ```

3. **安装 PM2**
   ```bash
   sudo npm install -g pm2
   ```

4. **安装 Nginx**
   ```bash
   sudo apt install nginx -y
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

5. **安装其他必要工具**
   ```bash
   sudo apt install git curl wget unzip -y
   ```

### 第三步：上传项目代码

**方法一：使用 SCP 上传**
```bash
# 在本地机器上执行
scp -i your-key.pem -r "QiLu website" ubuntu@your-ec2-ip:/tmp/
```

**方法二：使用 Git（推荐）**
```bash
# 在 EC2 实例上执行
sudo mkdir -p /var/www/qilu-school
sudo chown ubuntu:ubuntu /var/www/qilu-school
cd /var/www/qilu-school

# 如果代码在 GitHub 上
git clone https://github.com/your-username/qilu-school.git .

# 或者从本地上传的文件复制
sudo cp -r /tmp/"QiLu website"/* /var/www/qilu-school/
sudo chown -R ubuntu:ubuntu /var/www/qilu-school
```

### 第四步：配置和部署

1. **进入项目目录**
   ```bash
   cd /var/www/qilu-school/client
   ```

2. **安装依赖**
   ```bash
   npm ci --production
   ```

3. **构建项目**
   ```bash
   npm run build
   ```

4. **配置环境变量**
   ```bash
   # 编辑生产环境配置
   nano .env.production
   # 根据实际情况修改域名和其他配置
   ```

5. **配置 Nginx**
   ```bash
   sudo cp /var/www/qilu-school/nginx.conf /etc/nginx/sites-available/qilu-school
   
   # 编辑配置文件，替换域名
   sudo nano /etc/nginx/sites-available/qilu-school
   
   # 启用站点
   sudo ln -s /etc/nginx/sites-available/qilu-school /etc/nginx/sites-enabled/
   
   # 删除默认站点（可选）
   sudo rm /etc/nginx/sites-enabled/default
   
   # 测试配置
   sudo nginx -t
   
   # 重启 Nginx
   sudo systemctl restart nginx
   ```

6. **启动应用**
   ```bash
   # 使用 PM2 启动
   pm2 start ecosystem.config.js
   
   # 保存 PM2 配置
   pm2 save
   
   # 设置开机自启
   pm2 startup
   # 按照提示执行返回的命令
   ```

### 第五步：配置 SSL（可选但推荐）

1. **安装 Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   ```

2. **获取 SSL 证书**
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

3. **设置自动续期**
   ```bash
   sudo crontab -e
   # 添加以下行：
   0 12 * * * /usr/bin/certbot renew --quiet
   ```

## 🔧 部署后配置

### 1. 防火墙配置
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
```

### 2. 监控和日志
```bash
# 查看应用状态
pm2 status
pm2 logs

# 查看 Nginx 状态
sudo systemctl status nginx

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 3. 性能优化
```bash
# 设置 PM2 集群模式（可选）
pm2 delete all
pm2 start ecosystem.config.js --env production
```

## 🔄 更新部署

创建更新脚本：
```bash
#!/bin/bash
cd /var/www/qilu-school
git pull origin main
cd client
npm ci --production
npm run build
pm2 restart qilu-school
```

## 🛠️ 故障排除

### 常见问题

1. **端口 3000 被占用**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 PID
   ```

2. **权限问题**
   ```bash
   sudo chown -R www-data:www-data /var/www/qilu-school
   sudo chmod -R 755 /var/www/qilu-school
   ```

3. **内存不足**
   ```bash
   # 创建交换文件
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```

4. **Nginx 配置错误**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

## 📊 监控和维护

### 1. 设置监控
```bash
# 安装 htop
sudo apt install htop

# 监控系统资源
htop

# 监控应用
pm2 monit
```

### 2. 定期备份
```bash
# 创建备份脚本
sudo nano /usr/local/bin/backup-qilu.sh

#!/bin/bash
BACKUP_DIR="/var/backups/qilu-school"
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz /var/www/qilu-school

# 设置定期备份
sudo crontab -e
# 添加：每天凌晨 2 点备份
0 2 * * * /usr/local/bin/backup-qilu.sh
```

## 🎉 完成

部署完成后，你的网站应该可以通过以下方式访问：
- HTTP: http://your-domain.com
- HTTPS: https://your-domain.com (如果配置了 SSL)

记得定期更新系统和依赖，监控应用性能，并保持备份！
