import { getDashboardStats } from '@/app/actions/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Sparkles,
  FileText,
  Quote,
  TrendingUp,
  Globe,
  Search,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

function ScoreBadge({ score }: { score: number }) {
  if (score >= 80) return <Badge className="bg-green-500">{score}</Badge>;
  if (score >= 60) return <Badge className="bg-yellow-500">{score}</Badge>;
  return <Badge className="bg-red-500">{score}</Badge>;
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const summaryCards = [
    { title: '店铺总数', value: stats.businessCount, icon: Building2, href: '/dashboard/businesses', color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'AI 分析报告', value: stats.reportCount, icon: Sparkles, href: '/dashboard/analysis', color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: '生成内容', value: stats.contentCount, icon: FileText, href: '/dashboard/contents', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: '引用证据', value: stats.citationCount, icon: Quote, href: '/dashboard/citations', color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const scoreCards = [
    { title: '平均综合评分', value: stats.avgTotalScore, icon: TrendingUp, desc: '满分 100' },
    { title: '平均 AI 可见度', value: stats.avgGeoScore, icon: Globe, desc: 'AI 推荐能力' },
    { title: '平均 SEO 基础', value: stats.avgSeoScore, icon: Search, desc: '搜索引擎友好度' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">仪表盘</h1>
        <p className="text-sm text-muted-foreground">GeoHub 数据概览</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href}>
              <Card className="cursor-pointer transition-all hover:shadow-md">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={card.bg + ' p-3 rounded-lg'}>
                    <Icon className={'size-6 ' + card.color} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{card.title}</p>
                    <p className="text-2xl font-bold">{card.value}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scoreCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <Icon className="size-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold">{card.value}</span>
                  <ScoreBadge score={card.value} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">最新店铺</CardTitle>
            <Link href="/dashboard/businesses" className="text-sm text-primary flex items-center gap-1 hover:underline">
              查看全部 <ArrowRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recentBusinesses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">还没有添加店铺</p>
            ) : (
              <div className="space-y-3">
                {stats.recentBusinesses.map((b) => (
                  <Link key={b.id} href="/dashboard/businesses"
                    className="flex items-center justify-between py-2 border-b last:border-0 hover:bg-muted/50 rounded-lg px-2 -mx-2 transition-colors">
                    <div>
                      <p className="text-sm font-medium">{b.name}</p>
                      <p className="text-xs text-muted-foreground">{b.city} · {b.category}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {new Date(b.createdAt).toLocaleDateString('zh-CN')}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">最新分析报告</CardTitle>
            <Link href="/dashboard/analysis" className="text-sm text-primary flex items-center gap-1 hover:underline">
              查看全部 <ArrowRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recentReports.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">还没有分析报告</p>
            ) : (
              <div className="space-y-3">
                {stats.recentReports.map((r) => (
                  <Link key={r.id} href="/dashboard/analysis"
                    className="flex items-center justify-between py-2 border-b last:border-0 hover:bg-muted/50 rounded-lg px-2 -mx-2 transition-colors">
                    <div>
                      <p className="text-sm font-medium">{r.business.name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString('zh-CN')}</p>
                    </div>
                    <ScoreBadge score={r.totalScore} />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
