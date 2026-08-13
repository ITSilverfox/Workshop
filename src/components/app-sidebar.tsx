"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BellRing } from "lucide-react";

import { FoxIcon } from "@/components/fox-icon";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NAV_GROUPS } from "@/lib/nav-config";
import { UserMenu } from "@/components/user-menu";

const PINNED_LINKS = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Reminders", url: "/reminders", icon: BellRing },
];

function isActive(pathname: string, url: string) {
  return pathname === url || pathname.startsWith(`${url}/`);
}

export function AppSidebar({
  name,
  email,
  role,
}: {
  name: string;
  email: string;
  role: string | null;
}) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <FoxIcon className="size-4" />
                </div>
                <span className="text-base font-semibold">Workshop Management</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {PINNED_LINKS.map((link) => (
                <SidebarMenuItem key={link.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(pathname, link.url)}
                    tooltip={link.title}
                  >
                    <Link href={link.url}>
                      <link.icon />
                      <span>{link.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.links.map((link) => (
                  <SidebarMenuItem key={link.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(pathname, link.url)}
                      tooltip={link.title}
                    >
                      <Link href={link.url}>
                        <span>{link.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <UserMenu name={name} email={email} role={role} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
