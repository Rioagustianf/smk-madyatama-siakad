export type SchoolProgram = {
  name: string;
  slug: string;
};

export type SchoolData = {
  name: string;
  npsn: string;
  address: {
    street: string;
    kelurahan: string;
    kecamatan: string;
    city: string;
    province: string;
    postal_code: string;
  };
  contact: {
    phone: string;
    email: string;
    instagram: string;
    facebook: string;
    youtube: string;
  };
  accreditation: {
    status: string;
    score: number;
    source: string;
  };
  programs: SchoolProgram[];
  facilities: string[];
  achievements: Array<{
    title: string;
    level: string;
    rank: string;
  }>;
  news_samples: Array<{
    title: string;
    source: string;
    date: string;
    url: string;
  }>;
  notes: string;
};

export const school: SchoolData = {
  name: "SMK Madyatama",
  npsn: "10647495",
  address: {
    street: "Jl. Pertahanan (Pertahanan III)",
    kelurahan: "16 Ulu",
    kecamatan: "Seberang Ulu II",
    city: "Kota Palembang",
    province: "Sumatera Selatan",
    postal_code: "",
  },
  contact: {
    phone: "0711-516797",
    email: "smkmadyatamabisa@gmail.com",
    instagram: "https://www.instagram.com/smk.madyatama/",
    facebook: "https://www.facebook.com/TKJSmkMadyatamaPalembang/",
    youtube: "https://www.youtube.com/@smkmadyatamaa",
  },
  accreditation: {
    status: "B",
    score: 86,
    source: "katalogsekolah/akupintar",
  },
  programs: [
    { name: "Teknik Komputer dan Jaringan", slug: "tkj" },
    { name: "Akomodasi Perhotelan", slug: "perhotelan" },
  ],
  facilities: [
    "Ruang Kelas",
    "Laboratorium Komputer",
    "Laboratorium lainnya (tercatat hingga 4 lab menurut katalog)",
  ],
  achievements: [{ title: "O2SN (2011)", level: "Nasional", rank: "2" }],
  news_samples: [
    {
      title: "SMK Madyatama Berikan Bantuan Sosial",
      source: "beritalennus.co.id",
      date: "2022-07-26",
      url: "https://beritalennus.co.id/2022/07/26/smk-madyatama-palembang-berikan-bantuan-sosial-bagi-murid-yang-tidak-mampu/",
    },
  ],
  notes:
    "Data dikumpulkan dari direktori sekolah, instagram, PDF praktek kerja industri dan berita lokal; verifikasi disarankan.",
};
