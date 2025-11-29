"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Car, Calendar, MapPin, LayoutDashboard, LogOut } from "lucide-react"

export default function AdminNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/araclar", label: "Araçlar", icon: Car },
    { href: "/admin/rezervasyonlar", label: "Rezervasyonlar", icon: Calendar },
    { href: "/admin/lokasyonlar", label: "Lokasyonlar", icon: MapPin },
  ]

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="text-xl font-bold text-blue-600">
              CarBreeze Admin
            </Link>
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => signOut({ callbackUrl: "/admin/giris" })}
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Çıkış</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}

