// app/sales/layout.tsx

import "@/app/globals.css";
import StickyHeader from "@/components/dashboard/sticky-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/dashboard-sidebar";
import type { ReactNode } from "react";

export default function SalesLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* 左側：サイドバー（全高） */}
        <AppSidebar />

        {/* 右側：上がヘッダー、下がメイン */}
        <div className="flex flex-col flex-1 min-w-0">
          <StickyHeader /> {/* ✅ ヘッダーはここ！ */}
          <main className="flex-1 px-6 py-4 overflow-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
