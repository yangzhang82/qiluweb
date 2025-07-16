import { getRedis } from '../config/redis';

export class AIService {
  private redis: any;

  constructor() {
    this.redis = getRedis();
  }

  // AI聊天机器人
  async chat(message: string, userId?: number): Promise<string> {
    try {
      // 缓存检查
      const cacheKey = `chat:${Buffer.from(message).toString('base64')}`;
      const cached = await this.getCachedResult(cacheKey);
      if (cached) {
        return cached;
      }

      // 智能回复逻辑
      const response = await this.generateIntelligentResponse(message);

      // 缓存结果
      await this.cacheResult(cacheKey, response, 3600); // 缓存1小时

      return response;
    } catch (error) {
      console.error('AI Chat Error:', error);
      return '抱歉，我暂时无法回答您的问题，请稍后再试或联系人工客服。';
    }
  }

  // 生成智能回复
  private async generateIntelligentResponse(message: string): Promise<string> {
    // 预定义的知识库
    const knowledgeBase = {
      '招生': {
        keywords: ['招生', '报名', '入学', '申请', '录取'],
        responses: [
          '我校全年招生，欢迎优秀学子加入齐鲁国际学校大家庭！',
          '招生流程：在线申请 → 材料审核 → 入学测试 → 面试 → 录取通知',
          '具体招生信息请查看招生简章或联系招生办：400-123-4567'
        ]
      },
      '学费': {
        keywords: ['学费', '费用', '收费', '价格', '多少钱'],
        responses: [
          '我校学费根据年级不同有所差异：',
          '小学部：每年3.8万元',
          '初中部：每年4.5万元',
          '高中部：每年5.2万元',
          '详细收费标准请咨询招生办公室：400-123-4567'
        ]
      },
      '课程': {
        keywords: ['课程', '教学', '学科', '专业', '科目'],
        responses: [
          '我校开设丰富多样的课程体系：',
          '• 基础学科：语文、数学、英语、物理、化学、生物等',
          '• 特色课程：STEM教育、艺术课程、体育课程',
          '• 国际课程：AP课程、A-Level课程、IB课程',
          '满足不同学生的学习需求和发展方向'
        ]
      },
      '师资': {
        keywords: ['师资', '老师', '教师', '教授', '教学团队'],
        responses: [
          '我校拥有一支高素质的教师队伍：',
          '• 200+优秀教师，师生比1:8',
          '• 80%教师具有硕士以上学历',
          '• 30%教师具有海外留学背景',
          '• 多名教师获得省市级教学能手称号'
        ]
      },
      '设施': {
        keywords: ['设施', '环境', '校园', '硬件', '条件'],
        responses: [
          '我校拥有现代化的教学设施：',
          '• 智能化教室配备先进多媒体设备',
          '• 实验室、图书馆、体育馆一应俱全',
          '• 学生宿舍温馨舒适，24小时安保',
          '• 绿化覆盖率达60%，环境优美'
        ]
      },
      '地址': {
        keywords: ['地址', '位置', '在哪', '怎么去', '交通'],
        responses: [
          '学校地址：山东省济南市历下区齐鲁大道123号',
          '交通便利：',
          '• 地铁：3号线齐鲁站A出口步行5分钟',
          '• 公交：多路公交直达',
          '• 自驾：济青高速齐鲁出口',
          '欢迎预约参观校园！'
        ]
      },
      '联系': {
        keywords: ['联系', '电话', '咨询', '客服', '邮箱'],
        responses: [
          '联系方式：',
          '📞 招生热线：400-123-4567',
          '📧 邮箱：info@qilu.edu.cn',
          '🕐 工作时间：周一至周五 9:00-17:00',
          '💬 在线咨询：官网客服（24小时）'
        ]
      }
    };

    // 情感分析和意图识别
    const intent = this.analyzeIntent(message);

    // 关键词匹配
    for (const [category, data] of Object.entries(knowledgeBase)) {
      if (data.keywords.some(keyword => message.includes(keyword))) {
        const responses = data.responses;
        return responses.join('\n');
      }
    }

    // 通用回复
    const genericResponses = [
      '感谢您对齐鲁国际学校的关注！',
      '如需了解更多信息，请：',
      '📞 拨打招生热线：400-123-4567',
      '📧 发送邮件至：info@qilu.edu.cn',
      '🌐 访问官网了解详情',
      '我们的专业顾问会为您详细解答！'
    ];

    return genericResponses.join('\n');
  }

  // 意图分析
  private analyzeIntent(message: string): string {
    const intents = {
      'question': ['什么', '如何', '怎么', '为什么', '哪里', '?', '？'],
      'request': ['我想', '我要', '请', '帮我', '能否'],
      'greeting': ['你好', '您好', 'hello', 'hi', '早上好', '下午好'],
      'thanks': ['谢谢', '感谢', 'thank', '谢了']
    };

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase()))) {
        return intent;
      }
    }

    return 'unknown';
  }

  // 内容自动分类
  async classifyContent(content: string): Promise<string> {
    try {
      // 缓存检查
      const cacheKey = `classify:${Buffer.from(content.substring(0, 100)).toString('base64')}`;
      const cached = await this.getCachedResult(cacheKey);
      if (cached) {
        return cached;
      }

      // 高级分类逻辑
      const classification = this.performAdvancedClassification(content);

      // 缓存结果
      await this.cacheResult(cacheKey, classification, 7200); // 缓存2小时

      return classification;
    } catch (error) {
      console.error('Content Classification Error:', error);
      return '未分类';
    }
  }

  // 高级内容分类
  private performAdvancedClassification(content: string): string {
    const categories = {
      '校园新闻': {
        keywords: ['开学', '典礼', '活动', '校园', '学生', '新学期', '毕业', '入学'],
        weight: 1.0,
        patterns: [/开学典礼/, /校园活动/, /学生.*活动/, /新学期/]
      },
      '学术成就': {
        keywords: ['竞赛', '获奖', '成绩', '考试', '学术', '奖项', '比赛', '优异'],
        weight: 1.0,
        patterns: [/获得.*奖/, /竞赛.*成绩/, /学术.*成果/, /考试.*优异/]
      },
      '国际交流': {
        keywords: ['国际', '交流', '合作', '海外', '留学', '外教', '姐妹学校', '访问'],
        weight: 1.0,
        patterns: [/国际.*交流/, /海外.*项目/, /外国.*学校/, /国际.*合作/]
      },
      '招生信息': {
        keywords: ['招生', '报名', '入学', '录取', '申请', '招收', '名额'],
        weight: 1.0,
        patterns: [/招生.*简章/, /报名.*流程/, /入学.*要求/, /录取.*通知/]
      },
      '师资介绍': {
        keywords: ['教师', '老师', '师资', '教授', '教学', '名师', '教育'],
        weight: 1.0,
        patterns: [/教师.*介绍/, /师资.*力量/, /名师.*风采/, /教学.*团队/]
      },
      '课程介绍': {
        keywords: ['课程', '教学', '学科', '专业', '科目', '课堂', '教材'],
        weight: 1.0,
        patterns: [/课程.*设置/, /教学.*内容/, /学科.*建设/, /专业.*介绍/]
      },
      '校园设施': {
        keywords: ['设施', '建设', '图书馆', '实验室', '体育馆', '宿舍', '食堂'],
        weight: 1.0,
        patterns: [/设施.*建设/, /校园.*环境/, /硬件.*设备/, /基础.*设施/]
      },
      '科技创新': {
        keywords: ['科技', '创新', '发明', '专利', '研发', '技术', '智能'],
        weight: 1.0,
        patterns: [/科技.*创新/, /技术.*研发/, /创新.*项目/, /智能.*系统/]
      }
    };

    let bestCategory = '其他';
    let maxScore = 0;

    for (const [category, config] of Object.entries(categories)) {
      let score = 0;

      // 关键词匹配得分
      const keywordMatches = config.keywords.filter(keyword =>
        content.toLowerCase().includes(keyword.toLowerCase())
      ).length;
      score += keywordMatches * config.weight;

      // 正则模式匹配得分
      const patternMatches = config.patterns.filter(pattern =>
        pattern.test(content)
      ).length;
      score += patternMatches * 2; // 模式匹配权重更高

      // 词频分析
      const wordFrequency = this.calculateWordFrequency(content, config.keywords);
      score += wordFrequency * 0.5;

      if (score > maxScore) {
        maxScore = score;
        bestCategory = category;
      }
    }

    return maxScore > 0 ? bestCategory : '其他';
  }

  // 计算词频
  private calculateWordFrequency(content: string, keywords: string[]): number {
    const words = content.toLowerCase().split(/\s+/);
    let frequency = 0;

    keywords.forEach(keyword => {
      const count = words.filter(word => word.includes(keyword.toLowerCase())).length;
      frequency += count;
    });

    return frequency;
  }

  // 生成内容摘要
  async generateSummary(content: string, maxLength: number = 100): Promise<string> {
    try {
      // 缓存检查
      const cacheKey = `summary:${Buffer.from(content.substring(0, 200)).toString('base64')}:${maxLength}`;
      const cached = await this.getCachedResult(cacheKey);
      if (cached) {
        return cached;
      }

      // 智能摘要生成
      const summary = this.generateIntelligentSummary(content, maxLength);

      // 缓存结果
      await this.cacheResult(cacheKey, summary, 3600);

      return summary;
    } catch (error) {
      console.error('Summary Generation Error:', error);
      return content.substring(0, maxLength) + '...';
    }
  }

  // 智能摘要生成
  private generateIntelligentSummary(content: string, maxLength: number): string {
    // 预处理：清理内容
    const cleanContent = content
      .replace(/\s+/g, ' ')
      .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s，。！？；：""''（）]/g, '')
      .trim();

    // 分句
    const sentences = cleanContent
      .split(/[。！？.!?]/)
      .map(s => s.trim())
      .filter(s => s.length > 5); // 过滤太短的句子

    if (sentences.length === 0) {
      return cleanContent.substring(0, maxLength) + '...';
    }

    // 句子评分
    const scoredSentences = sentences.map((sentence, index) => ({
      sentence,
      score: this.scoreSentence(sentence, index, sentences.length, cleanContent),
      index
    }));

    // 按分数排序
    scoredSentences.sort((a, b) => b.score - a.score);

    // 选择最佳句子组合
    let summary = '';
    let currentLength = 0;
    const selectedSentences: typeof scoredSentences = [];

    for (const item of scoredSentences) {
      const sentenceLength = item.sentence.length + 1; // +1 for punctuation
      if (currentLength + sentenceLength <= maxLength) {
        selectedSentences.push(item);
        currentLength += sentenceLength;
      }
    }

    // 按原始顺序重新排列
    selectedSentences.sort((a, b) => a.index - b.index);

    // 构建摘要
    summary = selectedSentences.map(item => item.sentence).join('。');

    // 确保以句号结尾
    if (summary && !summary.endsWith('。') && !summary.endsWith('！') && !summary.endsWith('？')) {
      summary += '。';
    }

    // 如果摘要太长，截断并添加省略号
    if (summary.length > maxLength) {
      summary = summary.substring(0, maxLength - 3) + '...';
    }

    return summary || cleanContent.substring(0, maxLength) + '...';
  }

  // 句子评分算法
  private scoreSentence(sentence: string, position: number, totalSentences: number, fullContent: string): number {
    let score = 0;

    // 位置权重：开头和结尾的句子权重更高
    if (position === 0) {
      score += 3; // 第一句话权重最高
    } else if (position === totalSentences - 1) {
      score += 2; // 最后一句话权重较高
    } else if (position < totalSentences * 0.3) {
      score += 1; // 前30%的句子权重较高
    }

    // 长度权重：适中长度的句子权重更高
    const length = sentence.length;
    if (length >= 10 && length <= 50) {
      score += 2;
    } else if (length >= 5 && length <= 80) {
      score += 1;
    }

    // 关键词权重
    const keywords = ['学校', '学生', '教育', '课程', '教师', '国际', '优秀', '成绩', '活动', '发展'];
    const keywordCount = keywords.filter(keyword => sentence.includes(keyword)).length;
    score += keywordCount * 0.5;

    // 数字和具体信息权重
    if (/\d+/.test(sentence)) {
      score += 1;
    }

    // 避免重复内容
    const words = sentence.split('');
    const uniqueWords = new Set(words);
    const uniqueRatio = uniqueWords.size / words.length;
    score += uniqueRatio;

    return score;
  }

  // 生成内容标签
  async generateTags(content: string): Promise<string[]> {
    try {
      // 缓存检查
      const cacheKey = `tags:${Buffer.from(content.substring(0, 200)).toString('base64')}`;
      const cached = await this.getCachedResult(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      // 智能标签生成
      const tags = this.generateIntelligentTags(content);

      // 缓存结果
      await this.cacheResult(cacheKey, JSON.stringify(tags), 3600);

      return tags;
    } catch (error) {
      console.error('Tag Generation Error:', error);
      return [];
    }
  }

  // 智能标签生成
  private generateIntelligentTags(content: string): string[] {
    const tagCategories = {
      '教育类': {
        tags: ['教育', '学习', '教学', '培养', '素质教育', '全面发展'],
        patterns: [/教育/, /学习/, /教学/, /培养/]
      },
      '学校类': {
        tags: ['学校', '校园', '齐鲁', '国际学校', '校园生活', '学校文化'],
        patterns: [/学校/, /校园/, /齐鲁/, /国际/]
      },
      '学生类': {
        tags: ['学生', '同学', '青少年', '学子', '学生活动', '学生成长'],
        patterns: [/学生/, /同学/, /青少年/, /学子/]
      },
      '教师类': {
        tags: ['教师', '老师', '师资', '教授', '名师', '教学团队'],
        patterns: [/教师/, /老师/, /师资/, /教授/]
      },
      '课程类': {
        tags: ['课程', '学科', '专业', '科目', '课堂', '教材', '课程体系'],
        patterns: [/课程/, /学科/, /专业/, /科目/]
      },
      '活动类': {
        tags: ['活动', '比赛', '竞赛', '表演', '展示', '交流', '实践'],
        patterns: [/活动/, /比赛/, /竞赛/, /表演/, /展示/]
      },
      '成就类': {
        tags: ['获奖', '成绩', '优秀', '杰出', '卓越', '成就', '荣誉'],
        patterns: [/获奖/, /成绩/, /优秀/, /杰出/, /卓越/]
      },
      '国际类': {
        tags: ['国际', '海外', '留学', '交流', '合作', '全球', '世界'],
        patterns: [/国际/, /海外/, /留学/, /交流/, /合作/]
      },
      '科技类': {
        tags: ['科技', '创新', '技术', '智能', 'AI', '数字化', '现代化'],
        patterns: [/科技/, /创新/, /技术/, /智能/, /AI/, /数字/]
      },
      '招生类': {
        tags: ['招生', '报名', '入学', '录取', '申请', '招收'],
        patterns: [/招生/, /报名/, /入学/, /录取/, /申请/]
      }
    };

    const extractedTags: { tag: string; score: number }[] = [];

    // 基于分类提取标签
    for (const [category, config] of Object.entries(tagCategories)) {
      let categoryScore = 0;

      // 模式匹配
      config.patterns.forEach(pattern => {
        const matches = content.match(new RegExp(pattern.source, 'g'));
        if (matches) {
          categoryScore += matches.length;
        }
      });

      // 如果该分类有匹配，添加相关标签
      if (categoryScore > 0) {
        config.tags.forEach(tag => {
          const tagScore = this.calculateTagScore(tag, content, categoryScore);
          if (tagScore > 0) {
            extractedTags.push({ tag, score: tagScore });
          }
        });
      }
    }

    // 提取专有名词作为标签
    const properNouns = this.extractProperNouns(content);
    properNouns.forEach(noun => {
      extractedTags.push({ tag: noun, score: 2 });
    });

    // 按分数排序并去重
    const uniqueTags = new Map<string, number>();
    extractedTags.forEach(({ tag, score }) => {
      if (uniqueTags.has(tag)) {
        uniqueTags.set(tag, Math.max(uniqueTags.get(tag)!, score));
      } else {
        uniqueTags.set(tag, score);
      }
    });

    // 转换为数组并排序
    const sortedTags = Array.from(uniqueTags.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);

    // 返回前8个标签
    return sortedTags.slice(0, 8);
  }

  // 计算标签分数
  private calculateTagScore(tag: string, content: string, baseScore: number): number {
    let score = 0;

    // 直接匹配
    const directMatches = (content.match(new RegExp(tag, 'g')) || []).length;
    score += directMatches * 2;

    // 相关词匹配
    const relatedWords = this.getRelatedWords(tag);
    relatedWords.forEach(word => {
      const matches = (content.match(new RegExp(word, 'g')) || []).length;
      score += matches * 0.5;
    });

    // 基础分类分数
    score += baseScore * 0.3;

    return score;
  }

  // 获取相关词
  private getRelatedWords(tag: string): string[] {
    const relatedWordsMap: Record<string, string[]> = {
      '教育': ['培养', '教学', '育人', '成长'],
      '学生': ['同学', '学子', '青少年', '孩子'],
      '教师': ['老师', '教授', '导师', '教员'],
      '课程': ['学科', '科目', '专业', '教材'],
      '活动': ['比赛', '竞赛', '表演', '实践'],
      '国际': ['海外', '全球', '世界', '跨国'],
      '科技': ['技术', '创新', '智能', '现代'],
    };

    return relatedWordsMap[tag] || [];
  }

  // 提取专有名词
  private extractProperNouns(content: string): string[] {
    const properNouns: string[] = [];

    // 提取可能的专有名词（大写字母开头的词组）
    const matches = content.match(/[A-Z][a-zA-Z]+/g);
    if (matches) {
      matches.forEach(match => {
        if (match.length >= 2 && match.length <= 10) {
          properNouns.push(match);
        }
      });
    }

    // 提取中文专有名词（特定模式）
    const chineseMatches = content.match(/[一-九十百千万]+[年月日]|[0-9]+[年月日]/g);
    if (chineseMatches) {
      properNouns.push(...chineseMatches);
    }

    return [...new Set(properNouns)]; // 去重
  }

  // 内容推荐
  async getContentRecommendations(userId?: number, category?: string): Promise<any[]> {
    try {
      // 这里应该基于用户行为和内容相似度进行推荐
      // 目前返回模拟数据
      return [
        { id: 1, title: '推荐内容1', category: '校园新闻' },
        { id: 2, title: '推荐内容2', category: '学术成就' },
        { id: 3, title: '推荐内容3', category: '国际交流' }
      ];
    } catch (error) {
      console.error('Content Recommendation Error:', error);
      return [];
    }
  }

  // 简历分析
  async analyzeResume(resumeText: string): Promise<{ score: number; analysis: string }> {
    try {
      // 简单的简历评分逻辑
      let score = 5.0; // 基础分
      const analysis = [];

      // 教育背景评分
      if (resumeText.includes('博士') || resumeText.includes('PhD')) {
        score += 2.0;
        analysis.push('具有博士学位，学术背景优秀');
      } else if (resumeText.includes('硕士') || resumeText.includes('Master')) {
        score += 1.5;
        analysis.push('具有硕士学位，教育背景良好');
      } else if (resumeText.includes('本科') || resumeText.includes('Bachelor')) {
        score += 1.0;
        analysis.push('具有本科学位');
      }

      // 工作经验评分
      const experienceMatch = resumeText.match(/(\d+)年.*经验/);
      if (experienceMatch) {
        const years = parseInt(experienceMatch[1]);
        if (years >= 5) {
          score += 1.5;
          analysis.push(`具有${years}年丰富工作经验`);
        } else if (years >= 2) {
          score += 1.0;
          analysis.push(`具有${years}年工作经验`);
        } else {
          score += 0.5;
          analysis.push(`具有${years}年工作经验`);
        }
      }

      // 技能评分
      const skills = ['教学', '管理', '研究', '英语', '计算机'];
      const foundSkills = skills.filter(skill => resumeText.includes(skill));
      score += foundSkills.length * 0.3;
      if (foundSkills.length > 0) {
        analysis.push(`掌握技能：${foundSkills.join('、')}`);
      }

      // 确保分数在合理范围内
      score = Math.min(10, Math.max(1, score));

      return {
        score: Math.round(score * 10) / 10,
        analysis: analysis.join('；')
      };
    } catch (error) {
      console.error('Resume Analysis Error:', error);
      return {
        score: 5.0,
        analysis: '简历分析出现错误，请人工审核'
      };
    }
  }

  // 缓存AI结果
  async cacheResult(key: string, result: any, ttl: number = 3600): Promise<void> {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(result));
    } catch (error) {
      console.error('Cache Error:', error);
    }
  }

  // 获取缓存的AI结果
  async getCachedResult(key: string): Promise<any | null> {
    try {
      const cached = await this.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache Retrieval Error:', error);
      return null;
    }
  }
}
