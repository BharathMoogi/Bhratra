import { MetadataRoute } from 'next';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bhratra.vercel.app';

  try {
    // Fetch active trips to index their details pages
    const trips = await prisma.trip.findMany({
      where: { deletedAt: null },
      select: { id: true, updatedAt: true },
    });

    const tripUrls = trips.map((t) => ({
      url: `${baseUrl}/trips/${t.id}`,
      lastModified: t.updatedAt,
    }));

    return [
      { url: baseUrl, lastModified: new Date() },
      { url: `${baseUrl}/trips`, lastModified: new Date() },
      { url: `${baseUrl}/auth/login`, lastModified: new Date() },
      { url: `${baseUrl}/auth/signup`, lastModified: new Date() },
      ...tripUrls,
    ];
  } catch (err) {
    console.warn('Prerender sitemap database access failed, falling back to static core routes:', err);
    return [
      { url: baseUrl, lastModified: new Date() },
      { url: `${baseUrl}/trips`, lastModified: new Date() },
      { url: `${baseUrl}/auth/login`, lastModified: new Date() },
      { url: `${baseUrl}/auth/signup`, lastModified: new Date() },
    ];
  }
}
