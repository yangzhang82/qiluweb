import { Router } from 'express';
import { NewsController } from '../controllers/NewsController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const newsController = new NewsController();

// 获取新闻列表
router.get('/', newsController.getNews);

// 获取新闻详情
router.get('/:id', newsController.getNewsById);

// 创建新闻（管理员/教师）
router.post('/', authenticate, authorize('admin', 'teacher'), newsController.createNews);

// 更新新闻（管理员/教师）
router.put('/:id', authenticate, authorize('admin', 'teacher'), newsController.updateNews);

// 删除新闻（管理员）
router.delete('/:id', authenticate, authorize('admin'), newsController.deleteNews);

export default router;
