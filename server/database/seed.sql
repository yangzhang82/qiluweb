-- 齐鲁国际学校数据库种子数据

-- 插入管理员用户
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@qilu.edu.cn', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'admin'),
('teacher1', 'teacher1@qilu.edu.cn', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'teacher'),
('student1', 'student1@qilu.edu.cn', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'student');

-- 插入系统配置
INSERT INTO settings (key, value, description) VALUES 
('site_title', '齐鲁国际学校', '网站标题'),
('site_description', '齐鲁国际学校官方网站', '网站描述'),
('contact_email', 'info@qilu.edu.cn', '联系邮箱'),
('contact_phone', '400-123-4567', '联系电话'),
('school_address', '山东省济南市历下区', '学校地址'),
('enrollment_open', 'true', '是否开放报名'),
('ai_enabled', 'true', '是否启用AI功能');

-- 插入内容页面
INSERT INTO contents (title, content, type, category, language) VALUES 
('学校简介', '<h2>齐鲁国际学校简介</h2><p>齐鲁国际学校成立于2010年，是一所集小学、初中、高中为一体的现代化国际学校...</p>', 'page', 'about', 'zh'),
('School Introduction', '<h2>About QiLu International School</h2><p>QiLu International School was founded in 2010...</p>', 'page', 'about', 'en'),
('招生简章', '<h2>2024年招生简章</h2><p>我校2024年秋季招生工作现已开始...</p>', 'page', 'enrollment', 'zh'),
('师资力量', '<h2>优秀的师资团队</h2><p>我校拥有一支高素质的教师队伍...</p>', 'page', 'faculty', 'zh');

-- 插入新闻
INSERT INTO news (title, content, summary, author_id, category, tags, status, published_at) VALUES 
('齐鲁国际学校2024年春季开学典礼圆满举行', 
 '<p>2024年2月26日，齐鲁国际学校2024年春季开学典礼在学校体育馆隆重举行...</p>', 
 '我校2024年春季开学典礼圆满举行，全校师生共同迎接新学期的到来。', 
 1, '校园新闻', ARRAY['开学典礼', '新学期', '校园活动'], 'published', CURRENT_TIMESTAMP),
 
('我校学生在全国数学竞赛中获得优异成绩', 
 '<p>近日，全国中学生数学竞赛结果揭晓，我校多名学生获得优异成绩...</p>', 
 '我校学生在全国数学竞赛中表现出色，多人获奖。', 
 1, '学术成就', ARRAY['数学竞赛', '学生获奖', '学术成就'], 'published', CURRENT_TIMESTAMP),
 
('国际交流项目：与美国姐妹学校签署合作协议', 
 '<p>为进一步推进国际化教育，我校与美国加州某知名高中签署了友好合作协议...</p>', 
 '我校与美国姐妹学校签署合作协议，推进国际化教育发展。', 
 1, '国际交流', ARRAY['国际交流', '合作协议', '国际化教育'], 'published', CURRENT_TIMESTAMP);

-- 插入课程
INSERT INTO courses (title, description, teacher_id, category, level, duration, max_students, price, start_date, end_date) VALUES 
('高中数学强化班', '针对高中生的数学强化训练课程，提升数学思维能力', 2, '数学', 'intermediate', 120, 25, 2000.00, '2024-03-01 09:00:00', '2024-06-30 17:00:00'),
('英语口语提升班', '专注于提升学生英语口语表达能力的课程', 2, '英语', 'beginner', 90, 20, 1500.00, '2024-03-15 14:00:00', '2024-05-15 16:00:00'),
('科学实验探索课', '通过实验培养学生的科学思维和动手能力', 2, '科学', 'intermediate', 150, 15, 2500.00, '2024-04-01 10:00:00', '2024-07-31 12:00:00');

-- 插入示例报名数据
INSERT INTO enrollments (student_name, student_email, student_phone, parent_name, parent_phone, grade, message, status) VALUES 
('张小明', 'zhangxiaoming@example.com', '13800138001', '张大明', '13900139001', '高一', '希望能够进入贵校学习', 'pending'),
('李小红', 'lixiaohong@example.com', '13800138002', '李大红', '13900139002', '初三', '孩子对数学很感兴趣', 'approved'),
('王小强', 'wangxiaoqiang@example.com', '13800138003', '王大强', '13900139003', '高二', '希望能够参加国际交流项目', 'pending');

-- 插入示例简历数据
INSERT INTO resumes (applicant_name, email, phone, position, education, experience, skills, ai_score, status) VALUES 
('陈老师', 'chenlaoshi@example.com', '13700137001', '数学教师', '北京师范大学数学系硕士', '5年中学数学教学经验', ARRAY['数学教学', '班级管理', '学生辅导'], 8.5, 'reviewed'),
('刘老师', 'liulaoshi@example.com', '13700137002', '英语教师', '外国语大学英语专业学士', '3年英语教学经验', ARRAY['英语教学', '口语训练', '国际交流'], 7.8, 'shortlisted'),
('赵老师', 'zhaolaoshi@example.com', '13700137003', '物理教师', '清华大学物理系博士', '8年物理教学和科研经验', ARRAY['物理教学', '实验设计', '科研指导'], 9.2, 'pending');
