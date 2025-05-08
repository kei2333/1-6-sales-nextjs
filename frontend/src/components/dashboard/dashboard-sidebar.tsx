"use client";

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
import { Home, Goal, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const menuItems = [
  {
    title: "ダッシュボード",
    icon: Home,
    href: "/admin/dashboard",
  },
  {
    title: "目標設定",
    icon: Goal,
    href: "/admin/target_setting",
  }
];

const stores = ["関東広域", "北陸", "東海", "近畿", "中四国", "九州"];
const storeDict: { [key: string]: string } = {
  関東広域: "kat",
  北陸: "hok",
  東海: "tok",
  近畿: "kin",
  中四国: "chu",
  九州: "kyu",
};

export function AppSidebar() {
  const [openToday, setOpenToday] = useState(false);
  const [openPast, setOpenPast] = useState(false);

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
                    <Link href={item.href} className="flex items-center gap-2 px-2 py-1">
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* 今日の売上報告 */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setOpenToday(!openToday)}>
                  <div className="flex items-center justify-between w-full px-2 py-1">
                    <span className="flex gap-2 items-center">
                      <span>📅</span> 今日の売上報告
                    </span>
                    {openToday ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </SidebarMenuButton>
                {openToday && (
                  <div className="ml-4 mt-1 flex flex-col gap-1">
                    {stores.map((store) => (
                      <Link
                        key={store}
                        href={`/admin/sales/today/${storeDict[store]}`}
                        className="text-sm text-muted-foreground hover:text-primary transition"
                      >
                        {store}
                      </Link>
                    ))}
                  </div>
                )}
              </SidebarMenuItem>

              {/* 過去の売上報告 */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setOpenPast(!openPast)}>
                  <div className="flex items-center justify-between w-full px-2 py-1">
                    <span className="flex gap-2 items-center">
                      <span>🕒</span> 過去の売上報告
                    </span>
                    {openPast ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </SidebarMenuButton>
                {openPast && (
                  <div className="ml-4 mt-1 flex flex-col gap-1">
                    {stores.map((store) => (
                      <Link
                        key={store}
                        href={`/admin/sales/history/${storeDict[store]}`}
                        className="text-sm text-muted-foreground hover:text-primary transition"
                      >
                        {store}
                      </Link>
                    ))}
                  </div>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
