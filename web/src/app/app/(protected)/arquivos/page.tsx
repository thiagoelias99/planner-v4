import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconUpload, IconFiles } from "@tabler/icons-react"
import { UploadForm } from "./upload-form"
import { getUploadedFiles } from "@/actions/file/get-uploaded-files.action"
import { FilesClientWrapper } from "./files-client-wrapper"

export const dynamic = "force-dynamic"

export default async function FilesPage() {
  const result = await getUploadedFiles()
  const files = result.success ? result.files : []

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Seção de Upload */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUpload className="size-5" />
              Upload de Arquivos
            </CardTitle>
            <CardDescription>
              Envie seus arquivos para o servidor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UploadForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconFiles className="size-5" />
              Informações
            </CardTitle>
            <CardDescription>
              Sobre o gerenciamento de arquivos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <p className="text-sm font-medium">Total de Arquivos</p>
              <p className="text-2xl font-bold">{files.length}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Tamanho Total</p>
              <p className="text-2xl font-bold">
                {(files.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Listagem */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Arquivos Enviados</CardTitle>
            <CardDescription>
              Gerencie seus arquivos enviados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FilesClientWrapper initialFiles={files} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
