const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const out = __dirname;
(async () => {
  const { default: puppeteer } = await import('puppeteer-core');
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true, args: ['--no-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 1100, deviceScaleFactor: 1 });
    await page.goto('http://127.0.0.1:5180/', { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    const results = [];
    const covers = [];
    for (let id = 19; id <= 25; id++) {
      await page.evaluate(id => [...document.querySelectorAll('button.post')].find(b => b.querySelector('.post-id')?.textContent.trim() === `IG-${id}`).click(), id);
      await page.waitForFunction(() => [...document.querySelectorAll('.thumb img')].every(i => i.complete && i.naturalWidth > 0));
      const rows = await page.evaluate(() => [...document.querySelectorAll('.thumb')].map((thumb, index) => {
        const headline = thumb.querySelector('[data-headline]');
        const image = thumb.querySelector('img');
        const block = thumb.querySelector('.slide-text');
        return {
          slide: index + 1, headline: headline.textContent,
          lines: Math.round(headline.offsetHeight / parseFloat(getComputedStyle(headline).lineHeight)),
          image: image?.getAttribute('src'), width: image?.naturalWidth, height: image?.naturalHeight,
          alt: image?.alt, missing: !!thumb.querySelector('.photo-missing'),
          textTop: block.offsetTop, textBottom: block.offsetTop + block.offsetHeight,
          issues: thumb.title,
        };
      }));
      results.push({ post: `IG-${id}`, slides: rows });
      const slides = [];
      for (let index = 0; index < rows.length; index++) {
        await page.evaluate(index => document.querySelectorAll('.thumb')[index].click(), index);
        const image = await page.$('main.stage .scaled');
        const buffer = await image.screenshot();
        slides.push(await sharp(buffer).resize(270, 338).png().toBuffer());
        if (index === 0) covers.push(await sharp(buffer).resize(270, 338).png().toBuffer());
      }
      const strip = await sharp({ create: { width: slides.length * 270, height: 338, channels: 3, background: '#000' } })
        .composite(slides.map((input, i) => ({ input, left: i * 270, top: 0 }))).jpeg({ quality: 90 }).toBuffer();
      fs.writeFileSync(path.join(out, `IG-${id}-review.jpg`), strip);
    }
    await sharp({ create: { width: 1080, height: 676, channels: 3, background: '#14181a' } })
      .composite(covers.map((input, i) => ({ input, left: (i % 4) * 270, top: Math.floor(i / 4) * 338 })))
      .jpeg({ quality: 90 }).toFile(path.join(out, 'covers-review.jpg'));
    fs.writeFileSync(path.join(out, 'measurements.json'), JSON.stringify(results, null, 2) + '\n');
    console.log(JSON.stringify(results.flatMap(p => p.slides.filter(s => s.missing || s.lines > 3 || s.textTop < 0 || s.textBottom > 1350).map(s => ({ post: p.post, ...s }))), null, 2));
    console.log(`${results.length} posts, ${results.reduce((n,p) => n + p.slides.length,0)} slides inspected.`);
  } finally { await browser.close(); }
})();
