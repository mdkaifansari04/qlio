"use client";

import { Activity, Home, Plus, Settings, Terminal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_NAME, APP_VERSION } from "@/constants";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

const navigationItems = [
  { title: "Dashboard", icon: Home, href: "/dashboard" },
  { title: "Jobs", icon: Terminal, href: "/dashboard/jobs" },
  { title: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [runningJobs] = useState(3); // Mock running jobs count

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      {/* Header */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <Logo />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{APP_NAME}</span>
            <span className="text-xs text-muted-foreground">v{APP_VERSION}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start gap-2", isActive && "bg-secondary font-medium")}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
                {item.title === "Jobs" && runningJobs > 0 && (
                  <Badge variant="default" className="ml-auto h-5 px-1.5 text-xs">
                    {runningJobs}
                  </Badge>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="border-t p-4">
        <Link href="/dashboard/create-job">
          <Button className="w-full gap-2">
            <Plus className="h-4 w-4" />
            New Job
          </Button>
        </Link>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Activity className="h-3 w-3 text-green-500" />
          System Online
        </div>
      </div>
    </div>
  );
}
