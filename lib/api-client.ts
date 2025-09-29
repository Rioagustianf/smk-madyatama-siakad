import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_ENDPOINTS } from "@/lib/constants";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== "undefined") {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      if (typeof window !== "undefined") {
        document.cookie =
          "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/student/login";
      }
    }
    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  // GET request
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get(url, config).then((res) => res.data),

  // POST request
  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => apiClient.post(url, data, config).then((res) => res.data),

  // PUT request
  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => apiClient.put(url, data, config).then((res) => res.data),

  // PATCH request
  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => apiClient.patch(url, data, config).then((res) => res.data),

  // DELETE request
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.delete(url, config).then((res) => res.data),
};

// Specific API methods for each resource
export const apiMethods = {
  // Auth
  auth: {
    login: (credentials: {
      username: string;
      password: string;
      role?: string;
    }) => api.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
    logout: () => api.post(API_ENDPOINTS.AUTH.LOGOUT),
    getProfile: () => api.get(API_ENDPOINTS.AUTH.PROFILE),
  },

  // Users
  users: {
    list: (filters?: Record<string, any>) =>
      api.get(API_ENDPOINTS.USERS.LIST, { params: filters }),
    create: (data: any) => api.post(API_ENDPOINTS.USERS.CREATE, data),
    update: (id: string, data: any) =>
      api.put(API_ENDPOINTS.USERS.UPDATE(id), data),
    delete: (id: string) => api.delete(API_ENDPOINTS.USERS.DELETE(id)),
  },

  // Teachers
  teachers: {
    list: (filters?: Record<string, any>) =>
      api.get(API_ENDPOINTS.TEACHERS.LIST, { params: filters }),
    get: (id: string) => api.get(`/api/teachers/${id}`),
    create: (data: any) => api.post(API_ENDPOINTS.TEACHERS.CREATE, data),
    update: (id: string, data: any) =>
      api.put(API_ENDPOINTS.TEACHERS.UPDATE(id), data),
    delete: (id: string) => api.delete(API_ENDPOINTS.TEACHERS.DELETE(id)),
  },
  classes: {
    list: (filters?: Record<string, any>) =>
      api.get(API_ENDPOINTS.CLASSES.LIST, { params: filters }),
    get: (id: string) => api.get(`/api/classes/${id}`),
    create: (data: any) => api.post(API_ENDPOINTS.CLASSES.CREATE, data),
    update: (id: string, data: any) =>
      api.put(API_ENDPOINTS.CLASSES.UPDATE(id), data),
    delete: (id: string) => api.delete(API_ENDPOINTS.CLASSES.DELETE(id)),
  },
  schedules: {
    list: (filters?: Record<string, any>) =>
      api.get(API_ENDPOINTS.SCHEDULES.LIST, { params: filters }),
    get: (id: string) => api.get(`/api/schedules/${id}`),
    create: (data: any) => api.post(API_ENDPOINTS.SCHEDULES.CREATE, data),
    update: (id: string, data: any) =>
      api.put(API_ENDPOINTS.SCHEDULES.UPDATE(id), data),
    delete: (id: string) => api.delete(API_ENDPOINTS.SCHEDULES.DELETE(id)),
  },

  // Students
  students: {
    list: (filters?: Record<string, any>) =>
      api.get(API_ENDPOINTS.STUDENTS.LIST, { params: filters }),
    create: (data: any) => api.post(API_ENDPOINTS.STUDENTS.CREATE, data),
    update: (id: string, data: any) =>
      api.put(API_ENDPOINTS.STUDENTS.UPDATE(id), data),
    delete: (id: string) => api.delete(API_ENDPOINTS.STUDENTS.DELETE(id)),
  },

  // Courses
  courses: {
    list: (filters?: Record<string, any>) =>
      api.get(API_ENDPOINTS.COURSES.LIST, { params: filters }),
    create: (data: any) => api.post(API_ENDPOINTS.COURSES.CREATE, data),
    update: (id: string, data: any) =>
      api.put(API_ENDPOINTS.COURSES.UPDATE(id), data),
    delete: (id: string) => api.delete(API_ENDPOINTS.COURSES.DELETE(id)),
  },

  // Subjects
  subjects: {
    list: (filters?: Record<string, any>) =>
      api.get(API_ENDPOINTS.SUBJECTS.LIST, { params: filters }),
    create: (data: any) => api.post(API_ENDPOINTS.SUBJECTS.CREATE, data),
    update: (id: string, data: any) =>
      api.put(API_ENDPOINTS.SUBJECTS.UPDATE(id), data),
    delete: (id: string) => api.delete(API_ENDPOINTS.SUBJECTS.DELETE(id)),
  },

  // Majors
  majors: {
    list: (filters?: Record<string, any>) =>
      api.get(API_ENDPOINTS.MAJORS.LIST, { params: filters }),
    get: (_id: string) => api.get(API_ENDPOINTS.MAJORS.UPDATE(_id)),
    create: (data: any) => api.post(API_ENDPOINTS.MAJORS.CREATE, data),
    update: (_id: string, data: any) =>
      api.put(API_ENDPOINTS.MAJORS.UPDATE(_id), data),
    delete: (_id: string) => api.delete(API_ENDPOINTS.MAJORS.DELETE(_id)),
  },

  // Subjects
  subjects: {
    list: (filters?: Record<string, any>) =>
      api.get(API_ENDPOINTS.SUBJECTS.LIST, { params: filters }),
    create: (data: any) => api.post(API_ENDPOINTS.SUBJECTS.CREATE, data),
    update: (id: string, data: any) =>
      api.put(API_ENDPOINTS.SUBJECTS.UPDATE(id), data),
    delete: (id: string) => api.delete(API_ENDPOINTS.SUBJECTS.DELETE(id)),
  },

  // Schedules
  schedules: {
    list: (filters?: Record<string, any>) =>
      api.get(API_ENDPOINTS.SCHEDULES.LIST, { params: filters }),
    get: (id: string) => api.get(API_ENDPOINTS.SCHEDULES.UPDATE(id)),
    create: (data: any) => api.post(API_ENDPOINTS.SCHEDULES.CREATE, data),
    update: (id: string, data: any) =>
      api.put(API_ENDPOINTS.SCHEDULES.UPDATE(id), data),
    delete: (id: string) => api.delete(API_ENDPOINTS.SCHEDULES.DELETE(id)),
  },

  // Grades
  grades: {
    list: (filters?: Record<string, any>) =>
      api.get(API_ENDPOINTS.GRADES.LIST, { params: filters }),
    create: (data: any) => api.post(API_ENDPOINTS.GRADES.CREATE, data),
    update: (id: string, data: any) =>
      api.put(API_ENDPOINTS.GRADES.UPDATE(id), data),
    delete: (id: string) => api.delete(API_ENDPOINTS.GRADES.DELETE(id)),
    byStudent: (studentId: string) =>
      api.get(API_ENDPOINTS.GRADES.BY_STUDENT(studentId)),
    byTeacher: (teacherId: string) =>
      api.get(API_ENDPOINTS.GRADES.BY_TEACHER(teacherId)),
  },

  // Announcements
  announcements: {
    list: (filters?: Record<string, any>) =>
      api.get(API_ENDPOINTS.ANNOUNCEMENTS.LIST, { params: filters }),
    get: (_id: string) => api.get(API_ENDPOINTS.ANNOUNCEMENTS.UPDATE(_id)),
    create: (data: any) => api.post(API_ENDPOINTS.ANNOUNCEMENTS.CREATE, data),
    update: (_id: string, data: any) =>
      api.put(API_ENDPOINTS.ANNOUNCEMENTS.UPDATE(_id), data),
    delete: (_id: string) =>
      api.delete(API_ENDPOINTS.ANNOUNCEMENTS.DELETE(_id)),
  },

  // Gallery
  gallery: {
    list: (filters?: Record<string, any>) =>
      api.get(API_ENDPOINTS.GALLERY.LIST, { params: filters }),
    get: (id: string) => api.get(API_ENDPOINTS.GALLERY.UPDATE(id)),
    create: (data: any) => api.post(API_ENDPOINTS.GALLERY.CREATE, data),
    update: (id: string, data: any) =>
      api.put(API_ENDPOINTS.GALLERY.UPDATE(id), data),
    delete: (id: string) => api.delete(API_ENDPOINTS.GALLERY.DELETE(id)),
  },

  // Activities
  activities: {
    list: (filters?: Record<string, any>) =>
      api.get(API_ENDPOINTS.ACTIVITIES.LIST, { params: filters }),
    create: (data: any) => api.post(API_ENDPOINTS.ACTIVITIES.CREATE, data),
    update: (id: string, data: any) =>
      api.put(API_ENDPOINTS.ACTIVITIES.UPDATE(id), data),
    delete: (id: string) => api.delete(API_ENDPOINTS.ACTIVITIES.DELETE(id)),
  },

  // Staff
  staff: {
    list: (filters?: Record<string, any>) =>
      api.get(API_ENDPOINTS.STAFF.LIST, { params: filters }),
    get: (id: string) => api.get(API_ENDPOINTS.STAFF.UPDATE(id)),
    create: (data: any) => api.post(API_ENDPOINTS.STAFF.CREATE, data),
    update: (id: string, data: any) =>
      api.put(API_ENDPOINTS.STAFF.UPDATE(id), data),
    delete: (id: string) => api.delete(API_ENDPOINTS.STAFF.DELETE(id)),
  },

  // Internships
  internships: {
    list: (filters?: Record<string, any>) =>
      api.get(API_ENDPOINTS.INTERNSHIPS.LIST, { params: filters }),
    create: (data: any) => api.post(API_ENDPOINTS.INTERNSHIPS.CREATE, data),
    update: (id: string, data: any) =>
      api.put(API_ENDPOINTS.INTERNSHIPS.UPDATE(id), data),
    delete: (id: string) => api.delete(API_ENDPOINTS.INTERNSHIPS.DELETE(id)),
  },

  // News
  news: {
    list: (filters?: Record<string, any>) =>
      api.get(API_ENDPOINTS.NEWS.LIST, { params: filters }),
    get: (id: string) => api.get(API_ENDPOINTS.NEWS.UPDATE(id)),
    create: (data: any) => api.post(API_ENDPOINTS.NEWS.CREATE, data),
    update: (id: string, data: any) =>
      api.put(API_ENDPOINTS.NEWS.UPDATE(id), data),
    delete: (id: string) => api.delete(API_ENDPOINTS.NEWS.DELETE(id)),
  },

  // Profile
  profile: {
    get: () => api.get(API_ENDPOINTS.PROFILE.GET),
    update: (data: any) => api.put(API_ENDPOINTS.PROFILE.UPDATE, data),
  },
};

export default apiClient;
