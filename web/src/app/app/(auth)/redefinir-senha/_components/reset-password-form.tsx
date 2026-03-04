"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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

const resetPasswordFormSchema = z
  .object({
    password: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
    confirmPassword: z.string().min(8, { message: "A confirmação de senha deve ter pelo menos 8 caracteres" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    if (!tokenParam) {
      // Redirect to forgot password page if no token
      router.replace(EPages.FORGOT_PASSWORD)
      return
    }
    setToken(tokenParam)
  }, [searchParams, router])

  async function onSubmit(formData: ResetPasswordFormValues) {
    if (!token) {
      form.setError("password", {
        type: "manual",
        message: "Token inválido. Solicite um novo link de recuperação."
      })
      return
    }

    setIsLoading(true)
    try {
      const { error } = await authClient.resetPassword({
        newPassword: formData.password,
        token,
      })

      if (error) {
        console.error("Password reset error:", error)
        if (error.code === "TOKEN_EXPIRED") {
          form.setError("password", {
            type: "manual",
            message: "Token expirado. Solicite um novo link de recuperação."
          })
        } else {
          form.setError("password", {
            type: "manual",
            message: "Erro ao redefinir senha. Tente novamente."
          })
        }
      } else {
        setResetSuccess(true)
      }
    } catch (error) {
      console.error("Password reset error:", error)
      form.setError("password", {
        type: "manual",
        message: "Erro ao redefinir senha. Tente novamente."
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading while checking token
  if (!token) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Verificando...</CardTitle>
            <CardDescription>
              Verificando token de recuperação
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (resetSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Senha redefinida!</CardTitle>
            <CardDescription>
              Sua senha foi alterada com sucesso
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
                  Sua senha foi alterada com sucesso. Agora você pode fazer login com sua nova senha.
                </p>
              </div>
              <div className="space-y-4">
                <Button
                  onClick={() => router.push(EPages.SIGN_IN)}
                  className="w-full"
                >
                  Fazer login
                </Button>
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
          <CardTitle className="text-xl">Redefinir senha</CardTitle>
          <CardDescription>
            Digite sua nova senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Nova senha</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="password"
                      disabled={isLoading}
                      placeholder="Digite sua nova senha"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Confirmar nova senha</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="password"
                      disabled={isLoading}
                      placeholder="Confirme sua nova senha"
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
                  Redefinir senha
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