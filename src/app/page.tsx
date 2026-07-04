export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航 - 全部使用原生 a 标签 */}
      <header className="border-b py-4 px-6 flex justify-between items-center">
        <a href="/dashboard" className="text-2xl font-bold no-underline text-inherit hover:opacity-80">
          GeoHub
        </a>
        <nav className="flex gap-6 items-center">
          <a href="/dashboard" className="text-sm hover:underline">
            功能
          </a>
          <a href="/dashboard" className="text-sm hover:underline">
            平台
          </a>
          <a
            href="/dashboard"
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg no-underline"
          >
            登录
          </a>
        </nav>
      </header>

      {/* 主内容 - Hero 区域 */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">
            帮助商家被 <span className="text-blue-600">AI</span> 主动推荐
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            一站式 AI GEO 营销平台，优化您的商家信息在 ChatGPT、豆包、Kimi、DeepSeek 等 AI 平台中的可见度与推荐表现。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* "开始优化" - 纯 a 标签模拟按钮样式 */}
            <a
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg text-lg no-underline inline-flex items-center justify-center w-full sm:w-auto"
            >
              开始优化
            </a>
            {/* "了解更多" - 纯 a 标签模拟按钮样式 */}
            <a
              href="/dashboard/businesses"
              className="border border-gray-300 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg text-lg no-underline text-inherit inline-flex items-center justify-center w-full sm:w-auto"
            >
              了解更多
            </a>
          </div>
        </div>
      </main>

      {/* 底部 */}
      <footer className="border-t py-4 text-center text-sm text-gray-500">
        &copy; 2026 GeoHub AI GEO 平台
      </footer>
    </div>
  );
}
