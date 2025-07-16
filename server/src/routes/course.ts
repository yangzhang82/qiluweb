import { Router } from 'express';
import { CourseController } from '../controllers/CourseController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const courseController = new CourseController();

// 获取课程列表
router.get('/', courseController.getCourses);

// 获取课程详情
router.get('/:id', courseController.getCourseById);

// 创建课程（管理员/教师）
router.post('/', authenticate, authorize('admin', 'teacher'), courseController.createCourse);

// 更新课程（管理员/教师）
router.put('/:id', authenticate, authorize('admin', 'teacher'), courseController.updateCourse);

// 删除课程（管理员）
router.delete('/:id', authenticate, authorize('admin'), courseController.deleteCourse);

export default router;
