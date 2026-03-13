"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { EPages } from "@/lib/routes"
import { TicketIcon, UserIcon } from "lucide-react"
import Link from "next/link"

const items = [
  {
    title: "Usuários",
    url: EPages.USERS,
    icon: UserIcon,
  },
  {
    title: "Tickers",
    url: EPages.TICKERS,
    icon: TicketIcon,
  }
]

export function NavAdmin() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Administração</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}