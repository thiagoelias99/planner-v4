"use client"

import { useState } from "react"
import { ITickerHolding } from "@/hooks/query/use-dashboard"
import { ETickerType, eTickerTypeMapper } from "@/models/ticker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronsUpDownIcon } from "lucide-react"
import { usePrivacy } from "@/context/privacy-context"
import { formatCurrency, formatPercentage } from "@/lib/utils"

interface ITickersHoldingsTableProps {
  holdings: ITickerHolding[]
}

export function TickersHoldingsTable({ holdings }: ITickersHoldingsTableProps) {
  const { isPrivacyMode } = usePrivacy()
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
                    {formatCurrency(totalValue, { isPrivate: isPrivacyMode })}
                  </p>
                  <p className={`text-xs ${totalProfitLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {!isPrivacyMode && (totalProfitLoss >= 0 ? '+' : '')}
                    {formatCurrency(totalProfitLoss, { isPrivate: isPrivacyMode })}
                    {' '}({formatPercentage(totalProfitLossPercent / 100, { isPrivate: isPrivacyMode })})
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
                          <TableCell className="text-right">{isPrivacyMode ? '•••' : holding.quantity}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(holding.avgPrice, { isPrivate: isPrivacyMode })}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(holding.currentPrice, { isPrivate: isPrivacyMode })}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(holding.invested, { isPrivate: isPrivacyMode })}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(holding.totalValue, { isPrivate: isPrivacyMode })}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className={holding.profitLoss >= 0 ? ' text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                              <p className="font-medium">
                                {!isPrivacyMode && (holding.profitLoss >= 0 ? '+' : '')}
                                {formatCurrency(holding.profitLoss, { isPrivate: isPrivacyMode })}
                              </p>
                              <p className="text-xs">
                                ({formatPercentage(holding.profitLossPercent / 100, { isPrivate: isPrivacyMode })})
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
                            {formatCurrency(holding.totalValue, { isPrivate: isPrivacyMode })}
                          </p>
                          <p className={`text-xs ${holding.profitLoss >= 0 ? 'text-green-600 dark:text-green-600' : 'text-red-600 dark:text-red-400'}`}>
                            {!isPrivacyMode && (holding.profitLoss >= 0 ? '+' : '')}
                            {formatCurrency(holding.profitLoss, { isPrivate: isPrivacyMode })}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Quantidade</p>
                          <p className="font-medium">{isPrivacyMode ? '•••' : holding.quantity}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">P.M.</p>
                          <p className="font-medium">
                            {formatCurrency(holding.avgPrice, { isPrivate: isPrivacyMode })}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Cotação</p>
                          <p className="font-medium">
                            {formatCurrency(holding.currentPrice, { isPrivate: isPrivacyMode })}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Rentabilidade</p>
                          <p className={`font-medium ${holding.profitLoss >= 0 ? 'text-green-600 dark:text-green-600' : 'text-red-600 dark:text-red-400'}`}>
                            {formatPercentage(holding.profitLossPercent / 100, { isPrivate: isPrivacyMode })}
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
