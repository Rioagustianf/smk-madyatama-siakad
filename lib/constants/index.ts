// Navigation constants
export const NAVIGATION_ITEMS = {
  PUBLIC: [
    { label: "Beranda", href: "/" },
    { label: "Profil", href: "/profile" },
    { label: "Akademik", href: "/academic" },
    { label: "Kegiatan", href: "/activities" },
    { label: "Galeri", href: "/gallery" },
    { label: "Pengumuman", href: "/announcements" },
    { label: "Kontak", href: "/contact" },
  ],
  ADMIN: [
    { label: "Dashboard", href: "/dashboard/admin" },
    { label: "Guru", href: "/dashboard/admin/guru" },
    { label: "Mata Pelajaran", href: "/dashboard/admin/course" },
    { label: "Program Keahlian", href: "/dashboard/admin/academic" },
    { label: "Jadwal Pelajaran", href: "/dashboard/admin/schedules" },
    { label: "Jadwal Ujian", href: "/dashboard/admin/exams" },
    { label: "Kegiatan", href: "/dashboard/admin/activities" },
    { label: "Galeri", href: "/dashboard/admin/galeri" },
    { label: "Pengumuman", href: "/dashboard/admin/announcements" },
    { label: "Profil Sekolah", href: "/dashboard/admin/profile" },
    { label: "Staf", href: "/dashboard/admin/staff" },
    { label: "DUDI/Prakerin", href: "/dashboard/admin/internship" },
  ],
  TEACHER: [
    { label: "Input Nilai", href: "/dashboard/teacher/lesson-value-input" },
    { label: "Jadwal Pelajaran", href: "/dashboard/teacher/schedules" },
  ],
  STUDENT: [
    { label: "Lihat Nilai", href: "/dashboard/student/nilai" },
    { label: "Jadwal", href: "/dashboard/student/jadwal" },
  ],
};

// Academic constants
export const MAJORS = [
  {
    id: "tkj",
    name: "Teknik Komputer dan Jaringan",
    code: "TKJ",
    description:
      "Program keahlian yang mempelajari tentang instalasi, konfigurasi, dan pemeliharaan komputer serta jaringan.",
  },
  {
    id: "rpl",
    name: "Rekayasa Perangkat Lunak",
    code: "RPL",
    description:
      "Program keahlian yang fokus pada pengembangan aplikasi dan sistem perangkat lunak.",
  },
  {
    id: "mm",
    name: "Multimedia",
    code: "MM",
    description:
      "Program keahlian yang mempelajari tentang desain grafis, video editing, dan produksi multimedia.",
  },
  {
    id: "akl",
    name: "Akuntansi dan Keuangan Lembaga",
    code: "AKL",
    description:
      "Program keahlian yang mempelajari tentang akuntansi, perpajakan, dan manajemen keuangan.",
  },
];

export const SEMESTERS = [
  { value: 1, label: "Semester 1" },
  { value: 2, label: "Semester 2" },
];

export const SCHOOL_YEARS = Array.from({ length: 5 }, (_, i) => {
  const year = new Date().getFullYear() - 2 + i;
  return { value: year, label: `${year}/${year + 1}` };
});

export const DAYS = [
  { value: "monday", label: "Senin" },
  { value: "tuesday", label: "Selasa" },
  { value: "wednesday", label: "Rabu" },
  { value: "thursday", label: "Kamis" },
  { value: "friday", label: "Jumat" },
  { value: "saturday", label: "Sabtu" },
];

// Content categories
export const ANNOUNCEMENT_CATEGORIES = [
  { value: "academic", label: "Akademik" },
  { value: "general", label: "Umum" },
  { value: "exam", label: "Ujian" },
  { value: "event", label: "Acara" },
];

export const GALLERY_CATEGORIES = [
  { value: "academic", label: "Akademik" },
  { value: "extracurricular", label: "Ekstrakurikuler" },
  { value: "event", label: "Acara" },
  { value: "facility", label: "Fasilitas" },
  { value: "achievement", label: "Prestasi" },
];

export const ACHIEVEMENT_CATEGORIES = [
  { value: "academic", label: "Akademik" },
  { value: "sports", label: "Olahraga" },
  { value: "arts", label: "Seni" },
  { value: "competition", label: "Kompetisi" },
];

export const ACHIEVEMENT_LEVELS = [
  { value: "school", label: "Sekolah" },
  { value: "district", label: "Kecamatan" },
  { value: "city", label: "Kota" },
  { value: "province", label: "Provinsi" },
  { value: "national", label: "Nasional" },
  { value: "international", label: "Internasional" },
];

// User roles and permissions
export const USER_ROLES = [
  { value: "admin", label: "Administrator" },
  { value: "teacher", label: "Guru" },
  { value: "student", label: "Siswa" },
];

export const ADMIN_PERMISSIONS = [
  "manage_users",
  "manage_content",
  "manage_academic",
  "view_reports",
  "system_settings",
];

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REGISTER: "/api/auth/register",
    PROFILE: "/api/auth/profile",
  },
  USERS: {
    LIST: "/api/users",
    CREATE: "/api/users",
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
  },
  TEACHERS: {
    LIST: "/api/teachers",
    CREATE: "/api/teachers",
    UPDATE: (id: string) => `/api/teachers/${id}`,
    DELETE: (id: string) => `/api/teachers/${id}`,
  },
  STUDENTS: {
    LIST: "/api/students",
    CREATE: "/api/students",
    UPDATE: (id: string) => `/api/students/${id}`,
    DELETE: (id: string) => `/api/students/${id}`,
  },
  COURSES: {
    LIST: "/api/courses",
    CREATE: "/api/courses",
    UPDATE: (id: string) => `/api/courses/${id}`,
    DELETE: (id: string) => `/api/courses/${id}`,
  },
  MAJORS: {
    LIST: "/api/majors",
    CREATE: "/api/majors",
    UPDATE: (id: string) => `/api/majors/${id}`,
    DELETE: (id: string) => `/api/majors/${id}`,
  },
  SCHEDULES: {
    LIST: "/api/schedules",
    CREATE: "/api/schedules",
    UPDATE: (id: string) => `/api/schedules/${id}`,
    DELETE: (id: string) => `/api/schedules/${id}`,
  },
  EXAMS: {
    LIST: "/api/exams",
    CREATE: "/api/exams",
    UPDATE: (id: string) => `/api/exams/${id}`,
    DELETE: (id: string) => `/api/exams/${id}`,
  },
  GRADES: {
    LIST: "/api/grades",
    CREATE: "/api/grades",
    UPDATE: (id: string) => `/api/grades/${id}`,
    DELETE: (id: string) => `/api/grades/${id}`,
    BY_STUDENT: (studentId: string) => `/api/grades/student/${studentId}`,
    BY_TEACHER: (teacherId: string) => `/api/grades/teacher/${teacherId}`,
  },
  ANNOUNCEMENTS: {
    LIST: "/api/announcements",
    CREATE: "/api/announcements",
    UPDATE: (id: string) => `/api/announcements/${id}`,
    DELETE: (id: string) => `/api/announcements/${id}`,
  },
  GALLERY: {
    LIST: "/api/gallery",
    CREATE: "/api/gallery",
    UPDATE: (id: string) => `/api/gallery/${id}`,
    DELETE: (id: string) => `/api/gallery/${id}`,
  },
  ACTIVITIES: {
    LIST: "/api/activities",
    CREATE: "/api/activities",
    UPDATE: (id: string) => `/api/activities/${id}`,
    DELETE: (id: string) => `/api/activities/${id}`,
  },
  STAFF: {
    LIST: "/api/staff",
    CREATE: "/api/staff",
    UPDATE: (id: string) => `/api/staff/${id}`,
    DELETE: (id: string) => `/api/staff/${id}`,
  },
  INTERNSHIPS: {
    LIST: "/api/internships",
    CREATE: "/api/internships",
    UPDATE: (id: string) => `/api/internships/${id}`,
    DELETE: (id: string) => `/api/internships/${id}`,
  },
  PROFILE: {
    GET: "/api/profile",
    UPDATE: "/api/profile",
  },
};

// Form validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+62|62|0)[0-9]{9,13}$/,
  STUDENT_ID: /^[0-9]{8,12}$/,
  TEACHER_ID: /^[A-Z]{2}[0-9]{6}$/,
};

// File upload settings
export const UPLOAD_SETTINGS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  ALLOWED_VIDEO_TYPES: ["video/mp4", "video/webm", "video/avi"],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

// Time constants
export const TIME_FORMAT = "HH:mm";
export const DATE_FORMAT = "DD/MM/YYYY";
export const DATETIME_FORMAT = "DD/MM/YYYY HH:mm";
