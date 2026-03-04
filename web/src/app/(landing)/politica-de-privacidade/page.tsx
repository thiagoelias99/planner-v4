import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Política de Privacidade</h1>
        <p className="text-muted-foreground">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Informações que Coletamos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Coletamos diferentes tipos de informações para fornecer e melhorar nossos serviços:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Informações de Conta:</strong> Nome, endereço de e-mail, senha e outras informações de perfil</li>
              <li><strong>Informações de Uso:</strong> Como você interage com nossa plataforma</li>
              <li><strong>Informações Técnicas:</strong> Endereço IP, tipo de navegador, sistema operacional</li>
              <li><strong>Cookies:</strong> Utilizamos cookies para melhorar sua experiência</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Como Usamos suas Informações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Utilizamos as informações coletadas para:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fornecer, operar e manter nossos serviços</li>
              <li>Melhorar e personalizar sua experiência</li>
              <li>Comunicar com você sobre atualizações e novidades</li>
              <li>Processar transações e pagamentos</li>
              <li>Detectar e prevenir fraudes</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Compartilhamento de Informações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Não vendemos suas informações pessoais. Podemos compartilhar suas informações apenas nas seguintes situações:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Com seu consentimento:</strong> Quando você autoriza expressamente</li>
              <li><strong>Prestadores de serviço:</strong> Terceiros que nos ajudam a operar nossa plataforma</li>
              <li><strong>Exigências legais:</strong> Quando requerido por lei ou autoridades competentes</li>
              <li><strong>Proteção de direitos:</strong> Para proteger nossos direitos, propriedade ou segurança</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Segurança dos Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Criptografia de dados em trânsito e em repouso</li>
              <li>Controles de acesso rigorosos</li>
              <li>Monitoramento contínuo de segurança</li>
              <li>Auditorias regulares de segurança</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Seus Direitos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Você tem os seguintes direitos em relação aos seus dados pessoais:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Acesso:</strong> Solicitar uma cópia dos dados que temos sobre você</li>
              <li><strong>Correção:</strong> Corrigir informações imprecisas ou incompletas</li>
              <li><strong>Exclusão:</strong> Solicitar a exclusão de seus dados</li>
              <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
              <li><strong>Oposição:</strong> Opor-se ao processamento de seus dados</li>
              <li><strong>Restrição:</strong> Limitar o processamento de seus dados</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Retenção de Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os propósitos descritos
              nesta política, exceto quando um período de retenção mais longo for exigido ou permitido por lei.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Cookies e Tecnologias Similares</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Utilizamos cookies e tecnologias similares para:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Manter você logado em sua conta</li>
              <li>Lembrar suas preferências</li>
              <li>Analisar o uso da plataforma</li>
              <li>Personalizar conteúdo e anúncios</li>
            </ul>
            <p className="mt-4">
              Você pode gerenciar as configurações de cookies através do seu navegador.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Alterações nesta Política</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre mudanças
              significativas através do nosso site ou por e-mail. Recomendamos que você revise esta página
              regularmente para se manter informado sobre nossas práticas de privacidade.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Contato</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus direitos,
              entre em contato conosco:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>E-mail: privacidade@empresa.com</li>
              <li>Telefone: (11) 1234-5678</li>
              <li>Endereço: Rua Example, 123, São Paulo, SP</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
