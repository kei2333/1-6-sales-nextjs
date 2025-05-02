// components/app-sidebar.tsx

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarHeader,
  } from "@/components/ui/sidebar";
  import { Home, Search, Upload } from "lucide-react";
  
  const menuItems = [
    {
      title: "今日の売上報告",
      icon: Home,
      href: "/sales/today",
    },
    {
      title: "過去の売上報告",
      icon: Search,
      href: "/sales/history",
    },
    {
      title: "売上報告をする",
      icon: Upload,
      href: "/sales/entry",
    },
  ];
  
  export function AppSidebar() {
    return (
      <Sidebar>
        <SidebarHeader>
          <div className="text-lg font-bold px-4 py-2">売上管理おまかせくん</div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.href} className="flex items-center gap-2 px-2 py-1">
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }
  