"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ClassNameValue } from "tailwind-merge"
import { cn } from "@/lib/utils"

interface ChartDataPoint {
  date: string | Date
  value: number
}

interface ChartLineTrendingProps {
  data: ChartDataPoint[]
  scaleOffset?: number
  title: string
  description?: string
  footerDescription?: string
  valueFormatter?: (value: number) => string
  chartColor?: string
  dateFormatter?: (date: string | Date) => string
  className?: ClassNameValue
}

const defaultValueFormatter = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)

const defaultCompactFormatter = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    notation: 'compact',
    compactDisplay: 'short',
    style: 'currency',
    currency: 'BRL',
  }).format(value)

const defaultDateFormatter = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  })
}

export default function ChartLineTrending({
  data,
  scaleOffset = 25000,
  title,
  description,
  footerDescription,
  valueFormatter = defaultValueFormatter,
  chartColor = "var(--chart-1)",
  dateFormatter = defaultDateFormatter,
  className,
}: ChartLineTrendingProps) {
  const chartConfig = {
    value: {
      label: title,
      color: chartColor,
    },
  } satisfies ChartConfig

  // Format chart data
  const chartData = data.map(item => ({
    date: dateFormatter(item.date),
    value: Number(item.value),
  }))

  // Calculate min and max values for Y axis domain
  const values = chartData.map(d => d.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const yAxisMin = Math.max(0, minValue - scaleOffset)
  const yAxisMax = maxValue + scaleOffset

  // Calculate trend
  const firstValue = chartData[0]?.value || 0
  const lastValue = chartData[chartData.length - 1]?.value || 0
  const percentChange = firstValue > 0
    ? ((lastValue - firstValue) / firstValue) * 100
    : 0
  const isPositive = percentChange >= 0

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Nenhum dado disponível</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className={cn("w-full", className)}>
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[yAxisMin, yAxisMax]}
              tickFormatter={(value) => defaultCompactFormatter(value)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => valueFormatter(value as number)}
                />
              }
            />
            <Line
              dataKey="value"
              type="natural"
              stroke={chartColor}
              strokeWidth={2}
              dot={{
                fill: chartColor,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {isPositive ? (
            <>
              Crescimento de {Math.abs(percentChange).toFixed(2)}% no período{" "}
              <TrendingUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Redução de {Math.abs(percentChange).toFixed(2)}% no período{" "}
              <TrendingDown className="h-4 w-4" />
            </>
          )}
        </div>
        {footerDescription && (
          <div className="leading-none text-muted-foreground">
            {footerDescription}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
