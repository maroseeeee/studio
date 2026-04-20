"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  QrCode,
  ClipboardList,
  BarChart3,
  Clock,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    label: "Volunteers",
    icon: Users,
    href: "/volunteers",
  },
  {
    label: "Scanner",
    icon: QrCode,
    href: "/scan",
  },
  {
    label: "Attendance",
    icon: ClipboardList,
    href: "/logs",
  },
  {
    label: "Reports",
    icon: BarChart3,
    href: "/reports",
  },
];

export function SidebarNav({ forceShow = false }: { forceShow?: boolean }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="px-5 py-6 flex-1">
        <Link href="/" className="flex items-center mb-10 overflow-hidden">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <Clock className="text-white w-6 h-6" />
          </div>
          <div className={cn(
            "ml-4 transition-all duration-300 whitespace-nowrap",
            forceShow ? "opacity-100" : "opacity-0 group-hover/sidebar:opacity-100"
          )}>
            <h1 className="text-sm font-black text-primary font-headline leading-none tracking-tighter">
              Dalaw Nazareno<br/>Volunteers
            </h1>
          </div>
        </Link>
        <div className="space-y-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group relative flex items-center p-3 w-full font-semibold rounded-xl transition-all duration-200",
                pathname === route.href 
                  ? "bg-primary text-white shadow-md shadow-primary/10" 
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              )}
            >
              <route.icon className={cn("h-5 w-5 shrink-0")} />
              <span className={cn(
                "ml-4 transition-all duration-300 whitespace-nowrap",
                forceShow ? "opacity-100" : "opacity-0 group-hover/sidebar:opacity-100"
              )}>
                {route.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const currentRoute = routes.find(r => r.href === pathname);

  return (
    <div className="md:hidden sticky top-0 z-50 flex items-center justify-between p-4 border-b bg-white/80 backdrop-blur-lg">
      <div className="flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-primary h-10 w-10">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 border-none">
            <SheetHeader className="sr-only">
               <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <SidebarNav forceShow={true} />
          </SheetContent>
        </Sheet>
        <div className="ml-3">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none block">System</span>
          <span className="text-lg font-black text-primary leading-none uppercase">{currentRoute?.label || "Dashboard"}</span>
        </div>
      </div>
      <Link href="/scan" className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
        <QrCode className="text-white h-5 w-5" />
      </Link>
    </div>
  );
}
