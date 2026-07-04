import { Button } from "@/components/ui/button"

const navItems = [
  { label: "功能", href: "#features" },
  { label: "平台", href: "#platforms" },
]

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background text-sm font-bold">
              G
            </div>
            <span className="text-base font-semibold tracking-tight">GeoHub</span>
          </a>
          <nav className="hidden items-center gap-8 sm:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <Button variant="outline" size="sm">
          登录
        </Button>
      </div>
    </header>
  )
}
