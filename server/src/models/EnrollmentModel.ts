import { BaseModel } from './BaseModel';
import { Enrollment } from '../types';

export class EnrollmentModel extends BaseModel {
  constructor() {
    super('enrollments');
  }

  // 根据状态获取报名
  async getEnrollmentsByStatus(status: string): Promise<Enrollment[]> {
    return await this.findAll('status = $1', [status]);
  }

  // 获取待处理的报名
  async getPendingEnrollments(): Promise<Enrollment[]> {
    return await this.getEnrollmentsByStatus('pending');
  }

  // 获取已批准的报名
  async getApprovedEnrollments(): Promise<Enrollment[]> {
    return await this.getEnrollmentsByStatus('approved');
  }

  // 更新报名状态
  async updateStatus(id: number, status: string): Promise<Enrollment | null> {
    return await this.update(id, { status });
  }

  // 根据邮箱查找报名
  async findByEmail(email: string): Promise<Enrollment[]> {
    return await this.findAll('student_email = $1', [email]);
  }

  // 根据年级获取报名
  async getEnrollmentsByGrade(grade: string): Promise<Enrollment[]> {
    return await this.findAll('grade = $1', [grade]);
  }

  // 搜索报名
  async searchEnrollments(keyword: string): Promise<Enrollment[]> {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE student_name ILIKE $1 
      OR student_email ILIKE $1 
      OR parent_name ILIKE $1
      ORDER BY created_at DESC
    `;
    const result = await this.query(query, [`%${keyword}%`]);
    return result.rows;
  }

  // 获取报名统计
  async getEnrollmentStats(): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected
      FROM ${this.tableName}
    `;
    const result = await this.query(query);
    return result.rows[0];
  }

  // 按年级统计报名
  async getEnrollmentStatsByGrade(): Promise<any[]> {
    const query = `
      SELECT 
        grade,
        COUNT(*) as count,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count
      FROM ${this.tableName}
      GROUP BY grade
      ORDER BY grade
    `;
    const result = await this.query(query);
    return result.rows;
  }

  // 按月份统计报名
  async getEnrollmentStatsByMonth(): Promise<any[]> {
    const query = `
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as count
      FROM ${this.tableName}
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `;
    const result = await this.query(query);
    return result.rows;
  }
}
