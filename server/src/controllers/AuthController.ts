import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { ApiResponse } from '../types';
import { AppError } from '../middleware/errorHandler';

export class AuthController {
  async register(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('数据验证失败', 400);
      }

      const { username, email, password, role } = req.body;

      // 检查用户是否已存在
      // const existingUser = await getUserByEmail(email);
      // if (existingUser) {
      //   throw new AppError('用户已存在', 409);
      // }

      // 加密密码
      const hashedPassword = await bcrypt.hash(password, 12);

      // 创建用户
      // const user = await createUser({
      //   username,
      //   email,
      //   password: hashedPassword,
      //   role
      // });

      // 生成JWT令牌
      const payload = { userId: 1, email, role };
      const secret = process.env.JWT_SECRET || 'default_secret';
      const token = jwt.sign(payload, secret, { expiresIn: '7d' });

      res.status(201).json({
        success: true,
        message: '注册成功',
        data: {
          token,
          user: {
            id: 1,
            username,
            email,
            role
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('数据验证失败', 400);
      }

      const { email, password } = req.body;

      // 查找用户
      // const user = await getUserByEmail(email);
      // if (!user) {
      //   throw new AppError('用户不存在', 404);
      // }

      // 验证密码
      // const isPasswordValid = await bcrypt.compare(password, user.password);
      // if (!isPasswordValid) {
      //   throw new AppError('密码错误', 401);
      // }

      // 生成JWT令牌
      const payload = { userId: 1, email, role: 'admin' };
      const secret = process.env.JWT_SECRET || 'default_secret';
      const token = jwt.sign(payload, secret, { expiresIn: '7d' });

      res.json({
        success: true,
        message: '登录成功',
        data: {
          token,
          user: {
            id: 1,
            username: 'admin',
            email,
            role: 'admin'
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      // 实现令牌刷新逻辑
      res.json({
        success: true,
        message: '令牌刷新成功',
        data: { token: 'new_token' }
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      // 实现忘记密码逻辑
      res.json({
        success: true,
        message: '重置密码邮件已发送'
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      // 实现重置密码逻辑
      res.json({
        success: true,
        message: '密码重置成功'
      });
    } catch (error) {
      next(error);
    }
  }
}
