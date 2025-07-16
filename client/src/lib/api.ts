import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 添加认证token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 清除token并重定向到登录页
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// API接口定义
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (userData: any) =>
    api.post('/auth/register', userData),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
};

export const newsAPI = {
  getNews: (params?: any) =>
    api.get('/news', { params }),
  getNewsById: (id: string) =>
    api.get(`/news/${id}`),
  createNews: (newsData: any) =>
    api.post('/news', newsData),
  updateNews: (id: string, newsData: any) =>
    api.put(`/news/${id}`, newsData),
  deleteNews: (id: string) =>
    api.delete(`/news/${id}`),
};

export const contentAPI = {
  getContents: (params?: any) =>
    api.get('/content', { params }),
  getContentById: (id: string) =>
    api.get(`/content/${id}`),
  createContent: (contentData: any) =>
    api.post('/content', contentData),
  updateContent: (id: string, contentData: any) =>
    api.put(`/content/${id}`, contentData),
};

export const enrollmentAPI = {
  submitEnrollment: (enrollmentData: any) =>
    api.post('/enrollment', enrollmentData),
  getEnrollments: (params?: any) =>
    api.get('/enrollment', { params }),
  updateEnrollmentStatus: (id: string, status: string) =>
    api.patch(`/enrollment/${id}/status`, { status }),
};

export const courseAPI = {
  getCourses: (params?: any) =>
    api.get('/courses', { params }),
  getCourseById: (id: string) =>
    api.get(`/courses/${id}`),
  createCourse: (courseData: any) =>
    api.post('/courses', courseData),
  updateCourse: (id: string, courseData: any) =>
    api.put(`/courses/${id}`, courseData),
};

export const recruitmentAPI = {
  submitResume: (resumeData: any) =>
    api.post('/recruitment/resume', resumeData),
  getResumes: (params?: any) =>
    api.get('/recruitment/resumes', { params }),
  updateResumeStatus: (id: string, status: string) =>
    api.patch(`/recruitment/resumes/${id}/status`, { status }),
};

export const aiAPI = {
  chat: (message: string) =>
    api.post('/ai/chat', { message }),
  classifyContent: (content: string) =>
    api.post('/ai/classify', { content }),
  generateSummary: (content: string) =>
    api.post('/ai/summarize', { content }),
  generateTags: (content: string) =>
    api.post('/ai/tags', { content }),
  getRecommendations: (params?: any) =>
    api.get('/ai/recommendations', { params }),
};

export default api;
