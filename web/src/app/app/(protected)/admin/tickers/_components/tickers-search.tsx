"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { ETickerType } from "@/models/ticker"

interface TickersSearchProps {
  search: string
  type: string
  autoUpdate: string
  orderBy: string
  order: string
  onSearchChange: (value: string) => void
  onTypeChange: (value: string) => void
  onAutoUpdateChange: (value: string) => void
  onOrderByChange: (value: string) => void
  onOrderChange: (value: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export default function TickersSearch({
  search,
  type,
  autoUpdate,
  orderBy,
  order,
  onSearchChange,
  onTypeChange,
  onAutoUpdateChange,
  onOrderByChange,
  onOrderChange,
  onClearFilters,
  hasActiveFilters
}: TickersSearchProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por símbolo ou nome..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select value={type} onValueChange={onTypeChange}>
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value={ETickerType.STOCK}>Ação</SelectItem>
              <SelectItem value={ETickerType.ETF}>ETF</SelectItem>
              <SelectItem value={ETickerType.REIT}>FII</SelectItem>
              <SelectItem value={ETickerType.GOLD}>Ouro</SelectItem>
              <SelectItem value={ETickerType.CRYPTO}>Cripto</SelectItem>
              <SelectItem value={ETickerType.INTERNATIONAL}>Internacional</SelectItem>
            </SelectContent>
          </Select>

          <Select value={autoUpdate} onValueChange={onAutoUpdateChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Auto-update" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="true">Ativo</SelectItem>
              <SelectItem value="false">Inativo</SelectItem>
            </SelectContent>
          </Select>

          <Select value={orderBy} onValueChange={onOrderByChange}>
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="symbol">Símbolo</SelectItem>
              <SelectItem value="name">Nome</SelectItem>
              <SelectItem value="type">Tipo</SelectItem>
              <SelectItem value="price">Preço</SelectItem>
              <SelectItem value="change">Mudança</SelectItem>
              <SelectItem value="changePercent">Variação %</SelectItem>
              <SelectItem value="updatedAt">Atualização</SelectItem>
            </SelectContent>
          </Select>

          <Select value={order} onValueChange={onOrderChange}>
            <SelectTrigger className="w-30">
              <SelectValue placeholder="Ordem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Crescente</SelectItem>
              <SelectItem value="desc">Decrescente</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="icon"
              onClick={onClearFilters}
              title="Limpar filtros"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
