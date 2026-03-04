import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { CustomLogger } from "../utils/logger"
import { Resend } from "resend"
import EmailVerificationTemplate from "./templates/email/email-verification-template"
import PasswordResetTemplate from "./templates/email/password-reset-template"

@Injectable()
export class MailerService {
  constructor(
    private readonly configService: ConfigService,
  ) {
    this.resendApiKey = this.configService.get<string>("RESEND_API_KEY")
    this.resendDomain = this.configService.get<string>("RESEND_DOMAIN")
    this.enableEmailService = this.configService.get<boolean>("ENABLE_EMAIL_SERVICE") || false

    if (this.enableEmailService) {
      this.resend = new Resend(this.resendApiKey)
    }
  }

  private resendApiKey: string | undefined
  private resendDomain: string | undefined
  private enableEmailService: boolean
  private readonly logger = new CustomLogger(MailerService.name);
  private resend: Resend | undefined

  private checkConfig() {
    if (!this.enableEmailService) {
      this.logger.warn('Email service is disabled. Skipping email sending.')
      return false
    }

    if (!this.resendApiKey) {
      this.logger.error('Resend API key is not configured. Please set RESEND_API_KEY in your environment variables.')
      return false
    }

    if (!this.resendDomain) {
      this.logger.error('Resend domain is not configured. Please set RESEND_DOMAIN in your environment variables.')
      return false
    }

    return true
  }

  async sendEmailVerification(data: {
    name: string
    to: string
    url: string
  }) {
    if (!this.checkConfig() || !this.resend) return
    const { name, to, url } = data
    try {
      const { error } = await this.resend.emails.send({
        from: `TElias APP <app${this.resendDomain}>`,
        to,
        subject: `Confirme seu email - Transforme suas ideias em realidade`,
        react: EmailVerificationTemplate({
          userFirstname: name,
          verificationUrl: url,
        })
      })

      if (error) {
        throw new Error(`Erro ao enviar e-mail: ${error.message}`)
      }

      return { success: true }
    } catch (error) {
      const err = error as Error
      console.error("Erro ao enviar e-mail:", err)
      return { success: false, error: err.message }
    }
  }

  async sendPasswordReset(data: {
    name: string
    to: string
    url: string
  }) {
    if (!this.checkConfig() || !this.resend) return
    const { name, to, url } = data
    try {
      const { error } = await this.resend.emails.send({
        from: `TElias APP <app${this.resendDomain}>`,
        to,
        subject: `Redefinição de senha - Transforme suas ideias em realidade`,
        react: PasswordResetTemplate({
          userFirstname: name,
          resetUrl: url,
        })
      })

      if (error) {
        throw new Error(`Erro ao enviar e-mail: ${error.message}`)
      }

      return { success: true }
    } catch (error) {
      const err = error as Error
      console.error("Erro ao enviar e-mail:", err)
      return { success: false, error: err.message }
    }
  }
}