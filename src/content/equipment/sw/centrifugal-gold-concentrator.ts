import type { GuideSection } from '../index'

/** Kiswahili guide, preserving the English section anchors and diagram format. */
export const sections: GuideSection[] = [
  {
    id: "how-it-works",
    title: "Jinsi centrifugal concentrator inavyofanya kazi",
    html: `<p>Dhahabu ni nzito zaidi kuliko quartz na silicates zinazoiambatana. Chembe ndogo inaweza kutulia polepole chini ya gravity ya kawaida, hivyo concentrator huongeza nguvu inayotenganisha kwa takribani 60–200 G. Hii husaidia kushika dhahabu huru ndogo, lakini haiondoi hitaji la kuachia dhahabu kutoka kwenye mwamba kwanza.</p>
<figure class="eq-figure">
<div class="eq-diagram" tabindex="0" role="region" aria-label="Mchoro; sogeza pembeni kusoma maelezo yote">
<svg viewBox="0 0 720 370" role="img" aria-labelledby="ccon-title ccon-desc" style="width:100%;height:auto;display:block">
<title id="ccon-title">Jinsi centrifugal concentrator inavyofanya kazi</title>
<desc id="ccon-desc">Tope huingia kupitia bomba la kati hadi chini ya bakuli linalozunguka. Chembe nzito hushikwa kwenye pete, maji safi husaidia tabaka lisishikamane, na nyenzo nyepesi hutoka juu kama mabaki.</desc>
<defs><marker id="ccon-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>
<g font-family="inherit" fill="currentColor" font-size="13">
<path d="M175 310 L122 90 M545 310 L598 90 M175 310 H545" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" fill="none"/>
<path d="M200 300 L150 90 M520 300 L570 90 M200 300 H520" stroke="currentColor" stroke-width="2.5" fill="none"/>
<g stroke="currentColor" stroke-width="3">
<path d="M159.5 130 h24"/><path d="M169 170 h24"/><path d="M178.5 210 h24"/><path d="M188 250 h24"/>
<path d="M560.5 130 h-24"/><path d="M551 170 h-24"/><path d="M541.5 210 h-24"/><path d="M532 250 h-24"/>
</g>
<rect x="350" y="12" width="20" height="236" rx="3" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="1.5"/>
<g stroke="currentColor" stroke-width="1.5" fill="none" marker-end="url(#ccon-arrow)">
<path d="M360 250 V284"/>
<path d="M232 286 L196 116"/><path d="M488 286 L524 116"/>
<path d="M150 88 L112 58"/><path d="M570 88 L608 58"/>
<path d="M78 196 H146"/><path d="M642 196 H574"/>
<path d="M300 336 A60 12 0 0 0 420 336"/>
</g>
<text x="380" y="30">tope la kuingiza</text>
<text x="96" y="44" text-anchor="middle">mabaki ya juu</text>
<text x="624" y="44" text-anchor="middle">mabaki ya juu</text>
<text x="70" y="226" text-anchor="middle">maji ya</text><text x="70" y="243" text-anchor="middle">fluidisation</text>
<text x="650" y="226" text-anchor="middle">maji ya</text><text x="650" y="243" text-anchor="middle">fluidisation</text>
<text x="240" y="232">dhahabu</text><text x="240" y="249">kwenye pete</text>
<text x="360" y="362" text-anchor="middle">bakuli: nguvu ya 60–200 G</text>
</g>
</svg>
</div>
<figcaption><span class="eq-diagram-hint">Sogeza mchoro pembeni ili kusoma maelezo yote.</span>Mchoro wa dhana wa sehemu ya bakuli. Mkusanyiko hushikwa kwenye pete na hutolewa bakuli linaposimama kwa batch au kwa utoaji unaoendelea, kulingana na modeli.</figcaption>
</figure>
<ol><li><strong>Kuingiza tope.</strong> Malighafi iliyochujwa, kwa kawaida chini ya 2 mm kwa modeli zinazofaa, huingia kupitia bomba la kati hadi chini ya bakuli.</li>
<li><strong>Kupanga kwa msongamano.</strong> Mzunguko husukuma nyenzo kuelekea ukutani, ambapo chembe nzito huingia kwenye pete au riffles.</li>
<li><strong>Fluidisation.</strong> Maji safi huingia kupitia matundu madogo ili tabaka lisishikamane. Dhahabu nzito inaweza kuchukua nafasi ya chembe nyepesi badala ya pete kujazwa kwa mchanga mgumu.</li>
<li><strong>Kutoa mabaki.</strong> Nyenzo nyepesi hupita juu ya pete na kutoka kwenye ukingo wa juu.</li>
<li><strong>Kutoa mkusanyiko.</strong> Batch husimama na kuosha pete kwa ratiba; mfumo wa continuous hutumia njia ya kutoa bila kusimama.</li>
</ol><p>Uwiano wa mfano wa kukusanya ni 500:1 hadi 2,000:1 kwa uzito. Mkusanyiko bado unaweza kuwa na mchanga mzito na sulphides, hivyo mara nyingi husafishwa kwa <a href="/equipment-swahili/shaking-table-gold">meza ya kutikisa</a> kabla ya kutathmini kuyeyusha.</p>`,
  },
  {
    id: "recovery-by-size",
    title: "Utenganishaji wa dhahabu kulingana na ukubwa wa chembe",
    html: `<p>Concentrator hutenganisha dhahabu iliyoachia ndani ya ukubwa ambao bakuli limepangwa kushika. 85–98% ni mfano wa viwango vinavyotajwa kwa baadhi ya matumizi ya dhahabu huru, si dhamana ya eneo lako. Jedwali linaonyesha jinsi ukubwa unavyoweza kubadilisha matokeo.</p>
<div class="eq-tablewrap"><table class="eq-table eq-table-3"><caption class="eq-caption">Mwelekeo wa utenganishaji kwa dhahabu huru</caption><thead><tr><th scope="col">Ukubwa wa dhahabu</th><th scope="col">Uwezo wa kutenganisha</th><th scope="col">Cha kuangalia</th></tr>
</thead><tbody><tr><th scope="row">Zaidi ya 2 mm</th><td>Huondolewa kabla ya bakuli la chembe ndogo</td><td>Tathmini sluice au jig kwa kundi kubwa; thibitisha kikomo cha modeli.</td></tr>
<tr><th scope="row">150 µm – 2 mm</th><td>Unaweza kuwa mkubwa</td><td>Dhahabu bapa inaweza kutenganishwa tofauti na chembe za mviringo.</td></tr>
<tr><th scope="row">38 – 150 µm</th><td>Unaweza kuwa mkubwa</td><td>Concentrator inaweza kushika chembe ambazo sluice au meza inapoteza.</td></tr>
<tr><th scope="row">20 – 38 µm</th><td>Hupungua</td><td>Nguvu, maji na chembe laini sana zinahitaji udhibiti.</td></tr>
<tr><th scope="row">Chini ya 20 µm</th><td>Unaweza kuwa mdogo</td><td>Chembe hufuata maji zaidi; pima kama njia nyingine inafaa.</td></tr>
</tbody></table></div>
<p>Usagaji na majaribio ndiyo hatua zinazounganisha jedwali hili na mradi wako. Dhahabu iliyofungwa inaweza kwenda kwenye mabaki hata kama mashine imepangwa vizuri. <a href="/equipment-swahili/ball-mill-gold-ore">Ball mill</a> inaweza kuachia zaidi kwa gharama ya nishati, hivyo usisage zaidi bila kulinganisha faida.</p>
<p>Jaribio la gravity recoverable gold, GRG, linaonyesha sehemu inayoweza kupatikana kwa gravity kwenye usagaji fulani. Sehemu iliyobaki itathminiwe badala ya kudhani kuwa yote inahitaji leaching. Soma <a href="/insights/plant-test-work-guide">mwongozo wa majaribio (kwa Kiingereza)</a> na <a href="/insights/gravity-vs-cyanide-gold-recovery">ulinganisho wa gravity na sianidi (kwa Kiingereza)</a>.</p>`,
  },
  {
    id: "vs-shaking-table",
    title: "Concentrator na meza ya kutikisa zinavyosaidiana",
    html: `<p>Kwa kawaida vifaa hivi hufanya kazi tofauti zinazosaidiana. Concentrator hupokea mkondo mkubwa na kupunguza uzito wa mkusanyiko; meza husafisha mkusanyiko huo ili kutathmini hatua ya kuyeyusha.</p>
<div class="eq-tablewrap"><table class="eq-table eq-table-3"><caption class="eq-caption">Ulinganisho wa concentrator na meza</caption><thead><tr><th scope="col">Kipengele</th><th scope="col">Concentrator</th><th scope="col">Meza ya kutikisa</th></tr>
</thead><tbody><tr><th scope="row">Nguvu ya kutenganisha</th><td>60–200 G</td><td>Gravity, mwendo na maji</td></tr>
<tr><th scope="row">Kiasi cha kuchakata</th><td>0.5–100 t/h kwa bakuli</td><td>0.3–1.5 t/h kwa meza kamili</td></tr>
<tr><th scope="row">Dhahabu ndogo</th><td>Hadi takribani 20 µm kwa hali inayofaa</td><td>Inaweza kupoteza nyingi chini ya 45 µm</td></tr>
<tr><th scope="row">Recovery ya mfano</th><td>85–98% kwa dhahabu huru inayofaa</td><td>60–90%, kutegemea chembe laini</td></tr>
<tr><th scope="row">Mkusanyiko</th><td>Uwiano wa 500–2,000:1, bado una madini mazito</td><td>Daraja kubwa baada ya kusafisha</td></tr>
<tr><th scope="row">Ujuzi</th><td>Udhibiti wa maji na muda wa mzunguko</td><td>Marekebisho ya mteremko, mwendo na maji</td></tr>
<tr><th scope="row">Usalama wa mkusanyiko</th><td>Ndani ya bakuli</td><td>Unaonekana kwenye uso wazi</td></tr>
<tr><th scope="row">Kazi inayofaa</th><td>Gravity ya mkondo mkubwa</td><td>Kusafisha mkusanyiko au mtambo mdogo</td></tr>
</tbody></table></div>
<p>Mfano wa mfumo bila zebaki ni <strong>crusher → ball mill → concentrator → meza → hatua ya kuyeyusha</strong>. Mabaki yanahitaji kupimwa na kupelekwa kwenye mfumo unaofaa wa kuchakata au kuhifadhi. Maelezo zaidi yapo kwenye <a href="/insights/mercury-free-gold-recovery">mwongozo wa kupata dhahabu bila zebaki (kwa Kiingereza)</a>.</p>`,
  },
  {
    id: "installation-sizing",
    title: "Kusimika na kupanga uwezo wa concentrator",
    html: `<h3>Mahali pa kuweka kwenye mtambo</h3><p>Kwa mawe magumu, kifaa kinaweza kutibu bidhaa ya kinu au sehemu ya mkondo wa chini wa <a href="/equipment-swahili/hydrocyclone">hydrocyclone</a>. Kwa alluvial, kiwe baada ya kuosha na kuchuja kwa <a href="/equipment-swahili/trommel-screen">trommel</a> au <a href="/equipment-swahili/vibrating-screen">vibrating screen</a>, pamoja na kichujio cha mwisho kinachofikia kikomo cha bakuli. Mabaki ya zamani yanaweza kutayarishwa tena baada ya tathmini ya madini na uchafu uliopo, kabla ya kuunganisha gravity na <a href="/equipment-swahili/cil-cip-plant">CIL</a> au njia nyingine.</p>
<h3>Kuhesabu kiasi kinachopita</h3><p>Chagua kwa <strong>tani za yabisi kwa saa</strong> kwenye mkondo unaotibiwa. Mtambo wa 100 t/day unaofanya saa 20 hupokea 5 t/h. Ikiwa concentrator inatibu sehemu ya mzunguko wa kinu tu, tumia kiasi cha sehemu hiyo na ongezeko la nyenzo zinazozunguka tena. Kifaa kidogo kinaweza kuzidiwa, na kikubwa bila sababu huongeza gharama na maji.</p>
<h3>Mambo ya kuthibitisha eneo la kazi</h3><ul><li><strong>Kuchuja:</strong> ondoa mawe yanayozidi kikomo kabla ya bakuli.</li>
<li><strong>Maji:</strong> tumia maji safi, kichujio na shinikizo thabiti kwa mahitaji ya modeli.</li>
<li><strong>Muda wa batch:</strong> ratiba ndefu inaweza kujaza pete; fupi kupita kiasi huongeza mapumziko. Rekebisha kwa assay za mabaki.</li>
<li><strong>Umeme:</strong> mota za 1.5–30 kW zilinganishwe na chanzo halisi. Panga <a href="/equipment-swahili/diesel-generator-mining">jenereta</a> kwa kinu, pampu na concentrator pamoja.</li>
<li><strong>Mkusanyiko:</strong> dhibiti njia ya kutoa, watu wanaohusika na kumbukumbu za kila batch.</li>
</ul><p>Uchaguzi mzuri unaunganisha majaribio ya madini, kiasi halisi cha mkondo na huduma za eneo. Andaa taarifa hizo kabla ya kuomba modeli na nukuu ya bei.</p>`,
  },
]
