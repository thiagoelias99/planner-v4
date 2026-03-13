"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EOtherAssetType, eOtherAssetTypeMapper } from "@/models/other-asset"
import { Button } from "@/components/ui/button"
import { ArrowDownAZIcon, ArrowUpAZIcon, Trash2Icon } from "lucide-react"

interface Props {
  search: string
  agency: string
  type: string
  orderBy: string
  order: string
  onSearchChange: (value: string) => void
  onAgencyChange: (value: string) => void
  onTypeChange: (value: string) => void
  onOrderByChange: (value: string) => void
  onOrderChange: (value: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export default function OtherAssetsSearch({
  search,
  agency,
  type,
  orderBy,
  order,
  onSearchChange,
  onAgencyChange,
  onTypeChange,
  onOrderByChange,
  onOrderChange,
  onClearFilters,
  hasActiveFilters,
}: Props) {
  return (
    <div className="flex flex-col gap-4 mt-4 w-full p-4 border rounded-xl bg-card">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input for Description */}
        <div className="w-full sm:w-1/3 space-y-2">
          <Label>Descrição</Label>
          <Input
            placeholder="Buscar por descrição..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Agency Input */}
        <div className="w-full sm:w-1/4 space-y-2">
          <Label>Agência/Corretora</Label>
          <Input
            placeholder="Buscar por agência..."
            value={agency}
            onChange={(e) => onAgencyChange(e.target.value)}
          />
        </div>

        {/* Type Select */}
        <div className="w-full sm:w-1/4 space-y-2">
          <Label>Tipo</Label>
          <Select value={type} onValueChange={onTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {Object.entries(eOtherAssetTypeMapper).map(([value, { label }]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-2 border-t mt-2">
        <div className="flex gap-4 w-full sm:w-auto">
          {/* Order By */}
          <div className="space-y-2 w-full sm:w-48">
            <Label>Ordenar por</Label>
            <Select value={orderBy} onValueChange={onOrderByChange}>
              <SelectTrigger>
                <SelectValue placeholder="Ordernar por..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Data de Criação</SelectItem>
                <SelectItem value="updatedAt">Última Atualização</SelectItem>
                <SelectItem value="description">Descrição</SelectItem>
                <SelectItem value="value">Valor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Direction */}
          <div className="space-y-2 w-full sm:w-48">
            <Label>Direção</Label>
            <Select value={order} onValueChange={onOrderChange}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  {order === "asc" ? <ArrowUpAZIcon className="w-4 h-4" /> : <ArrowDownAZIcon className="w-4 h-4" />}
                  <span>{order === "asc" ? "Crescente" : "Decrescente"}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">
                  <div className="flex items-center gap-2">
                    <ArrowUpAZIcon className="w-4 h-4" />
                    <span>Crescente</span>
                  </div>
                </SelectItem>
                <SelectItem value="desc">
                  <div className="flex items-center gap-2">
                    <ArrowDownAZIcon className="w-4 h-4" />
                    <span>Decrescente</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-end self-end sm:self-auto w-full sm:w-auto mt-4 sm:mt-0">
            <Button
              variant="ghost"
              onClick={onClearFilters}
              className="text-muted-foreground w-full sm:w-auto"
            >
              <Trash2Icon className="w-4 h-4 mr-2" />
              Limpar Filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
