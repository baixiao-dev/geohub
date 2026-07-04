import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-28">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            帮助商家被 AI
            <br />
            <span className="text-muted-foreground">主动推荐</span>
          </h1>
          <p className="mt-6 text-base text-muted-foreground sm:text-lg md:mt-8 md:text-xl">
            一站式 AI 地理营销平台，优化您的商家信息在 ChatGPT、豆包、Kimi、
            <br className="hidden sm:inline" />
            DeepSeek、Claude 等 AI 平台中的可见度与推荐表现。
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 md:mt-10">
            <Button size="lg" className="h-11 rounded-xl px-6 text-base md:h-12 md:px-8">
              开始优化
              <ArrowRight className="ml-1.5 size-4" />
            </Button>
            <Button variant="outline" size="lg" className="h-11 rounded-xl px-6 text-base md:h-12 md:px-8">
              了解更多
            </Button>
          </div>
        </div>

        {/* Subtle gradient decoration */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 -translate-x-1/2">
          <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-b from-foreground/5 to-transparent opacity-40 blur-3xl" />
        </div>
      </div>
    </section>
  )
}
