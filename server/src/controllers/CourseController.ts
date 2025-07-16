import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export class CourseController {
  async getCourses(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      res.json({
        success: true,
        message: '获取课程列表成功',
        data: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getCourseById(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      res.json({
        success: true,
        message: '获取课程详情成功',
        data: {}
      });
    } catch (error) {
      next(error);
    }
  }

  async createCourse(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      res.status(201).json({
        success: true,
        message: '课程创建成功'
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCourse(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      res.json({
        success: true,
        message: '课程更新成功'
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCourse(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      res.json({
        success: true,
        message: '课程删除成功'
      });
    } catch (error) {
      next(error);
    }
  }
}
