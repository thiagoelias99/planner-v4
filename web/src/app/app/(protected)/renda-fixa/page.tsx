"use client"

import { DataTablePagination } from "@/components/tables/template/data-table-pagination"
import FixedIncomesTable from "@/app/app/(protected)/renda-fixa/_components/fixed-incomes-table"
import FixedIncomesSearch from "@/app/app/(protected)/renda-fixa/_components/fixed-incomes-search"
import Container from "@/components/ui/container"
import { useFixedIncomes } from "@/hooks/query/use-fixed-incomes"
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"
import { Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import CreateFixedIncomesForm from "./_components/create-fixed-incomes-form"
import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { EPosFixedIndex } from "@/models/fixed-income"

export default function FixedIncomesPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(16),
    description: parseAsString.withDefault(""),
    agency: parseAsString.withDefault(""),
    posFixedIndex: parseAsString.withDefault("all"),
    orderBy: parseAsString.withDefault("date"),
    order: parseAsString.withDefault("desc")
  })

  const { data: fixedIncomes } = useFixedIncomes({
    page: params.page,
    limit: params.limit,
    description: params.description || undefined,
    agency: params.agency || undefined,
    posFixedIndex: params.posFixedIndex !== "all" ? (params.posFixedIndex as EPosFixedIndex) : undefined,
    orderBy: params.orderBy,
    order: params.order
  })

  const paginatedData = fixedIncomes || {
    page: 1,
    limit: 16,
    total: 0,
    totalPages: 0,
    data: [],
  }

  const handleClearFilters = () => {
    setParams({
      description: "",
      agency: "",
      posFixedIndex: "all",
      orderBy: "date",
      order: "desc",
      page: 1
    })
  }

  const hasActiveFilters = !!params.description || !!params.agency || (params.posFixedIndex !== "all") || (params.orderBy !== "date") || (params.order !== "desc")

  return (
    <Container>
      <div className="flex gap-2 w-fit self-end">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="w-fit"><PlusIcon /> Nova Renda Fixa</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Nova Renda Fixa</SheetTitle>
              <SheetDescription>
                Preencha as informações para registrar um novo investimento de renda fixa.
              </SheetDescription>
            </SheetHeader>
            <SheetBody>
              <CreateFixedIncomesForm onSuccess={() => setIsSheetOpen(false)} />
            </SheetBody>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Fechar</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <FixedIncomesSearch
        description={params.description}
        agency={params.agency}
        posFixedIndex={params.posFixedIndex}
        orderBy={params.orderBy}
        order={params.order}
        onDescriptionChange={(value) => setParams({ description: value, page: 1 })}
        onAgencyChange={(value) => setParams({ agency: value, page: 1 })}
        onPosFixedIndexChange={(value) => setParams({ posFixedIndex: value, page: 1 })}
        onOrderByChange={(value) => setParams({ orderBy: value, page: 1 })}
        onOrderChange={(value) => setParams({ order: value, page: 1 })}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <FixedIncomesTable data={paginatedData.data} isLoading={!fixedIncomes} />

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

