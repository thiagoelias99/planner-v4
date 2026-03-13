"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { EPages } from "@/lib/routes"
import { LandmarkIcon, ScaleIcon, TicketsIcon, UserIcon } from "lucide-react"

const items = [
  {
    title: "Ordens",
    url: EPages.ORDERS,
    icon: TicketsIcon,
  },
  {
    title: "Renda Fixa",
    url: EPages.FIXED_INCOMES,
    icon: TicketsIcon,
  },
  {
    title: "Outros Ativos",
    url: EPages.OTHER_ASSETS,
    icon: LandmarkIcon,
  },
  {
    title: "Balanço de Ativos",
    url: EPages.ASSET_BALANCE,
    icon: ScaleIcon,
  },
  {
    title: "Minha Conta",
    url: EPages.USER_ACCOUNT,
    icon: UserIcon,
  }
]

export function NavSecondary() {
  return (
    <SidebarGroup className="mt-auto">
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}