import { Router } from 'express';
import { RecruitmentController } from '../controllers/RecruitmentController';
import { InterviewController } from '../controllers/InterviewController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const recruitmentController = new RecruitmentController();
const interviewController = new InterviewController();

// 简历相关路由
router.post('/resume', recruitmentController.uploadResume, recruitmentController.submitResume);
router.get('/resumes', authenticate, authorize('admin'), recruitmentController.getResumes);
router.get('/resumes/:id', authenticate, authorize('admin'), recruitmentController.getResumeById);
router.patch('/resumes/:id/status', authenticate, authorize('admin'), recruitmentController.updateResumeStatus);
router.post('/resumes/:id/analyze', authenticate, authorize('admin'), recruitmentController.analyzeResume);
router.get('/resumes/stats', authenticate, authorize('admin'), recruitmentController.getResumeStats);

// 面试相关路由
router.post('/interviews', authenticate, authorize('admin'), interviewController.scheduleInterview);
router.get('/interviews', authenticate, authorize('admin'), interviewController.getInterviews);
router.get('/interviews/:id', authenticate, authorize('admin'), interviewController.getInterviewById);
router.put('/interviews/:id', authenticate, authorize('admin'), interviewController.updateInterview);
router.post('/interviews/:id/complete', authenticate, authorize('admin'), interviewController.completeInterview);
router.post('/interviews/:id/cancel', authenticate, authorize('admin'), interviewController.cancelInterview);
router.get('/interviews/stats', authenticate, authorize('admin'), interviewController.getInterviewStats);
router.get('/interviews/today', authenticate, authorize('admin'), interviewController.getTodayInterviews);

export default router;
