'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { deleteBusiness } from '@/app/actions/business';
import { Business } from '@prisma/client';

const CATEGORIES = ['火锅', '川菜', '日料', '西餐', '咖啡', '小吃', '烧烤', '其他'];

interface BusinessTableProps {
  businesses: Business[];
}

export function BusinessTable({ businesses }: BusinessTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('全部');

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      const matchesSearch = business.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === '全部' || business.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [businesses, searchTerm, categoryFilter]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`确定要删除店铺“${name}”吗？此操作不可撤销。`)) {
      await deleteBusiness(id);
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      {/* 筛选栏 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="搜索店铺名称..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value || "")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="全部">全部</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 表格 */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>店铺名称</TableHead>
              <TableHead>城市</TableHead>
              <TableHead>分类</TableHead>
              <TableHead>联系方式</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBusinesses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  暂无店铺数据
                </TableCell>
              </TableRow>
            ) : (
              filteredBusinesses.map((business) => (
                <TableRow key={business.id}>
                  <TableCell className="font-medium">{business.name}</TableCell>
                  <TableCell>{business.city}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{business.category}</Badge>
                  </TableCell>
                  <TableCell>{business.phone || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/businesses/${business.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(business.id, business.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}