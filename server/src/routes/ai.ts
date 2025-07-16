import { Router } from 'express';
import { AIController } from '../controllers/AIController';
import { authenticate } from '../middleware/auth';

const router = Router();
const aiController = new AIController();

// AI问答机器人
router.post('/chat', aiController.chat);

// 内容分类
router.post('/classify', authenticate, aiController.classifyContent);

// 生成摘要
router.post('/summarize', authenticate, aiController.generateSummary);

// 生成标签
router.post('/tags', authenticate, aiController.generateTags);

// 内容推荐
router.get('/recommendations', aiController.getRecommendations);

export default router;
