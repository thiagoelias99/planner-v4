"use client"

import { cn } from "@/lib/utils"
import { ComponentProps, useEffect, useState } from 'react'
import CountUp from "react-countup"
import { ClassNameValue } from "tailwind-merge"


interface Props extends ComponentProps<"p"> {
  amount?: number | undefined
  amountTextClassName?: ClassNameValue
  decimals?: number
  prefix?: string
  suffix?: string
}

export default function NumberCountUp({ amount = 0, amountTextClassName, className, decimals = 0, prefix, suffix, ...rest }: Props) {
  const [progress, setProgress] = useState({
    previous: 0,
    current: amount
  })

  useEffect(() => {
    setProgress({
      previous: progress.current,
      current: amount
    })
  }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [amount])

  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      {...rest}
    >
      {prefix ? `${prefix} ` : ""}
      <CountUp
        start={progress.previous}
        end={progress.current}
        duration={1}
        decimals={decimals}
        separator="."
        decimal=","
        className={cn("text-foreground font-semibold text-3xl sm:text-xl", amountTextClassName)}
      />
      {suffix ? ` ${suffix}` : ""}
    </p>
  )
}