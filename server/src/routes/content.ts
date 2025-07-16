import { Router } from 'express';
import { ContentController } from '../controllers/ContentController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const contentController = new ContentController();

// 获取内容列表
router.get('/', contentController.getContents);

// 获取内容详情
router.get('/:id', contentController.getContentById);

// 创建内容（管理员/编辑）
router.post('/', authenticate, authorize('admin', 'teacher'), contentController.createContent);

// 更新内容（管理员/编辑）
router.put('/:id', authenticate, authorize('admin', 'teacher'), contentController.updateContent);

// 删除内容（管理员）
router.delete('/:id', authenticate, authorize('admin'), contentController.deleteContent);

export default router;
