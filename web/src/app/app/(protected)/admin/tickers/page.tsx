"use client"

import { DataTablePagination } from "@/components/tables/template/data-table-pagination"
import TickersTable from "@/app/app/(protected)/admin/tickers/_components/tickers-table"
import TickersSearch from "@/app/app/(protected)/admin/tickers/_components/tickers-search"
import Container from "@/components/ui/container"
import { useTickers } from "@/hooks/query/use-tickers"
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"
import { Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import CreateTickersForm from "./_components/create-tickers-form"
import { useState } from "react"
import { PlusIcon, RefreshCwIcon } from "lucide-react"
import { toast } from "sonner"

export default function TickersPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(16),
    search: parseAsString.withDefault(""),
    type: parseAsString.withDefault("all"),
    autoUpdate: parseAsString.withDefault("all"),
    orderBy: parseAsString.withDefault("symbol"),
    order: parseAsString.withDefault("asc")
  })

  const { data: tickers, autoUpdateTickers } = useTickers({
    page: params.page,
    limit: params.limit,
    search: params.search || undefined,
    type: params.type !== "all" ? params.type : undefined,
    autoUpdate: params.autoUpdate !== "all" ? params.autoUpdate === "true" : undefined,
    orderBy: params.orderBy,
    order: params.order
  })

  const paginatedData = tickers || {
    page: 1,
    limit: 16,
    total: 0,
    totalPages: 0,
    data: [],
  }

  const handleClearFilters = () => {
    setParams({
      search: "",
      type: "all",
      autoUpdate: "all",
      orderBy: "symbol",
      order: "asc",
      page: 1
    })
  }

  const handleAutoUpdate = async () => {
    try {
      await autoUpdateTickers.mutateAsync()
      toast.success("Tickers atualizados com sucesso!")
    } catch (error) {
      const err = error as Error
      const errorMessage = err?.message || "Erro ao atualizar tickers"
      toast.error(errorMessage)
    }
  }

  const hasActiveFilters = !!params.search || (params.type !== "all") || (params.autoUpdate !== "all") || (params.orderBy !== "symbol") || (params.order !== "asc")

  return (
    <Container>
      <div className="flex gap-2 w-fit self-end">
        <Button
          variant="outline"
          className="w-fit"
          onClick={handleAutoUpdate}
          disabled={autoUpdateTickers.isPending}
        >
          <RefreshCwIcon className={autoUpdateTickers.isPending ? "animate-spin" : ""} />
          {autoUpdateTickers.isPending ? "Atualizando..." : "Auto-update"}
        </Button>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="w-fit"><PlusIcon /> Novo Ticker</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Novo Ticker</SheetTitle>
              <SheetDescription>
                Preencha as informações para criar um novo ticker.
              </SheetDescription>
            </SheetHeader>
            <SheetBody>
              <CreateTickersForm onSuccess={() => setIsSheetOpen(false)} />
            </SheetBody>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Fechar</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <TickersSearch
        search={params.search}
        type={params.type}
        autoUpdate={params.autoUpdate}
        orderBy={params.orderBy}
        order={params.order}
        onSearchChange={(value) => setParams({ search: value, page: 1 })}
        onTypeChange={(value) => setParams({ type: value, page: 1 })}
        onAutoUpdateChange={(value) => setParams({ autoUpdate: value, page: 1 })}
        onOrderByChange={(value) => setParams({ orderBy: value, page: 1 })}
        onOrderChange={(value) => setParams({ order: value, page: 1 })}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <TickersTable data={paginatedData.data} isLoading={!tickers} />

      <DataTablePagination
        page={paginatedData.page}
        limit={paginatedData.limit}
        total={paginatedData.total}
        totalPages={paginatedData.totalPages}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
        onLimitChange={(limit) => setParams((prev) => ({ ...prev, limit, page: 1 }))}
      />
    </Container>
  )
}
