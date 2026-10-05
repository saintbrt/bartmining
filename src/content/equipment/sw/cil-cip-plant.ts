import type { GuideSection } from '../index'

/** Kiswahili guide, preserving the English section anchors and diagram format. */
export const sections: GuideSection[] = [
  {
    id: "how-it-works",
    title: "Jinsi mtambo wa CIL au CIP unavyofanya kazi",
    html: `<p>CIL na CIP zinaweza kutibu dhahabu ambayo gravity haiwezi kupata kwa kiwango cha kiuchumi, ikiwa madini yanafaa leaching. Mawe husagwa kuwa tope, dhahabu huyeyushwa kwenye mchakato wa sianidi uliodhibitiwa na kaboni hai huishika. Kaboni yenye dhahabu hupelekwa kwenye <a href="/equipments-swahili/gold-elution-electrowinning-plant">elution na electrowinning</a>. Mfumo huu unahitaji usanifu wa kemikali, wafanyakazi waliofunzwa na mpango wa mabaki.</p>
<figure class="eq-figure">
<div class="eq-diagram" tabindex="0" role="region" aria-label="Mchoro; sogeza pembeni kusoma maelezo yote">
<svg viewBox="0 0 720 340" role="img" aria-labelledby="cip-train-title cip-train-desc" style="width:100%;height:auto;display:block">
<title id="cip-train-title">Ulinganisho wa matanki ya CIL na CIP</title>
<desc id="cip-train-desc">Mfano wa CIL una kaboni katika matanki yote sita. Mfano wa CIP unayeyusha kwanza katika L1–L3 na kushika dhahabu kwa kaboni katika A1–A3. Kaboni husogezwa kinyume na tope na yenye dhahabu huenda elution.</desc>
<defs><marker id="cip-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>
<g font-family="inherit" text-anchor="middle" fill="currentColor">
<text x="60" y="38" font-size="14" font-weight="700">CIL</text>
<rect x="10" y="50" width="100" height="60" rx="6" stroke="currentColor" stroke-width="1.5" fill="none"/>
<text x="60" y="77" font-size="11">Mawe yaliyosagwa</text><text x="60" y="94" font-size="11">tope</text>
<path d="M110 80H126" stroke="currentColor" stroke-width="1.5" marker-end="url(#cip-arrow)"/>
<rect x="130" y="50" width="60" height="60" rx="6" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity=".14"/><text x="160" y="86" font-size="11" font-weight="700">1</text><rect x="202" y="50" width="60" height="60" rx="6" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity=".14"/><text x="232" y="86" font-size="11" font-weight="700">2</text><rect x="274" y="50" width="60" height="60" rx="6" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity=".14"/><text x="304" y="86" font-size="11" font-weight="700">3</text><rect x="346" y="50" width="60" height="60" rx="6" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity=".14"/><text x="376" y="86" font-size="11" font-weight="700">4</text><rect x="418" y="50" width="60" height="60" rx="6" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity=".14"/><text x="448" y="86" font-size="11" font-weight="700">5</text><rect x="490" y="50" width="60" height="60" rx="6" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity=".14"/><text x="520" y="86" font-size="11" font-weight="700">6</text>
<path d="M190 80H200" stroke="currentColor" stroke-width="1.5" marker-end="url(#cip-arrow)"/><path d="M262 80H272" stroke="currentColor" stroke-width="1.5" marker-end="url(#cip-arrow)"/><path d="M334 80H344" stroke="currentColor" stroke-width="1.5" marker-end="url(#cip-arrow)"/><path d="M406 80H416" stroke="currentColor" stroke-width="1.5" marker-end="url(#cip-arrow)"/><path d="M478 80H488" stroke="currentColor" stroke-width="1.5" marker-end="url(#cip-arrow)"/>
<path d="M550 80H576" stroke="currentColor" stroke-width="1.5" marker-end="url(#cip-arrow)"/>
<rect x="580" y="50" width="130" height="60" rx="6" stroke="currentColor" stroke-width="1.5" fill="none"/>
<text x="645" y="77" font-size="11">Kwenda mabaki</text><text x="645" y="94" font-size="10.5" opacity=".75">tiba na hifadhi</text>
<path d="M540 128H140" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#cip-arrow)"/>
<text x="340" y="146" font-size="10.5" opacity=".75">kaboni: kinyume na tope</text>
<path d="M160 50V26" stroke="currentColor" stroke-width="1.5" marker-end="url(#cip-arrow)"/>
<text x="172" y="38" font-size="10.5" text-anchor="start" opacity=".75">kaboni yenye dhahabu → elution</text>
<text x="60" y="208" font-size="14" font-weight="700">CIP</text>
<rect x="10" y="220" width="100" height="60" rx="6" stroke="currentColor" stroke-width="1.5" fill="none"/>
<text x="60" y="247" font-size="11">Mawe yaliyosagwa</text><text x="60" y="264" font-size="11">tope</text>
<path d="M110 250H126" stroke="currentColor" stroke-width="1.5" marker-end="url(#cip-arrow)"/>
<rect x="130" y="220" width="60" height="60" rx="6" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0"/><text x="160" y="256" font-size="11" font-weight="700">L1</text><rect x="202" y="220" width="60" height="60" rx="6" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0"/><text x="232" y="256" font-size="11" font-weight="700">L2</text><rect x="274" y="220" width="60" height="60" rx="6" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0"/><text x="304" y="256" font-size="11" font-weight="700">L3</text><rect x="346" y="220" width="60" height="60" rx="6" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity=".14"/><text x="376" y="256" font-size="11" font-weight="700">A1</text><rect x="418" y="220" width="60" height="60" rx="6" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity=".14"/><text x="448" y="256" font-size="11" font-weight="700">A2</text><rect x="490" y="220" width="60" height="60" rx="6" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity=".14"/><text x="520" y="256" font-size="11" font-weight="700">A3</text>
<path d="M190 250H200" stroke="currentColor" stroke-width="1.5" marker-end="url(#cip-arrow)"/><path d="M262 250H272" stroke="currentColor" stroke-width="1.5" marker-end="url(#cip-arrow)"/><path d="M334 250H344" stroke="currentColor" stroke-width="1.5" marker-end="url(#cip-arrow)"/><path d="M406 250H416" stroke="currentColor" stroke-width="1.5" marker-end="url(#cip-arrow)"/><path d="M478 250H488" stroke="currentColor" stroke-width="1.5" marker-end="url(#cip-arrow)"/>
<path d="M550 250H576" stroke="currentColor" stroke-width="1.5" marker-end="url(#cip-arrow)"/>
<rect x="580" y="220" width="130" height="60" rx="6" stroke="currentColor" stroke-width="1.5" fill="none"/>
<text x="645" y="247" font-size="11">Kwenda mabaki</text><text x="645" y="264" font-size="10.5" opacity=".75">tiba na hifadhi</text>
<path d="M540 298H356" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#cip-arrow)"/>
<text x="448" y="316" font-size="10.5" opacity=".75">kaboni: kinyume na tope</text>
<path d="M376 220V196" stroke="currentColor" stroke-width="1.5" marker-end="url(#cip-arrow)"/>
<text x="388" y="208" font-size="10.5" text-anchor="start" opacity=".75">kaboni yenye dhahabu → elution</text>
</g>
</svg>
</div>
<figcaption><span class="eq-diagram-hint">Sogeza mchoro pembeni ili kusoma maelezo yote.</span>Mchoro wa dhana: matanki yenye rangi yana kaboni hai. CIL huunganisha leaching na adsorption; CIP hutenganisha hatua hizo. Idadi na ujazo wa matanki halisi hutokana na majaribio ya madini.</figcaption>
</figure>
<p><strong>CIL</strong> huweka kaboni kwenye matanki ya leaching, na <strong>CIP</strong> hutenganisha matanki ya kuyeyusha na ya kushika dhahabu. Mchoro unaonyesha kanuni, si idadi inayopaswa kununuliwa. Soma <a href="/insights/cil-vs-cip-vs-heap-leach">ulinganisho wa CIL, CIP na heap leach (kwa Kiingereza)</a> kwa uchaguzi mpana.</p>
<p>Mtambo kamili unaunganisha hatua zinazofuata, kila moja ikipangwa kwa majaribio na masharti ya eneo:</p>
<ol><li><strong>Kuponda na kusaga:</strong> mfano wa 80% kupita 75–150 µm, na <a href="/equipments-swahili/centrifugal-gold-concentrator">gravity concentrator</a> ikiwa dhahabu huru inahalalisha hatua hiyo.</li>
<li><strong>Kuongeza msongamano:</strong> mfano wa yabisi 40–50% unaathiri ujazo na nishati ya kuchanganya.</li>
<li><strong>Leaching na adsorption:</strong> matanki 5–8 ya <a href="/equipments-swahili/leaching-tank">kuchanganya</a> ni mfano wa mfululizo; pH 10.5–11.5 na oksijeni 6–10 ppm ni viwango vya usanifu vinavyohitaji uthibitisho, si maelekezo ya kemikali ya kila mradi.</li>
<li><strong>Vichujio:</strong> tope hupita wakati kaboni inabaki katika hatua inayotakiwa.</li>
<li><strong>Kuhamisha kaboni:</strong> kaboni husogezwa kinyume na tope kulingana na mpangilio.</li>
<li><strong>Elution, electrowinning na regeneration:</strong> dhahabu hutolewa na uwezo wa kaboni kurejeshwa.</li>
<li><strong>Mabaki:</strong> mfumo wa kupunguza sianidi na kuhifadhi mabaki hupangwa na kuthibitishwa kwa eneo.</li>
</ol>`,
  },
  {
    id: "plant-design",
    title: "Vipimo vinavyoamua ukubwa wa mtambo wa CIL au CIP",
    html: `<p>Usanifu utokane na sampuli inayowakilisha madini, badala ya vipimo vya katalogi pekee. <a href="/insights/plant-test-work-guide">Majaribio kabla ya kununua mtambo (kwa Kiingereza)</a> huonyesha usagaji, muda na consumables zinazofaa. Jedwali lifuatalo ni muhtasari wa makundi ya kawaida, si setpoints za kuendesha mtambo.</p>
<div class="eq-tablewrap"><table class="eq-table eq-table-3"><caption class="eq-caption">Vigezo vya msingi vya usanifu</caption><thead><tr><th scope="col">Kigezo</th><th scope="col">Mfano wa kiwango</th><th scope="col">Kinachoathiriwa</th></tr>
</thead><tbody><tr><th scope="row">Usagaji</th><td>80% kupita 75–150 µm</td><td>Kuachia dhahabu na nguvu ya kinu</td></tr>
<tr><th scope="row">Muda wa leaching</th><td>18–36 h</td><td>Ujazo wa matanki</td></tr>
<tr><th scope="row">Msongamano</th><td>Yabisi 40–50%</td><td>Ujazo na nguvu ya kuchanganya</td></tr>
<tr><th scope="row">Sianidi</th><td>150–500 ppm NaCN</td><td>Mchakato na gharama za kemikali</td></tr>
<tr><th scope="row">pH</th><td>10.5–11.5 kwa mfumo wa chokaa</td><td>Udhibiti wa kemia na hatari ya HCN</td></tr>
<tr><th scope="row">Oksijeni iliyoyeyuka</th><td>6–10 ppm</td><td>Kasi ya leaching na chanzo cha hewa</td></tr>
<tr><th scope="row">Kaboni</th><td>10–25 g/L ya tope</td><td>Adsorption na akiba ya kaboni</td></tr>
<tr><th scope="row">Matanki</th><td>5–8</td><td>Mgawanyo wa hatua na mtiririko</td></tr>
<tr><th scope="row">Matundu ya vichujio</th><td>0.6–0.8 mm</td><td>Tope kupita na kaboni kubaki</td></tr>
</tbody></table></div>
<h3>Mfano wa kuhesabu ujazo</h3><p>Ujazo wa kazi ni ujazo wa tope kwa saa ukizidishwa kwa muda wa kukaa. Ujazo wa tope unatokana na mawe na maji: tani ÷ msongamano wa mawe, pamoja na maji yanayohitajika kufikia yabisi inayolengwa. Kwa mfano huu tunadhani msongamano wa mawe 2.7 t/m³, maji 1 t/m³, yabisi 45%, saa 24, nafasi ya juu iliyopangwa kama nyongeza ya 10% kwenye ujazo wa kazi na matanki sita sawa.</p>
<div class="eq-tablewrap"><table class="eq-table eq-table-3"><caption class="eq-caption">Mfano wenye assumptions: ujazo pamoja na nyongeza ya 10%</caption><thead><tr><th scope="col">Kiasi cha mawe</th><th scope="col">Ujazo wa jumla uliopangwa</th><th scope="col">Kila moja ya matanki sita</th></tr>
</thead><tbody><tr><th scope="row">50 t/day</th><td>≈ 88 m³</td><td>≈ 14.6 m³</td></tr>
<tr><th scope="row">100 t/day</th><td>≈ 175 m³</td><td>≈ 29.2 m³</td></tr>
<tr><th scope="row">250 t/day</th><td>≈ 438 m³</td><td>≈ 73.0 m³</td></tr>
<tr><th scope="row">500 t/day</th><td>≈ 876 m³</td><td>≈ 146.0 m³</td></tr>
</tbody></table></div>
<p>Kwa 50 t/day, mawe yana takribani 18.5 m³ na maji 61.1 m³ kwa siku, hivyo working volume ya saa 24 ni karibu 79.6 m³ kabla ya nyongeza. Huu ni mfano wa hesabu, si usanifu uliokamilika. Muda ukiongezeka mara mbili, ujazo unaongezeka mara mbili; yabisi ikishuka hadi 40%, ujazo wa mfano unaongezeka karibu 17%.</p>
<p>Kaboni inayohamishwa kila siku huamua <a href="/equipments-swahili/gold-elution-electrowinning-plant#batch-sizing">ukubwa wa batch ya elution</a>. Soma pia <a href="/insights/small-cip-plant-guide">mwongozo wa mtambo mdogo wa CIP na CIL (kwa Kiingereza)</a> kwa hesabu za consumables.</p>`,
  },
  {
    id: "tank-maintenance",
    title: "Hitilafu za matanki na namna ya kuzitambua mapema",
    html: `<p>Ratiba ya chini ya ukurasa ina vipindi vya kawaida. Hapa lengo ni kuunganisha dalili na kipimo kinachoweza kuonyesha kwa nini dhahabu inapotea, hata wakati mtambo unaonekana kuendelea kufanya kazi.</p>
<div class="eq-tablewrap"><table class="eq-table eq-table-3"><caption class="eq-caption">Hitilafu za kawaida za mfululizo wa matanki</caption><thead><tr><th scope="col">Hitilafu</th><th scope="col">Dalili</th><th scope="col">Ukaguzi</th></tr>
</thead><tbody><tr><th scope="row">Kichujio kuziba</th><td>Kiwango cha tanki kupanda au tope kupita juu</td><td>Tofauti ya kiwango kila zamu; utendaji wa sweep au airlift</td></tr>
<tr><th scope="row">Kichujio kuchanika</th><td>Kaboni kwenye hatua zisizotakiwa au mabaki</td><td>Chuja sampuli ya mabaki na kagua paneli</td></tr>
<tr><th scope="row">Kaboni kuchakaa</th><td>Akiba kupungua na chembe za kaboni kuongezeka</td><td>Akiba ya kila tanki, mixer na pampu ya kuhamisha</td></tr>
<tr><th scope="row">Kaboni kupoteza uwezo</th><td>Dhahabu kwenye myeyusho wa mwisho kuongezeka</td><td>Activity test na tanuru la regeneration</td></tr>
<tr><th scope="row">Mixer kuharibika</th><td>Chembe kutulia na recovery kupungua</td><td>Mkondo wa mota, gearbox na impeller</td></tr>
<tr><th scope="row">Scale ya chokaa</th><td>Mabaki magumu kwenye vichujio, mabomba na kaboni</td><td>Udhibiti wa pH na matokeo ya kuosha kwa mfumo salama</td></tr>
<tr><th scope="row">Oksijeni ndogo</th><td>Leaching polepole na dhahabu kwenye mabaki</td><td>DO meter, spargers na blower</td></tr>
<tr><th scope="row">Kutu au liner kushindwa</th><td>Uvujaji na alama kwenye msingi</td><td>Ukaguzi wa ndani na kingo za containment</td></tr>
</tbody></table></div>
<div class="art-callout"><strong>Kuingia tankini kunahitaji mpango wa kazi salama.</strong> Tenga nishati na kemikali, andaa tanki kwa utaratibu uliothibitishwa, pima hali ya hewa na tumia ruhusa ya confined-space entry, ufuatiliaji na uokoaji. Usichukulie kuliosha pekee kuwa salama wala kuchanganya tindikali na mabaki ya sianidi.</div>
<p>Uchaguzi wa mtambo unakamilika kwa mpango wa kuendesha na kufuatilia, pamoja na vifaa. Tumia majaribio, hesabu za ujazo na mpango wa mabaki kuandaa wigo wa mradi kabla ya kuomba nukuu.</p>`,
  },
]
