'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createBusiness } from '@/app/actions/business';

const CATEGORIES = ['火锅', '川菜', '日料', '西餐', '咖啡', '小吃', '烧烤', '其他'];

export function NewBusinessDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await createBusiness(formData);

    if (result.success) {
      setOpen(false);
      router.refresh();
      alert(result.message);
    } else {
      setError(result.message);
    }
    setLoading(false);
  }

  return (
    <>
      <Button variant="default" onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> 新增店铺
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>新增店铺</DialogTitle>
            <p className="text-sm text-muted-foreground">
              填写店铺信息后提交，带 <span className="text-red-500">*</span> 的为必填项。
            </p>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    店铺名称 <span className="text-red-500">*</span>
                  </Label>
                  <Input id="name" name="name" placeholder="如：海底捞" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">
                    城市 <span className="text-red-500">*</span>
                  </Label>
                  <Input id="city" name="city" placeholder="如：北京" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">
                    分类 <span className="text-red-500">*</span>
                  </Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">联系方式</Label>
                  <Input id="phone" name="phone" placeholder="如：010-12345678" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessHours">营业时间</Label>
                <Input id="businessHours" name="businessHours" placeholder="如：周一至周日 10:00-22:00" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">特色标签</Label>
                <Input id="features" name="features" placeholder="多个标签用逗号分隔，如：网红打卡、老字号、排队王" />
              </div>

              <div className="space-y-3 pt-2 border-t">
                <p className="text-sm font-medium text-muted-foreground">社交媒体链接（可选）</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="official">官网</Label>
                    <Input id="official" name="official" placeholder="https://" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="xiaohongshu">小红书</Label>
                    <Input id="xiaohongshu" name="xiaohongshu" placeholder="小红书链接" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dianping">大众点评</Label>
                    <Input id="dianping" name="dianping" placeholder="点评链接" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="douyin">抖音</Label>
                    <Input id="douyin" name="douyin" placeholder="抖音链接" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="wechat">微信公众号</Label>
                    <Input id="wechat" name="wechat" placeholder="公众号名称或链接" />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                取消
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? '提交中...' : '提交'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}