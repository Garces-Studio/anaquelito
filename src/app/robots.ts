import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const sitio = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://anaquelito.vercel.app';
  return { rules: { userAgent: '*', allow: '/', disallow: ['/admin/', '/dashboard/', '/checkout/'] }, sitemap: `${sitio}/sitemap.xml` };
}
