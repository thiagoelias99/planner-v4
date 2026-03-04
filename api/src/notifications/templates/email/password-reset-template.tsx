import React from "react"

import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface PasswordResetProps {
  userFirstname: string
  resetUrl: string
}

const baseUrl = process.env.NEXT_PUBLIC_URL

export const PasswordResetTemplate = ({
  userFirstname,
  resetUrl,
}: PasswordResetProps) => (
  <Html>
    <Head />
    <Body style={{ backgroundColor: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Preview>
        Redefina sua senha de acesso
      </Preview>
      <Container style={{ margin: '0 auto', padding: '20px 0 48px' }}>
        <Link href={baseUrl} style={{ display: 'block', textAlign: 'center' }}>
          <Img
            src={`${baseUrl}/logo/logo-h-light.png`}
            width="170"
            height="50"
            alt="Logo"
            style={{ margin: '0 auto', display: 'block' }}
          />
        </Link>
        <Text style={{ fontSize: '16px', lineHeight: '26px', color: '#374151', marginTop: '32px' }}>
          Olá {userFirstname},
        </Text>
        <Text style={{ fontSize: '16px', lineHeight: '26px', color: '#374151' }}>
          Você solicitou a redefinição de senha para sua conta.
          Clique no botão abaixo para criar uma nova senha.
        </Text>
        <Section style={{ textAlign: 'center', margin: '32px 0' }}>
          <Button
            style={{
              backgroundColor: '#db6720',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '16px',
              textDecoration: 'none',
              textAlign: 'center',
              display: 'inline-block',
              padding: '12px 24px',
              fontWeight: '600'
            }}
            href={resetUrl}
          >
            Redefinir Senha
          </Button>
        </Section>
        <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#6b7280' }}>
          Se você não conseguir clicar no botão acima, copie e cole o link abaixo em seu navegador:
        </Text>
        <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#3b82f6', wordBreak: 'break-all' }}>
          {resetUrl}
        </Text>
        <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#dc2626', marginTop: '24px' }}>
          ⚠️ Este link expira em 1 hora por motivos de segurança.
        </Text>
        <Text style={{ fontSize: '16px', lineHeight: '26px', color: '#374151', marginTop: '32px' }}>
          Atenciosamente,
          <br />
          Equipe de Desenvolvimento
        </Text>
        <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />
        <Text style={{ color: '#9ca3af', fontSize: '12px', lineHeight: '16px' }}>
          Este email foi enviado porque foi solicitada a redefinição de senha para sua conta.
          Se você não fez essa solicitação, ignore este email ou entre em contato conosco.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default PasswordResetTemplate
