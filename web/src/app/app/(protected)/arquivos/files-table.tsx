"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IconDownload, IconTrash } from "@tabler/icons-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { UploadedFile } from "@/generated/prisma/client"
import { deleteUploadedFile } from "@/actions/file/get-uploaded-files.action"
import { toast } from "sonner"

interface FilesTableProps {
  files: UploadedFile[]
  onFileDeleted: () => void
}

export function FilesTable({ files, onFileDeleted }: FilesTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const handleDelete = async (fileId: string) => {
    if (!confirm("Tem certeza que deseja deletar este arquivo?")) {
      return
    }

    setDeletingId(fileId)
    try {
      const result = await deleteUploadedFile(fileId)

      if (result.success) {
        toast.success("Arquivo deletado com sucesso!")
        onFileDeleted()
      } else {
        toast.error(result.error || "Erro ao deletar arquivo")
      }
    } catch (error) {
      console.error(error)
      toast.error("Erro ao deletar arquivo")
    } finally {
      setDeletingId(null)
    }
  }

  if (files.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Nenhum arquivo enviado ainda
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Arquivo</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Tamanho</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col gap-1">
                  <span className="truncate max-w-[200px]">
                    {file.originalName}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
                  {file.description || "-"}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono text-xs">
                  {file.mimeType.split("/")[1] || file.mimeType}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {formatFileSize(file.size)}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(file.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                  >
                    <a
                      href={`/api/upload/${file.id}`}
                      download
                    >
                      <IconDownload className="size-4" />
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(file.id)}
                    disabled={deletingId === file.id}
                  >
                    <IconTrash className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
