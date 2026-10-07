const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const out = path.resolve(__dirname, '../../tools/social-carousel/images');
const text = (x,y,value,size=28,colour='#f4f6f6') => `<text x="${x}" y="${y}" fill="${colour}" font-family="sans-serif" font-size="${size}">${value}</text>`;
const base = content => `<svg xmlns="http://www.w3.org/2000/svg" width="1122" height="1402"><rect width="1122" height="1402" fill="#14181a"/>${content}</svg>`;
const box = (x,y,w,h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#283237" stroke="#737f85"/>`;
const diagrams = {
  'explainer-ore-4': base(
    text(110,110,'COMPARE THE TEST BASIS',26,'#b9995c') +
    ['Feed sample','Grind size','Test duration','Reagent consumption','Recovery and residues'].map((t,i) => box(110,160+i*95,900,76)+text(145,207+i*95,t,30)).join('') +
    text(110,715,'Match the conditions before comparing recovery.',25)
  ),
  'explainer-power-2': base(
    text(110,100,'BUILD THE LOAD LIST',26,'#b9995c') +
    ['Crushing and grinding','Pumping and dewatering','Screening and recovery','Lighting and site services'].map((t,i)=>box(110,150+i*100,900,80)+text(145,200+i*100,t,30)).join('') +
    text(110,605,'For each load: rating, hours and starting method.',25)+
    text(110,665,'Identify equipment that must keep running.',25)
  ),
  'explainer-rental-4': base(
    text(110,105,'ILLUSTRATIVE SIX-MONTH JOB',26,'#b9995c') +
    [['Hire',15000],['Own: planned resale',14000],['Own: lower resale',19000]].map(([label,value],i)=>
      text(110,200+i*145,label,28)+`<rect x="110" y="${220+i*145}" width="${value/19000*850}" height="50" fill="${i===2?'#737f85':'#444c50'}"/>`+text(110,310+i*145,`USD ${value.toLocaleString('en-US')}`,27)
    ).join('') +text(110,735,'Before fuel, tax, excluded items and unpriced downtime.',20)
  ),
  'explainer-used-equipment-5': base(
    text(110,105,'ILLUSTRATIVE READY-TO-USE COST',26,'#b9995c') +
    [['Machine',40000],['Inspection',2000],['Repairs',8000],['Delivery',10000],['Installation',5000]].map(([label,value],i)=>text(110,185+i*77,label,29)+text(700,185+i*77,`USD ${value.toLocaleString('en-US')}`,29)).join('')+
    `<line x1="110" y1="540" x2="1010" y2="540" stroke="#737f85"/>`+text(110,610,'Total',33)+text(700,610,'USD 65,000',33)+
    text(110,700,'Before tax, operating cash and unresolved defects.',23)
  ),
  'product-dewatering-2': base(
    text(110,95,'CONCEPT: PUMPING THROUGH INTERMEDIATE SUMPS',25,'#b9995c')+
    box(160,140,320,100)+text(200,200,'Surface discharge',28)+
    box(650,340,320,110)+text(690,387,'Upper sump',28)+text(690,422,'Stage pump',25,'#b5bfc4')+
    box(160,560,320,110)+text(200,607,'Lower sump',28)+text(200,642,'Stage pump',25,'#b5bfc4')+
    `<path d="M480,600 H565 V390 H650 M810,340 V190 H480" fill="none" stroke="#b9995c" stroke-width="8"/>
     <path d="M620,375 L650,390 L620,405 M510,175 L480,190 L510,205" fill="none" stroke="#b9995c" stroke-width="8"/>`+
    text(110,745,'Flow and total head determine pump selection.',24)+
    text(110,785,'Concept only; no depths, duties or installation design specified.',21,'#b5bfc4')
  ),
};
(async()=>{for(const [name,svg] of Object.entries(diagrams)){
  fs.writeFileSync(path.join(__dirname,name+'.svg'),svg);
  await sharp(Buffer.from(svg)).png().toFile(path.join(out,name+'.png'));
}console.log(`${Object.keys(diagrams).length} diagram assets rendered.`);})();
