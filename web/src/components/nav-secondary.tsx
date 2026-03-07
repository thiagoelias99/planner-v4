"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { EPages } from "@/lib/routes"
import { SettingsIcon, TicketsIcon } from "lucide-react"

const items = [
  {
    title: "Ordens",
    url: EPages.ORDERS,
    icon: TicketsIcon,
  },
  {
    title: "Configurações",
    url: EPages.USER_ACCOUNT,
    icon: SettingsIcon,
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