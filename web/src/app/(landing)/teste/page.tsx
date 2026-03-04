import PasswordResetTemplate from "@/actions/mailer/templates/password-reset-template"

export default function TestPage() {
  return (
    <PasswordResetTemplate
      userFirstname="Maria"
      resetUrl="https://exemplo.com/redefinir-senha?token=xyz789"
    />
  )
}
