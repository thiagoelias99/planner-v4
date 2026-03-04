import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { Button } from "../../ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"

interface DataTablePaginationProps {
  page: number
  limit: number
  total: number
  totalPages: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

export function DataTablePagination({ page = 1, limit = 8, total, totalPages, onPageChange, onLimitChange }: DataTablePaginationProps) {

  const paginationControls = {
    currentPage: page || 1,
    totalPages: totalPages,
    canNextPage: page < totalPages,
    canPreviousPage: page > 1,
    isFirstPage: page === 1,
    isLastPage: page === totalPages,
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Itens por página:</span>
        <Select
          value={limit.toString()}
          onValueChange={(value) => onLimitChange(Number(value))}
        >
          <SelectTrigger className="w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="8">8</SelectItem>
            <SelectItem value="16">16</SelectItem>
            <SelectItem value="24">24</SelectItem>
            <SelectItem value="48">48</SelectItem>
            <SelectItem value="96">96</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {total} total
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant={paginationControls.isFirstPage ? "outline" : "default"}
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={paginationControls.isFirstPage}
        >
          <ChevronFirstIcon />
        </Button>
        <Button
          variant={!paginationControls.canPreviousPage ? "outline" : "default"}
          size="icon"
          onClick={() => onPageChange(page - 1)}
          disabled={!paginationControls.canPreviousPage}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          variant={!paginationControls.canNextPage ? "outline" : "default"}
          size="icon"
          onClick={() => onPageChange(page + 1)}
          disabled={!paginationControls.canNextPage}
        >
          <ChevronRightIcon />
        </Button>
        <Button
          variant={(paginationControls.isLastPage || paginationControls.totalPages === 0) ? "outline" : "default"}
          size="icon"
          onClick={() => onPageChange(paginationControls.totalPages)}
          disabled={paginationControls.isLastPage || paginationControls.totalPages === 0}
        >
          <ChevronLastIcon />
        </Button>
      </div>
    </div>
  )
}