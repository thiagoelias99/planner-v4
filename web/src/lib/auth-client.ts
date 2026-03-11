import { createAuthClient } from "better-auth/react"
import { admin } from "better-auth/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://api.planner.telias.com.br",
  plugins: [
    admin()
  ]
})