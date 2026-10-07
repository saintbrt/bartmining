import type { GuideSection } from '../index'

/** Kiswahili guide, preserving the English section anchor. NOTE FOR REVIEW: native Kiswahili review pending. */
export const sections: GuideSection[] = [
  {
    id: 'electric-vs-pneumatic',
    title: 'Drill za umeme au za hewa: kulinganisha gharama za uendeshaji',
    html: `<p>Migodi midogo mingi ya chini ya ardhi Tanzania huchimba kwa drill za hewa zenye mguu wa kusaidia (jackleg), na drill yenyewe mara chache ndiyo sehemu ghali. Gharama iko kwenye hewa iliyobanwa. Kubadilisha dizeli au umeme kuwa hewa iliyobanwa na kuipeleka kwenye bomba refu hupoteza sehemu kubwa ya nishati, kwa hiyo mgodi unaoendesha drill kadhaa hulipa hasa compressor yake na uvujaji. Drill za mkono za umeme au hydraulic huepuka mabadiliko hayo, ndiyo sababu waendeshaji huuliza kama zingekuwa nafuu kuendesha.</p>
<p>Mahitaji ya hewa yanaonyesha ukubwa wa jambo. Jackleg moja inahitaji takribani cfm 100–150 kwa bar 6–7, na drill nne zikifanya kazi pamoja zinahitaji takribani cfm 500–600 baada ya kujumuisha uvujaji na matumizi ya wakati mmoja. Compressor kwa kawaida huhitaji takribani kW 0.12–0.15 kwa kila cfm kwa bar 7, kwa hiyo kazi hiyo inachukua takribani kW 60–90 za nguvu ya compressor. Kwenye mfumo ambao haujawahi kukaguliwa uvujaji, 20–30% ya hewa hiyo inaweza kupotea kabla ya kufika kwenye sehemu ya kuchimbia.</p>
<div class="eq-tablewrap"><table class="eq-table">
<thead><tr><th></th><th>Jackleg ya hewa</th><th>Drill ya mkono ya umeme au hydraulic</th></tr></thead>
<tbody>
<tr><td>Njia ya nishati</td><td>Mafuta au gridi → compressor → bomba la hewa → drill</td><td>Gridi au jenereta → waya → drill (au power pack)</td></tr>
<tr><td>Gharama kuu ya uendeshaji</td><td>Mafuta au umeme wa compressor, uvujaji, mafuta ya bomba la hewa</td><td>Umeme, nyaya, huduma ya drill</td></tr>
<tr><td>Faida</td><td>Rahisi, imara, inajulikana na kurekebishwa ndani ya nchi</td><td>Huepuka hasara za compressor; kelele kidogo kwenye sehemu ya kuchimbia kwa baadhi ya modeli</td></tr>
<tr><td>Mipaka</td><td>Matumizi duni ya nishati; kelele; hutegemea compressor yenye ukubwa sahihi</td><td>Inahitaji umeme salama kwenye sehemu ya kuchimbia, viwango vinavyofaa kwa hali ya maji au gesi, vipuri vya ndani na mafundi waliofunzwa</td></tr>
</tbody>
</table></div>
<p>Kwa migodi midogo mingi, akiba ya haraka zaidi si aina mpya ya drill bali mfumo bora wa hewa: ziba uvujaji, punguza hasara za bomba na linganisha <a href="/equipment-swahili/air-compressor-mining">compressor</a> na drill zinazotumika kweli. Drill ya umeme inafaa kujaribiwa pale umeme wa kuaminika unaweza kufikishwa salama kwenye sehemu ya kuchimbia, mgodi unapanga kuchimba kwa miaka badala ya miezi na msambazaji anaweza kuhudumia mashine ndani ya nchi. Linganisha mbili kwa msingi mmoja: gharama ya nishati kwa kila mita iliyochimbwa, matengenezo, muda wa kusimama na mafunzo ambayo timu inahitaji, vikipimwa kwenye majaribio badala ya kuchukuliwa kwenye brosha.</p>`,
  },
]
