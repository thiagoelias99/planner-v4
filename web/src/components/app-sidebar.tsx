"use client"

import * as React from "react"
import Image from "next/image"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconForms,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { User } from "@/generated/prisma/client"
import { EPages } from "@/lib/routes"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Painel",
      url: EPages.DASHBOARD,
      icon: IconDashboard,
    },
    {
      title: "Ciclo de Vida",
      url: "#",
      icon: IconListDetails,
    },
    {
      title: "Análises",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "Arquivos",
      url: EPages.FILES,
      icon: IconFolder,
    },
    {
      title: "Equipe",
      url: EPages.TEAM,
      icon: IconUsers,
    },
    {
      title: "Formulário",
      url: EPages.FORM,
      icon: IconForms,
    },
  ],
  navClouds: [
    {
      title: "Capturar",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Propostas Ativas",
          url: "#",
        },
        {
          title: "Arquivadas",
          url: "#",
        },
      ],
    },
    {
      title: "Proposta",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Propostas Ativas",
          url: "#",
        },
        {
          title: "Arquivadas",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Propostas Ativas",
          url: "#",
        },
        {
          title: "Arquivadas",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Configurações",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Obter Ajuda",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Pesquisar",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Biblioteca de Dados",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Relatórios",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Assistente de Texto",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  sessionUser: User
}

export function AppSidebar({ sessionUser, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <Image
                  src="/logo/logo-1x1.png"
                  width={24}
                  height={24}
                  alt="Logo"
                  className=""
                />
                <span className="text-base font-semibold">Logoipsum</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser sessionUser={sessionUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
