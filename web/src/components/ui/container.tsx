import { cn } from "@/lib/utils"

export default function Container({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("container mx-auto w-full pt-6 pb-8 px-2 sm:px-4 space-y-4 md:space-y-8", className)}
      {...rest}
    >
      {children}
    </div>
  )
}