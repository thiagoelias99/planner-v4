"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IBudget } from "@/models/budget";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CreditCardIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";

interface BudgetSummaryCardsProps {
  budget: IBudget;
}

export default function BudgetSummaryCards({
  budget,
}: BudgetSummaryCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo</CardTitle>
          <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(budget.balance)}
          </div>
          <p className="text-xs text-muted-foreground">
            Previsto: {formatCurrency(budget.predictedBalance)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receitas</CardTitle>
          <ArrowUpIcon className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(budget.incomes.amount)}
          </div>
          <p className="text-xs text-muted-foreground">
            Previsto: {formatCurrency(budget.predictedIncomes.amount)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas</CardTitle>
          <ArrowDownIcon className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(budget.expenses.amount)}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatPercentage(budget.expenses.percentage)} | Previsto:{" "}
            {formatCurrency(budget.predictedExpenses.amount)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Investimentos</CardTitle>
          <TrendingDownIcon className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(budget.investments.amount)}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatPercentage(budget.investments.percentage)} | Previsto:{" "}
            {formatCurrency(budget.predictedInvestments.amount)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Cartão de Crédito
          </CardTitle>
          <CreditCardIcon className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(budget.creditCard.amount)}
          </div>
          <p className="text-xs text-muted-foreground">
            Pago: {formatCurrency(budget.creditCard.alreadyPaid)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
