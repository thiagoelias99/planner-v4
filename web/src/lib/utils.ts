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

interface FormatPercentageOptions {
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  appendSignage?: boolean
  divideBy?: number
}

export function formatPercentage(value: number = 0, options?: FormatPercentageOptions) {
  const signage = options?.appendSignage ? (value < 0 ? '' : '+') : ''
  const finalValue = options?.divideBy ? value / options.divideBy : value

  return `${signage}${Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: options?.minimumFractionDigits || 2,
    maximumFractionDigits: options?.maximumFractionDigits || 2
  }).format(finalValue)}`
}
