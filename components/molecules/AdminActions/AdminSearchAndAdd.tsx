"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

interface AdminSearchAndAddProps {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAddClick?: () => void;
  addLabel?: string;
}

export function AdminSearchAndAdd({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onAddClick,
  addLabel = "Tambah",
}: AdminSearchAndAddProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-64"
        />
      </div>
      {onAddClick ? (
        <Button className="gap-2" onClick={onAddClick}>
          <Plus className="h-4 w-4" />
          {addLabel}
        </Button>
      ) : null}
    </div>
  );
}
