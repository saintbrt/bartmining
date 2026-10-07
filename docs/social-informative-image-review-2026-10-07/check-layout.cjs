const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const out = __dirname;
const names = require('../../tools/social-carousel/images/file-names.json');
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
    for (let id = 26; id <= 40; id++) {
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
          cardOverlap: !!thumb.querySelector('.card') && block.offsetTop < 880,
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
    await sharp({ create: { width: 1080, height: 1352, channels: 3, background: '#14181a' } })
      .composite(covers.map((input, i) => ({ input, left: (i % 4) * 270, top: Math.floor(i / 4) * 338 })))
      .jpeg({ quality: 90 }).toFile(path.join(out, 'covers-review.jpg'));
    fs.writeFileSync(path.join(out, 'measurements.json'), JSON.stringify(results, null, 2) + '\n');
    const exportDir = path.join(out, 'exports');
    fs.mkdirSync(exportDir, { recursive: true });
    const client = await page.createCDPSession();
    await client.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: exportDir });
    const exported = [];
    for (const [id,index] of [[26,0],[39,1]]) {
      await page.evaluate(id => [...document.querySelectorAll('button.post')].find(b => b.querySelector('.post-id')?.textContent.trim() === `IG-${id}`).click(), id);
      await page.waitForFunction(() => [...document.querySelectorAll('.thumb img')].every(i => i.complete && i.naturalWidth > 0));
      await page.evaluate(index => document.querySelectorAll('.thumb')[index].click(), index);
      const file = `${names.posts[`IG-${id}`].prefix}-${index+1}.png`;
      const destination = path.join(exportDir,file);
      if(fs.existsSync(destination)) fs.unlinkSync(destination);
      await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent === 'Download slide').click());
      const start = Date.now();
      while(!fs.existsSync(destination) && Date.now()-start < 20000) await new Promise(r=>setTimeout(r,200));
      if(!fs.existsSync(destination)) throw Error('PNG export did not complete: '+file);
      const meta = await sharp(destination).metadata();
      if(meta.width !== 1080 || meta.height !== 1350) throw Error('Incorrect export dimensions: '+file);
      exported.push({file,width:meta.width,height:meta.height});
    }
    fs.writeFileSync(path.join(out,'export-check.json'),JSON.stringify(exported,null,2)+'\n');
    console.log(JSON.stringify(results.flatMap(p => p.slides.filter(s => s.missing || s.lines > 3 || s.textTop < 0 || s.textBottom > 1350 || s.cardOverlap || s.issues !== 'No issues').map(s => ({ post: p.post, ...s }))), null, 2));
    console.log(`${results.length} posts, ${results.reduce((n,p) => n + p.slides.length,0)} slides inspected.`);
    console.log('Explainer and product PNG exports verified at 1080 × 1350.');
  } finally { await browser.close(); }
})();
