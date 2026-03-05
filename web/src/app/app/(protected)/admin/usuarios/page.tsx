"use client"

import { DataTablePagination } from "@/components/tables/template/data-table-pagination"
import UsersTable from "@/app/app/(protected)/admin/usuarios/_components/users-table"
import UsersSearch from "@/app/app/(protected)/admin/usuarios/_components/users-search"
import Container from "@/components/ui/container"
import { useUsers } from "@/hooks/query/use-users"
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"

export default function UsersPage() {
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
