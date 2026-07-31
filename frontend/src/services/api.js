import axios from 'axios';

const API = axios.create({
  baseURL: 'https://ai-interview-tracker-backend.onrender.com' ,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getInterviews = () => API.get('/interviews/');
export const createInterview = (data) => API.post('/interviews/', data);
export const updateInterview = (id, data) => API.put(`/interviews/${id}`, data);
export const deleteInterview = (id) => API.delete(`/interviews/${id}`);
export const getQuestions = (topic) => API.get('/questions/', { params: { topic_tag: topic } });
export const createQuestion = (data) => API.post('/questions/', data);
export const deleteQuestion = (id) => API.delete(`/questions/${id}`);
export const getDashboardStats = () => API.get('/dashboard/stats');
export const getProfile = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/me', data);
export const getInsights = (data) => API.post('/dashboard/insights', data);
export const generateInsights = (data) => API.post('/insights/generate', data);
export const getClusteredQuestions = () => API.get('/clustering/');

export default API;