import { NextResponse } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { s3 } from "@/lib/s3"
import crypto from "crypto"
import prisma from "@/lib/prisma-client"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function POST(req: Request) {
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

    const formData = await req.formData()
    const file = formData.get("file") as File
    const fileDescription = formData.get("description") as string | null

    if (!file) {
      return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 400 })
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const fileExt = file.name.split(".").pop()
    const fileKey = crypto.randomUUID() + "." + fileExt

    // Upload para MinIO
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: file.type,
      })
    )

    const publicUrl = `${process.env.AWS_S3_URL}/${process.env.AWS_S3_BUCKET}/${fileKey}`

    // Salvar no Prisma
    const savedFile = await prisma.uploadedFile.create({
      data: {
        url: publicUrl,
        key: fileKey,
        originalName: file.name,
        description: fileDescription,
        size: file.size,
        mimeType: file.type,
      },
    })

    return NextResponse.json({ success: true, file: savedFile })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Erro no upload" }, { status: 500 })
  }
}