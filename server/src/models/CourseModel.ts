import { BaseModel } from './BaseModel';
import { Course } from '../types';

export class CourseModel extends BaseModel {
  constructor() {
    super('courses');
  }

  // 获取活跃课程
  async getActiveCourses(): Promise<Course[]> {
    return await this.findAll('status = $1', ['active']);
  }

  // 根据分类获取课程
  async getCoursesByCategory(category: string): Promise<Course[]> {
    return await this.findAll('category = $1 AND status = $2', [category, 'active']);
  }

  // 根据教师获取课程
  async getCoursesByTeacher(teacherId: number): Promise<Course[]> {
    return await this.findAll('teacher_id = $1', [teacherId]);
  }

  // 根据级别获取课程
  async getCoursesByLevel(level: string): Promise<Course[]> {
    return await this.findAll('level = $1 AND status = $2', [level, 'active']);
  }

  // 搜索课程
  async searchCourses(keyword: string): Promise<Course[]> {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE status = 'active'
      AND (title ILIKE $1 OR description ILIKE $1)
      ORDER BY created_at DESC
    `;
    const result = await this.query(query, [`%${keyword}%`]);
    return result.rows;
  }

  // 获取热门课程
  async getPopularCourses(limit: number = 10): Promise<Course[]> {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE status = 'active'
      ORDER BY current_students DESC, created_at DESC
      LIMIT $1
    `;
    const result = await this.query(query, [limit]);
    return result.rows;
  }

  // 更新课程学生数量
  async updateStudentCount(courseId: number, increment: number = 1): Promise<Course | null> {
    const query = `
      UPDATE ${this.tableName} 
      SET current_students = current_students + $1
      WHERE id = $2 AND current_students + $1 <= max_students
      RETURNING *
    `;
    const result = await this.query(query, [increment, courseId]);
    return result.rows[0] || null;
  }

  // 检查课程是否还有名额
  async hasAvailableSlots(courseId: number): Promise<boolean> {
    const query = `
      SELECT current_students < max_students as has_slots
      FROM ${this.tableName} 
      WHERE id = $1
    `;
    const result = await this.query(query, [courseId]);
    return result.rows[0]?.has_slots || false;
  }

  // 获取课程统计
  async getCourseStats(): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
        COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        SUM(current_students) as total_students,
        AVG(price) as avg_price
      FROM ${this.tableName}
    `;
    const result = await this.query(query);
    return result.rows[0];
  }
}
