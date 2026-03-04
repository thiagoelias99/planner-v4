import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export interface IActionResponse<T> {
  data?: T | null
  error?: string | null
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
