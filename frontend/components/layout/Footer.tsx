import Link from "next/link"
import { Github, Twitter, Linkedin, Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-primary" />
                          <span className="text-xl font-bold text-foreground">
                            PromptHub
                          </span>
          </Link>

          {/* Social Icons */}
          <div className="flex items-center space-x-4">
            <Link
              href="https://github.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              href="https://twitter.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="https://linkedin.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground">© 2024 PromptHub. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}
