import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EPages } from "@/lib/routes"

export function HeroSection() {
  return (
    <section className="relative w-full py-32 md:py-56">
      <div className="container mx-auto px-6 xl:px-0">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            Transforme suas ideias em{" "}
            <span className="text-primary">realidade</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Uma plataforma completa e moderna que oferece todas as ferramentas necessárias
            para você alcançar seus objetivos de forma rápida e eficiente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={EPages.SIGN_UP}>
              <Button size="lg" className="min-w-[200px]">
                Começar Agora
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="min-w-[200px]">
              Saiba Mais
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export function FeaturesSection() {
  const features = [
    {
      title: "Fácil de Usar",
      description: "Interface intuitiva e moderna que torna a experiência do usuário excepcional.",
      icon: "🚀"
    },
    {
      title: "Seguro e Confiável",
      description: "Seus dados estão protegidos com as melhores práticas de segurança.",
      icon: "🔒"
    },
    {
      title: "Suporte 24/7",
      description: "Nossa equipe está sempre disponível para ajudar você quando precisar.",
      icon: "💬"
    },
    {
      title: "Integração Completa",
      description: "Conecte-se facilmente com suas ferramentas e serviços favoritos.",
      icon: "🔗"
    },
    {
      title: "Performance Alta",
      description: "Tecnologia de ponta que garante velocidade e eficiência em todas as operações.",
      icon: "⚡"
    },
    {
      title: "Personalização",
      description: "Adapte a plataforma às suas necessidades específicas e preferências.",
      icon: "🎨"
    }
  ]

  return (
    <section id="features" className="w-full py-32 md:py-56 bg-muted/30">
      <div className="container mx-auto px-6 xl:px-0">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Por que escolher nossa plataforma?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descobra os recursos que fazem da nossa solução a escolha ideal para seu projeto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-background rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function AboutSection() {
  return (
    <section id="about" className="w-full py-32 md:py-56">
      <div className="container mx-auto px-6 xl:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Sobre Nossa Plataforma
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Desenvolvemos uma solução completa pensando nas necessidades reais dos usuários.
              Nossa missão é simplificar processos complexos e oferecer uma experiência excepcional.
            </p>
            <p className="text-muted-foreground mb-8">
              Com anos de experiência no mercado, nossa equipe trabalha constantemente para
              inovar e entregar as melhores ferramentas para nossos clientes.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">10k+</div>
                <div className="text-sm text-muted-foreground">Usuários Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg aspect-square flex items-center justify-center">
            <div className="text-6xl">📊</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ContactSection() {
  return (
    <section id="contact" className="w-full py-20 bg-muted/30">
      <div className="container mx-auto px-6 xl:px-0">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Pronto para começar?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Junte-se a milhares de usuários que já transformaram seus projetos com nossa plataforma.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={EPages.SIGN_UP}>
              <Button size="lg" className="min-w-[200px]">
                Criar Conta Grátis
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="min-w-[200px]">
              Falar com Vendas
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}