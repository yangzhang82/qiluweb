import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const userController = new UserController();

// 获取当前用户信息
router.get('/profile', authenticate, userController.getProfile);

// 更新用户信息
router.put('/profile', authenticate, userController.updateProfile);

// 获取用户列表（管理员）
router.get('/', authenticate, authorize('admin'), userController.getUsers);

// 获取用户详情（管理员）
router.get('/:id', authenticate, authorize('admin'), userController.getUserById);

// 更新用户状态（管理员）
router.patch('/:id/status', authenticate, authorize('admin'), userController.updateUserStatus);

export default router;
