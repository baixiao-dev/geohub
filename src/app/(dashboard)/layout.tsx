"use client"
 
 import * as React from "react"
 import Link from "next/link"
 import { usePathname } from "next/navigation"
 import {
   BarChart3,
   Building2,
   FileText,
   Menu,
   Quote,
   Sparkles,
   LogOut,
   Settings,
   User,
 } from "lucide-react"
 
 import { cn } from "@/lib/utils"
 import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
 import { Button } from "@/components/ui/button"
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu"
 import { Separator } from "@/components/ui/separator"
 import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
 } from "@/components/ui/sheet"
 import { ThemeToggle } from "@/components/theme-toggle"
 
 const sidebarItems = [
   {
     title: "仪表盘",
     href: "/dashboard",
     icon: BarChart3,
   },
   {
     title: "店铺管理",
     href: "/dashboard/businesses",
     icon: Building2,
   },
   {
     title: "AI 分析",
     href: "/dashboard/analysis",
     icon: Sparkles,
   },
   {
     title: "内容中心",
     href: "/dashboard/contents",
     icon: FileText,
   },
   {
     title: "引用证据",
     href: "/dashboard/citations",
     icon: Quote,
   },
 ]
 
 function SidebarNav({ onNavClick }: { onNavClick?: () => void }) {
   const pathname = usePathname()
 
   return (
     <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
       {sidebarItems.map((item) => {
         const isActive = pathname === item.href
         return (
           <Link
             key={item.href}
             href={item.href}
             onClick={onNavClick}
             className={cn(
               "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-colors",
               isActive
                 ? "bg-accent text-accent-foreground"
                 : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
             )}
           >
             <item.icon className="size-4 shrink-0" />
             <span>{item.title}</span>
           </Link>
         )
       })}
     </nav>
   )
 }
 
 function Sidebar() {
   return (
     <aside className="flex h-full w-60 flex-col border-r bg-sidebar">
       <div className="flex h-14 items-center gap-2 border-b px-4">
         <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
           <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
             G
           </div>
           <span className="text-sm font-semibold">GeoHub</span>
         </Link>
       </div>
       <SidebarNav />
     </aside>
   )
 }
 
 function MobileSidebar() {
   const [open, setOpen] = React.useState(false)
 
   return (
     <>
       <button
         type="button"
         onClick={() => setOpen(true)}
         className="inline-flex items-center justify-center md:hidden rounded-2xl size-8 hover:bg-accent"
       >
         <Menu className="size-5" />
         <span className="sr-only">{'打开菜单'}</span>
       </button>
       <Sheet open={open} onOpenChange={setOpen}>
         <SheetContent side="left" className="w-60 p-0">
           <SheetHeader className="sr-only">
             <SheetTitle>{'导航菜单'}</SheetTitle>
           </SheetHeader>
           <div className="flex h-14 items-center gap-2 border-b px-4">
             <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
               <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
                 G
               </div>
               <span className="text-sm font-semibold">GeoHub</span>
             </Link>
           </div>
           <SidebarNav onNavClick={() => setOpen(false)} />
         </SheetContent>
       </Sheet>
     </>
   )
 }
 
 export default function DashboardLayout({
   children,
 }: {
   children: React.ReactNode
 }) {
   return (
     <div className="flex min-h-screen">
       <div className="hidden md:flex">
         <Sidebar />
       </div>
 
       <div className="flex flex-1 flex-col">
         <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
           <MobileSidebar />
 
           <Link href="/" className="flex items-center gap-2 md:hidden">
             <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
               G
             </div>
             <span className="text-sm font-semibold">GeoHub</span>
           </Link>
 
           <div className="flex-1" />
 
           <ThemeToggle />
 
           <DropdownMenu>
             <DropdownMenuTrigger className="relative size-8 rounded-full outline-none">
               <Avatar className="size-8">
                 <AvatarImage src="/avatars/default.png" alt="user avatar" />
                 <AvatarFallback className="bg-muted">
                   <User className="size-4" />
                 </AvatarFallback>
               </Avatar>
             </DropdownMenuTrigger>
             <DropdownMenuContent className="w-48" align="end">
               <DropdownMenuLabel className="font-normal">
                 <div className="flex flex-col space-y-1">
                   <p className="text-sm font-medium">Admin</p>
                   <p className="text-xs text-muted-foreground">admin@geohub.ai</p>
                 </div>
               </DropdownMenuLabel>
               <DropdownMenuSeparator />
               <DropdownMenuItem>
                 <Settings className="mr-2 size-4" />
                 <span>Settings</span>
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               <DropdownMenuItem className="text-destructive">
                 <LogOut className="mr-2 size-4" />
                 <span>Logout</span>
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
         </header>
 
         <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
       </div>
     </div>
   )
 }
 