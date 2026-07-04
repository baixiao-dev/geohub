'use server';

import { prisma } from '@/lib/prisma';
import { OpenAI } from 'openai';

// 初始化 DeepSeek 客户端（兼容 OpenAI 接口）
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: 'https://api.deepseek.com',
});

export async function analyzeBusiness(businessId: string) {
  try {
    // 1. 获取店铺信息
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return { success: false, message: '店铺不存在' };
    }

    // 2. 构建分析 Prompt
    const prompt = `
你是一个专业的 AI GEO（生成式搜索引擎优化）分析师。请分析以下商家的线上可见度，并给出评分和建议。

商家信息：
- 名称：${business.name}
- 城市：${business.city}
- 分类：${business.category}
- 联系方式：${business.phone || '未提供'}
- 营业时间：${business.businessHours || '未提供'}
- 特色标签：${JSON.stringify(business.features)}
- 社交媒体链接：${JSON.stringify(business.socialLinks)}

请以 JSON 格式输出分析结果，包含以下字段：
{
  "totalScore": 0-100 的整数，总体评分，
  "geoScore": 0-100 的整数，AI 可见度评分，
  "seoScore": 0-100 的整数，基础 SEO 评分，
  "issues": ["问题1", "问题2"], // 发现的问题列表
  "suggestions": ["建议1", "建议2"], // 优化建议列表
  "summary": "一段总结性文字，分析该商家在 AI 搜索中的表现"
}

只返回 JSON，不要有其他文字。
`;

    // 3. 调用 DeepSeek API
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || '{}';
    const result = JSON.parse(content);

    // 4. 保存分析报告到数据库
    const report = await prisma.analysisReport.create({
      data: {
        businessId: business.id,
        totalScore: result.totalScore || 0,
        geoScore: result.geoScore || 0,
        seoScore: result.seoScore || 0,
        issues: result.issues || [],
        suggestions: result.suggestions || [],
        aiSummary: result.summary || '',
        analyzedKeyword: `${business.name} ${business.city}`,
      },
    });

    return { success: true, report };
  } catch (error) {
    console.error('分析失败:', error);
    return { success: false, message: '分析失败，请重试' };
  }
}

export async function getAnalysisReports(businessId?: string) {
  return await prisma.analysisReport.findMany({
    where: businessId ? { businessId } : undefined,
    include: { business: true },
    orderBy: { createdAt: 'desc' },
  });
}