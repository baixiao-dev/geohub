'use server';

import { prisma } from '@/lib/prisma';
import { OpenAI } from 'openai';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: 'https://api.deepseek.com',
});

type ContentType = 'faq' | 'website' | 'xiaohongshu' | 'wechat' | 'dianping' | 'jsonld';

async function getBusinessWithDetails(businessId: string) {
  return await prisma.business.findUnique({
    where: { id: businessId },
  });
}

// 生成 FAQ
async function generateFAQ(business: any) {
  const prompt = `
你是一个 AI GEO 内容专家。请为以下商家生成 50 条高质量的常见问答（FAQ），让 AI 搜索时更容易引用。

商家信息：
- 名称：${business.name}
- 城市：${business.city}
- 分类：${business.category}
- 特色：${JSON.stringify(business.features)}
- 营业时间：${business.businessHours || '未提供'}

要求：
1. 问题要真实、自然，是顾客真正会问的
2. 答案要详细、有用，包含具体信息
3. 覆盖：菜品/服务特色、价格、环境、交通、预约、适合场景等
4. 每条问答都要有独立价值，能单独被 AI 引用

输出格式（JSON数组）：
[
  { "q": "问题1", "a": "答案1" },
  { "q": "问题2", "a": "答案2" }
]

只返回 JSON 数组，不要其他文字。
`;

  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
  });

  const content = response.choices[0]?.message?.content || '[]';
  return JSON.parse(content);
}

async function generateWebsiteCopy(business: any) {
  const prompt = `
请为以下商家生成官网介绍文案（约 300-500 字），用于官方网站或品牌页面。

商家信息：
- 名称：${business.name}
- 城市：${business.city}
- 分类：${business.category}
- 特色：${JSON.stringify(business.features)}
- 营业时间：${business.businessHours || '未提供'}

要求：
1. 语言专业、有吸引力
2. 突出品牌特色和优势
3. 包含 SEO 关键词
4. 适合放在官网首页或关于页面

只返回文案内容，不要其他文字。
`;

  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || '';
}

async function generateXiaohongshu(business: any) {
  const prompt = `
请为以下商家生成 2 篇小红书种草文案，每篇 150-200 字。

商家信息：
- 名称：${business.name}
- 城市：${business.city}
- 分类：${business.category}
- 特色：${JSON.stringify(business.features)}

要求：
1. 风格真实、口语化，像真实用户的分享
2. 包含 3-5 个相关话题标签（#）
3. 突出 2-3 个核心卖点
4. 适合本地生活场景

输出格式：
---
[标题]
[正文内容]
[话题标签]
---
[第二篇]
`;

  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
  });

  return response.choices[0]?.message?.content || '';
}

async function generateWechatArticle(business: any) {
  const prompt = `
请为以下商家生成一篇公众号文章，约 800-1000 字。

商家信息：
- 名称：${business.name}
- 城市：${business.city}
- 分类：${business.category}
- 特色：${JSON.stringify(business.features)}

要求：
1. 标题要吸引眼球
2. 内容结构清晰（引言 → 主体 → 总结）
3. 语言生动，适合社交媒体传播
4. 突出品牌故事和独特性

返回格式：标题 + 正文
`;

  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || '';
}

async function generateDianping(business: any) {
  const prompt = `
请为以下商家生成大众点评店铺介绍，约 150-200 字。

商家信息：
- 名称：${business.name}
- 城市：${business.city}
- 分类：${business.category}
- 特色：${JSON.stringify(business.features)}

要求：
1. 突出 2-3 个核心卖点
2. 包含营业时间和地址信息
3. 语气亲切，适合大众点评用户阅读

只返回介绍内容，不要其他文字。
`;

  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.6,
  });

  return response.choices[0]?.message?.content || '';
}

async function generateJSONLD(business: any) {
  const prompt = `
请为以下商家生成 JSON-LD 结构化数据（Schema.org 格式），用于网站的 SEO 优化。

商家信息：
- 名称：${business.name}
- 城市：${business.city}
- 分类：${business.category}
- 联系方式：${business.phone || '未提供'}
- 营业时间：${business.businessHours || '未提供'}
- 特色标签：${JSON.stringify(business.features)}

请生成符合 Schema.org 的 LocalBusiness 类型的 JSON-LD 代码。

输出格式：只返回 JSON 代码，不要其他文字。
`;

  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content || '';
}

// 统一的生成入口
export async function generateContent(businessId: string, type: ContentType) {
  try {
    const business = await getBusinessWithDetails(businessId);
    if (!business) {
      return { success: false, message: '店铺不存在' };
    }

    let content = '';
    let title = '';

    switch (type) {
      case 'faq':
        content = JSON.stringify(await generateFAQ(business));
        title = `${business.name} FAQ 问答`;
        break;
      case 'website':
        content = await generateWebsiteCopy(business);
        title = `${business.name} 官网介绍`;
        break;
      case 'xiaohongshu':
        content = await generateXiaohongshu(business);
        title = `${business.name} 小红书文案`;
        break;
      case 'wechat':
        content = await generateWechatArticle(business);
        title = `${business.name} 公众号文章`;
        break;
      case 'dianping':
        content = await generateDianping(business);
        title = `${business.name} 大众点评介绍`;
        break;
      case 'jsonld':
        content = await generateJSONLD(business);
        title = `${business.name} JSON-LD 结构化数据`;
        break;
      default:
        return { success: false, message: '不支持的内容类型' };
    }

    const saved = await prisma.generatedContent.create({
      data: {
        businessId: business.id,
        type: type,
        title: title,
        content: content,
        status: 'draft',
      },
    });

    return { success: true, content: saved };
  } catch (error) {
    console.error('生成内容失败:', error);
    return { success: false, message: '生成失败，请重试' };
  }
}

export async function getGeneratedContents(businessId?: string) {
  return await prisma.generatedContent.findMany({
    where: businessId ? { businessId } : undefined,
    include: { business: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateContentStatus(id: string, status: 'draft' | 'copied' | 'published') {
  return await prisma.generatedContent.update({
    where: { id },
    data: { status },
  });
}