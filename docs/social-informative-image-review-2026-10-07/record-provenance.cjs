const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const repo = path.resolve(__dirname, '../..');
const assignments = JSON.parse(fs.readFileSync(path.join(__dirname, 'assignments.json')));
const registerPath = path.join(repo, 'tools/social-carousel/images/sources.json');
const register = JSON.parse(fs.readFileSync(registerPath));
const uses = key => assignments.filter(a => a.image === key).map(({post,slide}) => ({post,slide}));
const diagrams = {
  'explainer-ore-4.png': ['src/content/insights/plant-test-work-guide.ts', 'Fields to compare before interpreting a recovery difference; no invented test results.'],
  'explainer-power-2.png': ['src/content/insights/off-grid-mine-power.ts', 'Conceptual load categories; no invented motor ratings.'],
  'explainer-rental-4.png': ['src/content/insights/equipment-rental-tanzania.ts', 'The published illustrative six-month costs, with exclusions stated.'],
  'explainer-used-equipment-5.png': ['src/content/insights/used-mining-equipment-tanzania.ts', 'The published illustrative USD 65,000 ready-to-use cost and its five components.'],
  'product-dewatering-2.png': ['https://prod.xylem.com/nl-nl/applications/face-stage-dewatering/', 'Conceptual transfer through intermediate sumps, without dimensions or duties.'],
};
(async () => {
  for (const file of fs.readdirSync(path.join(__dirname,'results'))) {
    const record = JSON.parse(fs.readFileSync(path.join(__dirname,'results',file)));
    const meta = await sharp(path.join(repo,'tools/social-carousel/images',record.file)).metadata();
    const row = { ...record, author: 'Created for Bart Mining social carousel', license: 'Generated asset; no stock-photo attribution', width: meta.width, height: meta.height, description: record.alt, assignments: uses('social/'+record.file), changes: 'Original selected output retained; framed by the carousel crop.', review: 'Visually checked against equipment class and stated reference. Concept illustration, not a certification, assay result, quotation or installed project.' };
    const index = register.findIndex(x => x.file === row.file);
    if (index === -1) register.push(row); else register[index] = row;
  }
  for (const [file, [source,description]] of Object.entries(diagrams)) {
    const meta = await sharp(path.join(repo,'tools/social-carousel/images',file)).metadata();
    const row = { file, source, description, author: 'Bart Mining', license: 'Original code-rendered explanatory diagram', width:meta.width, height:meta.height, assignments: uses('social/'+file), editableSource: path.relative(repo,path.join(__dirname,file.replace('.png','.svg'))) };
    const index = register.findIndex(x=>x.file === file);
    if(index === -1) register.push(row); else register[index] = row;
  }
  fs.writeFileSync(registerPath,JSON.stringify(register,null,2)+'\n');
  const productionLog = JSON.parse(fs.readFileSync(path.join(repo,'docs/equipment-image-prompts-2026-10-06.json')));
  const catalogue = [];
  const previousCatalogue = JSON.parse(fs.readFileSync(path.join(__dirname,'catalogue-provenance.json')));
  for (const previous of previousCatalogue) {
    const key = previous.libraryKey;
    const originalKey = previous.originalLibraryKey;
    const entry = productionLog.entries.find(e=>e.asset === '/' + originalKey);
    if(!entry || entry.status !== 'generated') throw Error('No existing catalogue production record for '+key);
    const meta = await sharp(path.join(repo,'tools/social-carousel/images',key.slice(7))).metadata();
    catalogue.push({ libraryKey:key, originalLibraryKey:originalKey, source:'docs/equipment-image-prompts-2026-10-06.json', ...entry, width:meta.width, height:meta.height, assignments:uses(key), changes:'Identical catalogue illustration copied into the social library; carousel framing only.' });
  }
  fs.writeFileSync(path.join(__dirname,'catalogue-provenance.json'),JSON.stringify(catalogue,null,2)+'\n');
  console.log(`${fs.readdirSync(path.join(__dirname,'results')).length} new illustrations, ${Object.keys(diagrams).length} diagrams, ${catalogue.length} catalogue references recorded.`);
})();
