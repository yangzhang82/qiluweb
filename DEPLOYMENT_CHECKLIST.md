# 🚀 AWS EC2 部署检查清单

## 📋 部署前准备

### AWS 账户和 EC2 设置
- [ ] AWS 账户已创建并验证
- [ ] EC2 实例已创建（推荐 t3.medium, Ubuntu 22.04 LTS）
- [ ] 安全组已配置（开放 22, 80, 443 端口）
- [ ] 密钥对已创建并下载
- [ ] 弹性 IP 已分配（可选但推荐）

### 域名设置
- [ ] 域名已购买
- [ ] DNS 记录已配置指向 EC2 公网 IP
- [ ] 域名解析已生效（可用 `nslookup your-domain.com` 检查）

### 本地准备
- [ ] 项目代码已准备完毕
- [ ] SSH 客户端已安装
- [ ] 密钥文件权限已设置（`chmod 400 your-key.pem`）

## 🔧 部署步骤

### 第一步：连接到 EC2
- [ ] 成功连接到 EC2 实例
  ```bash
  ssh -i your-key.pem ubuntu@your-ec2-ip
  ```

### 第二步：环境设置
- [ ] 系统已更新
- [ ] Node.js 18.x 已安装
- [ ] PM2 已安装
- [ ] Nginx 已安装
- [ ] 防火墙已配置
- [ ] 项目目录已创建

**快速命令：**
```bash
./setup-ec2.sh
```

### 第三步：代码上传
选择一种方式：

**方式 A：SCP 上传**
- [ ] 代码已通过 SCP 上传到 EC2
  ```bash
  scp -i your-key.pem -r "QiLu website" ubuntu@your-ec2-ip:/tmp/
  ```

**方式 B：Git 克隆**
- [ ] 代码已推送到 Git 仓库
- [ ] 在 EC2 上成功克隆代码
  ```bash
  git clone https://github.com/your-username/qilu-school.git /var/www/qilu-school
  ```

### 第四步：应用部署
- [ ] 项目依赖已安装
- [ ] 项目已成功构建
- [ ] 环境变量已配置
- [ ] PM2 应用已启动
- [ ] Nginx 已配置并重启

**快速命令：**
```bash
./quick-deploy.sh your-domain.com
```

### 第五步：SSL 配置（推荐）
- [ ] Certbot 已安装
- [ ] SSL 证书已申请
- [ ] HTTPS 重定向已配置
- [ ] 自动续期已设置

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## ✅ 部署验证

### 基础功能检查
- [ ] 网站可通过 HTTP 访问
- [ ] 网站可通过 HTTPS 访问（如果配置了 SSL）
- [ ] 所有页面正常加载
- [ ] 静态资源正常加载
- [ ] 响应式设计在移动端正常工作

### 服务状态检查
- [ ] PM2 应用状态正常
  ```bash
  pm2 status
  ```
- [ ] Nginx 服务正常
  ```bash
  sudo systemctl status nginx
  ```
- [ ] 防火墙状态正常
  ```bash
  sudo ufw status
  ```

### 性能检查
- [ ] 页面加载速度 < 3 秒
- [ ] 服务器响应时间 < 1 秒
- [ ] 内存使用率 < 80%
- [ ] CPU 使用率正常

### 安全检查
- [ ] SSH 密钥登录正常
- [ ] 防火墙规则正确
- [ ] SSL 证书有效
- [ ] 安全头已配置

## 🔄 部署后配置

### 监控设置
- [ ] PM2 监控已启用
- [ ] 日志轮转已配置
- [ ] 系统监控已设置（可选）

### 备份设置
- [ ] 自动备份脚本已创建
- [ ] 定期备份任务已设置
- [ ] 备份恢复流程已测试

### 维护计划
- [ ] 更新部署流程已文档化
- [ ] 回滚计划已准备
- [ ] 监控告警已配置

## 🆘 故障排除

### 常见问题检查
- [ ] 端口是否被占用
- [ ] 权限是否正确
- [ ] 配置文件是否正确
- [ ] 日志中是否有错误

### 有用的命令
```bash
# 查看应用日志
pm2 logs qilu-school

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/error.log

# 查看系统资源
htop

# 测试网站连通性
curl -I http://your-domain.com
```

## 📞 支持联系

如果遇到问题，请检查：
1. 部署日志
2. 应用日志
3. Nginx 日志
4. 系统日志

或参考详细的 `DEPLOYMENT.md` 文档。

---

**部署完成时间：** ___________  
**部署人员：** ___________  
**域名：** ___________  
**服务器 IP：** ___________
