import type { GuideSection } from '../index'

/** Kiswahili guide, preserving the English section anchors and diagram format. */
export const sections: GuideSection[] = [
  {
    id: "pi-vs-vlf",
    title: "PI na VLF: tofauti ya namna zinavyogundua metali",
    html: `<p>Aina zote hutuma uga wa sumaku na kupima mwitikio wa metali, lakini zinatumia mbinu tofauti. Tofauti hiyo huamua jinsi detector inavyovumilia udongo wenye madini na kutofautisha takataka za metali.</p>
<ul><li><strong>VLF:</strong> hutuma ishara inayoendelea, kwa mfano 18–71 kHz kwa vifaa vya dhahabu. Marudio makubwa yanaweza kusaidia dhahabu ndogo, na discrimination husaidia kutofautisha baadhi ya metali. Hata hivyo, udongo wenye chuma unaweza kuongeza kelele na kupunguza kina.</li>
<li><strong>PI:</strong> hutuma pulses na kupima ishara inayopungua baada yake. Inaweza kuvumilia madini ya udongo vizuri, lakini uwezo wa kukataa takataka una mipaka, hivyo misumari na metali nyingine inaweza kuhitaji kuchimbwa pia.</li>
<li><strong>Multi-frequency VLF:</strong> hutumia marudio zaidi ya moja na inaweza kuwa chaguo la matumizi tofauti kwenye udongo wa kati. Uwezo hutegemea modeli na hali halisi.</li>
</ul><div class="eq-tablewrap"><table class="eq-table eq-table-3"><caption class="eq-caption">Ulinganisho wa detector za VLF na PI</caption><thead><tr><th scope="col">Kipengele</th><th scope="col">VLF</th><th scope="col">PI</th></tr>
</thead><tbody><tr><th scope="row">Mbinu</th><td>Ishara endelevu ya 18–71 kHz na phase</td><td>Pulse na kupungua kwa ishara</td></tr>
<tr><th scope="row">Udongo wenye madini</th><td>Unaweza kupunguza kina na kuhitaji ground balance</td><td>Mara nyingi huvumilia vizuri zaidi</td></tr>
<tr><th scope="row">Vipande vikubwa vya kina</th><td>Kina cha kati kulingana na modeli</td><td>Baadhi zinaweza kufikia 1 m au zaidi kwa coil na kipande kinachofaa</td></tr>
<tr><th scope="row">Dhahabu ndogo karibu na uso</th><td>Marudio ya juu yanaweza kufaa sana</td><td>Coil ndogo na pulse delay fupi husaidia</td></tr>
<tr><th scope="row">Discrimination</th><td>Inaweza kutofautisha baadhi ya takataka</td><td>Ina mipaka; ishara nyingi huhitaji kuchunguzwa</td></tr>
<tr><th scope="row">Hot rocks</th><td>Zinaweza kutoa ishara nyingi zisizolengwa</td><td>Mara nyingi ishara chache zaidi</td></tr>
<tr><th scope="row">Uzito na betri</th><td>Mara nyingi nyepesi</td><td>Inaweza kuwa nzito na kutumia nguvu zaidi</td></tr>
<tr><th scope="row">Gharama</th><td>Inaweza kuwa ndogo</td><td>Inaweza kuwa kubwa</td></tr>
<tr><th scope="row">Kazi ya kulinganisha</th><td>Udongo tulivu, dhahabu ndogo na takataka nyingi</td><td>Udongo wenye madini na vipande vya kina</td></tr>
</tbody></table></div>
<p>Kina hakiamuliwi na aina pekee. Jaribu kifaa kwa kipande na udongo vinavyowakilisha lengo lako kabla ya kuchagua.</p>`,
  },
  {
    id: "which-detector",
    title: "Kuchagua detector kulingana na kazi na udongo",
    html: `<p>Anza na udongo, ukubwa wa dhahabu unayotarajia na kiasi cha metali nyingine kilichopo. Mchoro unasaidia kuelekeza kulinganisha, kisha jaribio la eneo lithibitishe uchaguzi.</p>
<figure class="eq-figure">
<div class="eq-diagram" tabindex="0" role="region" aria-label="Mchoro; sogeza pembeni kusoma maelezo yote">
<svg viewBox="0 0 720 360" role="img" aria-labelledby="det-title det-desc" style="width:100%;height:auto;display:block">
<title id="det-title">Kuchagua detector ya PI au VLF</title>
<desc id="det-desc">Udongo wenye madini mengi unaweza kuhitaji PI. Coil kubwa hulinganishwa kwa vipande vikubwa vya kina na ndogo kwa dhahabu ndogo. Kwenye udongo tulivu, VLF ya marudio ya juu inaweza kufaa kwa dhahabu ndogo karibu na uso; multi-frequency ni chaguo jingine la kutathmini.</desc>
<defs><marker id="det-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>
<g font-family="inherit" text-anchor="middle" fill="currentColor">
<rect x="210" y="10" width="300" height="58" rx="8" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0"/><text x="360" y="36" font-size="11.5" font-weight="700">Udongo una madini mengi?</text><text x="360" y="54" font-size="11.5">murram mwekundu na mawe ya chuma</text>
<g stroke="currentColor" stroke-width="1.5" fill="none" marker-end="url(#det-arrow)">
<path d="M260 68 L150 118"/><path d="M460 68 L570 118"/>
<path d="M100 176 L95 236"/><path d="M220 176 L265 236"/>
<path d="M500 176 L455 236"/><path d="M640 176 L575 236"/>
</g>
<text x="185" y="92" font-size="12.5" opacity=".75">Ndiyo</text><text x="605" y="90" font-size="12.5" opacity=".75">Hapana, udongo tulivu</text>
<rect x="30" y="122" width="240" height="58" rx="8" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0"/><text x="150" y="148" font-size="11.5" font-weight="700">Pulse induction (PI)</text><text x="150" y="166" font-size="11.5">huvumilia madini ya udongo</text>
<rect x="450" y="122" width="240" height="58" rx="8" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0"/><text x="570" y="148" font-size="11.5" font-weight="700">Dhahabu ndogo karibu na uso,</text><text x="570" y="166" font-size="11.5">pamoja na metali nyingine?</text>
<text x="55" y="210" font-size="12" opacity=".75">kubwa, kina</text><text x="298" y="210" font-size="12" opacity=".75">ndogo</text>
<text x="432" y="210" font-size="12" opacity=".75">ndiyo</text><text x="670" y="201" font-size="12" opacity=".75">hapana /</text><text x="660" y="218" font-size="12" opacity=".75">mchanganyiko</text>
<rect x="15" y="240" width="160" height="58" rx="8" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity=".12"/><text x="95" y="266" font-size="11.5" font-weight="700">PI + coil kubwa</text><text x="95" y="284" font-size="11.5" font-weight="700">kina na vipande vikubwa</text>
<rect x="190" y="240" width="160" height="58" rx="8" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity=".12"/><text x="270" y="266" font-size="11.5" font-weight="700">PI + mono ndogo</text><text x="270" y="284" font-size="11.5" font-weight="700">au muda mfupi wa pulse</text>
<rect x="370" y="240" width="160" height="58" rx="8" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity=".12"/><text x="450" y="266" font-size="11.5" font-weight="700">VLF ya marudio ya juu</text><text x="450" y="284" font-size="11.5" font-weight="700">40–71 kHz</text>
<rect x="545" y="240" width="160" height="58" rx="8" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity=".12"/><text x="625" y="266" font-size="11.5" font-weight="700">Marudio mbalimbali</text><text x="625" y="284" font-size="11.5" font-weight="700">chaguo la matumizi tofauti</text>
</g>
</svg>
</div>
<figcaption><span class="eq-diagram-hint">Sogeza mchoro pembeni ili kusoma maelezo yote.</span>Mchoro wa kuchagua kwa hali ya udongo na dhahabu lengwa. PI inaweza kufaa kwenye udongo wenye madini mengi katika Kanda ya Ziwa na Lupa. Jaribu kwa sampuli inayojulikana kwenye eneo lako kabla ya kununua.</figcaption>
</figure>
<div class="eq-tablewrap"><table class="eq-table"><caption class="eq-caption">Aina ya detector kwa kazi tofauti</caption><thead><tr><th scope="col">Kazi</th><th scope="col">Mpangilio wa kulinganisha</th></tr>
</thead><tbody><tr><th scope="row">Murram mwekundu na mawe ya chuma</th><td>PI yenye mono au DD, baada ya ground balance kwenye eneo</td></tr>
<tr><th scope="row">Vipande vya kina vya eluvial</th><td>PI yenye coil kubwa ya 35–45 cm na mwendo polepole</td></tr>
<tr><th scope="row">Dhahabu ndogo kwenye udongo tulivu</th><td>VLF ya 40–71 kHz yenye coil ndogo ya concentric au DD</td></tr>
<tr><th scope="row">Kambi za zamani zenye takataka za chuma</th><td>VLF au multi-frequency yenye discrimination inayofaa</td></tr>
<tr><th scope="row">Mabaki na mawe kwenye meza ya kuchambua</th><td>Coil ndogo ya VLF au pinpointer; jaribu athari za metali nyingi</td></tr>
<tr><th scope="row">Kufuata dhahabu kuelekea chanzo</th><td>Detector inayofaa udongo, pamoja na GPS na kumbukumbu za kila kipande</td></tr>
</tbody></table></div>
<p>Detector haitoi njia kamili ya kutenganisha dhahabu laini ndani ya changarawe au mawe yaliyosagwa. Tathmini <a href="/equipment-swahili/shaking-table-gold">meza ya kutikisa</a> au <a href="/equipment-swahili/centrifugal-gold-concentrator">concentrator</a> kwa kazi ya kuchakata.</p>`,
  },
  {
    id: "coils-technique",
    title: "Coil, ground balance na utaratibu wa utafutaji",
    html: `<h3>Kuchagua coil</h3><p>Double-D inaweza kusaidia kwenye udongo wenye madini kwa namna inavyopokea ishara. Mono kwenye PI inaweza kutoa kina na sensitivity kubwa, lakini modeli na mineralisation vinaweza kuongeza kelele. Coil ya 15–25 cm inaweza kufaa kwa dhahabu ndogo au takataka nyingi; 35–45 cm kwa vipande vikubwa na eneo wazi. Hizi ni tofauti za kulinganisha, si ahadi ya kina.</p>
<h3>Ground balance na hot rocks</h3><p>Ground balance husaidia detector kutambua mwitikio wa udongo ili kuitenganisha na lengo. Rekebisha eneo linapobadilika, ikiwemo rangi au aina ya udongo. Mawe yenye magnetite au chuma, yanayoitwa hot rocks, yanaweza kutoa ishara. Jaribu kwenye jiwe linalojulikana ili kujifunza mwitikio wa modeli yako.</p>
<h3>Kufanya utafutaji wenye kumbukumbu</h3><ol><li>Pitisha coil polepole, karibu na uso na bapa, ukifunika takribani nusu ya upana wa njia iliyopita.</li>
<li>Chunguza ishara inayojirudia; dhahabu ndogo au ya kina inaweza kutoa ishara hafifu.</li>
<li>Pima shimo na udongo uliotolewa tofauti ili kujua lengo lilipo.</li>
<li>Rekodi GPS na kina cha kila kipande ili kuona makundi na mistari.</li>
<li>Fuatilia mwelekeo wa chanzo kwa jiolojia; dhahabu ya eluvial inaweza kusogea chini ya mteremko, lakini kuthibitisha mwamba kunahitaji <a href="/insights/gold-exploration-tanzania">utafiti wa madini (kwa Kiingereza)</a>, sampuli au <a href="/equipment-swahili/rc-drilling-rig">RC drilling</a>.</li>
</ol><div class="art-callout"><strong>Thibitisha haki ya kufanya kazi kwanza.</strong> Kumiliki detector hakutoi ruhusa ya kutafuta madini eneo lolote. Thibitisha leseni na ruhusa zinazohitajika kwa eneo na shughuli kwa mamlaka husika. Soma <a href="/insights-swahili/jinsi-ya-kupata-leseni-ya-pml">mwongozo wa PML</a> na <a href="/insights/selling-gold-tanzania">kuuza dhahabu Tanzania (kwa Kiingereza)</a>.</div>`,
  },
  {
    id: "buying-checklist",
    title: "Mambo ya kuangalia kabla ya kununua detector",
    html: `<p>Uchaguzi mzuri unahusisha uwezo, uhalisi wa bidhaa na msaada baada ya kununua. Tumia orodha hii kupanga maswali ya muuzaji na jaribio kabla ya kulipa.</p>
<ul><li><strong>Jaribio la udongo:</strong> tumia kipande kinachojulikana kwenye eneo lako au udongo unaofanana.</li>
<li><strong>Uhalisi:</strong> thibitisha serial number kwa mtengenezaji na pata warranty iliyoandikwa.</li>
<li><strong>Huduma:</strong> uliza mahali pa matengenezo na muda wa kawaida wa kurudisha kifaa.</li>
<li><strong>Coil na cover:</strong> panga vifuniko na vipuri kwa eneo lenye mawe.</li>
<li><strong>Betri:</strong> panga chaji, betri za ziada na chanzo cha solar au gari kinachokubaliwa kwa safari ndefu.</li>
<li><strong>Headphones na pinpointer:</strong> tathmini vifaa vinavyosaidia kutambua ishara na kupunguza muda wa kutafuta lengo kwenye shimo.</li>
<li><strong>Mafunzo:</strong> weka muda wa ground balance na kutafsiri ishara kabla ya kuamua kama kifaa kinafaa.</li>
</ul><p>Detector inayofaa ni ile inayolingana na udongo na lengo lako, yenye uhalisi na huduma inayothibitishwa. Tuma maelezo ya eneo, ukubwa wa dhahabu lengwa na bajeti kwenye <a href="https://wa.me/255759141705">WhatsApp</a> ili kupanga aina na wigo wa nukuu.</p>`,
  },
]
