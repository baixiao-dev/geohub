'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Copy, Check, Sparkles } from 'lucide-react';
import { generateContent, getGeneratedContents, updateContentStatus } from '@/app/actions/content';
import { getBusinesses } from '@/app/actions/business';
import type { Business, GeneratedContent } from '@prisma/client';

const CONTENT_TYPES = [
  { value: 'faq', label: '📋 FAQ 问答' },
  { value: 'website', label: '🌐 官网介绍' },
  { value: 'xiaohongshu', label: '📕 小红书文案' },
  { value: 'wechat', label: '📱 公众号文章' },
  { value: 'dianping', label: '⭐ 大众点评介绍' },
  { value: 'jsonld', label: '🔗 JSON-LD 结构化数据' },
];

export default function ContentsPage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [contents, setContents] = useState<(GeneratedContent & { business: Business })[]>([]);
  const [generating, setGenerating] = useState(false);
  const [contentType, setContentType] = useState('faq');
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
    async function loadContents() {
      if (!selectedBusinessId) return;
      const data = await getGeneratedContents(selectedBusinessId);
      setContents(data);
    }
    loadContents();
  }, [selectedBusinessId]);

  const handleGenerate = async () => {
    if (!selectedBusinessId || !contentType) return;
    setGenerating(true);
    const result = await generateContent(selectedBusinessId, contentType as any);
    if (result.success) {
      const data = await getGeneratedContents(selectedBusinessId);
      setContents(data);
      router.refresh();
    } else {
      alert(result.message || '生成失败');
    }
    setGenerating(false);
  };

  const handleCopy = async (content: GeneratedContent) => {
    try {
      await navigator.clipboard.writeText(content.content);
      setCopiedId(content.id);
      await updateContentStatus(content.id, 'copied');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      alert('复制失败，请手动复制');
    }
  };

  const getTypeLabel = (type: string) => {
    return CONTENT_TYPES.find(t => t.value === type)?.label || type;
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      draft: { label: '草稿', variant: 'secondary' },
      copied: { label: '已复制', variant: 'outline' },
      published: { label: '已发布', variant: 'default' },
    };
    const info = map[status] || map.draft;
    return <Badge variant={info.variant}>{info.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">内容中心</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            生成 AI 优化内容
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              value={selectedBusinessId}
              onValueChange={(value: string) => setSelectedBusinessId(value || '')}
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

            <Select
              value={contentType}
              onValueChange={(value: string) => setContentType(value || '')}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="选择内容类型" />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleGenerate} disabled={generating || !selectedBusinessId}>
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 生成中...
                </>
              ) : (
                '🚀 生成内容'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">已生成的内容</h2>
        {contents.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              还没有生成内容，选择店铺和类型后点击「生成内容」。
            </CardContent>
          </Card>
        ) : (
          contents.map((item) => (
            <Card key={item.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline">{getTypeLabel(item.type)}</Badge>
                    {getStatusBadge(item.status)}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(item)}
                >
                  {copiedId === item.id ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copiedId === item.id ? '已复制' : '复制'}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md max-h-[300px] overflow-y-auto whitespace-pre-wrap text-sm">
                  {item.type === 'faq' ? (
                    (() => {
                      try {
                        const faqs = JSON.parse(item.content);
                        return faqs.map((faq: any, i: number) => (
                          <div key={i} className="mb-3 pb-3 border-b last:border-0">
                            <p className="font-medium">Q: {faq.q}</p>
                            <p className="text-muted-foreground mt-1">A: {faq.a}</p>
                          </div>
                        ));
                      } catch {
                        return item.content;
                      }
                    })()
                  ) : (
                    item.content
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}