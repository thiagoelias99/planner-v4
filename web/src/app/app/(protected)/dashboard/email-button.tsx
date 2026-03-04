"use client"

import { Button } from "@/components/ui/button"

interface IEmailButtonProps {
  name?: string
}

export default function EmailButton({ name }: IEmailButtonProps) {


  return (
    <Button >Enviar Email {name}</Button>
  )
}
