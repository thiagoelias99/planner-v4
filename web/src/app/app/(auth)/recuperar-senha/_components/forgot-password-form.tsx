"use client"

import { useState } from "react"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { EPages } from "@/lib/routes"

const forgotPasswordFormSchema = z.object({
  email: z.email({ message: "Insira um email válido" }),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(formData: ForgotPasswordFormValues) {
    setIsLoading(true)
    try {
      const { error } = await authClient.requestPasswordReset({
        email: formData.email,
        redirectTo: `${window.location.origin}${EPages.RESET_PASSWORD}`,
      })

      if (error) {
        console.error("Password reset error:", error)
        form.setError("email", {
          type: "manual",
          message: "Erro ao enviar email de recuperação. Tente novamente."
        })
      } else {
        setEmailSent(true)
      }
    } catch (error) {
      console.error("Password reset error:", error)
      form.setError("email", {
        type: "manual",
        message: "Erro ao enviar email de recuperação. Tente novamente."
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Email enviado!</CardTitle>
            <CardDescription>
              Verifique sua caixa de entrada para redefinir sua senha
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enviamos um link de recuperação para <strong>{form.getValues("email")}</strong>.
                  Clique no link para redefinir sua senha.
                </p>
                <p className="text-sm text-muted-foreground">
                  Não recebeu o email? Verifique sua pasta de spam ou tente novamente.
                </p>
              </div>
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEmailSent(false)}
                  className="w-full"
                >
                  Tentar outro email
                </Button>
                <FieldDescription className="text-center">
                  Lembrou da senha? <Link href={EPages.SIGN_IN}>Fazer login</Link>
                </FieldDescription>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Recuperar senha</CardTitle>
          <CardDescription>
            Digite seu email para receber um link de recuperação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      type="email"
                      placeholder="seu@email.com"
                      disabled={isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full"
                >
                  Enviar link de recuperação
                </Button>
                <FieldDescription className="text-center">
                  Lembrou da senha? <Link href={EPages.SIGN_IN}>Fazer login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}