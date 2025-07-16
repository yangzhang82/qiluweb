import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

interface Interview {
  id: number;
  resume_id: number;
  candidate_name: string;
  position: string;
  interviewer: string;
  scheduled_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  score?: number;
  feedback?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export class InterviewController {
  // 模拟面试数据
  private interviews: Interview[] = [
    {
      id: 1,
      resume_id: 1,
      candidate_name: '张教师',
      position: '高中数学教师',
      interviewer: '教务主任',
      scheduled_time: '2024-03-20T14:00:00Z',
      status: 'scheduled',
      notes: '请准备教学演示',
      created_at: '2024-03-15T10:00:00Z',
      updated_at: '2024-03-15T10:00:00Z'
    },
    {
      id: 2,
      resume_id: 3,
      candidate_name: '王博士',
      position: '物理教师',
      interviewer: '校长',
      scheduled_time: '2024-03-18T10:00:00Z',
      status: 'completed',
      score: 9,
      feedback: '候选人表现优秀，专业知识扎实，教学理念先进，建议录用。',
      created_at: '2024-03-13T16:00:00Z',
      updated_at: '2024-03-18T11:00:00Z'
    }
  ];

  async scheduleInterview(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const { resume_id, candidate_name, position, interviewer, scheduled_time, notes } = req.body;

      // 验证必填字段
      if (!resume_id || !candidate_name || !position || !interviewer || !scheduled_time) {
        res.status(400).json({
          success: false,
          message: '请填写完整的面试信息'
        });
        return;
      }

      // 检查时间冲突
      const conflictInterview = this.interviews.find(interview => 
        interview.interviewer === interviewer && 
        interview.scheduled_time === scheduled_time &&
        interview.status === 'scheduled'
      );

      if (conflictInterview) {
        res.status(400).json({
          success: false,
          message: '该面试官在此时间已有其他面试安排'
        });
        return;
      }

      // 创建面试记录
      const newInterview: Interview = {
        id: this.interviews.length + 1,
        resume_id: Number(resume_id),
        candidate_name,
        position,
        interviewer,
        scheduled_time,
        status: 'scheduled',
        notes: notes || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      this.interviews.push(newInterview);

      res.status(201).json({
        success: true,
        message: '面试安排成功',
        data: newInterview
      });
    } catch (error) {
      next(error);
    }
  }

  async getInterviews(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10, status, interviewer, date } = req.query;

      let filteredInterviews = [...this.interviews];

      // 按状态筛选
      if (status) {
        filteredInterviews = filteredInterviews.filter(interview => interview.status === status);
      }

      // 按面试官筛选
      if (interviewer) {
        filteredInterviews = filteredInterviews.filter(interview => 
          interview.interviewer.includes(interviewer as string)
        );
      }

      // 按日期筛选
      if (date) {
        const targetDate = new Date(date as string).toDateString();
        filteredInterviews = filteredInterviews.filter(interview => 
          new Date(interview.scheduled_time).toDateString() === targetDate
        );
      }

      // 分页
      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = startIndex + Number(limit);
      const paginatedInterviews = filteredInterviews.slice(startIndex, endIndex);

      res.json({
        success: true,
        message: '获取面试列表成功',
        data: paginatedInterviews,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: filteredInterviews.length,
          totalPages: Math.ceil(filteredInterviews.length / Number(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getInterviewById(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const interview = this.interviews.find(i => i.id === Number(id));

      if (!interview) {
        res.status(404).json({
          success: false,
          message: '面试记录不存在'
        });
        return;
      }

      res.json({
        success: true,
        message: '获取面试详情成功',
        data: interview
      });
    } catch (error) {
      next(error);
    }
  }

  async updateInterview(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const interviewIndex = this.interviews.findIndex(i => i.id === Number(id));

      if (interviewIndex === -1) {
        res.status(404).json({
          success: false,
          message: '面试记录不存在'
        });
        return;
      }

      // 更新面试记录
      this.interviews[interviewIndex] = {
        ...this.interviews[interviewIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };

      res.json({
        success: true,
        message: '面试信息更新成功',
        data: this.interviews[interviewIndex]
      });
    } catch (error) {
      next(error);
    }
  }

  async completeInterview(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { score, feedback } = req.body;

      const interviewIndex = this.interviews.findIndex(i => i.id === Number(id));

      if (interviewIndex === -1) {
        res.status(404).json({
          success: false,
          message: '面试记录不存在'
        });
        return;
      }

      if (this.interviews[interviewIndex].status !== 'scheduled') {
        res.status(400).json({
          success: false,
          message: '只能完成已安排的面试'
        });
        return;
      }

      // 更新面试状态为已完成
      this.interviews[interviewIndex] = {
        ...this.interviews[interviewIndex],
        status: 'completed',
        score: score ? Number(score) : undefined,
        feedback: feedback || '',
        updated_at: new Date().toISOString()
      };

      res.json({
        success: true,
        message: '面试完成记录已保存',
        data: this.interviews[interviewIndex]
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelInterview(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const interviewIndex = this.interviews.findIndex(i => i.id === Number(id));

      if (interviewIndex === -1) {
        res.status(404).json({
          success: false,
          message: '面试记录不存在'
        });
        return;
      }

      if (this.interviews[interviewIndex].status !== 'scheduled') {
        res.status(400).json({
          success: false,
          message: '只能取消已安排的面试'
        });
        return;
      }

      // 更新面试状态为已取消
      this.interviews[interviewIndex] = {
        ...this.interviews[interviewIndex],
        status: 'cancelled',
        notes: (this.interviews[interviewIndex].notes || '') + `\n取消原因：${reason || '未说明'}`,
        updated_at: new Date().toISOString()
      };

      res.json({
        success: true,
        message: '面试已取消',
        data: this.interviews[interviewIndex]
      });
    } catch (error) {
      next(error);
    }
  }

  async getInterviewStats(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const total = this.interviews.length;
      const scheduled = this.interviews.filter(i => i.status === 'scheduled').length;
      const completed = this.interviews.filter(i => i.status === 'completed').length;
      const cancelled = this.interviews.filter(i => i.status === 'cancelled').length;

      // 按面试官统计
      const byInterviewer = this.interviews.reduce((acc, interview) => {
        if (!acc[interview.interviewer]) {
          acc[interview.interviewer] = { total: 0, completed: 0, scheduled: 0 };
        }
        acc[interview.interviewer].total++;
        if (interview.status === 'completed') {
          acc[interview.interviewer].completed++;
        } else if (interview.status === 'scheduled') {
          acc[interview.interviewer].scheduled++;
        }
        return acc;
      }, {} as Record<string, any>);

      // 平均评分
      const completedWithScore = this.interviews.filter(i => i.status === 'completed' && i.score);
      const avgScore = completedWithScore.length > 0 ? 
        completedWithScore.reduce((sum, i) => sum + (i.score || 0), 0) / completedWithScore.length : 0;

      res.json({
        success: true,
        message: '获取面试统计成功',
        data: {
          overview: { total, scheduled, completed, cancelled, avgScore },
          byInterviewer
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getTodayInterviews(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const today = new Date().toDateString();
      const todayInterviews = this.interviews.filter(interview => 
        new Date(interview.scheduled_time).toDateString() === today &&
        interview.status === 'scheduled'
      );

      res.json({
        success: true,
        message: '获取今日面试安排成功',
        data: todayInterviews
      });
    } catch (error) {
      next(error);
    }
  }
}
