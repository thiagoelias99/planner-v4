import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import CookiesNotification from "@/components/cookies-notification"
import QueryContext from "@/context/query-context"
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ThemeProvider } from "next-themes"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "TE Planner",
  description: "Planeje seu dia a dia de forma eficiente.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="TE Planner" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryContext>
            <NuqsAdapter>
              {children}
              <CookiesNotification />
              <Toaster />
            </NuqsAdapter>
          </QueryContext>
        </ThemeProvider>
      </body>
    </html>
  )
}
