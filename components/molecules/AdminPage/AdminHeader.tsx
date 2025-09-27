"use client";

import React from "react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function AdminHeader({ title, subtitle, right }: AdminHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle ? <p className="text-muted-foreground">{subtitle}</p> : null}
      </div>
      {right}
    </div>
  );
}
