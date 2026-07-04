export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background text-xs font-bold">
              G
            </div>
            <span className="text-sm font-semibold tracking-tight">GeoHub</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground">
              隐私政策
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              服务条款
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              联系我们
            </a>
          </nav>
        </div>
        <div className="mt-8 border-t border-border/40 pt-6 text-center text-xs text-muted-foreground sm:text-left">
          &copy; {currentYear} GeoHub. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
