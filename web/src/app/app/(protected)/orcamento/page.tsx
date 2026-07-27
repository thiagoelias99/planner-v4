"use client";

import { DataTablePagination } from "@/components/tables/template/data-table-pagination";
import BudgetsTable from "@/app/app/(protected)/orcamento/_components/budgets-table";
import BudgetsSearch from "@/app/app/(protected)/orcamento/_components/budgets-search";
import BudgetSummaryCards from "@/app/app/(protected)/orcamento/_components/budget-summary-cards";
import Container from "@/components/ui/container";
import { useBudgets } from "@/hooks/query/use-budgets";
import {
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsString,
  useQueryStates,
} from "nuqs";
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { format } from "date-fns";

export default function BudgetPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(16),
    startDate: parseAsIsoDateTime,
    endDate: parseAsIsoDateTime,
    orderBy: parseAsString.withDefault("date"),
    order: parseAsString.withDefault("desc"),
  });

  const { data: budgets } = useBudgets({
    page: params.page,
    limit: params.limit,
    startDate: params.startDate ? params.startDate.toISOString() : undefined,
    endDate: params.endDate ? params.endDate.toISOString() : undefined,
    orderBy: params.orderBy,
    order: params.order,
  });

  const paginatedData = budgets || {
    page: 1,
    limit: 16,
    total: 0,
    totalPages: 0,
    data: {
      from: new Date(),
      to: new Date(),
      balance: 0,
      predictedBalance: 0,
      incomes: { amount: 0 },
      predictedIncomes: { amount: 0 },
      redemptions: { amount: 0 },
      predictedRedemptions: { amount: 0 },
      expenses: { amount: 0, percentage: 0 },
      predictedExpenses: { amount: 0, percentage: 0 },
      investments: { amount: 0, percentage: 0 },
      predictedInvestments: { amount: 0, percentage: 0 },
      creditCard: { amount: 0, alreadyPaid: 0 },
      predictedCreditCard: { amount: 0, alreadyPaid: 0 },
      transactions: [],
      categories: [],
    },
  };

  const handleClearFilters = () => {
    setParams({
      startDate: null,
      endDate: null,
      orderBy: "date",
      order: "desc",
      page: 1,
    });
  };

  const hasActiveFilters =
    !!params.startDate ||
    !!params.endDate ||
    params.orderBy !== "date" ||
    params.order !== "desc";

  return (
    <Container>
      <div className="flex gap-2 w-fit self-end mb-4">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="w-fit">
              <PlusIcon /> Nova Transação
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Nova Transação</SheetTitle>
              <SheetDescription>
                Preencha as informações para registrar uma nova transação no
                orçamento.
              </SheetDescription>
            </SheetHeader>
            <SheetBody>
              {/* <CreateTransactionForm onSuccess={() => setIsSheetOpen(false)} /> */}
              <p className="text-sm text-muted-foreground">
                Formulário de criação em desenvolvimento...
              </p>
            </SheetBody>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Fechar</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {budgets && <BudgetSummaryCards budget={paginatedData.data} />}

      <BudgetsSearch
        startDate={params.startDate || undefined}
        endDate={params.endDate || undefined}
        orderBy={params.orderBy}
        order={params.order}
        onStartDateChange={(value) =>
          setParams({ startDate: value || null, page: 1 })
        }
        onEndDateChange={(value) =>
          setParams({ endDate: value || null, page: 1 })
        }
        onOrderByChange={(value) => setParams({ orderBy: value, page: 1 })}
        onOrderChange={(value) => setParams({ order: value, page: 1 })}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <BudgetsTable
        data={paginatedData.data.transactions}
        isLoading={!budgets}
      />

      <DataTablePagination
        page={paginatedData.page}
        limit={paginatedData.limit}
        total={paginatedData.total}
        totalPages={paginatedData.totalPages}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
        onLimitChange={(limit) =>
          setParams((prev) => ({ ...prev, limit, page: 1 }))
        }
      />
    </Container>
  );
}
