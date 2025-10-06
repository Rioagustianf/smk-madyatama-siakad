import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Number helpers
export function roundNumber(
  value: number | string,
  digits: number = 0
): number {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(num)) return 0;
  const factor = Math.pow(10, digits);
  return Math.round(num * factor) / factor;
}

export function calculateLetterGrade(
  score: number
): "A" | "B" | "C" | "D" | "E" {
  const s = Number(score) || 0;
  if (s >= 85) return "A";
  if (s >= 75) return "B";
  if (s >= 65) return "C";
  if (s >= 55) return "D";
  return "E";
}
