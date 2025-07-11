"use client"

import { Activity, Home, LogOut, Plus, Settings, Terminal } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { APP_NAME, APP_VERSION } from "@/constants"
import { accessTokenStorage } from "@/lib/token-storage"
import { cn } from "@/lib/utils"
import { Logo } from "./logo"

const navigationItems = [
  { title: "Dashboard", icon: Home, href: "/dashboard" },
  { title: "Jobs", icon: Terminal, href: "/dashboard/jobs" },
  { title: "Settings", icon: Settings, href: "/dashboard/settings" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    accessTokenStorage.delete()
    await fetch("/api/logout")
    router.push("/")
  }

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      {/* Header */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <Logo />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{APP_NAME}</span>
            <span className="text-xs text-muted-foreground">
              v{APP_VERSION}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.split(item.href).pop() === ""
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  isActive && "bg-secondary font-medium"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Quick Actions */}
      <div className="border-t p-4 flex flex-col gap-2">
        <Link href="/dashboard/create-job">
          <Button className="w-full gap-2">
            <Plus className="h-4 w-4" />
            New Job
          </Button>
        </Link>

        <Button
          onClick={handleLogout}
          variant={"ghost"}
          className="w-full gap-2 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>

        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Activity className="h-3 w-3 text-green-500" />
          System Online
        </div>
      </div>
    </div>
  )
}
