import type { GuideSection } from '../index'

/** Kiswahili guide, preserving the English section anchors and diagram format. */
export const sections: GuideSection[] = [
  {
    id: "elution-process",
    title: "Hatua za elution na kupata dhahabu kutoka kwenye kaboni",
    html: `<p>Elution hufanya kazi ya kurudisha dhahabu kutoka kwenye kaboni kwenda kwenye myeyusho. Kwenye matanki, kaboni hushika dhahabu iliyoyeyuka; kwenye column, joto na kemia iliyodhibitiwa huiondoa kwenye kiasi kidogo cha myeyusho. Electrowinning kisha huitoa kama yabisi. Mchoro unaonyesha mtiririko wa dhana, lakini kila hatua inahitaji vifaa, udhibiti na utaratibu maalumu wa kazi.</p>
<figure class="eq-figure">
<div class="eq-diagram" tabindex="0" role="region" aria-label="Mchoro; sogeza pembeni kusoma maelezo yote">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="elution-flow-title elution-flow-desc" style="width:100%;height:auto;display:block">
<title id="elution-flow-title">Mtiririko wa elution na kupata dhahabu</title>
<desc id="elution-flow-desc">Kaboni yenye dhahabu hupitia hatua zilizotenganishwa za kuosha na elution. Myeyusho huenda electrowinning, sludge huandaliwa kwa kuyeyusha, na kaboni hurudishwa baada ya kurejeshwa uwezo.</desc>
<defs><marker id="elu-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>
<g font-family="inherit" font-size="15" text-anchor="middle" fill="currentColor">
<g stroke="currentColor" stroke-width="1.5" fill="none">
<rect x="10" y="30" width="200" height="80" rx="8"/><rect x="260" y="30" width="200" height="80" rx="8"/><rect x="510" y="30" width="200" height="80" rx="8"/>
<rect x="510" y="190" width="200" height="80" rx="8"/><rect x="260" y="190" width="200" height="80" rx="8"/><rect x="10" y="190" width="200" height="80" rx="8"/>
</g>
<text x="110" y="64" font-weight="700">1. Kaboni yenye dhahabu</text><text x="110" y="88" font-size="13" opacity=".75">kutoka CIL/CIP</text>
<text x="360" y="64" font-weight="700">2. Kuosha kaboni</text><text x="360" y="88" font-size="13" opacity=".75">hatua tofauti iliyodhibitiwa</text>
<text x="610" y="64" font-weight="700">3. Elution</text><text x="610" y="88" font-size="13" opacity=".75">myeyusho wenye joto</text>
<text x="610" y="224" font-weight="700">4. Electrowinning</text><text x="610" y="248" font-size="13" opacity=".75">dhahabu kwenye cathode</text>
<text x="360" y="224" font-weight="700">5. Kuyeyusha</text><text x="360" y="248" font-size="13" opacity=".75">sludge + flux → doré</text>
<text x="110" y="224" font-weight="700">6. Kurejesha kaboni</text><text x="110" y="248" font-size="13" opacity=".75">kaboni, 650–750 °C</text>
<g stroke="currentColor" stroke-width="1.5" fill="none" marker-end="url(#elu-arrow)">
<path d="M210 70H255"/><path d="M460 70H505"/><path d="M610 110V185"/><path d="M510 230H465"/>
<path d="M560 110 C 480 150, 250 150, 160 186"/>
</g>
<text x="360" y="132" font-size="12.5" opacity=".7">kaboni baada ya elution</text>
<path d="M110 190V140" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" fill="none" marker-end="url(#elu-arrow)"/>
<text x="110" y="132" font-size="12.5" opacity=".7">kurudi kwenye matanki</text>
</g>
</svg>
</div>
<figcaption><span class="eq-diagram-hint">Sogeza mchoro pembeni ili kusoma maelezo yote.</span>Mchoro wa dhana wa batch elution. Myeyusho wenye dhahabu kutoka hatua ya 3 huenda kwenye seli. Kwa Zadra unaweza kuzunguka kati ya column na seli. Hatua ya tindikali hutenganishwa salama na sianidi.</figcaption>
</figure>
<ol><li><strong>Kupokea kaboni.</strong> Kaboni yenye dhahabu hutolewa kwenye CIL au CIP, kuchujwa kutoka kwenye tope na kuoshwa ili chembe za mawe zisiingie column.</li>
<li><strong>Kuondoa scale.</strong> Hatua ya acid wash inaweza kuondoa calcium carbonate inayofunika matundu ya kaboni. Ifanywe katika mfumo uliosanifiwa, wenye utenganishaji salama na sianidi pamoja na kuosha na vipimo vinavyothibitisha hatua inayofuata.</li>
<li><strong>Elution.</strong> Mifumo ya shinikizo inaweza kutumia 110–140 °C, na baadhi ya mifumo ya atmospheric karibu 95 °C. Lengo la mfano ni chini ya 100 g/t iliyobaki kwenye kaboni, lakini setpoints na kemia hutokana na mchakato husika.</li>
<li><strong>Electrowinning.</strong> Rectifier hupitisha mkondo kati ya anode na cathode, ambapo dhahabu hukusanywa kutoka kwenye myeyusho.</li>
<li><strong>Kuyeyusha.</strong> Sludge huandaliwa na kuyeyushwa pamoja na flux katika mfumo wenye uingizaji hewa na udhibiti unaofaa, kupata doré kwa usafishaji zaidi.</li>
<li><strong>Regeneration.</strong> Kaboni inaweza kupashwa kwenye tanuru la mfano la 650–750 °C kwa mazingira yaliyodhibitiwa, kisha kurudishwa kwenye matanki baada ya kuthibitisha uwezo wake.</li>
</ol>`,
  },
  {
    id: "aarl-vs-zadra",
    title: "Tofauti kati ya AARL na Zadra",
    html: `<p>Zadra huzungusha myeyusho wa elution kati ya column na seli ya electrowinning. AARL, iliyotengenezwa na Anglo American Research Laboratories, hutumia hatua zilizoandaliwa za kutayarisha kaboni na kusogeza dhahabu kwa maji safi yenye joto. Inaweza kutoa myeyusho mdogo wenye daraja kubwa kwa mzunguko mfupi, lakini huhitaji udhibiti na ubora wa maji unaolingana.</p>
<div class="eq-tablewrap"><table class="eq-table eq-table-3"><caption class="eq-caption">Tofauti za kawaida za Zadra na AARL</caption><thead><tr><th scope="col">Kipengele</th><th scope="col">Zadra</th><th scope="col">AARL</th></tr>
</thead><tbody><tr><th scope="row">Mtiririko</th><td>Myeyusho huzunguka kati ya column na seli</td><td>Hatua tofauti za kuosha, kutayarisha na elution ya kupita mara moja</td></tr>
<tr><th scope="row">Kemia ya mfano</th><td>Takribani 1% NaOH na 0.1–0.2% NaCN katika baadhi ya mifumo</td><td>Pre-soak ya baadhi ya mifumo: 2–3% NaOH na 1–3% NaCN; kisha maji yaliyotayarishwa</td></tr>
<tr><th scope="row">Joto</th><td>Karibu 95 °C atmospheric au 125–140 °C pressure</td><td>110–120 °C kwa mifumo ya shinikizo</td></tr>
<tr><th scope="row">Muda</th><td>48–72 h atmospheric; 12–24 h pressure</td><td>8–14 h</td></tr>
<tr><th scope="row">Myeyusho wenye dhahabu</th><td>Kiasi kikubwa, electrowinning ndani ya mzunguko</td><td>Kiasi kidogo, electrowinning baada ya strip</td></tr>
<tr><th scope="row">Maji</th><td>Mahitaji yanategemea mfumo</td><td>Maji safi yaliyotayarishwa; hardness inaweza kuathiri kaboni</td></tr>
<tr><th scope="row">Vifaa</th><td>Mpangilio unaweza kuwa rahisi zaidi</td><td>Matanki na vali zaidi pamoja na sequencing</td></tr>
<tr><th scope="row">Kazi ya kulinganisha</th><td>Mtambo mdogo au wa kati, ikiwemo batch ya 0.5–3 t</td><td>Kiasi kikubwa kinachohitaji mizunguko mifupi</td></tr>
</tbody></table></div>
<p>Viwango vya kemia kwenye jedwali ni vya kuelewa tofauti za usanifu, si maelekezo ya kuchanganya kemikali. Pressure Zadra inaweza kuwa chaguo la kati kati ya muda mrefu wa atmospheric na mfumo mpana wa AARL. Linganisha kwa kiasi cha kaboni, huduma na timu; soma <a href="/insights/cil-vs-cip-vs-heap-leach">CIL, CIP na heap leach (kwa Kiingereza)</a> na <a href="/insights/small-cip-plant-guide">mwongozo wa mtambo mdogo (kwa Kiingereza)</a>.</p>`,
  },
  {
    id: "whats-included",
    title: "Vifaa vinavyounda mtambo kamili wa elution",
    html: `<p>Nukuu ya column pekee haitoi wigo wa kituo kinachoweza kufanya kazi. Linganisha vifaa, huduma na usalama vilivyojumuishwa, pamoja na sehemu ambazo zinatolewa au kujengwa kwenye eneo lako.</p>
<div class="eq-tablewrap"><table class="eq-table"><caption class="eq-caption">Orodha ya wigo wa elution</caption><thead><tr><th scope="col">Kifaa</th><th scope="col">Kazi yake</th></tr>
</thead><tbody><tr><th scope="row">Elution column</th><td>Kushikilia batch ya kaboni, insulation na uthibitisho wa shinikizo unaofaa</td></tr>
<tr><th scope="row">Heater au boiler</th><td>Kutoa joto kwa mfumo wa heat exchanger uliopangwa</td></tr>
<tr><th scope="row">Acid wash</th><td>Kuondoa scale kwa mfumo wenye utenganishaji na hatua za usalama</td></tr>
<tr><th scope="row">Matanki na pampu</th><td>Kutayarisha na kuzungusha myeyusho, na hatua za ziada kwa njia husika</td></tr>
<tr><th scope="row">Seli na rectifier</th><td>Electrowinning ya dhahabu kwenye cathode</td></tr>
<tr><th scope="row">Tanuru la kaboni</th><td>Kurejesha uwezo wa adsorption</td></tr>
<tr><th scope="row">Tanuru la kuyeyusha</th><td>Kuandaa doré pamoja na crucibles, flux na moulds</td></tr>
<tr><th scope="row">Udhibiti na usalama</th><td>Joto, shinikizo, vipima HCN, uingizaji hewa, vifaa vya dharura na udhibiti wa kuingia</td></tr>
</tbody></table></div>
<div class="art-callout"><strong>Unatafuta msingi wa bei?</strong> Soma <a href="/insights/gold-elution-plant-price">gharama za mtambo wa elution Tanzania (kwa Kiingereza)</a> kwa wigo wa mifano, uendeshaji na kulinganisha huduma ya pamoja. Nukuu ya mradi lazima ibainishe kilichojumuishwa.</div>`,
  },
  {
    id: "batch-sizing",
    title: "Kupanga batch ya kaboni kwa kiasi cha dhahabu",
    html: `<p>Batch hutokana na dhahabu inayopatikana na tofauti kati ya daraja la kaboni kabla na baada ya elution. Hivyo tani za mawe pekee hazitoshi kupanga column.</p>
<p><strong>Kaboni ya strip kwa siku (t) = dhahabu inayopatikana kwa siku (g) ÷ tofauti ya daraja la kaboni kabla na baada ya strip (g/t).</strong></p>
<p>Mfano huu unadhani mawe ya 3 g/t, recovery ya leaching 90%, kaboni yenye 1,500 g/t kabla na 100 g/t baada ya strip, na batch kila siku tatu. Tofauti ya daraja ni 1,400 g/t. Hizi ni assumptions za hesabu, si matokeo ya mradi wako.</p>
<div class="eq-tablewrap"><table class="eq-table eq-table-3"><caption class="eq-caption">Mfano wa batch kwa assumptions zilizotajwa</caption><thead><tr><th scope="col">Kiasi cha mawe</th><th scope="col">Kaboni kwa siku</th><th scope="col">Batch kila siku 3</th></tr>
</thead><tbody><tr><th scope="row">50 t/day</th><td>≈ 0.1 t</td><td>≈ 0.3 t; linganisha huduma ya pamoja</td></tr>
<tr><th scope="row">100 t/day</th><td>≈ 0.2 t</td><td>≈ 0.6 t</td></tr>
<tr><th scope="row">250 t/day</th><td>≈ 0.5 t</td><td>≈ 1.5 t</td></tr>
<tr><th scope="row">500 t/day</th><td>≈ 1.0 t</td><td>≈ 2.9 t</td></tr>
<tr><th scope="row">1,000 t/day</th><td>≈ 1.9 t</td><td>≈ 5.8 t</td></tr>
</tbody></table></div>
<p>Kwa 50 t/day, dhahabu ya mfano ni 135 g kwa siku, hivyo kaboni ni 135 ÷ 1,400 ≈ 0.096 t kwa siku. Daraja likiongezeka au kaboni ikibeba dhahabu kidogo, batch inaongezeka. Panga nafasi ya mabadiliko na hakikisha tanuru linaweza kutibu kiasi hicho kati ya strip. Batch ndogo, kwa mfano chini ya nusu tani, inaweza kuhalalisha kulinganisha huduma ya pamoja badala ya kununua kituo chote.</p>`,
  },
  {
    id: "power-heating",
    title: "Umeme, kupasha joto na huduma za eneo",
    html: `<p>Thibitisha mfumo wa umeme wa vifaa, kwa mfano 400 V wa awamu tatu, 50 Hz na 230 V kwa baadhi ya controls. Kupasha joto ni mzigo mkubwa wa nishati, kwa sababu myeyusho unahitaji kufikia na kudumisha joto la mchakato.</p>
<ul><li><strong>Joto la dizeli:</strong> linaweza kufaa nje ya gridi, kwa sababu kutumia jenereta kutengeneza umeme kisha joto huongeza hatua za upotevu wa nishati.</li>
<li><strong>Joto la umeme:</strong> linganisha ikiwa gridi ina uwezo na uthabiti unaohitajika, pamoja na tariff na control ya mfumo.</li>
<li><strong>Jenereta:</strong> hesabu pampu, rectifier, blower, taa, feni na vipima gesi pamoja na kuanzisha mota. Soma kuhusu <a href="/equipment-swahili/diesel-generator-mining">jenereta ya mgodi</a> na <a href="/insights/off-grid-mine-power">umeme nje ya gridi (kwa Kiingereza)</a>.</li>
<li><strong>Huduma za usalama:</strong> vipima gesi na uingizaji hewa vihifadhiwe kwa mpango wa nguvu unaolingana na tathmini ya hatari, hata mfumo mwingine unapozidiwa.</li>
</ul><p>Upatikanaji wa kemikali na kaboni pia ni sehemu ya mpango. Soma <a href="/insights/activated-carbon-cyanide-tanzania">kaboni hai na kemikali za mtambo (kwa Kiingereza)</a> kwa maelezo ya ununuzi.</p>
<p>Mtambo unaofaa huunganisha batch iliyohesabiwa, njia ya elution, huduma na usalama. Andaa kiasi na daraja la kaboni, ratiba ya strip na hali ya eneo ili nukuu itoe wigo unaoweza kukaguliwa.</p>`,
  },
]
