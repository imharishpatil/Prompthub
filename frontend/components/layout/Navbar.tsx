"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Zap, LogOut } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"

const isAuthPage: boolean = true; //pathname === "/login" || pathname === "/register"
let navigation: Array<{ name: string; href: string }> = []
if (isAuthPage) {
  navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Explore", href: "/explore" },
    { name: "Create", href: "/create" },
    { name: "Profile", href: "/profile" },
  ];
} else {
  navigation = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "About", href: "/about" },
  ];
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-[var(--color-background)] backdrop-blur supports-[backdrop-filter]:bg-[color:var(--color-background)/0.6] border-[var(--color-border)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-[var(--color-primary)]" />
              <span className="text-xl font-bold text-[var(--color-foreground)]">
                PromptHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-[var(--color-secondary)] text-[var(--color-primary)]"
                      : "text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] hover:bg-[var(--color-muted)]"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {!isAuthPage ? (
              <div className="hidden sm:flex items-center space-x-2">
                <Link href="/login">
                  <Button
                    className="bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-secondary)] hover:text-accent-foreground"
                    variant="secondary"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    className="bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)]"
                    variant="outline"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Avatar>
                  <AvatarImage
                    src="/placeholder-user.jpg"
                    alt="Profile"
                    className="cursor-pointer"
                  />
                  <AvatarFallback>H</AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
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
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-[var(--color-border)] bg-[var(--color-background)]">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                    pathname === item.href
                      ? "bg-[var(--color-secondary)] text-[var(--color-primary)]"
                      : "text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] hover:bg-[var(--color-muted)]"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {isAuthPage ? (
                <div className="pt-4 pb-3 border-t flex">
                  <Avatar>
                    <AvatarImage
                      src="/placeholder-user.jpg"
                      alt="Profile"
                      className="cursor-pointer"
                    />
                    <AvatarFallback>H</AvatarFallback>
                  </Avatar>
                  <Button variant="ghost" size="sm">
                    <LogOut />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 flex">
                  <Link href="/login" className="block">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-secondary)]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" className="block">
                    <Button
                      variant="ghost"
                      className="w-full justify-start bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)]"
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
