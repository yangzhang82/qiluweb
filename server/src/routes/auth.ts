import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const authController = new AuthController();

// 用户注册
router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('用户名至少3个字符'),
  body('email').isEmail().withMessage('请输入有效的邮箱地址'),
  body('password').isLength({ min: 6 }).withMessage('密码至少6个字符'),
  body('role').isIn(['admin', 'teacher', 'student', 'parent']).withMessage('无效的用户角色')
], authController.register);

// 用户登录
router.post('/login', [
  body('email').isEmail().withMessage('请输入有效的邮箱地址'),
  body('password').notEmpty().withMessage('密码不能为空')
], authController.login);

// 刷新令牌
router.post('/refresh', authController.refreshToken);

// 忘记密码
router.post('/forgot-password', [
  body('email').isEmail().withMessage('请输入有效的邮箱地址')
], authController.forgotPassword);

// 重置密码
router.post('/reset-password', [
  body('token').notEmpty().withMessage('重置令牌不能为空'),
  body('password').isLength({ min: 6 }).withMessage('密码至少6个字符')
], authController.resetPassword);

export default router;
