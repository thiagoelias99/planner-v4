"use client"

import { FilesTable } from "./files-table"
import type { UploadedFile } from "@/generated/prisma/client"
import { useRouter } from "next/navigation"

interface FilesClientWrapperProps {
  initialFiles: UploadedFile[]
}

export function FilesClientWrapper({ initialFiles }: FilesClientWrapperProps) {
  const router = useRouter()

  const handleFileDeleted = () => {
    router.refresh()
  }

  return <FilesTable files={initialFiles} onFileDeleted={handleFileDeleted} />
}
