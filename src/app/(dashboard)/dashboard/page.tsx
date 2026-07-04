'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { analyzeBusiness, getAnalysisReports } from '@/app/actions/analysis';
import { getBusinesses } from '@/app/actions/business';
import type { Business, AnalysisReport } from '@prisma/client';

export default function AnalysisPage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [reports, setReports] = useState<(AnalysisReport & { business: Business })[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getBusinesses();
      setBusinesses(data);
      if (data.length > 0) {
        setSelectedBusinessId(data[0].id);
      }
    }
    load();
  }, []);

  useEffect(() => {
    async function loadReports() {
      if (!selectedBusinessId) return;
      const data = await getAnalysisReports(selectedBusinessId);
      setReports(data);
    }
    loadReports();
  }, [selectedBusinessId]);

  const handleAnalyze = async () => {
    if (!selectedBusinessId) return;
    setAnalyzing(true);
    const result = await analyzeBusiness(selectedBusinessId);
    if (result.success) {
      const data = await getAnalysisReports(selectedBusinessId);
      setReports(data);
      router.refresh();
    } else {
      alert(result.message || '分析失败');
    }
    setAnalyzing(false);
  };

  const latestReport = reports[0];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">AI 分析</h1>
        <div className="flex gap-4 items-center">
          <Select
            value={selectedBusinessId}
            onValueChange={(value: string | null) => setSelectedBusinessId(value || '')}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="选择店铺" />
            </SelectTrigger>
            <SelectContent>
              {businesses.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAnalyze} disabled={analyzing || !selectedBusinessId}>
            {analyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 分析中...
              </>
            ) : (
              '开始分析'
            )}
          </Button>
        </div>
      </div>

      {latestReport ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">总体评分</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{latestReport.totalScore}</div>
                <p className="text-xs text-muted-foreground">满分 100</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">AI 可见度</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{latestReport.geoScore}</div>
                <p className="text-xs text-muted-foreground">AI 推荐能力</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">SEO 基础</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{latestReport.seoScore}</div>
                <p className="text-xs text-muted-foreground">搜索引擎友好度</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>分析详情</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" /> 发现的问题
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {(latestReport.issues as string[]).map((issue, i) => (
                    <li key={i} className="text-sm text-muted-foreground">{issue}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" /> 优化建议
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {(latestReport.suggestions as string[]).map((s, i) => (
                    <li key={i} className="text-sm text-muted-foreground">{s}</li>
                  ))}
                </ul>
              </div>
              {latestReport.aiSummary && (
                <div>
                  <h3 className="font-semibold">总结</h3>
                  <p className="text-sm text-muted-foreground">{latestReport.aiSummary}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            选择店铺并点击「开始分析」来生成 AI 可见度报告。
          </CardContent>
        </Card>
      )}
    </div>
  );
}