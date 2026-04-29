import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { PrismaService } from "../prisma/prisma.service"
import argon2 from "argon2"
import { admin } from "better-auth/plugins"
import { apiKey } from "@better-auth/api-key"
import { Resend } from "resend"
import EmailVerificationTemplate from "../notifications/templates/email/email-verification-template"
import PasswordResetTemplate from "../notifications/templates/email/password-reset-template"

export const auth = betterAuth({
  database: prismaAdapter(PrismaService.getInstance(), {
    provider: "postgresql",
  }),
  trustedOrigins: process.env.ALLOWED_ORIGINS?.split(';').filter(origin => origin.trim()) || ["http://localhost:3000"],
  session: {
    expiresIn: 60 * 60 * 24 * 90, // 90 days
    updateAge: 60 * 60 * 24 // 1 day (every 1 day the session expiration is updated)
  },
  rateLimit: {
    enabled: true,
    window: 60, // time window in seconds
    max: 100, // max requests in the window
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    password: {
      hash: async (password: string) => {
        return await argon2.hash(password)
      },
      verify: async (data: { hash: string, password: string }) => {
        return await argon2.verify(data.hash, data.password)
      }
    },
    sendResetPassword: async ({ user, url }) => {
      const enableEmailService = process.env.ENABLE_EMAIL_SERVICE === 'true'

      if (!enableEmailService) {
        console.log('Email service is disabled. Skipping password reset email.')
        return
      }

      const resendApiKey = process.env.RESEND_API_KEY
      const resendDomain = process.env.RESEND_DOMAIN

      if (!resendApiKey || !resendDomain) {
        console.error('Resend configuration is missing. Cannot send password reset email.')
        return
      }

      try {
        const resend = new Resend(resendApiKey)
        const { error } = await resend.emails.send({
          from: `TElias APP <app${resendDomain}>`,
          to: user.email,
          subject: 'Redefinição de senha - Transforme suas ideias em realidade',
          react: PasswordResetTemplate({
            userFirstname: user.name || 'Usuário',
            resetUrl: url,
          })
        })

        if (error) {
          console.error('Error sending password reset email:', error)
        }
      } catch (error) {
        console.error('Failed to send password reset email:', error)
      }
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const enableEmailService = process.env.ENABLE_EMAIL_SERVICE === 'true'

      if (!enableEmailService) {
        console.log('Email service is disabled. Skipping verification email.')
        return
      }

      const resendApiKey = process.env.RESEND_API_KEY
      const resendDomain = process.env.RESEND_DOMAIN

      if (!resendApiKey || !resendDomain) {
        console.error('Resend configuration is missing. Cannot send verification email.')
        return
      }

      try {
        const resend = new Resend(resendApiKey)
        const { error } = await resend.emails.send({
          from: `TElias APP <app${resendDomain}>`,
          to: user.email,
          subject: 'Confirme seu email - Transforme suas ideias em realidade',
          react: EmailVerificationTemplate({
            userFirstname: user.name || 'Usuário',
            verificationUrl: url,
          })
        })

        if (error) {
          console.error('Error sending verification email:', error)
        }
      } catch (error) {
        console.error('Failed to send verification email:', error)
      }
    }
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      disableSignUp: false
    },
  },
  plugins: [
    admin(),
    apiKey()
  ]
})