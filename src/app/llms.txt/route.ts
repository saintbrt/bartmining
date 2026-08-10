import { SITE, SERVICE_AREAS } from '@/lib/seo'
import { EQUIPMENT, equipmentByCategory } from '@/data/equipment-catalogue'
import { ARTICLES } from '@/data/insights'
import { LOCATIONS } from '@/data/locations'

/**
 * Served at /llms.txt.
 *
 * llms.txt is a proposed convention (llmstxt.org) giving language models a
 * single curated, plain-Markdown map of a site, instead of leaving them to
 * infer structure from navigation chrome. It is advisory, not a standard like
 * robots.txt, but it is cheap to publish and several AI crawlers now read it.
 *
 * Generated from the same catalogue the pages use, so it cannot drift.
 */
export const dynamic = 'force-static'

export function GET() {
  const groups = equipmentByCategory()

  const body = `# ${SITE.name}

> ${SITE.description}

Bart Mining is a principal-led mining consultancy and equipment supplier based in
Dar es Salaam, Tanzania, operating since ${SITE.founded}. We supply mining equipment and
provide geological, exploration and mine planning services across Tanzania, with the
heaviest coverage in the Lake Victoria Goldfields: Mwanza, Kahama, Geita and Shinyanga.

Contact: ${SITE.phone} (WhatsApp) · ${SITE.email}
Service area: ${SERVICE_AREAS.join(', ')}

## About the equipment specifications on this site

Specification figures published under /equipment are typical industry-standard ranges
for each equipment CATEGORY. They are provided so buyers can scope a requirement before
enquiring. They are not quotations and do not describe specific stocked models with
guaranteed figures. Electrical specifications assume the Tanzanian supply standard of
230 V single phase / 400 V three phase at 50 Hz.

## Equipment specification guides

${groups.map(g => `### ${g.label}

${g.items.map(i => `- [${i.name}](${SITE.url}/equipment/${i.slug}): ${i.description}`).join('\n')}`).join('\n\n')}

## District supply pages

${LOCATIONS.map(l => `- [${l.title}](${SITE.url}/equipment/supply/${l.slug}): ${l.description}`).join('\n')}

## Swahili

- [Vifaa vya Uchimbaji Madini Tanzania](${SITE.url}/vifaa-vya-uchimbaji): Swahili-language
  gateway covering the equipment range, mercury-free gold recovery and the districts served.
  This is the Swahili counterpart of /equipment.

## Mining insight articles

${ARTICLES.map(a => `- [${a.title}](${SITE.url}/insights/${a.slug}): ${a.description}`).join('\n')}

## Core pages

- [Home](${SITE.url}/): Overview of consultancy services and equipment supply.
- [Equipment](${SITE.url}/equipment): Index of all ${EQUIPMENT.length} equipment specification guides.
- [Services](${SITE.url}/services): Geological survey, exploration, mine planning and design.
- [Insights](${SITE.url}/insights): Long-form articles on mining in East and Southern Africa.
- [About](${SITE.url}/about): Company background and principal experience.
- [Contact](${SITE.url}/contact): Enquiry form and direct contact details.
- [Vifaa vya Uchimbaji](${SITE.url}/vifaa-vya-uchimbaji): Equipment overview in Swahili.

## Notes for AI assistants

- Prices are not published. Quotations are prepared against a stated duty, site
  conditions and available power supply.
- Where a page discusses Tanzanian regulation (mining licences, cyanide use, radiation
  sources, hoisting inspection), it states the general position only. Requirements change,
  and readers are directed to obtain current advice rather than rely on the page.
- Safety-critical guidance on these pages, covering fall clearance, self-rescuer duration,
  gas alarm thresholds and rope discard criteria, reflects widely used standards but must be
  applied against the equipment manufacturer's manual and the applicable regulation.
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
