import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Termos de Serviço</h1>
        <p className="text-muted-foreground">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Aceitação dos Termos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Ao acessar e usar nossa plataforma, você concorda em ficar vinculado a estes Termos de Serviço
              e a todas as leis e regulamentos aplicáveis. Se você não concordar com algum destes termos,
              está proibido de usar ou acessar este site.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Descrição do Serviço</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Nossa plataforma oferece uma variedade de serviços digitais, incluindo mas não se limitando a:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Criação e gerenciamento de conta de usuário</li>
              <li>Acesso a recursos e funcionalidades da plataforma</li>
              <li>Comunicação e suporte ao cliente</li>
              <li>Processamento de transações quando aplicável</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Elegibilidade e Registro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Para usar nossos serviços, você deve:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ter pelo menos 18 anos de idade ou a idade legal em sua jurisdição</li>
              <li>Fornecer informações precisas e completas durante o registro</li>
              <li>Manter a confidencialidade de suas credenciais de login</li>
              <li>Ser responsável por todas as atividades em sua conta</li>
              <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Uso Aceitável</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Você concorda em não usar nossa plataforma para:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Atividades ilegais ou que violem leis locais, estaduais ou federais</li>
              <li>Transmitir conteúdo ofensivo, difamatório ou inadequado</li>
              <li>Interferir no funcionamento da plataforma ou dos serviços</li>
              <li>Tentar acessar contas de outros usuários sem autorização</li>
              <li>Distribuir malware, vírus ou código malicioso</li>
              <li>Realizar engenharia reversa ou tentar extrair código-fonte</li>
              <li>Usar dados de outros usuários para fins comerciais não autorizados</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Propriedade Intelectual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Todo o conteúdo da plataforma, incluindo:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Textos, gráficos, logos, ícones e imagens</li>
              <li>Software, código-fonte e funcionalidades</li>
              <li>Marcas registradas e propriedade intelectual</li>
            </ul>
            <p className="mt-4">
              São de propriedade exclusiva nossa ou de nossos licenciadores e estão protegidos por leis de
              direitos autorais e outras leis de propriedade intelectual.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Privacidade e Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Sua privacidade é importante para nós. Nossa coleta, uso e proteção de informações pessoais
              são regidos por nossa Política de Privacidade, que está incorporada a estes termos por referência.
              Ao usar nossos serviços, você concorda com a coleta e uso de informações de acordo com nossa
              Política de Privacidade.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Pagamentos e Reembolsos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Se aplicável aos nossos serviços:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Todos os preços estão sujeitos a alterações sem aviso prévio</li>
              <li>Os pagamentos devem ser feitos através dos métodos aceitos</li>
              <li>As taxas são não reembolsáveis, exceto quando exigido por lei</li>
              <li>Você é responsável por quaisquer impostos aplicáveis</li>
              <li>Podemos suspender o serviço por falta de pagamento</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Rescisão</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Podemos rescindir ou suspender sua conta e acesso aos serviços, sem aviso prévio, por:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violação destes Termos de Serviço</li>
              <li>Comportamento prejudicial a outros usuários</li>
              <li>Atividades fraudulentas ou ilegais</li>
              <li>Não pagamento de taxas quando aplicável</li>
            </ul>
            <p className="mt-4">
              Você pode encerrar sua conta a qualquer momento entrando em contato conosco.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Limitação de Responsabilidade</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Nossa plataforma é fornecida &ldquo;como está&rdquo; e &ldquo;conforme disponível&rdquo;. Não garantimos que o serviço
              será ininterrupto, seguro ou livre de erros. Em nenhuma circunstância seremos responsáveis por
              danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo perda de lucros,
              dados ou uso, mesmo se tivermos sido avisados da possibilidade de tais danos.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Indenização</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Você concorda em indenizar, defender e manter inofensivos nós, nossos funcionários, diretores
              e agentes de e contra todas as reivindicações, danos, obrigações, perdas, responsabilidades,
              custos ou dívidas e despesas (incluindo honorários advocatícios) resultantes de seu uso dos
              serviços ou violação destes termos.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11. Lei Aplicável</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Estes termos serão interpretados e regidos de acordo com as leis do Brasil, sem considerar
              conflitos de princípios legais. Qualquer disputa relacionada a estes termos será resolvida
              nos tribunais competentes do Brasil.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>12. Alterações nos Termos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão
              em vigor imediatamente após a publicação em nosso site. Seu uso continuado dos serviços após
              tais mudanças constitui aceitação dos novos termos.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>13. Contato</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Se você tiver dúvidas sobre estes Termos de Serviço, entre em contato conosco:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>E-mail: suporte@empresa.com</li>
              <li>Telefone: (11) 1234-5678</li>
              <li>Endereço: Rua Example, 123, São Paulo, SP</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
