import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/seo'

/**
 * Served at /robots.txt.
 *
 * Replaces the robots.txt that sat at the repository root, which Next.js
 * never served (only /public and the app router are routable), so the site
 * shipped with no robots.txt at all.
 *
 * AI crawlers are listed explicitly rather than left to the wildcard. Some
 * of them - notably Google-Extended and Applebot-Extended - are consulted
 * as opt-in signals for AI answer surfaces, and naming them removes any
 * ambiguity about whether this content may be used in generated answers.
 */
const AI_CRAWLERS = [
  'GPTBot',             // OpenAI, training + ChatGPT browsing
  'OAI-SearchBot',      // OpenAI, ChatGPT Search index
  'ChatGPT-User',       // OpenAI, live user-initiated fetch
  'ClaudeBot',          // Anthropic
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'Google-Extended',    // Gemini / AI Overviews grounding
  'Applebot-Extended',
  'PerplexityBot',
  'Perplexity-User',
  'CCBot',              // Common Crawl, feeds many downstream models
  'Bytespider',
  'Amazonbot',
  'meta-externalagent',
  'cohere-ai',
  'DuckAssistBot',
  'MistralAI-User',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The operations dashboard is authenticated and has no search value.
        disallow: ['/admin', '/admin/', '/api/'],
      },
      ...AI_CRAWLERS.map(userAgent => ({
        userAgent,
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/'],
      })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
