import { cn } from "@/lib/utils"
import React from 'react'
import { ClassNameValue } from "tailwind-merge"

interface FormBodyProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'className'> {
  className?: ClassNameValue
  children: React.ReactNode
}

export function FormBody({ className, children, ...props }: FormBodyProps) {
  return (
    <form
      className={cn("flex flex-col gap-4 justify-start items-start", className)}
      {...props}
    >
      {children}
    </form>
  )
}
