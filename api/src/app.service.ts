import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from "@nestjs/config"
import { PrismaService } from "./prisma/prisma.service"
import { auth } from "./utils/auth"
import argon2 from "argon2"
import { EUserRole } from "./users/utils/user-role"

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name)

  constructor(
    private readonly configService: ConfigService,
    private prisma: PrismaService
  ) {
    const adminEmail = this.configService.getOrThrow<string>('ADMIN_USER_EMAIL')
    const adminPassword = this.configService.getOrThrow<string>('ADMIN_PASSWORD')

    prisma.user.findUnique({ where: { email: adminEmail } })
      .then(user => {
        if (!user) {
          auth.api.signUpEmail({
            body: {
              email: adminEmail,
              password: adminPassword,
              name: 'Admin User'
            }
          })
            .then((result) => {
              return prisma.user.update({
                where: { id: result.user.id },
                data: { role: EUserRole.ADMIN }
              })
            })
            .then((result) => {
              this.logger.log(`Admin user created with email: ${adminEmail}`)
            })
            .catch(err => {
              this.logger.error('Error creating admin user:', err)
            })
        } else {
          // Update admin password if user already exists
          argon2.hash(adminPassword).then(hashedPassword => {
            prisma.account.updateMany({
              where: {
                providerId: "credential",
                accountId: user.id
              },
              data: {
                password: hashedPassword
              }
            })
              .then(() => {
                this.logger.log(`Admin user password updated for email: ${adminEmail}`)
              })
              .catch(err => {
                this.logger.error('Error updating admin user password:', err)
              })
          })
            .catch(err => {
              this.logger.error('Error hashing admin password:', err)
            })
        }
      })
  }
}
