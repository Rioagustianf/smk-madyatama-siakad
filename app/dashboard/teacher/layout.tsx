"use client";

import React from "react";
import { AppSidebar } from "@/components/molecules/Sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { LogOut, User } from "lucide-react";
import { AvatarWithInitials } from "@/components/ui/avatar-with-initials";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/teacher/login");
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 bg-white">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <div className="flex items-center justify-between w-full">
            <div className="font-semibold">Dashboard Guru</div>
            <div className="">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <AvatarWithInitials
                    src={state.user?.avatar}
                    alt={state.user?.name || "Teacher"}
                    name={state.user?.name || "Teacher"}
                    size="md"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-primary-900"
                  align="start"
                >
                  <DropdownMenuLabel className="text-white">
                    {state.user?.name || "Nama Guru"}
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    className="text-white cursor-pointer"
                    onClick={() => router.push("/profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="font-bold text-white cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4 min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
