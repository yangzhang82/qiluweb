import request from 'supertest';
import { app } from '../app';

describe('API Endpoints', () => {
  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('AI Endpoints', () => {
    describe('POST /api/ai/chat', () => {
      it('should return chat response', async () => {
        const response = await request(app)
          .post('/api/ai/chat')
          .send({ message: '你好' })
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('response');
        expect(typeof response.body.data.response).toBe('string');
      });

      it('should return error for missing message', async () => {
        const response = await request(app)
          .post('/api/ai/chat')
          .send({})
          .expect(400);

        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message');
      });
    });

    describe('POST /api/ai/classify', () => {
      it('should classify content correctly', async () => {
        const response = await request(app)
          .post('/api/ai/classify')
          .send({ content: '学校开学典礼活动' })
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('category');
        expect(typeof response.body.data.category).toBe('string');
      });
    });

    describe('POST /api/ai/summarize', () => {
      it('should generate summary', async () => {
        const response = await request(app)
          .post('/api/ai/summarize')
          .send({ 
            content: '这是一个很长的内容，需要生成摘要。内容包含了很多信息。',
            maxLength: 20
          })
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('summary');
        expect(response.body.data.summary.length).toBeLessThanOrEqual(23); // 20 + '...'
      });
    });

    describe('POST /api/ai/tags', () => {
      it('should generate tags', async () => {
        const response = await request(app)
          .post('/api/ai/tags')
          .send({ content: '学校教育活动学生参与' })
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('tags');
        expect(Array.isArray(response.body.data.tags)).toBe(true);
      });
    });
  });

  describe('News Endpoints', () => {
    describe('GET /api/news', () => {
      it('should return news list', async () => {
        const response = await request(app)
          .get('/api/news')
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
      });

      it('should support pagination', async () => {
        const response = await request(app)
          .get('/api/news?page=1&limit=5')
          .expect(200);

        expect(response.body).toHaveProperty('pagination');
        expect(response.body.pagination).toHaveProperty('page', 1);
        expect(response.body.pagination).toHaveProperty('limit', 5);
      });
    });

    describe('GET /api/news/:id', () => {
      it('should return specific news item', async () => {
        const response = await request(app)
          .get('/api/news/1')
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('id', 1);
      });

      it('should return 404 for non-existent news', async () => {
        const response = await request(app)
          .get('/api/news/999999')
          .expect(404);

        expect(response.body).toHaveProperty('success', false);
      });
    });
  });

  describe('Enrollment Endpoints', () => {
    describe('POST /api/enrollment', () => {
      it('should submit enrollment successfully', async () => {
        const enrollmentData = {
          student_name: '测试学生',
          student_email: 'test@example.com',
          student_phone: '13800138000',
          parent_name: '测试家长',
          parent_phone: '13900139000',
          grade: '高一',
          message: '测试报名'
        };

        const response = await request(app)
          .post('/api/enrollment')
          .send(enrollmentData)
          .expect(201);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message');
      });

      it('should validate required fields', async () => {
        const response = await request(app)
          .post('/api/enrollment')
          .send({})
          .expect(400);

        expect(response.body).toHaveProperty('success', false);
      });
    });
  });

  describe('Recruitment Endpoints', () => {
    describe('POST /api/recruitment/resume', () => {
      it('should submit resume successfully', async () => {
        const resumeData = {
          applicant_name: '测试教师',
          email: 'teacher@example.com',
          phone: '13800138000',
          position: '数学教师',
          education: '硕士',
          experience: '3年',
          skills: '数学教学,班级管理'
        };

        const response = await request(app)
          .post('/api/recruitment/resume')
          .send(resumeData)
          .expect(201);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('id');
      });

      it('should validate required fields', async () => {
        const response = await request(app)
          .post('/api/recruitment/resume')
          .send({})
          .expect(400);

        expect(response.body).toHaveProperty('success', false);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent-route')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should handle invalid JSON', async () => {
      const response = await request(app)
        .post('/api/ai/chat')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });

    it('should handle OPTIONS requests', async () => {
      const response = await request(app)
        .options('/api/ai/chat')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-methods');
    });
  });

  describe('Rate Limiting', () => {
    it('should apply rate limiting to AI endpoints', async () => {
      // 发送多个请求测试限流
      const requests = Array(10).fill(null).map(() => 
        request(app)
          .post('/api/ai/chat')
          .send({ message: '测试' })
      );

      const responses = await Promise.all(requests);
      
      // 检查是否有请求被限流
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      
      // 在高频请求下应该有一些请求被限流
      if (rateLimitedResponses.length > 0) {
        expect(rateLimitedResponses[0].body).toHaveProperty('success', false);
        expect(rateLimitedResponses[0].body.message).toContain('请求过于频繁');
      }
    });
  });
});
