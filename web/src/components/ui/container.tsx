import { cn } from "@/lib/utils"

export default function Container({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("container mx-auto flex flex-col w-full pt-6 pb-8 px-2 sm:px-4 gap-2 md:gap-4", className)}
      {...rest}
    >
      {children}
    </div>
  )
}