import { Pool } from 'pg';

let pool: Pool;

export const connectDatabase = async (): Promise<void> => {
  try {
    // 在开发环境中，如果没有数据库，跳过连接
    if (process.env.NODE_ENV === 'development' && !process.env.DB_PASSWORD) {
      console.log('⚠️  数据库未配置，使用模拟模式');
      return;
    }

    pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'qilu_school_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // 测试连接
    await pool.query('SELECT NOW()');
  } catch (error) {
    console.error('数据库连接失败:', error);
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  开发环境数据库连接失败，继续运行（模拟模式）');
      return;
    }
    throw error;
  }
};

export const getPool = (): Pool => {
  if (!pool) {
    // 如果没有初始化，创建一个模拟的连接池用于开发
    console.warn('数据库未初始化，使用模拟连接池');
    pool = new Pool({
      host: 'localhost',
      port: 5432,
      database: 'qilu_school',
      user: 'postgres',
      password: 'password',
      max: 1,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return pool;
};

export const closeDatabase = async (): Promise<void> => {
  if (pool) {
    await pool.end();
  }
};
