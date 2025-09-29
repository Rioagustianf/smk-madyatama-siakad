import { connectToDatabase, getCollections } from "@/lib/database/mongodb";
import bcrypt from "bcryptjs";

// Data siswa kelas 12 TKJ 1
const studentsTKJ1 = [
  { name: "Adly Prawirayuda Pradifta", nisn: "0091128942" },
  { name: "Al Kausar Putra", nisn: "008717679" },
  { name: "Amanda Zahara", nisn: "" },
  { name: "Amelia", nisn: "0086634454" },
  { name: "Andini", nisn: "0072622136" },
  { name: "Ayu Fadilah", nisn: "0088801857" },
  { name: "Dina Amelia", nisn: "0086787654" },
  { name: "Faizun Saifullah", nisn: "0083919905" },
  { name: "Jafira Pinar Dwi", nisn: "0083338617" },
  { name: "Julia Amggraini", nisn: "0085336009" },
  { name: "Juni Apriyaurnsya", nisn: "0095264933" },
  { name: "M. Hafiz Romadon", nisn: "00882782044" },
  { name: "M. Nur Fattur Rohman", nisn: "0078739055" },
  { name: "Mela Noviyanti", nisn: "0082800677" },
  { name: "Mgs. M. Razib Pratama", nisn: "" },
  { name: "Mohamad Azis Nurfauzi", nisn: "0074799234" },
  { name: "Muhamad Arif Saputra", nisn: "" },
  { name: "Muhammad Adlan Saputra", nisn: "0096240702" },
  { name: "Muhammad Dede Reza Ferdiyansyah", nisn: "0098067442" },
  { name: "Muhammad Ferdi Juniansyah", nisn: "0083189180" },
  { name: "Mutia Ukhti Fillah", nisn: "0081351201" },
  { name: "Nabila Annaja", nisn: "0087490917" },
  { name: "Nadiyah Kamilah Pratami", nisn: "0075757595" },
  { name: "Nadin Amelia", nisn: "" },
  { name: "Nasyifah Nur Fadilah", nisn: "0081885825" },
  { name: "Pratiwi Kelin Syapiah", nisn: "0097774573" },
  { name: "Ratno Wiyendri", nisn: "0089879929" },
  { name: "Rayhan", nisn: "0084358699" },
  { name: "Renaldy Adinata", nisn: "0085741670" },
  { name: "Ria Agustin", nisn: "" },
  { name: "Robbiahtul Adawiya", nisn: "0087955374" },
  { name: "Sa'idah", nisn: "0087570308" },
  { name: "Siti Rahmawati", nisn: "0086310568" },
  { name: "Syifa Aulia", nisn: "0086621282" },
  { name: "Syifa Khairunnisa", nisn: "" },
  { name: "Tiara Nur Azizah", nisn: "0093924214" },
  { name: "Wirdha", nisn: "0086801702" },
  { name: "Wulan Septi Ramadhani", nisn: "0089777587" },
  { name: "Yogi Saputra", nisn: "0067911387" },
  { name: "Yunita Maharrani", nisn: "0083177127" },
];

// Data siswa kelas 12 TKJ 2
const studentsTKJ2 = [
  { name: "Adelya Azhar", nisn: "0076235621" },
  { name: "Anisa Agustin", nisn: "0069700662" },
  { name: "Azharah Ramadhani", nisn: "0088134714" },
  { name: "Cika Aprilia", nisn: "0075620243" },
  { name: "Damar Saputra", nisn: "0084997148" },
  { name: "Fariz Akbar Hidayat", nisn: "" },
  { name: "Fazri Dwi Rismianto", nisn: "0089252284" },
  { name: "Ilham Fais Naqli", nisn: "0081885825" },
  { name: "Kaila Agustin", nisn: "0086495309" },
  { name: "Lilis Oktarina", nisn: "0072495941" },
  { name: "M. Arya Merlinsky", nisn: "0099211566" },
  { name: "M.Felix Aditia", nisn: "0082231279" },
  { name: "M. Keisar Khadafi", nisn: "0086693614" },
  { name: "M. Adjie Adhiaksa", nisn: "308448032" },
  { name: "Muhamad Rafli Maulana", nisn: "0089877618" },
  { name: "Muhamad Shahid", nisn: "0087546099" },
  { name: "Muhamad Rangga", nisn: "0085094875" },
  { name: "Muhamad Tanzilal", nisn: "0082749844" },
  { name: "Nadila Sapitri", nisn: "0084587038" },
  { name: "Naila Azizah", nisn: "0085245275" },
  { name: "Naura Maya Savira", nisn: "0098253020" },
  { name: "Novelita Arjeti", nisn: "3079252713" },
  { name: "Novira Anggraini", nisn: "0088457986" },
  { name: "Novita Sari", nisn: "0086758684" },
  { name: "Nurjanah", nisn: "0082622201" },
  { name: "Pera Wati", nisn: "0047679614" },
  { name: "Ramon Saputra Pratama", nisn: "0077530048" },
  { name: "Rasya Almaghfira Nababan", nisn: "0097361322" },
  { name: "Rega Aditya Putra", nisn: "0088708255" },
  { name: "Ridho Hibrizi al Jali", nisn: "-" },
  { name: "Sagita Cahayani", nisn: "0084569192" },
  { name: "Sentika", nisn: "0086984588" },
  { name: "Sina Jenari", nisn: "0091454332" },
  { name: "Siti Alleysia Putri", nisn: "0086257529" },
  { name: "Varin Dwi Aryanti", nisn: "0089487175" },
  { name: "Widiyanto", nisn: "0064002544" },
  { name: "Wulandari", nisn: "0087451999" },
  { name: "Yuna Olivia", nisn: "3095486147" },
  { name: "Zahwatul Hayyah", nisn: "0076235621" },
];

// Data jurusan (majors)
const majors = [
  {
    name: "Teknik Komputer dan Jaringan",
    code: "TKJ",
    description: "Program keahlian Teknik Komputer dan Jaringan",
    facilities: [
      "Lab Komputer",
      "Lab Jaringan",
      "Workshop Hardware",
      "Ruang Server",
    ],
    careerProspects: [
      "Network Administrator",
      "System Administrator",
      "IT Support",
      "Network Engineer",
      "Cyber Security Specialist",
    ],
    isActive: true,
  },
  {
    name: "Perhotelan",
    code: "PH",
    description: "Program keahlian Perhotelan",
    facilities: [
      "Lab Tata Boga",
      "Lab Tata Graha",
      "Lab Front Office",
      "Simulasi Hotel",
    ],
    careerProspects: [
      "Front Office Staff",
      "Housekeeping Supervisor",
      "Food & Beverage Manager",
      "Event Coordinator",
      "Hotel Manager",
    ],
    isActive: true,
  },
];

// Data guru berdasarkan data client - dengan struktur relasi proper
const teachers = [
  {
    name: "Iik Ayu Meilani",
    username: "iik_ayu",
    phone: "081234567890",
    education: "A.Md",
    subjects: [], // Will be populated after subjects are created
    classes: ["12 TKJ 1", "12 TKJ 2"],
    isActive: true,
  },
  {
    name: "Supriyanto",
    username: "supriyanto",
    phone: "081234567891",
    education: "S.Kom",
    subjects: [],
    classes: ["12 TKJ 1", "12 TKJ 2"],
    isActive: true,
  },
  {
    name: "Miranda",
    username: "miranda",
    phone: "081234567892",
    education: "S.Kom",
    subjects: [],
    classes: ["12 TKJ 2"],
    isActive: true,
  },
  {
    name: "Erwin Mulyadi",
    username: "erwin_mulyadi",
    phone: "081234567893",
    education: "A.Md",
    subjects: [],
    classes: ["12 TKJ 1", "12 TKJ 2"],
    isActive: true,
  },
  {
    name: "Eka Yunita",
    username: "eka_yunita",
    phone: "081234567894",
    education: "S.E",
    subjects: [],
    classes: ["12 TKJ 1", "12 TKJ 2"],
    isActive: true,
  },
  {
    name: "Yesi Oktavia",
    username: "yesi_oktavia",
    phone: "081234567895",
    education: "S.Pd",
    subjects: [],
    classes: ["12 TKJ 1", "12 TKJ 2"],
    isActive: true,
  },
  {
    name: "Fadhilah Khairani",
    username: "fadhilah_khairani",
    phone: "081234567896",
    education: "M.Pd",
    subjects: [],
    classes: ["12 TKJ 1", "12 TKJ 2"],
    isActive: true,
  },
  {
    name: "Lina Maryana",
    username: "lina_maryana",
    phone: "081234567897",
    education: "S.Pd",
    subjects: [],
    classes: ["12 TKJ 1", "12 TKJ 2"],
    isActive: true,
  },
  {
    name: "Ustadz Ahmad",
    username: "ustadz_ahmad",
    phone: "081234567898",
    education: "S.Ag",
    subjects: [],
    classes: ["12 TKJ 1", "12 TKJ 2"],
    isActive: true,
  },
];

// Data mata pelajaran - dengan teacherId reference (akan diisi setelah teachers dibuat)
const subjects = [
  {
    code: "ASJ",
    name: "Administrasi Sistem Jaringan",
    description: "Mata pelajaran Administrasi Sistem Jaringan",
    teacherId: "", // Will be populated with actual teacher _id
    isActive: true,
  },
  {
    code: "TLJ",
    name: "Teknik Layanan Jaringan",
    description: "Mata pelajaran Teknik Layanan Jaringan",
    teacherId: "",
    isActive: true,
  },
  {
    code: "AIJ",
    name: "Administrasi Infrastruktur Jaringan",
    description: "Mata pelajaran Administrasi Infrastruktur Jaringan",
    teacherId: "",
    isActive: true,
  },
  {
    code: "PKK",
    name: "Produk Kreatif Kewirausahaan",
    description: "Mata pelajaran Produk Kreatif Kewirausahaan",
    teacherId: "",
    isActive: true,
  },
  {
    code: "PKN",
    name: "Pendidikan Kewarganegaraan",
    description: "Mata pelajaran Pendidikan Kewarganegaraan",
    teacherId: "",
    isActive: true,
  },
  {
    code: "MTK",
    name: "Matematika",
    description: "Mata pelajaran Matematika",
    teacherId: "",
    isActive: true,
  },
  {
    code: "B. Inggris",
    name: "Bahasa Inggris",
    description: "Mata pelajaran Bahasa Inggris",
    teacherId: "",
    isActive: true,
  },
  {
    code: "B. Indonesia",
    name: "Bahasa Indonesia",
    description: "Mata pelajaran Bahasa Indonesia",
    teacherId: "",
    isActive: true,
  },
  {
    code: "Agama",
    name: "Pendidikan Agama Islam",
    description: "Mata pelajaran Pendidikan Agama Islam",
    teacherId: "",
    isActive: true,
  },
];

// Data kelas dengan wali kelas
const classes = [
  {
    name: "12 TKJ 1",
    majorId: "", // Will be populated with actual major _id
    homeroomTeacherId: "", // Will be populated with actual teacher _id
    isActive: true,
  },
  {
    name: "12 TKJ 2",
    majorId: "", // Will be populated with actual major _id
    homeroomTeacherId: "", // Will be populated with actual teacher _id
    isActive: true,
  },
];

// Jadwal pelajaran 12 TKJ 1
const scheduleTKJ1 = [
  // Senin
  { day: "Senin", time: "07:00-07:40", subject: "UPACARA", class: "12 TKJ 1" },
  {
    day: "Senin",
    time: "07:40-08:20",
    subject: "Adminfrajar",
    class: "12 TKJ 1",
  },
  {
    day: "Senin",
    time: "08:20-09:00",
    subject: "Adminfrajar",
    class: "12 TKJ 1",
  },
  {
    day: "Senin",
    time: "09:00-09:40",
    subject: "Adminfrajar",
    class: "12 TKJ 1",
  },
  { day: "Senin", time: "10:10-10:50", subject: "Agama", class: "12 TKJ 1" },
  { day: "Senin", time: "10:50-11:30", subject: "Agama", class: "12 TKJ 1" },
  { day: "Senin", time: "11:30-12:10", subject: "ASJ", class: "12 TKJ 1" },
  { day: "Senin", time: "12:40-13:20", subject: "ASJ", class: "12 TKJ 1" },
  { day: "Senin", time: "13:20-14:00", subject: "ASJ", class: "12 TKJ 1" },

  // Selasa
  { day: "Selasa", time: "07:00-07:40", subject: "PKK", class: "12 TKJ 1" },
  { day: "Selasa", time: "07:40-08:20", subject: "PKK", class: "12 TKJ 1" },
  { day: "Selasa", time: "08:20-09:00", subject: "ASJ", class: "12 TKJ 1" },
  { day: "Selasa", time: "09:00-09:40", subject: "ASJ", class: "12 TKJ 1" },
  { day: "Selasa", time: "10:10-10:50", subject: "PKN", class: "12 TKJ 1" },
  { day: "Selasa", time: "10:50-11:30", subject: "PKN", class: "12 TKJ 1" },
  {
    day: "Selasa",
    time: "11:30-12:10",
    subject: "Adminfrajar",
    class: "12 TKJ 1",
  },
  {
    day: "Selasa",
    time: "12:40-13:20",
    subject: "Adminfrajar",
    class: "12 TKJ 1",
  },
  {
    day: "Selasa",
    time: "13:20-14:00",
    subject: "Adminfrajar",
    class: "12 TKJ 1",
  },

  // Rabu
  { day: "Rabu", time: "07:00-07:40", subject: "Teklayjar", class: "12 TKJ 1" },
  { day: "Rabu", time: "07:40-08:20", subject: "Teklayjar", class: "12 TKJ 1" },
  { day: "Rabu", time: "08:20-09:00", subject: "Teklayjar", class: "12 TKJ 1" },
  { day: "Rabu", time: "09:00-09:40", subject: "Teklayjar", class: "12 TKJ 1" },
  {
    day: "Rabu",
    time: "10:10-10:50",
    subject: "Adminfrajar",
    class: "12 TKJ 1",
  },
  {
    day: "Rabu",
    time: "10:50-11:30",
    subject: "Adminfrajar",
    class: "12 TKJ 1",
  },
  { day: "Rabu", time: "11:30-12:10", subject: "Agama", class: "12 TKJ 1" },
  { day: "Rabu", time: "12:40-13:20", subject: "PKK", class: "12 TKJ 1" },
  { day: "Rabu", time: "13:20-14:00", subject: "PKK", class: "12 TKJ 1" },

  // Kamis
  { day: "Kamis", time: "07:00-07:40", subject: "MTK", class: "12 TKJ 1" },
  { day: "Kamis", time: "07:40-08:20", subject: "MTK", class: "12 TKJ 1" },
  {
    day: "Kamis",
    time: "08:20-09:00",
    subject: "Teklayjar",
    class: "12 TKJ 1",
  },
  {
    day: "Kamis",
    time: "09:00-09:40",
    subject: "Teklayjar",
    class: "12 TKJ 1",
  },
  { day: "Kamis", time: "10:10-10:50", subject: "PKK", class: "12 TKJ 1" },
  { day: "Kamis", time: "10:50-11:30", subject: "PKK", class: "12 TKJ 1" },
  { day: "Kamis", time: "11:30-12:10", subject: "PKK", class: "12 TKJ 1" },
  { day: "Kamis", time: "12:10-12:50", subject: "PKK", class: "12 TKJ 1" },

  // Jumat
  {
    day: "Jumat",
    time: "07:00-07:40",
    subject: "Teklayjar",
    class: "12 TKJ 1",
  },
  {
    day: "Jumat",
    time: "07:40-08:20",
    subject: "Teklayjar",
    class: "12 TKJ 1",
  },
  { day: "Jumat", time: "08:20-09:00", subject: "MTK", class: "12 TKJ 1" },
  { day: "Jumat", time: "09:00-09:40", subject: "MTK", class: "12 TKJ 1" },
  {
    day: "Jumat",
    time: "10:10-10:40",
    subject: "B. Inggris",
    class: "12 TKJ 1",
  },
  {
    day: "Jumat",
    time: "10:40-11:20",
    subject: "B. Inggris",
    class: "12 TKJ 1",
  },

  // Sabtu
  { day: "Sabtu", time: "07:00-07:40", subject: "SENAM", class: "12 TKJ 1" },
  {
    day: "Sabtu",
    time: "07:40-08:20",
    subject: "B. Inggris",
    class: "12 TKJ 1",
  },
  {
    day: "Sabtu",
    time: "08:20-09:00",
    subject: "B. Inggris",
    class: "12 TKJ 1",
  },
  { day: "Sabtu", time: "09:00-09:40", subject: "ASJ", class: "12 TKJ 1" },
  { day: "Sabtu", time: "10:10-10:50", subject: "ASJ", class: "12 TKJ 1" },
  { day: "Sabtu", time: "10:50-11:30", subject: "ASJ", class: "12 TKJ 1" },
  {
    day: "Sabtu",
    time: "11:30-12:10",
    subject: "Adminfrajar",
    class: "12 TKJ 1",
  },
  {
    day: "Sabtu",
    time: "12:40-13:20",
    subject: "B. Indonesia",
    class: "12 TKJ 1",
  },
  {
    day: "Sabtu",
    time: "13:20-14:00",
    subject: "B. Indonesia",
    class: "12 TKJ 1",
  },
];

// Jadwal pelajaran 12 TKJ 2
const scheduleTKJ2 = [
  // Senin
  { day: "Senin", time: "07:00-07:40", subject: "UPACARA", class: "12 TKJ 2" },
  { day: "Senin", time: "07:40-08:20", subject: "PKK", class: "12 TKJ 2" },
  { day: "Senin", time: "08:20-09:00", subject: "PKK", class: "12 TKJ 2" },
  { day: "Senin", time: "09:00-09:40", subject: "ASJ", class: "12 TKJ 2" },
  { day: "Senin", time: "10:10-10:50", subject: "ASJ", class: "12 TKJ 2" },
  { day: "Senin", time: "10:50-11:30", subject: "TLJ", class: "12 TKJ 2" },
  { day: "Senin", time: "11:30-12:10", subject: "TLJ", class: "12 TKJ 2" },
  { day: "Senin", time: "12:40-13:20", subject: "TLJ", class: "12 TKJ 2" },
  { day: "Senin", time: "13:20-14:00", subject: "TLJ", class: "12 TKJ 2" },

  // Selasa
  { day: "Selasa", time: "07:00-07:40", subject: "AIJ", class: "12 TKJ 2" },
  { day: "Selasa", time: "07:40-08:20", subject: "AIJ", class: "12 TKJ 2" },
  { day: "Selasa", time: "08:20-09:00", subject: "AIJ", class: "12 TKJ 2" },
  { day: "Selasa", time: "09:00-09:40", subject: "AIJ", class: "12 TKJ 2" },
  { day: "Selasa", time: "10:10-10:50", subject: "PKK", class: "12 TKJ 2" },
  { day: "Selasa", time: "10:50-11:30", subject: "PKK", class: "12 TKJ 2" },
  {
    day: "Selasa",
    time: "11:30-12:10",
    subject: "B. Inggris",
    class: "12 TKJ 2",
  },
  { day: "Selasa", time: "12:40-13:20", subject: "MTK", class: "12 TKJ 2" },
  { day: "Selasa", time: "13:20-14:00", subject: "MTK", class: "12 TKJ 2" },

  // Rabu
  { day: "Rabu", time: "07:00-07:40", subject: "AIJ", class: "12 TKJ 2" },
  { day: "Rabu", time: "07:40-08:20", subject: "AIJ", class: "12 TKJ 2" },
  { day: "Rabu", time: "08:20-09:00", subject: "AIJ", class: "12 TKJ 2" },
  {
    day: "Rabu",
    time: "09:00-09:40",
    subject: "Agama Islam",
    class: "12 TKJ 2",
  },
  {
    day: "Rabu",
    time: "10:10-10:50",
    subject: "Agama Islam",
    class: "12 TKJ 2",
  },
  {
    day: "Rabu",
    time: "10:50-11:30",
    subject: "Agama Islam",
    class: "12 TKJ 2",
  },
  {
    day: "Rabu",
    time: "11:30-12:10",
    subject: "B. Inggris",
    class: "12 TKJ 2",
  },
  { day: "Rabu", time: "12:40-13:20", subject: "TLJ", class: "12 TKJ 2" },
  { day: "Rabu", time: "13:20-14:00", subject: "TLJ", class: "12 TKJ 2" },

  // Kamis
  { day: "Kamis", time: "07:00-07:40", subject: "PKK", class: "12 TKJ 2" },
  { day: "Kamis", time: "07:40-08:20", subject: "PKK", class: "12 TKJ 2" },
  { day: "Kamis", time: "08:20-09:00", subject: "PKK", class: "12 TKJ 2" },
  { day: "Kamis", time: "09:00-09:40", subject: "PKK", class: "12 TKJ 2" },
  { day: "Kamis", time: "10:10-10:50", subject: "ASJ", class: "12 TKJ 2" },
  { day: "Kamis", time: "10:50-11:30", subject: "ASJ", class: "12 TKJ 2" },
  { day: "Kamis", time: "11:30-12:10", subject: "ASJ", class: "12 TKJ 2" },

  // Jumat
  { day: "Jumat", time: "07:00-07:40", subject: "MTK", class: "12 TKJ 2" },
  { day: "Jumat", time: "07:40-08:20", subject: "MTK", class: "12 TKJ 2" },
  { day: "Jumat", time: "08:20-09:00", subject: "TLJ", class: "12 TKJ 2" },
  { day: "Jumat", time: "09:00-09:40", subject: "TLJ", class: "12 TKJ 2" },
  { day: "Jumat", time: "10:10-10:50", subject: "AIJ", class: "12 TKJ 2" },
  { day: "Jumat", time: "10:50-11:30", subject: "AIJ", class: "12 TKJ 2" },

  // Sabtu
  { day: "Sabtu", time: "07:00-07:40", subject: "SENAM", class: "12 TKJ 2" },
  { day: "Sabtu", time: "07:40-08:20", subject: "PKN", class: "12 TKJ 2" },
  { day: "Sabtu", time: "08:20-09:00", subject: "PKN", class: "12 TKJ 2" },
  {
    day: "Sabtu",
    time: "09:00-09:40",
    subject: "B. Indonesia",
    class: "12 TKJ 2",
  },
  {
    day: "Sabtu",
    time: "10:10-10:50",
    subject: "B. Indonesia",
    class: "12 TKJ 2",
  },
  {
    day: "Sabtu",
    time: "10:50-11:30",
    subject: "B. Inggris",
    class: "12 TKJ 2",
  },
  {
    day: "Sabtu",
    time: "11:30-12:10",
    subject: "B. Inggris",
    class: "12 TKJ 2",
  },
];

// Helper function to convert name to username
function nameToUsername(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/[^a-z0-9_]/g, "") // Remove special characters
    .substring(0, 20); // Limit length
}

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    const collections = await getCollections();
    console.log("📊 Collections:", Object.keys(collections));

    // Clear existing data
    if (collections.majors) {
      await collections.majors.deleteMany({});
    }
    if (collections.students) {
      await collections.students.deleteMany({});
    }
    if (collections.teachers) {
      await collections.teachers.deleteMany({});
    }
    if (collections.subjects) {
      await collections.subjects.deleteMany({});
    }
    if (collections.classes) {
      await collections.classes.deleteMany({});
    }
    if (collections.schedules) {
      await collections.schedules.deleteMany({});
    }
    if (collections.admins) {
      await collections.admins.deleteMany({});
    }

    console.log("✅ Cleared existing data");

    // Hash password once
    const hashedPassword = await bcrypt.hash("password123", 10);
    const hashedAdminPassword = await bcrypt.hash("admin123", 10);

    // Seed majors first
    const majorData = majors.map((major) => ({
      ...major,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    if (collections.majors) {
      const result = await collections.majors.insertMany(majorData);
      console.log(`✅ Seeded ${result.insertedCount} majors`);
    } else {
      console.log("❌ Majors collection not found");
    }

    // Seed students
    const studentData = [
      ...studentsTKJ1.map((student, index) => ({
        id: student.nisn || `TKJ1-${String(index + 1).padStart(2, "0")}`,
        studentId: student.nisn || `TKJ1-${String(index + 1).padStart(2, "0")}`,
        name: student.name,
        username: nameToUsername(student.name),
        password: hashedPassword,
        class: "12 TKJ 1",
        major: "Teknik Komputer dan Jaringan",
        nisn: student.nisn || "",
        year: 2024,
        isActive: true,
        role: "student" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      ...studentsTKJ2.map((student, index) => ({
        id: student.nisn || `TKJ2-${String(index + 1).padStart(2, "0")}`,
        studentId: student.nisn || `TKJ2-${String(index + 1).padStart(2, "0")}`,
        name: student.name,
        username: nameToUsername(student.name),
        password: hashedPassword,
        class: "12 TKJ 2",
        major: "Teknik Komputer dan Jaringan",
        nisn: student.nisn || "",
        year: 2024,
        isActive: true,
        role: "student" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    ];

    if (collections.students) {
      const result = await collections.students.insertMany(studentData);
      console.log(`✅ Seeded ${result.insertedCount} students`);
    } else {
      console.log("❌ Students collection not found");
    }

    // Seed teachers first
    const teacherData = teachers.map((teacher) => ({
      id: teacher.username,
      name: teacher.name,
      username: teacher.username,
      phone: teacher.phone,
      password: hashedPassword,
      subjects: [], // Will be populated after subjects are created
      classes: teacher.classes,
      education: teacher.education,
      isActive: teacher.isActive,
      role: "teacher" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    let teacherIds: { [key: string]: string } = {};
    if (collections.teachers) {
      const result = await collections.teachers.insertMany(teacherData);
      console.log(`✅ Seeded ${result.insertedCount} teachers`);

      // Create mapping of teacher names to IDs
      const insertedTeachers = await collections.teachers.find({}).toArray();
      insertedTeachers.forEach((teacher) => {
        teacherIds[teacher.name] = teacher._id.toString();
      });
    } else {
      console.log("❌ Teachers collection not found");
    }

    // Seed subjects with teacher references
    const subjectData = subjects.map((subject) => {
      // Map teacher names to IDs
      const teacherNameMap: { [key: string]: string } = {
        ASJ: "Iik Ayu Meilani",
        TLJ: "Supriyanto",
        AIJ: "Miranda",
        PKK: "Erwin Mulyadi",
        PKN: "Eka Yunita",
        MTK: "Yesi Oktavia",
        "B. Inggris": "Fadhilah Khairani",
        "B. Indonesia": "Lina Maryana",
        Agama: "Ustadz Ahmad", // Will need to add this teacher
      };

      const teacherName = teacherNameMap[subject.code];
      const teacherId = teacherName ? teacherIds[teacherName] : "";

      return {
        code: subject.code,
        name: subject.name,
        description: subject.description,
        teacherId: teacherId,
        isActive: subject.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    if (collections.subjects) {
      await collections.subjects.insertMany(subjectData);
      console.log(`✅ Seeded ${subjectData.length} subjects`);
    } else {
      console.log("⚠️ Subjects collection not found, skipping...");
    }

    // Seed classes with homeroom teacher references
    // Get majors from database to get actual _id
    const majorsFromDB = await collections.majors.find({}).toArray();
    const majorIds: { [key: string]: string } = {};
    majorsFromDB.forEach((major: any) => {
      majorIds[major.name] = major._id.toString();
    });

    const classData = classes.map((cls) => {
      // Assign homeroom teachers (first teacher for TKJ 1, second for TKJ 2)
      const homeroomTeacherMap: { [key: string]: string } = {
        "12 TKJ 1": "Iik Ayu Meilani", // ASJ teacher
        "12 TKJ 2": "Supriyanto", // TLJ teacher
      };

      const teacherName = homeroomTeacherMap[cls.name];
      const homeroomTeacherId = teacherName ? teacherIds[teacherName] : "";

      // Get TKJ major ID from database
      const majorId = majorIds["Teknik Komputer dan Jaringan"] || "";

      return {
        name: cls.name,
        majorId: majorId,
        homeroomTeacherId: homeroomTeacherId,
        isActive: cls.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    if (collections.classes) {
      const result = await collections.classes.insertMany(classData);
      console.log(`✅ Seeded ${result.insertedCount} classes`);
    } else {
      console.log("❌ Classes collection not found");
    }

    // Seed schedules
    const scheduleData = [
      ...scheduleTKJ1.map((schedule) => ({
        day: schedule.day,
        time: schedule.time,
        subject: schedule.subject,
        class: schedule.class,
        teacher: getTeacherBySubject(schedule.subject),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      ...scheduleTKJ2.map((schedule) => ({
        day: schedule.day,
        time: schedule.time,
        subject: schedule.subject,
        class: schedule.class,
        teacher: getTeacherBySubject(schedule.subject),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    ];

    if (collections.schedules) {
      await collections.schedules.insertMany(scheduleData);
      console.log(`✅ Seeded ${scheduleData.length} schedules`);
    } else {
      console.log("⚠️ Schedules collection not found, skipping...");
    }

    // Seed default admin
    const adminData = {
      id: "admin",
      name: "Administrator",
      username: "admin",
      password: hashedAdminPassword,
      permissions: ["all"],
      isActive: true,
      role: "admin" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await collections.admins.insertOne(adminData);
    console.log("✅ Seeded default admin");

    console.log("🎉 Database seeding completed successfully!");

    return {
      majors: majorData.length,
      students: studentData.length,
      teachers: teacherData.length,
      subjects: subjectData.length,
      classes: classData.length,
      schedules: scheduleData.length,
      admins: 1,
    };
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    if (error instanceof Error) {
      console.error("❌ Error details:", error.message);
      console.error("❌ Error stack:", error.stack);
    }
    throw error;
  }
}

function getTeacherBySubject(subject: string): string {
  const subjectMap: { [key: string]: string } = {
    ASJ: "Iik Ayu Meilani",
    TLJ: "Supriyanto",
    AIJ: "Miranda",
    PKK: "Erwin Mulyadi",
    PKN: "Eka Yunita",
    MTK: "Yesi Oktavia",
    "B. Inggris": "Fadhilah Khairani",
    "B. Indonesia": "Lina Maryana",
    Agama: "Ustadz Ahmad",
    UPACARA: "Guru Piket",
    SENAM: "Guru Olahraga",
  };

  return subjectMap[subject] || "Guru Pengampu";
}
