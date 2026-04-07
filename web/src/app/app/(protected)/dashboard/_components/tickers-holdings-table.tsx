"use client"

import { useState } from "react"
import { ITickerHolding } from "@/hooks/query/use-dashboard"
import { ETickerType, eTickerTypeMapper } from "@/models/ticker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronsUpDownIcon } from "lucide-react"

interface ITickersHoldingsTableProps {
  holdings: ITickerHolding[]
}

export function TickersHoldingsTable({ holdings }: ITickersHoldingsTableProps) {
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({})
  if (!holdings || holdings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ativos em Carteira</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">Nenhum ativo em carteira.</p>
        </CardContent>
      </Card>
    )
  }

  // Group holdings by type
  const groupedHoldings = holdings.reduce((acc, holding) => {
    if (!acc[holding.type]) {
      acc[holding.type] = []
    }
    acc[holding.type].push(holding)
    return acc
  }, {} as Record<ETickerType, ITickerHolding[]>)

  // Sort types by total value
  const sortedTypes = Object.keys(groupedHoldings).sort((a, b) => {
    const totalA = groupedHoldings[a as ETickerType].reduce((sum, h) => sum + h.totalValue, 0)
    const totalB = groupedHoldings[b as ETickerType].reduce((sum, h) => sum + h.totalValue, 0)
    return totalB - totalA
  }) as ETickerType[]

  const toggleExpanded = (type: string) => {
    setExpandedTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  return (
    <div className="space-y-4">
      {sortedTypes.map(type => {
        const typeHoldings = groupedHoldings[type]
        const totalValue = typeHoldings.reduce((sum, h) => sum + h.totalValue, 0)
        const totalInvested = typeHoldings.reduce((sum, h) => sum + h.invested, 0)
        const totalProfitLoss = totalValue - totalInvested
        const totalProfitLossPercent = (totalProfitLoss / totalInvested) * 100
        const isExpanded = expandedTypes[type] ?? false

        return (
          <Card key={type} className="gap-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>{eTickerTypeMapper[type].label}</CardTitle>
                  <Badge
                    className="text-white"
                    style={{ backgroundColor: eTickerTypeMapper[type].fill }}
                  >
                    {typeHoldings.length} {typeHoldings.length === 1 ? "ativo" : "ativos"}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
                  </p>
                  <p className={`text-xs ${totalProfitLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {totalProfitLoss >= 0 ? '+' : ''}
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalProfitLoss)}
                    {' '}({totalProfitLossPercent.toFixed(2)}%)
                  </p>
                </div>
              </div>
            </CardHeader>
            <div className="flex w-full justify-center items-center">
              <Button
                variant="ghost"
                className="text-xs text-muted-foreground"
                onClick={() => toggleExpanded(type)}
              >
                Detalhes
                <ChevronsUpDownIcon
                  className={`ml-1 h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              </Button>
            </div>
            {isExpanded && (
              <CardContent>
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ativo</TableHead>
                        <TableHead className="text-right">Qtd.</TableHead>
                        <TableHead className="text-right">P.M.</TableHead>
                        <TableHead className="text-right">Cotação</TableHead>
                        <TableHead className="text-right">Investido</TableHead>
                        <TableHead className="text-right">Atual</TableHead>
                        <TableHead className="text-right">Lucro/Prejuízo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {typeHoldings.map((holding) => (
                        <TableRow key={holding.symbol}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{holding.symbol}</p>
                              <p className="text-xs text-muted-foreground">{holding.name}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{holding.quantity}</TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(holding.avgPrice)}
                          </TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(holding.currentPrice)}
                          </TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(holding.invested)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(holding.totalValue)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className={holding.profitLoss >= 0 ? ' text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                              <p className="font-medium">
                                {holding.profitLoss >= 0 ? '+' : ''}
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(holding.profitLoss)}
                              </p>
                              <p className="text-xs">
                                ({holding.profitLossPercent.toFixed(2)}%)
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-3">
                  {typeHoldings.map((holding) => (
                    <div key={holding.symbol} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{holding.symbol}</p>
                          <p className="text-xs text-muted-foreground">{holding.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(holding.totalValue)}
                          </p>
                          <p className={`text-xs ${holding.profitLoss >= 0 ? 'text-green-600 dark:text-green-600' : 'text-red-600 dark:text-red-400'}`}>
                            {holding.profitLoss >= 0 ? '+' : ''}
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(holding.profitLoss)}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Quantidade</p>
                          <p className="font-medium">{holding.quantity}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">P.M.</p>
                          <p className="font-medium">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(holding.avgPrice)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Cotação</p>
                          <p className="font-medium">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(holding.currentPrice)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Rentabilidade</p>
                          <p className={`font-medium ${holding.profitLoss >= 0 ? 'text-green-600 dark:text-green-600' : 'text-red-600 dark:text-red-400'}`}>
                            {holding.profitLossPercent.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}
