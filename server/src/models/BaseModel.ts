import { Pool, QueryResult } from 'pg';
import { getPool } from '../config/database';

export abstract class BaseModel {
  protected pool: Pool;
  protected tableName: string;

  constructor(tableName: string) {
    this.pool = getPool();
    this.tableName = tableName;
  }

  // 通用查询方法
  protected async query(text: string, params?: any[]): Promise<QueryResult> {
    try {
      return await this.pool.query(text, params);
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  // 查找所有记录
  async findAll(conditions?: string, params?: any[]): Promise<any[]> {
    let query = `SELECT * FROM ${this.tableName}`;
    if (conditions) {
      query += ` WHERE ${conditions}`;
    }
    query += ' ORDER BY created_at DESC';
    
    const result = await this.query(query, params);
    return result.rows;
  }

  // 根据ID查找记录
  async findById(id: number): Promise<any | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    const result = await this.query(query, [id]);
    return result.rows[0] || null;
  }

  // 根据UUID查找记录
  async findByUuid(uuid: string): Promise<any | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE uuid = $1`;
    const result = await this.query(query, [uuid]);
    return result.rows[0] || null;
  }

  // 创建记录
  async create(data: Record<string, any>): Promise<any> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
    
    const query = `
      INSERT INTO ${this.tableName} (${keys.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;
    
    const result = await this.query(query, values);
    return result.rows[0];
  }

  // 更新记录
  async update(id: number, data: Record<string, any>): Promise<any | null> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');
    
    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await this.query(query, [id, ...values]);
    return result.rows[0] || null;
  }

  // 删除记录
  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
    const result = await this.query(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  // 分页查询
  async findWithPagination(
    page: number = 1,
    limit: number = 10,
    conditions?: string,
    params?: any[]
  ): Promise<{ data: any[]; total: number; totalPages: number }> {
    const offset = (page - 1) * limit;
    
    // 查询总数
    let countQuery = `SELECT COUNT(*) FROM ${this.tableName}`;
    if (conditions) {
      countQuery += ` WHERE ${conditions}`;
    }
    
    const countResult = await this.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);
    
    // 查询数据
    let dataQuery = `SELECT * FROM ${this.tableName}`;
    if (conditions) {
      dataQuery += ` WHERE ${conditions}`;
    }
    dataQuery += ` ORDER BY created_at DESC LIMIT $${(params?.length || 0) + 1} OFFSET $${(params?.length || 0) + 2}`;
    
    const dataResult = await this.query(dataQuery, [...(params || []), limit, offset]);
    
    return {
      data: dataResult.rows,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  // 检查记录是否存在
  async exists(conditions: string, params: any[]): Promise<boolean> {
    const query = `SELECT 1 FROM ${this.tableName} WHERE ${conditions} LIMIT 1`;
    const result = await this.query(query, params);
    return result.rows.length > 0;
  }
}
