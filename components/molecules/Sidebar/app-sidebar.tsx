"use client";

import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

function useSidebarData() {
  const pathname = usePathname();
  const isStudent = pathname?.startsWith("/dashboard/student");
  const isTeacher = pathname?.startsWith("/dashboard/teacher");
  const isAdmin = pathname?.startsWith("/dashboard/admin");

  if (isStudent) {
    return {
      navMain: [
        { title: "Lihat Nilai", url: "/dashboard/student/lesson-value" },
        { title: "Jadwal Pelajaran", url: "/dashboard/student/schedules" },
      ],
    };
  }

  if (isTeacher) {
    return {
      navMain: [
        { title: "Input Nilai", url: "/dashboard/teacher/lesson-value-input" },
        { title: "Jadwal Pelajaran", url: "/dashboard/teacher/schedules" },
      ],
    };
  }

  if (isAdmin) {
    return {
      navMain: [
        { title: "Dashboard", url: "/dashboard/admin" },
        {
          title: "Akademik",
          url: "#",
          items: [
            { title: "Program Keahlian", url: "/dashboard/admin/academic" },
            { title: "Mata Pelajaran", url: "/dashboard/admin/course" },
            { title: "Kelas", url: "/dashboard/admin/classes" },
            { title: "Jadwal Pelajaran", url: "/dashboard/admin/schedules" },
            { title: "Jadwal Ujian", url: "/dashboard/admin/exams" },
          ],
        },
        {
          title: "Kegiatan",
          url: "#",
          items: [
            {
              title: "Prestasi & Ekstrakurikuler",
              url: "/dashboard/admin/activities",
            },
            { title: "Galeri", url: "/dashboard/admin/galeri" },
            { title: "DUDI & Prakerin", url: "/dashboard/admin/internship" },
          ],
        },
        {
          title: "Informasi",
          url: "#",
          items: [
            { title: "Pengumuman", url: "/dashboard/admin/announcements" },
            { title: "Berita", url: "/dashboard/admin/news" },
          ],
        },
        {
          title: "Profil & Tendik",
          url: "#",
          items: [
            { title: "Profil Sekolah", url: "/dashboard/admin/profile" },
            { title: "Tendik", url: "/dashboard/admin/staff" },
          ],
        },
      ],
    };
  }

  return {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        items: [],
      },
    ],
  };
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data = useSidebarData();
  return (
    <Sidebar {...props} className="bg-primary-950 text-white">
      <SidebarHeader className="bg-primary-950 border-b-2 border-primary-800">
        <SidebarMenu className="bg-primary-950 text-white">
          <SidebarMenuItem>
            <SidebarMenuButton
              className="hover:bg-primary-900 hover:text-white"
              size="lg"
              asChild
            >
              <a href="#">
                <div className="bg-white/15 text-white flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">SMK</span>
                  <span className="opacity-80">Madyatama</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-primary-950">
        <SidebarGroup>
          <SidebarMenu className="gap-2 bg-primary-950 text-white">
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                {item.items?.length ? (
                  <>
                    <SidebarMenuButton className="text-white hover:bg-primary-900">
                      {item.title}
                    </SidebarMenuButton>
                    <SidebarMenuSub className="ml-3 border-l border-primary-800">
                      {item.items.map((sub) => (
                        <SidebarMenuSubItem key={sub.title}>
                          <SidebarMenuSubButton className="text-white" asChild>
                            <a href={sub.url}>{sub.title}</a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </>
                ) : (
                  <SidebarMenuButton
                    asChild
                    className="text-white hover:bg-primary-900 hover:text-white bg-primary-950"
                  >
                    <a href={item.url} className="font-medium">
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
