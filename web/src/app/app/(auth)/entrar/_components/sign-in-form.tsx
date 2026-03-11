"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  FieldSeparator,
} from "@/components/ui/field"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { EPages } from "@/lib/routes"

const loginFormSchema = z.object({
  email: z
    .email({ message: "Insira um email válido" }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
})

type LoginFormValues = z.infer<typeof loginFormSchema>

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function handleGoogleSignIn() {
    setIsLoading(true)
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${process.env.NEXT_PUBLIC_URL}${EPages.DASHBOARD}`,
    }, {
      onSuccess: () => {
        setIsLoading(false)
        router.replace(`${process.env.NEXT_PUBLIC_URL}${EPages.DASHBOARD}`)
      },
      onError: (ctx) => {
        console.error("Google sign-in error:", ctx)
        setIsLoading(false)
      }
    })
  }

  async function onSubmit(formData: LoginFormValues) {
    console.log("Better Auth URL:", process.env.NEXT_PUBLIC_BETTER_AUTH_URL)
    console.log("Callback URL:", `${process.env.NEXT_PUBLIC_URL}${EPages.DASHBOARD}`)

    await authClient.signIn.email({
      email: formData.email,
      password: formData.password,
      callbackURL: `${process.env.NEXT_PUBLIC_URL}${EPages.DASHBOARD}`,
      rememberMe: true,
    }, {
      onRequest: () => {
        setIsLoading(true)
      },
      onSuccess: () => {
        setIsLoading(false)
        router.replace(`${process.env.NEXT_PUBLIC_URL}${EPages.DASHBOARD}`)
      },
      onError: async (ctx) => {
        console.error("Sign in error:", ctx)
        setIsLoading(false)
        if (ctx.error.code === "INVALID_EMAIL_OR_PASSWORD") {
          form.setError("email", {
            type: "manual",
            message: "Email ou senha inválidos"
          })
        }
        if (ctx.error.code === "EMAIL_NOT_VERIFIED") {
          await authClient.sendVerificationEmail({
            email: formData.email,
          })

          form.setError("email", {
            type: "manual",
            message: "Email não verificado. Um novo email de verificação foi enviado."
          })
        }
      }
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bem vindo de volta</CardTitle>
          <CardDescription>
            Faça login com sua conta do Google
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleSignIn}
                  isLoading={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Entrar com Google
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Ou continue com
              </FieldSeparator>
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
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor={field.name}>Senha</FieldLabel>
                      <Link
                        href={EPages.FORGOT_PASSWORD}
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Esqueceu sua senha?
                      </Link>
                    </div>
                    <Input
                      {...field}
                      id={field.name}
                      type="password"
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
                >Entrar</Button>
                <FieldDescription className="text-center">
                  Não tem uma conta? <Link href={EPages.SIGN_UP}>Criar conta</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}