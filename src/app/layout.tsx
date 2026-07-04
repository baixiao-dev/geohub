 import type { Metadata } from "next"
 import { Providers } from "./providers"
 import "./globals.css"

 export const metadata: Metadata = {
   title: "GeoHub - AI GEO 营销平台",
   description:
     "一站式 AI 地理营销平台，帮助商家在 ChatGPT、豆包、Kimi、DeepSeek、Claude 等 AI 平台中获得主动推荐，提升线上可见度。",
  openGraph: {
    title: "GeoHub - AI GEO 营销平台",
    description:
      "一站式 AI 地理营销平台，帮助商家在各大 AI 平台中获得主动推荐。",
    type: "website",
  },
}

 export default function RootLayout({
   children,
 }: Readonly<{
   children: React.ReactNode
 }>) {
   return (
     <html lang="zh-CN" suppressHydrationWarning>
       <body className="min-h-screen bg-background font-sans antialiased">
         <Providers>
           {children}
         </Providers>
       </body>
     </html>
   )
 }
