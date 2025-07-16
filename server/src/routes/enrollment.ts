import { Router } from 'express';
import { EnrollmentController } from '../controllers/EnrollmentController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const enrollmentController = new EnrollmentController();

// 提交报名申请
router.post('/', enrollmentController.createEnrollment);

// 获取报名列表（管理员）
router.get('/', authenticate, authorize('admin'), enrollmentController.getEnrollments);

// 获取报名详情（管理员）
router.get('/:id', authenticate, authorize('admin'), enrollmentController.getEnrollmentById);

// 更新报名状态（管理员）
router.patch('/:id/status', authenticate, authorize('admin'), enrollmentController.updateEnrollmentStatus);

export default router;
