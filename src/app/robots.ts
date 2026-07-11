import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bhratra.vercel.app';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/profile/', '/trips/*/chat', '/trips/*/edit'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
