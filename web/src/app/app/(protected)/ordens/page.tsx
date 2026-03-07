"use client"

import { DataTablePagination } from "@/components/tables/template/data-table-pagination"
import TickerOrdersTable from "@/app/app/(protected)/ordens/_components/ticker-orders-table"
import TickerOrdersSearch from "@/app/app/(protected)/ordens/_components/ticker-orders-search"
import Container from "@/components/ui/container"
import { useTickerOrders } from "@/hooks/query/use-ticker-orders"
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"
import { Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import CreateTickerOrdersForm from "./_components/create-ticker-orders-form"
import { useState } from "react"
import { PlusIcon } from "lucide-react"

export default function OrdersPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(16),
    search: parseAsString.withDefault(""),
    type: parseAsString.withDefault("all"),
    orderBy: parseAsString.withDefault("createdAt"),
    order: parseAsString.withDefault("desc")
  })

  const { data: tickerOrders } = useTickerOrders({
    page: params.page,
    limit: params.limit,
    search: params.search || undefined,
    type: params.type !== "all" ? params.type : undefined,
    orderBy: params.orderBy,
    order: params.order
  })

  const paginatedData = tickerOrders || {
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
      orderBy: "createdAt",
      order: "desc",
      page: 1
    })
  }

  const hasActiveFilters = !!params.search || (params.type !== "all") || (params.orderBy !== "createdAt") || (params.order !== "desc")

  return (
    <Container>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button className="w-fit self-end"><PlusIcon /> Nova Ordem</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Nova Ordem</SheetTitle>
            <SheetDescription>
              Preencha as informações para criar uma nova ordem de compra ou venda.
            </SheetDescription>
          </SheetHeader>
          <SheetBody>
            <CreateTickerOrdersForm onSuccess={() => setIsSheetOpen(false)} />
          </SheetBody>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Fechar</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <TickerOrdersSearch
        search={params.search}
        type={params.type}
        orderBy={params.orderBy}
        order={params.order}
        onSearchChange={(value) => setParams({ search: value, page: 1 })}
        onTypeChange={(value) => setParams({ type: value, page: 1 })}
        onOrderByChange={(value) => setParams({ orderBy: value, page: 1 })}
        onOrderChange={(value) => setParams({ order: value, page: 1 })}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <TickerOrdersTable data={paginatedData.data} isLoading={!tickerOrders} />

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
