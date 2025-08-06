"use client"

import Link from "next/link"
import { LayoutDashboard, Send, TabletSmartphoneIcon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import SignOutForm from "./sign-out-form"
import Logo from "./logo"
import { usePathname } from "next/navigation"
import { NavUser } from "./nav-user"

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="flex items-center">
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2 py-4 gap-y-2">
          <SidebarMenuItem>
            <SidebarMenuButton isActive={pathname.startsWith('/dashboard')} size="lg">
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <span className={`text-sm font-medium`}>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem >
          <SidebarMenuItem>
            <SidebarMenuButton isActive={pathname.startsWith('/devices')} size="lg">
              <Link href="/devices" className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                  <TabletSmartphoneIcon />
                </div>
                <span className={`text-sm font-medium`}>Devices</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={pathname.startsWith('/send-message')} size="lg">
              <Link href="/send-message" className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                  <Send />
                </div>
                <span className={`text-sm font-medium`}>Send Message</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
