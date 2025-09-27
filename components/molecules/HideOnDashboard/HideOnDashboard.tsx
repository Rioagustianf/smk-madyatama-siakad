"use client";

import React from "react";
import { usePathname } from "next/navigation";

interface HideOnDashboardProps {
  children: React.ReactNode;
}

export function HideOnDashboard({ children }: HideOnDashboardProps) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isStudentLogin = pathname === "/student/login";
  const isTeacherLogin = pathname === "/teacher/login";
  if (isDashboard || isStudentLogin || isTeacherLogin) return null;
  return <>{children}</>;
}
