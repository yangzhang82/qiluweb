import { BaseModel } from './BaseModel';
import { Resume } from '../types';

export class ResumeModel extends BaseModel {
  constructor() {
    super('resumes');
  }

  // 根据状态获取简历
  async getResumesByStatus(status: string): Promise<Resume[]> {
    return await this.findAll('status = $1', [status]);
  }

  // 获取待处理的简历
  async getPendingResumes(): Promise<Resume[]> {
    return await this.getResumesByStatus('pending');
  }

  // 获取已筛选的简历
  async getShortlistedResumes(): Promise<Resume[]> {
    return await this.getResumesByStatus('shortlisted');
  }

  // 根据职位获取简历
  async getResumesByPosition(position: string): Promise<Resume[]> {
    return await this.findAll('position = $1', [position]);
  }

  // 更新简历状态
  async updateStatus(id: number, status: string): Promise<Resume | null> {
    return await this.update(id, { status });
  }

  // 更新AI评分和分析
  async updateAIAnalysis(id: number, score: number, analysis: string): Promise<Resume | null> {
    return await this.update(id, { 
      ai_score: score, 
      ai_analysis: analysis 
    });
  }

  // 根据邮箱查找简历
  async findByEmail(email: string): Promise<Resume[]> {
    return await this.findAll('email = $1', [email]);
  }

  // 搜索简历
  async searchResumes(keyword: string): Promise<Resume[]> {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE applicant_name ILIKE $1 
      OR email ILIKE $1 
      OR position ILIKE $1
      OR education ILIKE $1
      OR experience ILIKE $1
      ORDER BY created_at DESC
    `;
    const result = await this.query(query, [`%${keyword}%`]);
    return result.rows;
  }

  // 根据技能搜索简历
  async searchBySkills(skills: string[]): Promise<Resume[]> {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE skills && $1
      ORDER BY ai_score DESC NULLS LAST, created_at DESC
    `;
    const result = await this.query(query, [skills]);
    return result.rows;
  }

  // 获取高分简历
  async getHighScoreResumes(minScore: number = 7.0): Promise<Resume[]> {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE ai_score >= $1
      ORDER BY ai_score DESC, created_at DESC
    `;
    const result = await this.query(query, [minScore]);
    return result.rows;
  }

  // 获取简历统计
  async getResumeStats(): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'reviewed' THEN 1 END) as reviewed,
        COUNT(CASE WHEN status = 'shortlisted' THEN 1 END) as shortlisted,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
        AVG(ai_score) as avg_score,
        COUNT(CASE WHEN ai_score >= 8.0 THEN 1 END) as high_score_count
      FROM ${this.tableName}
    `;
    const result = await this.query(query);
    return result.rows[0];
  }

  // 按职位统计简历
  async getResumeStatsByPosition(): Promise<any[]> {
    const query = `
      SELECT 
        position,
        COUNT(*) as count,
        AVG(ai_score) as avg_score,
        COUNT(CASE WHEN status = 'shortlisted' THEN 1 END) as shortlisted_count
      FROM ${this.tableName}
      GROUP BY position
      ORDER BY count DESC
    `;
    const result = await this.query(query);
    return result.rows;
  }
}
