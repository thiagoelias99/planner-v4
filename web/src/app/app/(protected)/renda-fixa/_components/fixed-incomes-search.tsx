"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { EPosFixedIndex } from "@/models/fixed-income"

interface FixedIncomesSearchProps {
  description: string
  agency: string
  posFixedIndex: string
  orderBy: string
  order: string
  onDescriptionChange: (value: string) => void
  onAgencyChange: (value: string) => void
  onPosFixedIndexChange: (value: string) => void
  onOrderByChange: (value: string) => void
  onOrderChange: (value: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export default function FixedIncomesSearch({
  description,
  agency,
  posFixedIndex,
  orderBy,
  order,
  onDescriptionChange,
  onAgencyChange,
  onPosFixedIndexChange,
  onOrderByChange,
  onOrderChange,
  onClearFilters,
  hasActiveFilters
}: FixedIncomesSearchProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por descrição..."
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="relative flex-1">
            <Input
              placeholder="Buscar por instituição financeira..."
              value={agency}
              onChange={(e) => onAgencyChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select value={posFixedIndex} onValueChange={onPosFixedIndexChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Índice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value={EPosFixedIndex.NONE}>Prefixado</SelectItem>
              <SelectItem value={EPosFixedIndex.CDI}>CDI</SelectItem>
              <SelectItem value={EPosFixedIndex.IPCA}>IPCA</SelectItem>
              <SelectItem value={EPosFixedIndex.IGPM}>IGP-M</SelectItem>
              <SelectItem value={EPosFixedIndex.INPC}>INPC</SelectItem>
              <SelectItem value={EPosFixedIndex.SELIC}>SELIC</SelectItem>
            </SelectContent>
          </Select>

          <Select value={orderBy} onValueChange={onOrderByChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Data de Início</SelectItem>
              <SelectItem value="dueDate">Data de Vencimento</SelectItem>
              <SelectItem value="description">Descrição</SelectItem>
              <SelectItem value="initialInvestment">Valor Inicial</SelectItem>
              <SelectItem value="currentValue">Valor Atual</SelectItem>
              <SelectItem value="updatedAt">Última Atualização</SelectItem>
            </SelectContent>
          </Select>

          <Select value={order} onValueChange={onOrderChange}>
            <SelectTrigger className="w-36">
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
