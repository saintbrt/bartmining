const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const output = path.resolve(__dirname, '../../tools/social-carousel/images');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'tanzania-adm1.geojson')));
const regions = ['Geita', 'Mwanza', 'Shinyanga', 'Mbeya', 'Tabora', 'Dodoma', 'Morogoro', 'Lindi', 'Mtwara', 'Manyara'];
// Show regional centres, not licence areas; historical regional boundaries are
// deliberately omitted. Labels identify the regions named in the post.
const points = {
  Geita: [32.232, -2.871, -88, 18], Mwanza: [32.898, -2.516, 20, -20],
  Shinyanga: [33.421, -3.663, -24, 30], Mbeya: [33.45, -8.9, -74, 28],
  Tabora: [32.826, -5.016, -92, 8], Dodoma: [35.75, -6.16, -100, 36],
  Morogoro: [37.66, -6.82, 12, -16], Lindi: [39.716, -9.997, -52, -20],
  Mtwara: [40.183, -10.273, 12, 28], Manyara: [35.75, -4.23, 12, -20],
};
const project = ([lon, lat]) => [150 + (lon - 29.2) * 64, 92 + (-lat - 1) * 54];
const paths = data.features.flatMap(f => {
  const polygons = f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates : [f.geometry.coordinates];
  return polygons.map(poly => poly.map(ring => ring.map((p, i) => `${i ? 'L' : 'M'}${project(p).map(n => n.toFixed(1)).join(',')}`).join(' ') + ' Z').join(' '));
});
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1122" height="1402" viewBox="0 0 1122 1402">
<rect width="1122" height="1402" fill="#14181a"/>
<text x="110" y="60" fill="#d4dbde" font-family="sans-serif" font-size="22">REGIONS NAMED IN THE REPORT</text>
${paths.map(d => `<path d="${d}" fill="#283237" stroke="#283237" stroke-width="2"/>`).join('')}
${regions.map(name => { const [lon, lat, dx, dy] = points[name]; const [x,y] = project([lon,lat]); return `<circle cx="${x}" cy="${y}" r="6" fill="#b9995c"/><text x="${x+dx}" y="${y+dy}" fill="#f4f6f6" font-family="sans-serif" font-size="25">${name}</text>`; }).join('')}
<text x="110" y="695" fill="#b5bfc4" font-family="sans-serif" font-size="19">Regional centres shown; these are not licence-area boundaries.</text>
<text x="110" y="730" fill="#b5bfc4" font-family="sans-serif" font-size="17">Map: geoBoundaries / © OpenStreetMap contributors · ODbL 1.0</text>
</svg>`;
const split = `<svg xmlns="http://www.w3.org/2000/svg" width="1122" height="1402">
<rect width="1122" height="1402" fill="#14181a"/>
<text x="110" y="130" fill="#b9995c" font-family="sans-serif" font-size="26">FORMER ALLOCATION UNDER REGULATION 4(4)</text>
<text x="110" y="190" fill="#f4f6f6" font-family="sans-serif" font-size="30">The provision was declared invalid.</text>
<rect x="110" y="290" width="360" height="160" fill="#444c50"/>
<rect x="470" y="290" width="540" height="160" fill="#737f85"/>
<text x="145" y="395" fill="white" font-family="sans-serif" font-size="76">40%</text>
<text x="505" y="395" fill="white" font-family="sans-serif" font-size="76">60%</text>
<text x="110" y="510" fill="#f4f6f6" font-family="sans-serif" font-size="28">Village / community</text>
<text x="505" y="510" fill="#f4f6f6" font-family="sans-serif" font-size="28">District / municipal /</text>
<text x="110" y="550" fill="#f4f6f6" font-family="sans-serif" font-size="28">projects</text>
<text x="505" y="550" fill="#f4f6f6" font-family="sans-serif" font-size="28">city council projects</text>
<text x="110" y="650" fill="#b5bfc4" font-family="sans-serif" font-size="22">This explains the former split; it is not a new allocation rule.</text>
</svg>`;
(async () => {
  for (const [name, content] of [['news-youth-2', svg], ['news-csr-2', split]]) {
    fs.writeFileSync(path.join(__dirname, name + '.svg'), content);
    await sharp(Buffer.from(content)).png().toFile(path.join(output, name + '.png'));
  }
})();
