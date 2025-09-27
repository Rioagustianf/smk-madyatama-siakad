"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AdminTableCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function AdminTableCard({
  title,
  description,
  children,
}: AdminTableCardProps) {
  return (
    <Card className="border border-primary-900">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">{children}</div>
      </CardContent>
    </Card>
  );
}
