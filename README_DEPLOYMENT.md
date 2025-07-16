# 🌟 齐鲁国际学校网站 - AWS EC2 部署包

这是齐鲁国际学校网站的完整 AWS EC2 部署解决方案。

## 📁 部署文件说明

### 🚀 自动化脚本
- **`setup-ec2.sh`** - EC2 环境初始化脚本（安装 Node.js, PM2, Nginx 等）
- **`quick-deploy.sh`** - 一键部署脚本（推荐使用）
- **`deploy.sh`** - 详细部署脚本（高级用户）

### ⚙️ 配置文件
- **`client/ecosystem.config.js`** - PM2 进程管理配置
- **`nginx.conf`** - Nginx 服务器配置
- **`client/.env.production`** - 生产环境变量配置

### 📚 文档
- **`DEPLOYMENT.md`** - 详细部署指南
- **`DEPLOYMENT_CHECKLIST.md`** - 部署检查清单

## 🎯 快速部署（3 步完成）

### 第 1 步：准备 EC2 实例
1. 在 AWS 控制台创建 Ubuntu 22.04 LTS 实例
2. 配置安全组（开放 22, 80, 443 端口）
3. 下载密钥对文件

### 第 2 步：上传代码并设置环境
```bash
# 上传项目到 EC2
scp -i your-key.pem -r "QiLu website" ubuntu@your-ec2-ip:/tmp/

# 连接到 EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# 复制项目并设置环境
sudo mkdir -p /var/www/qilu-school
sudo cp -r /tmp/"QiLu website"/* /var/www/qilu-school/
cd /var/www/qilu-school
chmod +x *.sh

# 运行环境设置脚本
./setup-ec2.sh
```

### 第 3 步：一键部署
```bash
# 重新登录（使权限生效）
exit
ssh -i your-key.pem ubuntu@your-ec2-ip

# 运行部署脚本
cd /var/www/qilu-school
./quick-deploy.sh your-domain.com
```

## 🔧 高级配置

### SSL 证书配置
```bash
# 申请免费 SSL 证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 设置自动续期
sudo crontab -e
# 添加：0 12 * * * /usr/bin/certbot renew --quiet
```

### 性能优化
```bash
# 启用 PM2 集群模式
pm2 delete qilu-school
pm2 start ecosystem.config.js --env production -i max
```

### 监控设置
```bash
# 查看应用状态
pm2 status
pm2 monit

# 查看系统资源
htop

# 查看日志
pm2 logs qilu-school
sudo tail -f /var/log/nginx/access.log
```

## 📊 系统要求

### 最低配置
- **实例类型**: t3.small
- **内存**: 2GB RAM
- **存储**: 20GB SSD
- **操作系统**: Ubuntu 22.04 LTS

### 推荐配置
- **实例类型**: t3.medium
- **内存**: 4GB RAM
- **存储**: 30GB SSD
- **网络**: 增强网络

## 🌐 访问信息

部署完成后，你的网站将可以通过以下方式访问：

- **HTTP**: `http://your-domain.com`
- **HTTPS**: `https://your-domain.com` (配置 SSL 后)
- **管理后台**: `http://your-domain.com/admin`

## 🔄 更新部署

创建更新脚本 `update.sh`：
```bash
#!/bin/bash
cd /var/www/qilu-school
git pull origin main  # 如果使用 Git
cd client
npm ci --production
npm run build
pm2 restart qilu-school
```

## 🛠️ 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 PID
   ```

2. **权限问题**
   ```bash
   sudo chown -R www-data:www-data /var/www/qilu-school
   ```

3. **内存不足**
   ```bash
   # 检查内存使用
   free -h
   # 创建交换文件（setup-ec2.sh 会自动处理）
   ```

4. **Nginx 配置错误**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

### 有用的命令
```bash
# 重启所有服务
pm2 restart all
sudo systemctl restart nginx

# 查看端口使用
sudo netstat -tlnp

# 查看磁盘使用
df -h

# 查看系统日志
sudo journalctl -f
```

## 📞 技术支持

### 日志位置
- **应用日志**: `pm2 logs qilu-school`
- **Nginx 访问日志**: `/var/log/nginx/access.log`
- **Nginx 错误日志**: `/var/log/nginx/error.log`
- **系统日志**: `/var/log/syslog`

### 配置文件位置
- **Nginx 配置**: `/etc/nginx/sites-available/qilu-school`
- **PM2 配置**: `/var/www/qilu-school/client/ecosystem.config.js`
- **环境变量**: `/var/www/qilu-school/client/.env.production`

## 🎉 部署成功！

如果一切顺利，你现在应该有一个完全运行的齐鲁国际学校网站！

记得：
- ✅ 定期备份数据
- ✅ 监控系统性能
- ✅ 保持系统更新
- ✅ 定期检查 SSL 证书

---

**祝你部署顺利！** 🚀

如有问题，请参考 `DEPLOYMENT.md` 获取详细信息，或查看 `DEPLOYMENT_CHECKLIST.md` 确保所有步骤都已完成。
