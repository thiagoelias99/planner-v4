"use client"

import { ChartPieWithLegend } from "@/components/dashboard/chart-pie-with-legend"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface IAssetsPieChartProps {
  data: { key: string; value: number }[]
}

export default function AssetsPieChart({ data }: IAssetsPieChartProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Distribuição Atual</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartPieWithLegend data={data} />
      </CardContent>
    </Card>
  )
}
