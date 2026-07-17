import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://migrait.app'
  return [
    { url: base, priority: 1 },
    { url: `${base}/pricing`, priority: 0.8 },
    { url: `${base}/about`, priority: 0.6 },
    { url: `${base}/contact`, priority: 0.8 },
  ]
}
