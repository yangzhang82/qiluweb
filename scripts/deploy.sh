#!/bin/bash

# 齐鲁国际学校网站部署脚本
# 使用方法: ./scripts/deploy.sh [环境] [版本]
# 例如: ./scripts/deploy.sh production v1.0.0

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查参数
ENVIRONMENT=${1:-production}
VERSION=${2:-latest}

log_info "开始部署齐鲁国际学校网站"
log_info "环境: $ENVIRONMENT"
log_info "版本: $VERSION"

# 检查必要的工具
check_dependencies() {
    log_info "检查依赖工具..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker 未安装"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose 未安装"
        exit 1
    fi
    
    log_success "依赖检查完成"
}

# 备份当前版本
backup_current() {
    log_info "备份当前版本..."
    
    if [ -d "backup" ]; then
        rm -rf backup
    fi
    
    mkdir -p backup
    
    # 备份数据库
    if docker-compose ps postgres | grep -q "Up"; then
        log_info "备份数据库..."
        docker-compose exec -T postgres pg_dump -U qilu_user qilu_school > backup/database_$(date +%Y%m%d_%H%M%S).sql
        log_success "数据库备份完成"
    fi
    
    # 备份上传文件
    if [ -d "uploads" ]; then
        log_info "备份上传文件..."
        cp -r uploads backup/uploads_$(date +%Y%m%d_%H%M%S)
        log_success "文件备份完成"
    fi
}

# 构建镜像
build_images() {
    log_info "构建Docker镜像..."
    
    # 构建应用镜像
    docker build -t qilu-school:$VERSION .
    
    # 标记为latest
    if [ "$VERSION" != "latest" ]; then
        docker tag qilu-school:$VERSION qilu-school:latest
    fi
    
    log_success "镜像构建完成"
}

# 运行测试
run_tests() {
    log_info "运行测试..."
    
    # 后端测试
    log_info "运行后端测试..."
    cd server
    npm test
    cd ..
    
    # 前端测试
    log_info "运行前端测试..."
    cd client
    npm test -- --watchAll=false
    cd ..
    
    log_success "测试通过"
}

# 部署应用
deploy_application() {
    log_info "部署应用..."
    
    # 停止现有服务
    log_info "停止现有服务..."
    docker-compose down
    
    # 清理旧镜像
    log_info "清理旧镜像..."
    docker image prune -f
    
    # 启动新服务
    log_info "启动新服务..."
    docker-compose up -d
    
    # 等待服务启动
    log_info "等待服务启动..."
    sleep 30
    
    # 健康检查
    health_check
    
    log_success "应用部署完成"
}

# 健康检查
health_check() {
    log_info "执行健康检查..."
    
    # 检查前端
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        log_success "前端服务正常"
    else
        log_error "前端服务异常"
        exit 1
    fi
    
    # 检查后端
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        log_success "后端服务正常"
    else
        log_error "后端服务异常"
        exit 1
    fi
    
    # 检查数据库
    if docker-compose exec -T postgres pg_isready -U qilu_user -d qilu_school > /dev/null 2>&1; then
        log_success "数据库连接正常"
    else
        log_error "数据库连接异常"
        exit 1
    fi
    
    log_success "健康检查通过"
}

# 回滚函数
rollback() {
    log_warning "开始回滚..."
    
    # 停止当前服务
    docker-compose down
    
    # 恢复数据库
    if [ -f "backup/database_*.sql" ]; then
        log_info "恢复数据库..."
        latest_backup=$(ls -t backup/database_*.sql | head -n1)
        docker-compose up -d postgres
        sleep 10
        docker-compose exec -T postgres psql -U qilu_user -d qilu_school < "$latest_backup"
    fi
    
    # 恢复文件
    if [ -d "backup/uploads_*" ]; then
        log_info "恢复上传文件..."
        latest_uploads=$(ls -td backup/uploads_* | head -n1)
        rm -rf uploads
        cp -r "$latest_uploads" uploads
    fi
    
    # 启动服务
    docker-compose up -d
    
    log_success "回滚完成"
}

# 清理函数
cleanup() {
    log_info "清理临时文件..."
    
    # 清理旧的备份文件（保留最近5个）
    if [ -d "backup" ]; then
        find backup -name "database_*.sql" -type f | sort -r | tail -n +6 | xargs rm -f
        find backup -name "uploads_*" -type d | sort -r | tail -n +6 | xargs rm -rf
    fi
    
    # 清理Docker
    docker system prune -f
    
    log_success "清理完成"
}

# 主函数
main() {
    # 捕获错误并回滚
    trap 'log_error "部署失败，开始回滚..."; rollback; exit 1' ERR
    
    check_dependencies
    
    if [ "$ENVIRONMENT" = "production" ]; then
        backup_current
        run_tests
    fi
    
    build_images
    deploy_application
    cleanup
    
    log_success "🎉 部署成功完成！"
    log_info "前端地址: http://localhost:3000"
    log_info "后端地址: http://localhost:3001"
    log_info "管理后台: http://localhost:3000/admin"
}

# 显示帮助信息
show_help() {
    echo "齐鲁国际学校网站部署脚本"
    echo ""
    echo "使用方法:"
    echo "  $0 [环境] [版本]"
    echo ""
    echo "参数:"
    echo "  环境    部署环境 (development|staging|production) [默认: production]"
    echo "  版本    部署版本标签 [默认: latest]"
    echo ""
    echo "示例:"
    echo "  $0 production v1.0.0"
    echo "  $0 staging latest"
    echo ""
    echo "选项:"
    echo "  -h, --help     显示帮助信息"
    echo "  -r, --rollback 回滚到上一个版本"
    echo ""
}

# 处理命令行参数
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    -r|--rollback)
        rollback
        exit 0
        ;;
    *)
        main
        ;;
esac
