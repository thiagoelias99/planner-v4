"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"

interface TickerOrdersSearchProps {
  search: string
  type: string
  orderBy: string
  order: string
  onSearchChange: (value: string) => void
  onTypeChange: (value: string) => void
  onOrderByChange: (value: string) => void
  onOrderChange: (value: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export default function TickerOrdersSearch({
  search,
  type,
  orderBy,
  order,
  onSearchChange,
  onTypeChange,
  onOrderByChange,
  onOrderChange,
  onClearFilters,
  hasActiveFilters
}: TickerOrdersSearchProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por ticker..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Select value={type} onValueChange={onTypeChange}>
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="BUY">Compra</SelectItem>
              <SelectItem value="SELL">Venda</SelectItem>
            </SelectContent>
          </Select>

          <Select value={orderBy} onValueChange={onOrderByChange}>
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ticker">Ticker</SelectItem>
              <SelectItem value="type">Tipo</SelectItem>
              <SelectItem value="quantity">Quantidade</SelectItem>
              <SelectItem value="price">Preço</SelectItem>
              <SelectItem value="createdAt">Data Criação</SelectItem>
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
