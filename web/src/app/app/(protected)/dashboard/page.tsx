"use client"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"

import ExampleTable from "@/components/tables/example-table"
import { DataTablePagination } from "@/components/tables/template/data-table-pagination"
import { useUsers } from "@/hooks/query/use-users"
import { parseAsInteger, useQueryStates } from 'nuqs'

export default function DashboardPage() {
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(8)
  })

  const { data, isFetching } = useUsers(params)

  const paginatedData = data || {
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 0,
    data: [],
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <div className="w-full px-4 lg:px-6">
        <ExampleTable
          data={paginatedData.data}
          isLoading={isFetching}
        />
        <DataTablePagination
          page={paginatedData.page}
          limit={paginatedData.limit}
          total={paginatedData.total}
          totalPages={paginatedData.totalPages}
          onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
          onLimitChange={(limit) => setParams((prev) => ({ ...prev, limit, page: 1 }))}
        />
      </div>
    </div>
  )
}
