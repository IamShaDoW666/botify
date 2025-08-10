"use client"

import { getConnectedDevices } from "@/actions/device"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useDeviceStore } from "@/store/device-store"
import { useQuery } from "@tanstack/react-query"
import { LayoutDashboard, Send, TabletSmartphoneIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import Logo from "./logo"
import { NavUser } from "./nav-user"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"
import { Skeleton } from "./ui/skeleton"

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { device: currentDevice, setDevice, setInitialState } = useDeviceStore();
  const { data: devices } = useQuery({
    queryKey: ['devices'],
    queryFn: getConnectedDevices,
  });
  useEffect(() => {
    setInitialState(devices?.map((device) => device.body) || []);
  }, [])
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
          {currentDevice ? (
            <SidebarMenuItem>
              <Select onValueChange={(val) => setDevice(val)} defaultValue={currentDevice}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Device" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Devices</SelectLabel>
                    {devices?.map((device) => (
                      (<SelectItem value={device.body} key={device.id} >{device.body}</SelectItem>)
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </SidebarMenuItem>) : <SidebarMenuItem>
            <Skeleton className="w-full h-9" />
          </SidebarMenuItem>}
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
