"use client";

import React, { forwardRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarWithInitialsProps {
  src?: string;
  alt?: string;
  name: string;
  className?: string;
  fallbackClassName?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-24 w-24",
};

const textSizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-3xl",
};

export const AvatarWithInitials = forwardRef<
  HTMLDivElement,
  AvatarWithInitialsProps
>(
  (
    { src, alt, name, className, fallbackClassName, size = "md", ...props },
    ref
  ) => {
    // Generate initials from name
    const getInitials = (fullName: string): string => {
      return fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <Avatar
        ref={ref}
        className={cn(
          sizeClasses[size],
          "cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg hover:ring-2 hover:ring-primary-300 hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 active:scale-95",
          className
        )}
        {...props}
      >
        <AvatarImage src={src} alt={alt || name} />
        <AvatarFallback
          className={cn(
            "bg-primary-600 text-white font-semibold transition-all duration-200 hover:bg-primary-700",
            textSizeClasses[size],
            fallbackClassName
          )}
        >
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
    );
  }
);

AvatarWithInitials.displayName = "AvatarWithInitials";
