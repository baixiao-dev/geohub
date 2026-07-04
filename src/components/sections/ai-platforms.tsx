import { Badge } from "@/components/ui/badge"

const platforms = [
  {
    name: "ChatGPT",
    description: "OpenAI 旗下对话式 AI 助手",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "豆包",
    description: "字节跳动出品 AI 智能助手",
    color: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  {
    name: "Kimi",
    description: "月之暗面科技 AI 助手",
    color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    name: "DeepSeek",
    description: "深度求索 AI 对话模型",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    name: "Claude",
    description: "Anthropic 出品 AI 助手",
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
]

export function AIPlatforms() {
  return (
    <section id="platforms" className="border-t border-border/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            支持的平台
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            覆盖主流 AI 平台
          </h2>
          <p className="mt-4 text-muted-foreground">
            您的商家信息将出现在用户常用的 AI 助手中，精准触达目标客户
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className="group rounded-2xl border border-border/50 bg-card p-6 text-center transition-all hover:border-border hover:shadow-sm"
            >
              <div
                className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold ${platform.color}`}
              >
                {platform.name.slice(0, 2)}
              </div>
              <h3 className="text-sm font-semibold">{platform.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {platform.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
