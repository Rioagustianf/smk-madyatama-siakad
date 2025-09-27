import { PageHeader } from "@/components/molecules/PageHeader/PageHeader";
import { Typography } from "@/components/atoms/Typography/Typography";
import { Button } from "@/components/atoms/Button/Button";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div>
      <PageHeader
        title="Akses Ditolak"
        subtitle="Anda tidak memiliki izin untuk mengakses halaman ini"
        breadcrumbs={[{ label: "Unauthorized" }]}
        backgroundImage="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
      />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-6">
              <svg
                className="mx-auto h-24 w-24 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <Typography variant="h2" className="mb-4 text-red-600">
              Akses Ditolak
            </Typography>

            <Typography variant="body1" className="mb-6 text-gray-600">
              Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
              Silakan hubungi administrator jika Anda merasa ini adalah
              kesalahan.
            </Typography>

            <div className="space-y-3">
              <Button asChild className="w-full bg-primary-700 text-white">
                <Link href="/student/login">Kembali ke Login Siswa</Link>
              </Button>

              <Button asChild variant="outline" className="w-full">
                <Link href="/teacher/login">Login sebagai Guru/Admin</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
