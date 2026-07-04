import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 导航栏 */}
      <header className="border-b py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">GeoHub</h1>
        <nav className="flex gap-4">
          <Link href="/dashboard" className="text-sm hover:underline">
            后台
          </Link>
          <Link href="/dashboard/businesses" className="text-sm hover:underline">
            店铺管理
          </Link>
        </nav>
      </header>

      {/* 主内容 */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">
            帮助商家被 <span className="text-blue-600">AI</span> 主动推荐
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            一站式 AI GEO 营销平台，优化您的商家信息在 ChatGPT、豆包、Kimi、DeepSeek 等 AI 平台中的可见度与推荐表现。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                开始优化
              </Button>
            </Link>
            <Link href="/dashboard/businesses">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                管理店铺
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* 底部 */}
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        © 2026 GeoHub AI GEO 平台
      </footer>
    </div>
  );
}