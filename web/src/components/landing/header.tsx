import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EPages } from "@/lib/routes"
import Image from "next/image"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-6 xl:px-0">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href={EPages.HOME} className="flex items-center space-x-2">
              <Image
                src="/logo/logo-1x1.png"
                width={40}
                height={40}
                alt="Picture of the author"
                className="sm:hidden"
              />
              <Image
                src="/logo/logo-h-light.png"
                width={200}
                height={40}
                alt="Picture of the author"
                className="hidden sm:inline-block dark:hidden"
              />
              <Image
                src="/logo/logo-h-dark.png"
                width={200}
                height={40}
                alt="Picture of the author"
                className="hidden dark:sm:inline-block"
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Recursos
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Sobre
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Contato
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href={EPages.SIGN_IN}>
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href={EPages.SIGN_UP}>
              <Button size="sm">
                Registrar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}