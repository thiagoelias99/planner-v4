import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import NumberCountUp from "../ui/number-count-up"
import { ClassNameValue } from "tailwind-merge"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { ExternalLinkIcon, InfoIcon } from "lucide-react"
import Link from "next/link"
import LoadingIndicator from "../ui/loading-indicator"

interface Props {
  label?: string
  subLabel?: string
  footer?: React.ReactNode
  amount?: number
  isLoading?: boolean
  tooltipContent?: string
  className?: ClassNameValue
  prefix?: string
  suffix?: string
  decimals?: number
  link?: string
  emphasis?: boolean
}

export default function DashboardNumericIndicator({ label, subLabel, footer, amount, isLoading, className, tooltipContent, prefix, suffix, decimals, link, emphasis }: Props) {
  return (
    <Card className={cn("gap-2", { "bg-zinc-100 dark:bg-zinc-800": emphasis }, { "pb-2": footer }, className)}>
      <CardHeader className="relative flex flex-row justify-between items-start">
        <div className="flex flex-row justify-start items-start gap-1">
          <div>
            <CardTitle
              className={cn("text-muted-foreground", { "font-bold": emphasis })}
            >
              {label}
            </CardTitle>
            <span className="text-sm text-muted-foreground italic">{subLabel}</span>
          </div>
          {tooltipContent && (
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="size-5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltipContent}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        {isLoading && (
          <LoadingIndicator size="default" className="absolute -top-4 right-4" />
        )}
        {link && (
          <Link href={link}>
            <ExternalLinkIcon className="text-muted-foreground" />
          </Link>
        )}
      </CardHeader>
      <CardContent className="w-full flex justify-center items-center">
        <NumberCountUp
          amount={amount}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
        />
      </CardContent>
      {footer && (
        <CardFooter className="">
          {footer}
        </CardFooter>
      )}
    </Card>
  )
}
