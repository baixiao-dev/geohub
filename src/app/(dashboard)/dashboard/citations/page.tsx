'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Trash2, ExternalLink, CheckCircle } from 'lucide-react';
import { createCitation, getCitations, deleteCitation, updateCitationStatus } from '@/app/actions/citation';
import { getBusinesses } from '@/app/actions/business';
import type { Business, AiCitation } from '@prisma/client';

const PLATFORMS = [
  { value: 'ChatGPT', label: 'ChatGPT', icon: '🤖' },
  { value: '豆包', label: '豆包', icon: '🫘' },
  { value: 'Kimi', label: 'Kimi', icon: '🔥' },
  { value: 'DeepSeek', label: 'DeepSeek', icon: '🧠' },
  { value: 'Claude', label: 'Claude', icon: '💜' },
  { value: '腾讯元宝', label: '腾讯元宝', icon: '💎' },
  { value: '其他', label: '其他', icon: '📌' },
];

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'success' }> = {
  pending: { label: '待验证', variant: 'secondary' },
  verified: { label: '已验证', variant: 'default' },
  published: { label: '已展示', variant: 'success' },
};

export default function CitationsPage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [citations, setCitations] = useState<(AiCitation & { business: Business })[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formPlatform, setFormPlatform] = useState('ChatGPT');
  const [formKeyword, setFormKeyword] = useState('');
  const [formScreenshotUrl, setFormScreenshotUrl] = useState('');

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
    async function loadCitations() {
      if (!selectedBusinessId) return;
      setLoading(true);
      const data = await getCitations(selectedBusinessId);
      setCitations(data);
      setLoading(false);
    }
    loadCitations();
  }, [selectedBusinessId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedBusinessId) return;
    setSubmitting(true);

    const formData = new FormData();
    formData.append('businessId', selectedBusinessId);
    formData.append('platform', formPlatform);
    formData.append('queryKeyword', formKeyword);
    formData.append('screenshotUrl', formScreenshotUrl);

    const result = await createCitation(formData);
    if (result.success) {
      setOpen(false);
      setFormKeyword('');
      setFormScreenshotUrl('');
      const data = await getCitations(selectedBusinessId);
      setCitations(data);
      router.refresh();
    } else {
      alert(result.message || '创建失败');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条引用证据吗？')) return;
    await deleteCitation(id);
    const data = await getCitations(selectedBusinessId);
    setCitations(data);
  };

  const handleVerify = async (id: string) => {
    await updateCitationStatus(id, 'verified');
    const data = await getCitations(selectedBusinessId);
    setCitations(data);
  };

  const getPlatformIcon = (platform: string) => {
    return PLATFORMS.find((p) => p.value === platform)?.icon || '📌';
  };

  const totalCitations = citations.length;
  const verifiedCount = citations.filter((c) => c.status === 'verified').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">引用证据</h1>
        <div className="flex gap-4 items-center">
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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
  <Plus className="mr-2 h-4 w-4" /> 添加证据
</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加 AI 引用证据</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>AI 平台</Label>
                    <Select value={formPlatform} onValueChange={(value: string) => setFormPlatform(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择平台" />
                      </SelectTrigger>
                      <SelectContent>
                        {PLATFORMS.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.icon} {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>搜索关键词</Label>
                    <Input
                      placeholder="如：附近有什么好吃的"
                      value={formKeyword}
                      onChange={(e) => setFormKeyword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>截图链接（可选）</Label>
                    <Input
                      placeholder="https://example.com/screenshot.png"
                      value={formScreenshotUrl}
                      onChange={(e) => setFormScreenshotUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      建议先将截图上传到图床，再粘贴链接
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    取消
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    保存
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">总引用次数</p>
            <p className="text-3xl font-bold">{totalCitations}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">已验证引用</p>
            <p className="text-3xl font-bold text-green-600">{verifiedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">待验证</p>
            <p className="text-3xl font-bold text-yellow-600">{totalCitations - verifiedCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {loading ? (
          <Card>
            <CardContent className="py-10 text-center">加载中...</CardContent>
          </Card>
        ) : citations.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              还没有引用证据，在 AI 平台搜索店铺后添加截图。
            </CardContent>
          </Card>
        ) : (
          citations.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{getPlatformIcon(item.platform)}</span>
                  <div>
                    <p className="font-medium">{item.platform}</p>
                    <p className="text-sm text-muted-foreground">
                      “{item.queryKeyword}”
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={STATUS_MAP[item.status]?.variant || 'secondary'}>
                    {STATUS_MAP[item.status]?.label || item.status}
                  </Badge>
                  {item.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerify(item.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" /> 验证
                    </Button>
                  )}
                  {item.screenshotUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(item.screenshotUrl || '', '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}