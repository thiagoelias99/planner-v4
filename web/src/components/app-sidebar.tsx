"use client"

import * as React from "react"
import Image from "next/image"
import { NavAdmin } from "@/components/nav-admin"
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
import { EUserRole, IUser } from "@/models/user"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  sessionUser: IUser
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
        <NavMain />
        <NavSecondary />
        {
          sessionUser.role === EUserRole.ADMIN && <NavAdmin />
        }
      </SidebarContent>
      <SidebarFooter>
        <NavUser sessionUser={sessionUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
