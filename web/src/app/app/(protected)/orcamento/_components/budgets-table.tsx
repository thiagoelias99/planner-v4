"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/tables/template/data-table";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  ITransactionItem,
  eTransactionCategoryTypeMapper,
  ePaymentMethodMapper,
} from "@/models/budget";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useBudgets } from "@/hooks/query/use-budgets";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { usePrivacy } from "@/context/privacy-context";

interface Props {
  data?: ITransactionItem[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function BudgetsTable({
  data = [],
  isLoading = false,
  emptyMessage = "Nenhuma transação encontrada",
}: Props) {
  const { isPrivacyMode } = usePrivacy();
  const { deleteTransactionItem } = useBudgets();

  function getColumns(): ColumnDef<ITransactionItem>[] {
    return [
      {
        accessorKey: "date",
        header: () => <p className="text-start">Data</p>,
        cell: (row) => {
          const date = row.getValue() as Date;
          return (
            <p className="text-start text-sm">
              {format(new Date(date), "dd/MM/yyyy", { locale: ptBR })}
            </p>
          );
        },
        size: 100,
      },
      {
        accessorKey: "description",
        header: () => <p className="text-start">Descrição</p>,
        cell: (row) => {
          const description = row.getValue() as string;
          const transaction = row.row.original;
          return (
            <div className="flex flex-col">
              <p className="text-start font-medium">{description}</p>
              <p className="text-start text-xs text-muted-foreground">
                {ePaymentMethodMapper[transaction.paymentMethod]}
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: "categoryDescription",
        header: () => <p className="text-start">Categoria</p>,
        cell: (row) => {
          const category = row.getValue() as string;
          return <p className="text-start text-sm">{category}</p>;
        },
        size: 150,
      },
      {
        accessorKey: "type",
        header: () => <p className="text-center">Tipo</p>,
        cell: (row) => {
          const type =
            row.getValue() as keyof typeof eTransactionCategoryTypeMapper;
          const typeInfo = eTransactionCategoryTypeMapper[type];
          return (
            <div className="flex justify-center">
              <Badge variant={typeInfo.variant}>{typeInfo.label}</Badge>
            </div>
          );
        },
        size: 120,
      },
      {
        accessorKey: "value",
        header: () => <p className="text-end">Valor</p>,
        cell: (row) => {
          const value = row.getValue() as number;
          return (
            <p className="text-end font-semibold">
              {formatCurrency(value, { isPrivate: isPrivacyMode })}
            </p>
          );
        },
        size: 130,
      },
      {
        id: "actions",
        header: () => <p className="text-center">Ações</p>,
        cell: (row) => {
          const transaction = row.row.original;

          return (
            <div className="flex justify-center gap-2">
              {/* <Sheet open={isSheetOpen && selectedTransaction?.id === transaction.id} onOpenChange={(open) => {
                setIsSheetOpen(open)
                if (!open) setSelectedTransaction(null)
              }}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedTransaction(transaction)}
                  >
                    <Edit2Icon className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Editar Transação</SheetTitle>
                    <SheetDescription>
                      Atualize as informações da transação.
                    </SheetDescription>
                  </SheetHeader>
                  <SheetBody>
                    {selectedTransaction && (
                      <UpdateTransactionForm
                        transaction={selectedTransaction}
                        onSuccess={() => setIsSheetOpen(false)}
                      />
                    )}
                  </SheetBody>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button variant="outline">Fechar</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet> */}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir a transação "
                      {transaction.description}"? Esta ação não pode ser
                      desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        try {
                          await deleteTransactionItem.mutateAsync(
                            transaction.id,
                          );
                          toast.success("Transação excluída com sucesso!");
                        } catch (error) {
                          toast.error("Erro ao excluir transação");
                        }
                      }}
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        },
        size: 100,
      },
    ];
  }

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block">
        <DataTable
          columns={getColumns()}
          data={data}
          isLoading={isLoading}
          emptyMessage={emptyMessage}
        />
      </div>

      {/* Mobile View */}
      {/* <div className="md:hidden">
        <MobileBudgetsTable data={data} isLoading={isLoading} />
      </div> */}
    </>
  );
}
