"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Zap, LogOut } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"
import { deleteCookies } from "@/hooks/logout"
import { Logout } from "../auth/logout"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [user, setUser] = React.useState<{ name?: string; avatarUrl?: string } | null>(null)

  React.useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsLoggedIn(!!token);
    const userData = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
          setUser(parsed);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }
  }, [])

  function handleLogout(){
    router.push("/login")
    setIsLoggedIn(false)
    deleteCookies("token")
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  const navigation = isLoggedIn
    ? [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Explore", href: "/explore" },
        { name: "Create", href: "/create" },
        { name: "Profile", href: "/profile" },
      ]
    : [
        { name: "Home", href: "/" },
        { name: "Explore", href: "/explore" },
        { name: "About", href: "/about" },
      ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                PromptHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Button
                  variant="ghost"
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                    pathname === item.href
                      ? "bg-secondary text-primary"
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  )}
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {!isLoggedIn ? (
              <div className="hidden sm:flex items-center space-x-2">
                <Button
                  onClick={() => router.push("/login")}
                  className="bg-primary text-primary-foreground hover:bg-secondary hover:text-accent-foreground cursor-pointer"
                  variant="secondary"
                >
                  Login
                </Button>

                <Button
                  onClick={() => router.push("/register")}
                  className="hover:bg-muted hover:text-muted-foreground bg-secondary cursor-pointer"
                  variant="outline"
                >
                  Register
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Avatar>
                  <AvatarImage
                    src={user?.avatarUrl || "/placeholder-user.jpg"}
                    alt="Profile"
                    className="cursor-pointer"
                  />
                  <AvatarFallback>
                    {user?.name ? user.name[0] : "U"}
                  </AvatarFallback>
                </Avatar>    
                <Logout onClick={handleLogout} />
           
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border bg-background">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                    pathname === item.href
                      ? "bg-secondary text-primary"
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {isLoggedIn ? (
                <div className="pt-4 pb-3 border-t flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage
                      src={user?.avatarUrl || "/placeholder-user.jpg"}
                      alt="Profile"
                      className="cursor-pointer"
                    />
                    <AvatarFallback>
                      {user?.name ? user.name[0] : "U"}
                    </AvatarFallback>
                  </Avatar>
                <Logout onClick={handleLogout} />
                </div>
              ) : (
                <div className="space-y-2 flex">
                  <Link href="/login" className="block">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-primary text-primary-foreground hover:bg-secondary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" className="block">
                    <Button
                      variant="ghost"
                      className="w-full justify-start bg-muted text-muted-foreground hover:bg-secondary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
