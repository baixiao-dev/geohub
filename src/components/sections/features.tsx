import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Radar,
  FileText,
  Share2,
  BarChart3,
} from "lucide-react"

const features = [
  {
    title: "AI 可见度分析",
    description:
      "分析您的商家信息在各大 AI 平台中的检索表现与推荐权重，精准定位优化空间。",
    icon: Radar,
  },
  {
    title: "内容自动生成",
    description:
      "基于 AI 引擎自动生成适配各平台格式的商家描述、关键词与 FAQ，提升被推荐概率。",
    icon: FileText,
  },
  {
    title: "多平台分发",
    description:
      "一键将优化后的商家信息同步至 ChatGPT、豆包、Kimi 等平台，确保信息一致准确。",
    icon: Share2,
  },
  {
    title: "数据监控",
    description:
      "实时追踪商家在各 AI 平台的曝光量、推荐频次与用户互动数据，持续优化策略。",
    icon: BarChart3,
  },
]

export function Features() {
  return (
    <section id="features" className="border-t border-border/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            核心功能
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            让 AI 成为您的免费推广渠道
          </h2>
          <p className="mt-4 text-muted-foreground">
            从分析到优化，从生成到监控，一站式管理您的 AI 地理营销策略
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className="group transition-all hover:shadow-md"
              >
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="mt-2 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
