import type { GuideSection } from '../index'

/** Kiswahili guide, preserving the English section anchors. NOTE FOR REVIEW: native Kiswahili review pending. */
export const sections: GuideSection[] = [
  {
    id: 'why-maintenance-matters',
    title: 'Matengenezo yanalinda nini kwenye matanki ya CIP au CIL',
    html: `<p>Mfululizo wa matanki ya leaching hupata dhahabu pale tu kila tanki linapoweka tope likiwa limechanganyika, kaboni ikiwa mahali pake na hewa ikiingia vizuri. Matatizo mengi kwenye mtambo mdogo wa CIP au CIL huanza kama upotevu wa kimya badala ya kuharibika ghafla: kichujio cha kati ya matanki kinachoruhusu kaboni laini kwenda kwenye mabaki, impeller iliyochakaa inayoacha mchanga utulie pembeni, au mifereji iliyojaa mchanga inayopitisha tope pembeni ya tanki badala ya kupita ndani yake. Kila moja hupunguza dhahabu inayopatikana kwa wiki kadhaa kabla mtu hajaliona kwenye uzalishaji.</p>
<p>Kwa hiyo matengenezo ya kawaida yana kazi tatu. Yanahakikisha vichanganyio na vichujio vinafanya kazi kila zamu. Yanagundua uchakavu wa tabaka la kinga la ndani, impeller na mabomba ya hewa kabla havijaharibika. Na yanaacha kumbukumbu, ili kushuka kwa urejeshaji kufuatiliwe hadi chanzo chake badala ya kulaumu madini. Jedwali la vipindi vya matengenezo hapa chini linaorodhesha ukaguzi wa kawaida; sehemu zinazofuata zinaeleza jinsi ya kufanya ukaguzi wa ndani uliopangwa na dalili za kufuatilia kati ya vipindi vya kusimamisha. Kwa mchakato mzima, angalia <a href="/equipment-swahili/cil-cip-plant">mwongozo wa mtambo wa CIL na CIP</a>.</p>`,
  },
  {
    id: 'planned-inspection',
    title: 'Jinsi ya kufanya ukaguzi uliopangwa wa tanki la leaching',
    html: `<p>Ukaguzi wa ndani unamaanisha kutoa tanki moja kwenye mfululizo, kulimwaga na kuingiza watu ndani. Hiyo inachanganya nafasi finyu, mabaki ya kemikali za mchakato na mitambo mizito inayozunguka, kwa hiyo lazima ufuate taratibu za usalama na vibali vilivyoandikwa vya mtambo. Mpangilio ulio hapa chini unaonyesha hatua ambazo meneja wa mtambo anapaswa kupanga; hauchukui nafasi ya taratibu hizo wala kanuni za kushughulikia kemikali zilizowekwa na msanifu wa mchakato wako.</p>
<ol>
<li><strong>Panga njia mbadala.</strong> Amua tope litapitaje pembeni ya tanki likiwa nje ya kazi, na kaboni iliyomo itahamishwaje kwenda tanki linalofuata ili isipotee wala kukosa hesabu.</li>
<li><strong>Tenga nishati.</strong> Funga kwa kufuli mota ya kichanganyio, hewa na pampu zozote, na andika nani ameshika kila kufuli.</li>
<li><strong>Mwaga na osha.</strong> Mwaga tope kwenda sehemu iliyoidhinishwa na osha tanki kwa mujibu wa utaratibu wa kuondoa uchafuzi, ili mabaki yasibaki sakafuni.</li>
<li><strong>Pima hewa.</strong> Mtu mwenye ujuzi apime hewa ndani kabla mtu yeyote hajaingia na aendelee kupima wakati wa kazi, akitumia <a href="/equipment-swahili/gas-detection-monitor">kipima gesi</a> chenye vihisio vinavyotakiwa na utaratibu wenu, ikiwemo cha hydrogen cyanide pale mchakato unapokihitaji.</li>
<li><strong>Kagua na andika.</strong> Kagua kila kipengele kwenye orodha hapa chini, piga picha au chora kasoro, na pima uchakavu inapowezekana ili ukaguzi ujao ulinganishe matokeo.</li>
<li><strong>Tengeneza, kisha rudisha kazini.</strong> Badilisha vipuri vilivyochakaa, rekebisha tabaka la kinga la ndani na acha rangi ya kinga ikauke kama mtengenezaji anavyoelekeza. Washa kichanganyio kabla ya kujaza tanki tope lote, kisha thibitisha mchanganyiko na mtiririko wa kichujio katika zamu ya kwanza.</li>
</ol>
<p>Ndani ya tanki, ukaguzi unapaswa kuhusisha:</p>
<ul>
<li>Blade za impeller na shafti, kuona uchakavu, nyufa na kupoteza mizani.</li>
<li>Tabaka la kinga la ndani kwenye usawa wa tope na kuzunguka sakafu, ambako msuguano na kutu hujikusanya.</li>
<li>Wavu wa kichujio cha kati ya matanki na sehemu zake za kuziba, kuona matundu au mianya ambayo ingeruhusu kaboni kupita.</li>
<li>Mabomba na midomo ya kuingiza hewa, kuona kuziba au kuvunjika.</li>
<li>Baffles, sakafu ya tanki na mifereji ya kuingia na kutoka, kuona mchanga uliojaa, nyufa na uvujaji.</li>
</ul>
<p>Panga kusimamisha wakati mfululizo unaweza kukosa tanki moja, na weka impeller za akiba, wavu wa kichujio na vifaa vya kurekebisha tabaka la kinga eneo la kazi kabla. Tanki linalosubiri kipuri kwa wiki mbili linafanya mfululizo mzima ufanye kazi ukiwa pungufu.</p>`,
  },
  {
    id: 'warning-signs',
    title: 'Dalili za mapema kati ya vipindi vya kusimamisha',
    html: `<p>Waendeshaji huona matatizo mengi yanayoanza kabla ukaguzi haujayaona, ikiwa wanajua cha kuangalia. Jedwali linaunganisha dalili za kawaida na vyanzo vyake vya mara nyingi na hatua ya kwanza ya kuchukua. Lichukue kama mwanzo wa kutafuta hitilafu: dalili ikiendelea, thibitisha chanzo na mtaalamu wa metallurgia wa mtambo au msambazaji wa kifaa.</p>
<div class="eq-tablewrap"><table class="eq-table">
<thead><tr><th>Anachoona mwendeshaji</th><th>Chanzo kinachowezekana</th><th>Hatua ya kwanza</th></tr></thead>
<tbody>
<tr><td>Kaboni laini kwenye sampuli ya mabaki au kwenye chujio la mabaki</td><td>Kichujio cha kati kimechanika au sehemu ya kuziba imechakaa</td><td>Kagua kichujio cha tanki hilo na hesabu ya kaboni; rekebisha kabla upotevu haujaongezeka</td></tr>
<tr><td>Kina cha tope kinapanda nyuma ya kichujio kimoja</td><td>Kichujio kimeziba kwa changarawe, vipande vya mbao au kaboni kubwa</td><td>Safisha au geuza kichujio na kagua chujio la takataka la juu</td></tr>
<tr><td>Sauti au mtikisiko wa kichanganyio umebadilika</td><td>Uchakavu wa impeller, blade zilizolegea, bearing au gearbox</td><td>Kagua mafuta ya gearbox na bearing; panga ukaguzi wa impeller</td></tr>
<tr><td>Mchanga mzito kwenye mifereji au sehemu isiyotikisika juu ya tanki</td><td>Tope halichanganyiki vizuri, mara nyingi kutokana na impeller iliyochakaa au tope zito kupita kiasi</td><td>Kagua hali ya impeller na msongamano wa tope ukilinganisha na usanifu</td></tr>
<tr><td>Madoa ya kutu au unyevu ukuta wa nje</td><td>Tabaka la kinga la ndani limeharibika</td><td>Weka alama, fuatilia na leta ukaguzi wa ndani mapema</td></tr>
<tr><td>Oksijeni iliyoyeyuka inashuka kwa kiasi kilekile cha hewa</td><td>Midomo ya hewa imeziba au kuvunjika</td><td>Kagua mabomba ya hewa na valvu fursa ijayo</td></tr>
</tbody>
</table></div>
<p>Kinachounganisha yote ni kumbukumbu. Daftari la kila siku la hali ya vichanganyio, ukaguzi wa vichujio na mzunguko wa kaboni humwezesha mtambo kulinganisha mwezi huu na uliopita na kuchukua hatua kwa mwenendo badala ya kipimo kimoja. Kwa makadirio ya kwanza ya ujazo wa tanki, tumia <a href="/insights-swahili/kikokotoo-cha-tanki-la-leaching">kikokotoo cha tanki la leaching</a>. Ukipanga matanki mapya au kubadilisha mfululizo uliochakaa, tutumie tani kwa siku, msongamano wa tope na matokeo ya majaribio ya leaching ili ujazo wa matanki, vichanganyio na vichujio vipangwe pamoja.</p>`,
  },
]
