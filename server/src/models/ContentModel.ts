import { BaseModel } from './BaseModel';
import { Content } from '../types';

export class ContentModel extends BaseModel {
  constructor() {
    super('contents');
  }

  // 根据类型和语言获取内容
  async getContentByTypeAndLanguage(type: string, language: string = 'zh'): Promise<Content[]> {
    return await this.findAll('type = $1 AND language = $2 AND status = $3', [type, language, 'active']);
  }

  // 根据分类获取内容
  async getContentByCategory(category: string, language: string = 'zh'): Promise<Content[]> {
    return await this.findAll('category = $1 AND language = $2 AND status = $3', [category, language, 'active']);
  }

  // 获取页面内容
  async getPageContent(category: string, language: string = 'zh'): Promise<Content | null> {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE type = 'page' AND category = $1 AND language = $2 AND status = 'active'
      LIMIT 1
    `;
    const result = await this.query(query, [category, language]);
    return result.rows[0] || null;
  }

  // 搜索内容
  async searchContent(keyword: string, language: string = 'zh'): Promise<Content[]> {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE language = $1 AND status = 'active'
      AND (title ILIKE $2 OR content ILIKE $2)
      ORDER BY created_at DESC
    `;
    const result = await this.query(query, [language, `%${keyword}%`]);
    return result.rows;
  }

  // 获取所有活跃内容
  async getActiveContent(language: string = 'zh'): Promise<Content[]> {
    return await this.findAll('language = $1 AND status = $2', [language, 'active']);
  }

  // 根据类型获取内容统计
  async getContentStats(): Promise<any> {
    const query = `
      SELECT 
        type,
        language,
        COUNT(*) as count
      FROM ${this.tableName} 
      WHERE status = 'active'
      GROUP BY type, language
      ORDER BY type, language
    `;
    const result = await this.query(query);
    return result.rows;
  }
}
