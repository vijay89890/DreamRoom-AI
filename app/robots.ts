import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/editor/', '/upload/'],
    },
    sitemap: 'https://dreamroom-ai.com/sitemap.xml',
  }
}