import Link from "next/link"
import Image from "next/image"
import { EPages } from "@/lib/routes"

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto py-12 md:py-16 px-6 xl:px-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e descrição */}
          <div className="space-y-4">
            <Link href={EPages.HOME} className="flex items-center space-x-2">
              <Image
                src="/logo/logo-1x1.png"
                width={32}
                height={32}
                alt="Picture of the author"
                className="sm:hidden"
              />
              <Image
                src="/logo/logo-h-light.png"
                width={120}
                height={32}
                alt="Picture of the author"
                className="hidden sm:inline-block dark:hidden"
              />
              <Image
                src="/logo/logo-h-dark.png"
                width={120}
                height={32}
                alt="Picture of the author"
                className="hidden dark:sm:inline-block"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              Uma plataforma moderna e intuitiva para suas necessidades.
            </p>
          </div>

          {/* Links do produto */}
          <div className="space-y-4">
            <h3 className="font-semibold">Produto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                  Recursos
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  Preços
                </Link>
              </li>
              <li>
                <Link href="#docs" className="text-muted-foreground hover:text-primary transition-colors">
                  Documentação
                </Link>
              </li>
            </ul>
          </div>

          {/* Links da empresa */}
          <div className="space-y-4">
            <h3 className="font-semibold">Empresa</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#about" className="text-muted-foreground hover:text-primary transition-colors">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link href="#blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#careers" className="text-muted-foreground hover:text-primary transition-colors">
                  Carreiras
                </Link>
              </li>
            </ul>
          </div>

          {/* Links de suporte */}
          <div className="space-y-4">
            <h3 className="font-semibold">Suporte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#help" className="text-muted-foreground hover:text-primary transition-colors">
                  Central de ajuda
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="#status" className="text-muted-foreground hover:text-primary transition-colors">
                  Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © 2025 Logoipsum. Todos os direitos reservados.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link href={EPages.PRIVACY_POLICY} className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Política de Privacidade
            </Link>
            <Link href={EPages.TERMS_OF_SERVICE} className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}