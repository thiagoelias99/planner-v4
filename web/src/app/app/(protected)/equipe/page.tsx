"use client"

import UsersTable from "@/components/tables/users-table"
import { DataTablePagination } from "@/components/tables/template/data-table-pagination"
import { useUsers } from "@/hooks/query/use-users"
import { parseAsInteger, useQueryStates } from 'nuqs'

export default function TeamPage() {
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(24)
  })

  const { data, isFetching, error } = useUsers(params)

  const paginatedData = data || {
    page: 1,
    limit: 24,
    total: 0,
    totalPages: 0,
    data: [],
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-bold tracking-tight">Equipe</h1>
        <p className="text-muted-foreground">
          Gerencie e visualize todos os usuários da plataforma.
        </p>
      </div>
      <div className="w-full px-4 lg:px-6">
        {error ? (
          <div className="text-center py-8 text-destructive">
            Erro ao carregar usuários: {error.message}
          </div>
        ) : (
          <>
            <UsersTable data={paginatedData.data} isLoading={isFetching} />
            <DataTablePagination
              page={paginatedData.page}
              limit={paginatedData.limit}
              total={paginatedData.total}
              totalPages={paginatedData.totalPages}
              onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
              onLimitChange={(limit) => setParams((prev) => ({ ...prev, limit, page: 1 }))}
            />
          </>
        )}
      </div>
    </div>
  )
}
