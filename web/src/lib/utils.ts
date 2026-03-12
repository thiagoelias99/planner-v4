import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export interface IActionResponse<T> {
  data?: T | null
  error?: string | null
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function elipsify(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

export function capitalize(name: string): string {
  return name
    .toLowerCase()
    .split(' ')
    .filter(word => word.trim().length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
