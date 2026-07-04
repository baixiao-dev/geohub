'use server';

import { prisma } from '@/lib/prisma';

export async function getDashboardStats() {
  const [
    businessCount,
    reportCount,
    contentCount,
    citationCount,
    avgReport,
    recentBusinesses,
    recentReports,
  ] = await Promise.all([
    prisma.business.count(),
    prisma.analysisReport.count(),
    prisma.generatedContent.count(),
    prisma.aiCitation.count(),
    prisma.analysisReport.aggregate({
      _avg: { totalScore: true, geoScore: true, seoScore: true },
    }),
    prisma.business.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.analysisReport.findMany({
      take: 5,
      include: { business: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    businessCount,
    reportCount,
    contentCount,
    citationCount,
    avgTotalScore: Math.round(avgReport._avg.totalScore ?? 0),
    avgGeoScore: Math.round(avgReport._avg.geoScore ?? 0),
    avgSeoScore: Math.round(avgReport._avg.seoScore ?? 0),
    recentBusinesses,
    recentReports,
  };
}
