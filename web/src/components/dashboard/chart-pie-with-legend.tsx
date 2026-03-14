/* eslint-disable react-hooks/purity */
"use client"

import { Label, Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { ClassNameValue } from "tailwind-merge"

type ChartInput = { key: string; value: number; fill?: string }[]

interface ChartPieDonutActiveProps {
  data: ChartInput
  total?: string
  hideLabels?: boolean
  showInPercentage?: boolean
  className?: ClassNameValue
}

export function ChartPieWithLegend({ data, total, hideLabels, showInPercentage, className }: ChartPieDonutActiveProps) {
  // 🎨 5 cores fixas
  const baseColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ]

  // 🔮 Função para gerar cor aleatória em HSL (mantendo tom agradável)
  const randomColor = () => {
    const hue = Math.floor(Math.random() * 360)
    const saturation = 70 + Math.random() * 20 // 70–90%
    const lightness = 45 + Math.random() * 10 // 45–55%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }

  // ⚙️ Monta o chartConfig dinamicamente
  const chartConfig: ChartConfig = data.reduce(
    (acc, item, index) => {
      const color =
        item.fill || // Usa o fill se já existir
        (index < baseColors.length
          ? baseColors[index]
          : randomColor())

      return {
        ...acc,
        [item.key]: {
          label: item.key.charAt(0).toUpperCase() + item.key.slice(1),
          color,
        },
      }
    },
    { value: { label: "Valor" } }
  )

  // 📊 Adiciona cores no chartData
  const chartData = data.map((item, index) => ({
    ...item,
    fill:
      item.fill || // Usa o fill se já existir
      (index < baseColors.length
        ? baseColors[index]
        : randomColor()),
  }))

  return (
    <ChartContainer
      config={chartConfig}
      className={cn("mx-auto aspect-square h-[250px] min-h-[250px] min-w-0 w-full", className)}
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        {/* <ChartLegend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          content={({ payload }) => (
            <div className="hidden sm:flex flex-col gap-2">
              {payload?.map((entry, index: number) => (
                <div key={`item-${index}`} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-sm"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm capitalize">
                    {(() => {
                      const formattedValue =
                        String(entry.value).length > 20
                          ? `${String(entry.value).substring(0, 20)}...`
                          : entry.value

                      return `${formattedValue} | ${showInPercentage
                        ? `${chartData[index].value.toFixed(2)}%`
                        : chartData[index].value
                        }`
                    })()}
                  </span>
                </div>
              ))}
            </div>
          )}
        /> */}
        <Pie
          label={({ name, value, percent, x, y }) => {
            if (hideLabels) return null

            // Esconde rótulos menores que 8%
            if (percent < 0.08) return null

            return (
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#ffffff"
                fontSize={12}
                fontWeight={700}
              >
                {(() => {
                  const formattedName =
                    String(name).length > 20
                      ? `${String(name).substring(0, 20)}...`
                      : String(name)

                  return showInPercentage
                    ? `${formattedName}: ${(percent * 100).toFixed(1)}%`
                    : `${formattedName}: ${Math.round(value)}`
                })()}
              </text>
            )
          }}
          labelLine={false}
          data={chartData}
          dataKey="value"
          nameKey="key"
          innerRadius={60}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-xl font-bold"
                    >
                      {total}
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
