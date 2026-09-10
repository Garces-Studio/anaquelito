import type { MetadataRoute } from 'next';
import { obtenerCatalogo } from '@/lib/catalogo-publico';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitio = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://anaquelito.vercel.app';
  const { productos } = await obtenerCatalogo();
  return [
    { url: sitio, changeFrequency: 'weekly', priority: 1 },
    { url: `${sitio}/catalogo`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${sitio}/mayoreo`, changeFrequency: 'monthly', priority: 0.7 },
    ...productos.map((p) => ({ url: `${sitio}/productos/${p.slug}`, changeFrequency: 'weekly' as const, priority: 0.8 })),
  ];
}
