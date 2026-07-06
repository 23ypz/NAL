USE academic_light;

-- 演示账号密码均为：Admin123!
INSERT INTO users (full_name, email, password_hash, role, college, major, bio, expertise_tags)
VALUES
('系统管理员', 'admin@academic-light.test', '$2a$10$yLECkCmZJLdnOjFkMrDXFuMh35vj0IadB1iKsFcfoTmyaKOA1NVUa', 'admin', NULL, NULL, '系统默认管理员账号', '系统管理'),
('王老师', 'mentor@academic-light.test', '$2a$10$yLECkCmZJLdnOjFkMrDXFuMh35vj0IadB1iKsFcfoTmyaKOA1NVUa', 'mentor', '计算机学院', '软件工程', '负责竞赛与科研项目指导', '软件工程,数据库,竞赛指导'),
('张同学', 'student@academic-light.test', '$2a$10$yLECkCmZJLdnOjFkMrDXFuMh35vj0IadB1iKsFcfoTmyaKOA1NVUa', 'student', '计算机学院', '计算机科学与技术', '关注科研训练与学科竞赛', '前端开发,算法,科研训练')
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  role = VALUES(role),
  college = VALUES(college),
  major = VALUES(major),
  bio = VALUES(bio),
  expertise_tags = VALUES(expertise_tags);

INSERT INTO competitions (
  name, level, category, description, organizer, event_time, registration_time,
  knowledge_areas, historical_topics, growth_trend, popularity_score, view_count, favorite_count, created_by, updated_by
)
SELECT
  '大学生软件设计竞赛', 'A', '软件工程', '面向大学生的软件项目设计与开发竞赛，鼓励团队完成完整的软件分析、设计、实现与测试。',
  '计算机学院', '2026年10月', '2026-09-10',
  '需求分析、系统设计、数据库、软件测试', '历年题目包括校园服务系统、知识库系统、票务系统等。',
  'normal', 8.8, 120, 0, u.id, u.id
FROM users u
WHERE u.email = 'mentor@academic-light.test'
  AND NOT EXISTS (SELECT 1 FROM competitions c WHERE c.name = '大学生软件设计竞赛');

INSERT INTO research_projects (title, college, field, stage, lab, plan, summary, team_size, created_by)
SELECT
  '校园学术资源协同管理系统优化研究', '计算机学院', 'Web系统开发', '课题招募', '软件工程实验室',
  '完成需求分析、数据库优化、前后端联调和系统测试。',
  '围绕竞赛、科研、保研与讨论交流场景开展系统优化。', 4, u.id
FROM users u
WHERE u.email = 'mentor@academic-light.test'
  AND NOT EXISTS (SELECT 1 FROM research_projects rp WHERE rp.title = '校园学术资源协同管理系统优化研究');

INSERT INTO postgraduate_posts (title, college, category, stage, highlight, resources, deadline, created_by)
SELECT
  '计算机学院保研准备经验分享', '计算机学院', '经验分享', '资料收集',
  '建议尽早整理成绩单、竞赛经历、科研项目和个人陈述。',
  '简历模板、面试汇报结构、材料清单', '2026-09-01', u.id
FROM users u
WHERE u.email = 'mentor@academic-light.test'
  AND NOT EXISTS (SELECT 1 FROM postgraduate_posts pp WHERE pp.title = '计算机学院保研准备经验分享');

INSERT INTO discussion_posts (title, content, college, tags, created_by)
SELECT
  '如何准备大型软件项目答辩？',
  '建议重点展示项目背景、需求分析、UML设计、数据库设计、核心功能演示和测试结果。',
  '计算机学院', '课程项目,答辩,软件工程', u.id
FROM users u
WHERE u.email = 'student@academic-light.test'
  AND NOT EXISTS (SELECT 1 FROM discussion_posts dp WHERE dp.title = '如何准备大型软件项目答辩？');

INSERT INTO system_configs (module_name, config_key, config_value, value_type, description)
VALUES
('competition', 'hot_view_count', '100', 'number', '竞赛浏览量达到该值后可视为热门竞赛'),
('competition', 'deadline_warn_days', '7', 'number', '竞赛截止前提醒天数'),
('research', 'max_apply_count', '3', 'number', '学生最多可同时申请的科研项目数量'),
('security', 'password_min_length', '6', 'number', '用户密码最小长度'),
('security', 'token_expire_hours', '168', 'number', '登录令牌有效小时数')
ON DUPLICATE KEY UPDATE
  config_value = VALUES(config_value),
  value_type = VALUES(value_type),
  description = VALUES(description);
