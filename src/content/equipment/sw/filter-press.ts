import type { GuideSection } from '../index'

/** Kiswahili guide, preserving the English section anchors. NOTE FOR REVIEW: native Kiswahili review pending. */
export const sections: GuideSection[] = [
  {
    id: 'dry-stacking',
    title: 'Filter press na kuhifadhi mabaki yakiwa makavu',
    html: `<p>Mitambo midogo mingi ya dhahabu hupeleka mabaki kwenye bwawa la maji, ambapo yabisi hutulia na maji hutumika tena au hukauka. Kuhifadhi mabaki yakiwa makavu (dry stacking) hufuata njia tofauti: filter press huondoa maji mengi kwanza, na mabaki yaliyoshikamana baada ya kuchujwa (keki) yenye unyevu kidogo hupangwa na kushindiliwa kwenye eneo lililoandaliwa. Mtambo hupata maji mengi zaidi ya kutumia tena na huepuka kuhifadhi tope jingi nyuma ya tuta.</p>
<p>Njia hii inafaa maeneo yenye uhaba wa maji, nafasi ndogo au ardhi isiyofaa kwa bwawa, au pale mwendeshaji anataka kupunguza hatari ya kuhifadhi mabaki ya maji. Inagharimu zaidi kujenga na kuendesha kuliko bwawa rahisi, kwa sababu press, pampu yake, vitambaa na umeme lazima vifanye kazi kila siku, na rundo bado linahitaji mifereji, kushindiliwa na kudhibiti maji ya mvua. Tanzania, usimamizi wa mabaki huidhinishwa kupitia tathmini ya athari kwa mazingira ya mradi na mipango yake, kwa hiyo jadili chaguo hili na mshauri wako wa mazingira na <a href="https://www.nemc.or.tz/">NEMC</a> mapema badala ya baada ya mtambo kusanifiwa.</p>`,
  },
  {
    id: 'sizing-example',
    title: 'Kupanga ukubwa wa filter press kwa mabaki: mfano wa hesabu',
    html: `<p>Press hupangwa kwa yabisi kavu inazopaswa kushughulikia kila siku, unyevu wa keki unaoweza kufikiwa na muda wa mzunguko wake. Mfano ulio hapa chini unatumia takwimu za dhana kuonyesha mpangilio wa hesabu; jaribio la kuchuja kwenye mabaki yako halisi ndilo linaloweka muda halisi wa mzunguko na unyevu.</p>
<ol>
<li><strong>Yabisi.</strong> Tuseme mtambo unatoa tani 50 za yabisi kavu za mabaki kwa siku.</li>
<li><strong>Keki.</strong> Kwa unyevu wa keki wa 15% (dhana), press hutoa takribani 50 ÷ 0.85 = tani 59 za keki yenye unyevu kwa siku.</li>
<li><strong>Maji yanayorudishwa.</strong> Ikiwa tope la mabaki lina yabisi 40% kwa uzito (dhana), linabeba mita za ujazo 75 za maji kwa siku. Keki hubaki na takribani mita za ujazo 9, kwa hiyo press hurudisha takribani mita za ujazo 66 kwa siku kwenye mchakato.</li>
<li><strong>Mizunguko.</strong> Kwa mzunguko wa kuchuja wa dakika 60 (dhana) pamoja na dakika 20 za kufungua, kutoa na kufunga, press inayofanya kazi saa 20 hukamilisha takribani mizunguko 15 kwa siku.</li>
<li><strong>Ujazo kwa mzunguko.</strong> Kila mzunguko lazima ubebe takribani 59 ÷ 15 = tani 3.9 za keki. Kwa msongamano wa keki wa t/m³ 1.9 (dhana), hiyo ni takribani mita za ujazo 2 za ujazo wa vyumba, ambao msambazaji hubadilisha kuwa ukubwa na idadi ya sahani za kichujio.</li>
</ol>
<p>Hatua hizo hizo zinatumika kwa mkusanyiko au mabaki ya elution kwa kiwango kidogo zaidi. Kwa nukuu ya bei, tuma tani kavu kwa siku, msongamano wa tope, matokeo ya ukubwa wa chembe za mabaki na saa ambazo press itafanya kazi, na muombe msambazaji athibitishe muda wa mzunguko na unyevu wa keki kwa jaribio la kuchuja kabla ya kuamua.</p>`,
  },
]
