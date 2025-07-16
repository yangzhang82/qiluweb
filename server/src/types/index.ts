export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  avatar?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: Date;
  updated_at: Date;
}

export interface News {
  id: number;
  title: string;
  content: string;
  summary?: string;
  author_id: number;
  category: string;
  tags: string[];
  featured_image?: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  teacher_id: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // 课程时长（分钟）
  max_students: number;
  current_students: number;
  price: number;
  status: 'active' | 'inactive' | 'completed';
  start_date: Date;
  end_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Enrollment {
  id: number;
  student_name: string;
  student_email: string;
  student_phone: string;
  parent_name?: string;
  parent_phone?: string;
  grade: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: Date;
  updated_at: Date;
}

export interface Resume {
  id: number;
  applicant_name: string;
  email: string;
  phone: string;
  position: string;
  education: string;
  experience: string;
  skills: string[];
  file_path?: string;
  ai_score?: number;
  ai_analysis?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  created_at: Date;
  updated_at: Date;
}

export interface Content {
  id: number;
  title: string;
  content: string;
  type: 'page' | 'section' | 'widget';
  category: string;
  language: 'zh' | 'en';
  meta_title?: string;
  meta_description?: string;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
