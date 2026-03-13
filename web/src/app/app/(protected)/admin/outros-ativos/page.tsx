"use client"

import { DataTablePagination } from "@/components/tables/template/data-table-pagination"
import OtherAssetsTable from "@/app/app/(protected)/admin/outros-ativos/_components/other-assets-table"
import OtherAssetsSearch from "@/app/app/(protected)/admin/outros-ativos/_components/other-assets-search"
import Container from "@/components/ui/container"
import { useOtherAssets } from "@/hooks/query/use-other-assets"
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"
import { Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import CreateOtherAssetsForm from "./_components/create-other-assets-form"
import { useState } from "react"
import { PlusIcon } from "lucide-react"

export default function OtherAssetsPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(16),
    search: parseAsString.withDefault(""),
    agency: parseAsString.withDefault(""),
    type: parseAsString.withDefault("all"),
    orderBy: parseAsString.withDefault("createdAt"),
    order: parseAsString.withDefault("desc")
  })

  const { data: otherAssets, isLoading } = useOtherAssets({
    page: params.page,
    limit: params.limit,
    description: params.search || undefined,
    agency: params.agency || undefined,
    type: params.type !== "all" ? (params.type as any) : undefined,
    orderBy: params.orderBy as any,
    order: params.order as any
  })

  // Safe fallback if data is still loading to not break UI pagination structure
  const paginatedData = otherAssets || {
    page: 1,
    limit: 16,
    total: 0,
    totalPages: 0,
    data: [],
  }

  const handleClearFilters = () => {
    setParams({
      search: "",
      agency: "",
      type: "all",
      orderBy: "createdAt",
      order: "desc",
      page: 1
    })
  }

  const hasActiveFilters = !!params.search || !!params.agency || (params.type !== "all") || (params.orderBy !== "createdAt") || (params.order !== "desc")

  return (
    <Container>
      <div className="flex gap-2 w-fit self-end mb-2 mt-4">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="w-fit"><PlusIcon className="w-4 h-4 mr-2" /> Novo Ativo</Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
            <SheetHeader>
              <SheetTitle>Novo Ativo</SheetTitle>
              <SheetDescription>
                Preencha as informações para registrar um novo ativo.
              </SheetDescription>
            </SheetHeader>
            <SheetBody className="flex-1 overflow-y-auto pr-2 pb-4 pt-4">
              <CreateOtherAssetsForm onSuccess={() => setIsSheetOpen(false)} />
            </SheetBody>
            <SheetFooter className="mt-auto border-t pt-4">
              <SheetClose asChild>
                <Button variant="outline" className="w-full">Fechar</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <OtherAssetsSearch
        search={params.search}
        agency={params.agency}
        type={params.type}
        orderBy={params.orderBy}
        order={params.order}
        onSearchChange={(value) => setParams({ search: value, page: 1 })}
        onAgencyChange={(value) => setParams({ agency: value, page: 1 })}
        onTypeChange={(value) => setParams({ type: value, page: 1 })}
        onOrderByChange={(value) => setParams({ orderBy: value, page: 1 })}
        onOrderChange={(value) => setParams({ order: value, page: 1 })}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="mt-6">
        <OtherAssetsTable data={paginatedData.data} isLoading={isLoading} />
      </div>

      <div className="mt-4">
        <DataTablePagination
          page={paginatedData.page}
          limit={paginatedData.limit}
          total={paginatedData.total}
          totalPages={paginatedData.totalPages}
          onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
          onLimitChange={(limit) => setParams((prev) => ({ ...prev, limit, page: 1 }))}
        />
      </div>
    </Container>
  )
}
