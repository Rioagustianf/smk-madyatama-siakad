"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to teacher login page
    router.replace("/teacher/login");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-950 mx-auto"></div>
        <p className="mt-4 text-gray-600">Mengalihkan ke halaman login...</p>
      </div>
    </div>
  );
}
