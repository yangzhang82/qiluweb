import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
import { ResumeModel } from '../models/ResumeModel';
import { AIService } from '../services/AIService';
import { EmailService } from '../services/EmailService';
import multer from 'multer';
import path from 'path';

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('只支持PDF、DOC、DOCX格式的文件'));
    }
  }
});

export class RecruitmentController {
  private resumeModel = new ResumeModel();
  private aiService = new AIService();
  private emailService = new EmailService();

  // 文件上传中间件
  uploadResume = upload.single('resume');

  async submitResume(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const { applicant_name, email, phone, position, education, experience, skills } = req.body;
      const file = req.file;

      // 验证必填字段
      if (!applicant_name || !email || !phone || !position) {
        res.status(400).json({
          success: false,
          message: '请填写完整的基本信息'
        });
        return;
      }

      // 创建简历记录
      const resumeData = {
        applicant_name,
        email,
        phone,
        position,
        education: education || '',
        experience: experience || '',
        skills: Array.isArray(skills) ? skills : (skills ? skills.split(',') : []),
        file_path: file ? file.path : null,
        status: 'pending'
      };

      const resume = await this.resumeModel.create(resumeData);

      // 异步进行AI分析
      this.performAIAnalysis(resume.id, resumeData);

      // 发送确认邮件
      await this.emailService.sendResumeConfirmation(email, applicant_name, position);

      res.status(201).json({
        success: true,
        message: '简历提交成功，我们会在5个工作日内与您联系',
        data: { id: resume.id }
      });
    } catch (error) {
      next(error);
    }
  }

  async getResumes(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10, status, position, sort = 'created_at', order = 'DESC' } = req.query;

      let conditions = '';
      const params: any[] = [];
      let paramIndex = 1;

      if (status) {
        conditions += `status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
      }

      if (position) {
        if (conditions) conditions += ' AND ';
        conditions += `position ILIKE $${paramIndex}`;
        params.push(`%${position}%`);
        paramIndex++;
      }

      const result = await this.resumeModel.findWithPagination(
        Number(page),
        Number(limit),
        conditions || undefined,
        params.length > 0 ? params : undefined
      );

      const response: ApiResponse = {
        success: true,
        message: '获取简历列表成功',
        data: result.data,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: result.total,
          totalPages: result.totalPages
        }
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getResumeById(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const resume = await this.resumeModel.findById(Number(id));

      if (!resume) {
        res.status(404).json({
          success: false,
          message: '简历不存在'
        });
        return;
      }

      res.json({
        success: true,
        message: '获取简历详情成功',
        data: resume
      });
    } catch (error) {
      next(error);
    }
  }

  async updateResumeStatus(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected'];
      if (!validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          message: '无效的状态值'
        });
        return;
      }

      const resume = await this.resumeModel.updateStatus(Number(id), status);

      if (!resume) {
        res.status(404).json({
          success: false,
          message: '简历不存在'
        });
        return;
      }

      res.json({
        success: true,
        message: '简历状态更新成功',
        data: resume
      });
    } catch (error) {
      next(error);
    }
  }

  async analyzeResume(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const resume = await this.resumeModel.findById(Number(id));

      if (!resume) {
        res.status(404).json({
          success: false,
          message: '简历不存在'
        });
        return;
      }

      // 构建简历文本用于AI分析
      const resumeText = `
        姓名：${resume.applicant_name}
        职位：${resume.position}
        学历：${resume.education}
        工作经验：${resume.experience}
        技能：${resume.skills?.join('、') || ''}
      `;

      // 进行AI分析
      const analysis = await this.aiService.analyzeResume(resumeText);

      // 更新简历的AI分析结果
      const updatedResume = await this.resumeModel.updateAIAnalysis(
        Number(id),
        analysis.score,
        analysis.analysis
      );

      res.json({
        success: true,
        message: 'AI分析完成',
        data: {
          score: analysis.score,
          analysis: analysis.analysis,
          resume: updatedResume
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getResumeStats(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const stats = await this.resumeModel.getResumeStats();
      const positionStats = await this.resumeModel.getResumeStatsByPosition();

      res.json({
        success: true,
        message: '获取简历统计成功',
        data: {
          overview: stats,
          byPosition: positionStats
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // 私有方法：异步执行AI分析
  private async performAIAnalysis(resumeId: number, resumeData: any): Promise<void> {
    try {
      const resumeText = `
        姓名：${resumeData.applicant_name}
        职位：${resumeData.position}
        学历：${resumeData.education}
        工作经验：${resumeData.experience}
        技能：${resumeData.skills?.join('、') || ''}
      `;

      const analysis = await this.aiService.analyzeResume(resumeText);

      await this.resumeModel.updateAIAnalysis(
        resumeId,
        analysis.score,
        analysis.analysis
      );
    } catch (error) {
      console.error('AI分析失败:', error);
    }
  }
}
