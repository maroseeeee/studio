
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
  MessageSquare,
  Clock,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    color: "text-primary",
  },
  {
    label: "Volunteers",
    icon: Users,
    href: "/volunteers",
    color: "text-primary",
  },
  {
    label: "Scan QR",
    icon: QrCode,
    href: "/scan",
    color: "text-accent",
  },
  {
    label: "Attendance Logs",
    icon: ClipboardList,
    href: "/logs",
    color: "text-primary",
  },
  {
    label: "Reports",
    icon: BarChart3,
    href: "/reports",
    color: "text-primary",
  },
  {
    label: "AI Communication",
    icon: MessageSquare,
    href: "/communication",
    color: "text-primary",
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-card border-r">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-10">
          <div className="relative w-8 h-8 mr-4 bg-primary rounded-lg flex items-center justify-center">
            <Clock className="text-white w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-primary font-headline">DalawScan</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-muted rounded-lg transition",
                pathname === route.href ? "text-primary bg-muted" : "text-muted-foreground"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MobileNav() {
  return (
    <div className="md:hidden flex items-center p-4 border-b bg-card">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <SidebarNav />
        </SheetContent>
      </Sheet>
      <div className="ml-4 font-bold text-primary text-xl font-headline">DalawScan</div>
    </div>
  );
}
