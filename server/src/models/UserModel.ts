import { BaseModel } from './BaseModel';
import { User } from '../types';

export class UserModel extends BaseModel {
  constructor() {
    super('users');
  }

  // 根据邮箱查找用户
  async findByEmail(email: string): Promise<User | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE email = $1`;
    const result = await this.query(query, [email]);
    return result.rows[0] || null;
  }

  // 根据用户名查找用户
  async findByUsername(username: string): Promise<User | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE username = $1`;
    const result = await this.query(query, [username]);
    return result.rows[0] || null;
  }

  // 创建用户
  async createUser(userData: Partial<User>): Promise<User> {
    return await this.create(userData);
  }

  // 更新用户状态
  async updateStatus(id: number, status: string): Promise<User | null> {
    return await this.update(id, { status });
  }

  // 根据角色查找用户
  async findByRole(role: string): Promise<User[]> {
    return await this.findAll('role = $1', [role]);
  }

  // 检查邮箱是否已存在
  async emailExists(email: string): Promise<boolean> {
    return await this.exists('email = $1', [email]);
  }

  // 检查用户名是否已存在
  async usernameExists(username: string): Promise<boolean> {
    return await this.exists('username = $1', [username]);
  }

  // 获取活跃用户
  async getActiveUsers(): Promise<User[]> {
    return await this.findAll('status = $1', ['active']);
  }
}
