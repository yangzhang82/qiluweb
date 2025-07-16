import { AIService } from '../services/AIService';

describe('AIService', () => {
  let aiService: AIService;

  beforeEach(() => {
    aiService = new AIService();
  });

  describe('chat', () => {
    it('should return appropriate response for recruitment questions', async () => {
      const response = await aiService.chat('我想了解招生信息');
      expect(response).toContain('招生');
      expect(typeof response).toBe('string');
    });

    it('should return appropriate response for tuition questions', async () => {
      const response = await aiService.chat('学费多少钱？');
      expect(response).toContain('学费');
      expect(response).toContain('400-123-4567');
    });

    it('should return generic response for unknown questions', async () => {
      const response = await aiService.chat('今天天气怎么样？');
      expect(response).toContain('感谢您对齐鲁国际学校的关注');
    });
  });

  describe('classifyContent', () => {
    it('should classify campus news correctly', async () => {
      const content = '齐鲁国际学校开学典礼在校园体育馆举行，全校师生参加了活动';
      const category = await aiService.classifyContent(content);
      expect(category).toBe('校园新闻');
    });

    it('should classify academic achievements correctly', async () => {
      const content = '我校学生在全国数学竞赛中获得一等奖，展现了优异的学术成绩';
      const category = await aiService.classifyContent(content);
      expect(category).toBe('学术成就');
    });

    it('should classify international exchange correctly', async () => {
      const content = '我校与美国姐妹学校签署国际交流合作协议，推进国际化教育';
      const category = await aiService.classifyContent(content);
      expect(category).toBe('国际交流');
    });
  });

  describe('generateSummary', () => {
    it('should generate appropriate summary', async () => {
      const content = '齐鲁国际学校是一所优秀的国际化学校。学校拥有先进的教学设施和优秀的师资队伍。我们致力于培养具有国际视野的优秀人才。学校开设了丰富多样的课程，包括基础学科和特色课程。';
      const summary = await aiService.generateSummary(content, 50);
      
      expect(summary.length).toBeLessThanOrEqual(53); // 50 + '...'
      expect(summary).toContain('齐鲁国际学校');
    });

    it('should handle short content', async () => {
      const content = '短内容测试';
      const summary = await aiService.generateSummary(content, 100);
      expect(summary).toBe(content);
    });
  });

  describe('generateTags', () => {
    it('should generate relevant tags', async () => {
      const content = '齐鲁国际学校开展科技创新教育活动，学生们参与机器人竞赛获得优异成绩';
      const tags = await aiService.generateTags(content);
      
      expect(Array.isArray(tags)).toBe(true);
      expect(tags.length).toBeGreaterThan(0);
      expect(tags.length).toBeLessThanOrEqual(8);
      
      // 应该包含相关标签
      const tagString = tags.join(' ');
      expect(tagString).toMatch(/(学校|教育|学生|科技|创新|竞赛)/);
    });

    it('should return empty array for empty content', async () => {
      const tags = await aiService.generateTags('');
      expect(tags).toEqual([]);
    });
  });

  describe('analyzeResume', () => {
    it('should analyze resume and return score and analysis', async () => {
      const resumeText = `
        姓名：张老师
        职位：数学教师
        学历：硕士
        工作经验：5年教学经验
        技能：数学教学、班级管理、课程设计
      `;
      
      const result = await aiService.analyzeResume(resumeText);
      
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('analysis');
      expect(typeof result.score).toBe('number');
      expect(result.score).toBeGreaterThanOrEqual(1);
      expect(result.score).toBeLessThanOrEqual(10);
      expect(typeof result.analysis).toBe('string');
      expect(result.analysis.length).toBeGreaterThan(0);
    });

    it('should give higher score for better qualifications', async () => {
      const highQualityResume = `
        姓名：王博士
        职位：物理教师
        学历：博士
        工作经验：10年教学经验
        技能：物理教学、实验设计、科研指导、英语
      `;
      
      const lowQualityResume = `
        姓名：李老师
        职位：物理教师
        学历：本科
        工作经验：1年经验
        技能：教学
      `;
      
      const highResult = await aiService.analyzeResume(highQualityResume);
      const lowResult = await aiService.analyzeResume(lowQualityResume);
      
      expect(highResult.score).toBeGreaterThan(lowResult.score);
    });
  });

  describe('caching', () => {
    it('should cache and retrieve results', async () => {
      const key = 'test-key';
      const testData = { message: 'test data' };
      
      // 缓存数据
      await aiService.cacheResult(key, testData, 60);
      
      // 获取缓存数据
      const cached = await aiService.getCachedResult(key);
      expect(cached).toEqual(testData);
    });

    it('should return null for non-existent cache', async () => {
      const cached = await aiService.getCachedResult('non-existent-key');
      expect(cached).toBeNull();
    });
  });
});
