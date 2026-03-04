import { NextResponse } from "next/server"
import { GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { s3 } from "@/lib/s3"
import prisma from "@/lib/prisma-client"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticação
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      )
    }

    const { id } = await params

    // Buscar informações do arquivo no banco
    const fileRecord = await prisma.uploadedFile.findUnique({
      where: { id }
    })

    if (!fileRecord) {
      return NextResponse.json(
        { error: "Arquivo não encontrado" },
        { status: 404 }
      )
    }

    // Baixar arquivo do S3
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: fileRecord.key,
    })

    const response = await s3.send(command)

    if (!response.Body) {
      return NextResponse.json(
        { error: "Erro ao baixar arquivo" },
        { status: 500 }
      )
    }

    // Converter stream para bytes
    const bytes = await response.Body.transformToByteArray()
    const buffer = Buffer.from(bytes)

    // Retornar arquivo com nome original
    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": fileRecord.mimeType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fileRecord.originalName)}"`,
        "Content-Length": buffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("Erro ao baixar arquivo:", error)
    return NextResponse.json(
      { error: "Erro ao baixar arquivo" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticação
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      )
    }

    const { id } = await params

    // Buscar informações do arquivo no banco
    const fileRecord = await prisma.uploadedFile.findUnique({
      where: { id }
    })

    if (!fileRecord) {
      return NextResponse.json(
        { error: "Arquivo não encontrado" },
        { status: 404 }
      )
    }

    // Deletar do S3
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: fileRecord.key,
      })
    )

    // Deletar do banco de dados
    await prisma.uploadedFile.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao deletar arquivo:", error)
    return NextResponse.json(
      { error: "Erro ao deletar arquivo" },
      { status: 500 }
    )
  }
}
