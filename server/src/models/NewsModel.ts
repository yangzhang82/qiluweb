import { BaseModel } from './BaseModel';
import { News } from '../types';

export class NewsModel extends BaseModel {
  constructor() {
    super('news');
  }

  // 获取已发布的新闻
  async getPublishedNews(): Promise<News[]> {
    return await this.findAll('status = $1', ['published']);
  }

  // 根据分类获取新闻
  async getNewsByCategory(category: string): Promise<News[]> {
    return await this.findAll('category = $1 AND status = $2', [category, 'published']);
  }

  // 获取置顶新闻
  async getFeaturedNews(limit: number = 5): Promise<News[]> {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE status = 'published' AND featured_image IS NOT NULL
      ORDER BY published_at DESC 
      LIMIT $1
    `;
    const result = await this.query(query, [limit]);
    return result.rows;
  }

  // 搜索新闻
  async searchNews(keyword: string): Promise<News[]> {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE status = 'published' 
      AND (title ILIKE $1 OR content ILIKE $1 OR summary ILIKE $1)
      ORDER BY published_at DESC
    `;
    const result = await this.query(query, [`%${keyword}%`]);
    return result.rows;
  }

  // 根据标签获取新闻
  async getNewsByTag(tag: string): Promise<News[]> {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE status = 'published' AND $1 = ANY(tags)
      ORDER BY published_at DESC
    `;
    const result = await this.query(query, [tag]);
    return result.rows;
  }

  // 获取相关新闻
  async getRelatedNews(newsId: number, category: string, limit: number = 5): Promise<News[]> {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE id != $1 AND category = $2 AND status = 'published'
      ORDER BY published_at DESC 
      LIMIT $3
    `;
    const result = await this.query(query, [newsId, category, limit]);
    return result.rows;
  }

  // 发布新闻
  async publishNews(id: number): Promise<News | null> {
    return await this.update(id, { 
      status: 'published', 
      published_at: new Date() 
    });
  }

  // 获取新闻统计
  async getNewsStats(): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'published' THEN 1 END) as published,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft,
        COUNT(CASE WHEN status = 'archived' THEN 1 END) as archived
      FROM ${this.tableName}
    `;
    const result = await this.query(query);
    return result.rows[0];
  }
}
