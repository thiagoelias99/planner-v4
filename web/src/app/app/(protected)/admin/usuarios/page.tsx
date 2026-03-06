"use client"

import { DataTablePagination } from "@/components/tables/template/data-table-pagination"
import UsersTable from "@/app/app/(protected)/admin/usuarios/_components/users-table"
import UsersSearch from "@/app/app/(protected)/admin/usuarios/_components/users-search"
import Container from "@/components/ui/container"
import { useUsers } from "@/hooks/query/use-users"
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"
import { Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import CreateUsersForm from "./_components/create-users-form"
import { useState } from "react"
import { PlusIcon } from "lucide-react"

export default function UsersPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(16),
    search: parseAsString.withDefault(""),
    role: parseAsString.withDefault("all"),
    orderBy: parseAsString.withDefault("name"),
    order: parseAsString.withDefault("asc")
  })

  const { data: users } = useUsers({
    page: params.page,
    limit: params.limit,
    search: params.search || undefined,
    role: params.role !== "all" ? params.role : undefined,
    orderBy: params.orderBy,
    order: params.order
  })

  const paginatedData = users || {
    page: 1,
    limit: 16,
    total: 0,
    totalPages: 0,
    data: [],
  }

  const handleClearFilters = () => {
    setParams({
      search: "",
      role: "all",
      orderBy: "name",
      order: "asc",
      page: 1
    })
  }

  const hasActiveFilters = !!params.search || (params.role !== "all") || (params.orderBy !== "name") || (params.order !== "asc")

  return (
    <Container>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button className="w-fit self-end"><PlusIcon /> Novo Usuário</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Novo Usuário</SheetTitle>
            <SheetDescription>
              Preencha as informações para criar um novo usuário.
            </SheetDescription>
          </SheetHeader>
          <SheetBody>
            <CreateUsersForm onSuccess={() => setIsSheetOpen(false)} />
          </SheetBody>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Fechar</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <UsersSearch
        search={params.search}
        role={params.role}
        orderBy={params.orderBy}
        order={params.order}
        onSearchChange={(value) => setParams({ search: value, page: 1 })}
        onRoleChange={(value) => setParams({ role: value, page: 1 })}
        onOrderByChange={(value) => setParams({ orderBy: value, page: 1 })}
        onOrderChange={(value) => setParams({ order: value, page: 1 })}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <UsersTable data={paginatedData.data} isLoading={!users} />

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
