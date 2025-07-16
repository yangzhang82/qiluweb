export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  avatar?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
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
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  teacher_id: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  max_students: number;
  current_students: number;
  price: number;
  status: 'active' | 'inactive' | 'completed';
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
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

export interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: string;
  isUser: boolean;
}

export interface MenuItem {
  key: string;
  label: string;
  href: string;
  children?: MenuItem[];
}

export interface HeroSection {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
}

export interface FeatureCard {
  icon: string;
  title: string;
  description: string;
  link?: string;
}

export interface TestimonialCard {
  name: string;
  role: string;
  content: string;
  avatar?: string;
  rating: number;
}
