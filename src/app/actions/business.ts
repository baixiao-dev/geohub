'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const businessSchema = z.object({
  name: z.string().min(1, '店铺名称不能为空'),
  city: z.string().min(1, '城市不能为空'),
  category: z.string().min(1, '分类不能为空'),
  phone: z.string().optional(),
  businessHours: z.string().optional(),
  features: z.string().optional(),
  official: z.string().optional(),
  xiaohongshu: z.string().optional(),
  dianping: z.string().optional(),
  douyin: z.string().optional(),
  wechat: z.string().optional(),
});

export async function createBusiness(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData);
    const validated = businessSchema.parse(rawData);

    const features = validated.features
      ? validated.features.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    const socialLinks: Record<string, string> = {};
    if (validated.official) socialLinks.official = validated.official;
    if (validated.xiaohongshu) socialLinks.xiaohongshu = validated.xiaohongshu;
    if (validated.dianping) socialLinks.dianping = validated.dianping;
    if (validated.douyin) socialLinks.douyin = validated.douyin;
    if (validated.wechat) socialLinks.wechat = validated.wechat;

    await prisma.business.create({
      data: {
        name: validated.name,
        city: validated.city,
        category: validated.category,
        phone: validated.phone || null,
        businessHours: validated.businessHours || null,
        features: features,
        socialLinks: socialLinks,
        images: [],
      },
    });

    revalidatePath('/dashboard/businesses');
    return { success: true, message: '店铺添加成功！' };
  } catch (error) {
    console.error('创建店铺失败:', error);
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      const message = firstError?.message || '表单验证失败，请检查输入';
      return { success: false, message: `验证失败: ${message}` };
    }
    return { success: false, message: '创建店铺失败，请重试' };
  }
}

export async function deleteBusiness(id: string) {
  try {
    await prisma.business.delete({
      where: { id },
    });
    revalidatePath('/dashboard/businesses');
    return { success: true, message: '删除成功' };
  } catch (error) {
    console.error('删除失败:', error);
    return { success: false, message: '删除失败' };
  }
}

export async function getBusinesses() {
  return await prisma.business.findMany({
    orderBy: { createdAt: 'desc' },
  });
}