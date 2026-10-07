/**
 * Short descriptions for each Makita main product (one entry per Makita
 * product name; every size and kit option sits under it). Model data comes
 * from catalogue.json, collected from makita.co.tz on 2026-10-07.
 * NOTE FOR REVIEW: native Kiswahili review pending for the `sw` copy.
 */

export interface ProductCopy { en: string; sw: string }

export const PRODUCT_COPY: Record<string, ProductCopy> = {
  // Rotary & combination hammers
  'combination-hammer-lxt': { en: '18V cordless SDS-PLUS combination hammers for drilling and light chiselling in concrete, from compact 18 mm models to twin-battery 36V hammers for 28 mm holes.', sw: 'Combination hammer za betri za 18V (SDS-PLUS) kwa kutoboa na kuchonga kidogo kwenye zege, kuanzia modeli ndogo za mm 18 hadi za betri mbili za 36V kwa matundu ya mm 28.' },
  'combination-hammer-xgt': { en: '40V cordless SDS-PLUS combination hammers with corded-class power, several with anti-vibration and wireless dust-extractor start.', sw: 'Combination hammer za betri za 40V (SDS-PLUS) zenye nguvu karibu na za waya, nyingi zikiwa na kinga ya mtikisiko na kuwasha kifyonza vumbi bila waya.' },
  'combination-hammer': { en: 'Corded combination hammers from 780 W to 850 W for SDS-PLUS and SDS-MAX bits, the everyday choice for anchors and fixings where mains or generator power is available.', sw: 'Combination hammer za waya za W 780 hadi 850 kwa bit za SDS-PLUS na SDS-MAX, chaguo la kila siku kwa nanga na vifungo pale umeme wa gridi au jenereta upo.' },
  'rotary-hammer-lxt': { en: '18V cordless rotary hammers, from light SDS-PLUS models for small holes to a twin-battery SDS-MAX hammer for 40 mm holes.', sw: 'Rotary hammer za betri za 18V, kuanzia modeli nyepesi za SDS-PLUS kwa matundu madogo hadi ya betri mbili ya SDS-MAX kwa matundu ya mm 40.' },
  'rotary-hammer-xgt': { en: '40V and 80V cordless rotary hammers for heavy SDS-PLUS and SDS-MAX drilling up to 52 mm without a cable.', sw: 'Rotary hammer za betri za 40V na 80V kwa kutoboa kwa nguvu kwa SDS-PLUS na SDS-MAX hadi mm 52 bila waya.' },
  'rotary-hammer': { en: 'Corded rotary hammers from 470 W to 1 510 W, covering light SDS-PLUS drilling up to heavy 52 mm SDS-MAX work, with anti-vibration versions for long shifts.', sw: 'Rotary hammer za waya za W 470 hadi 1 510, kuanzia kutoboa kwepesi kwa SDS-PLUS hadi kazi nzito ya SDS-MAX ya mm 52, zikiwemo za kinga ya mtikisiko kwa zamu ndefu.' },
  // Demolition hammers & breakers
  'demolition-hammer-xgt': { en: 'Cordless SDS-MAX demolition hammers on 40V and twin-battery 80V for chiselling and breaking without a power lead.', sw: 'Demolition hammer za betri za SDS-MAX za 40V na 80V (betri mbili) kwa kuchonga na kuvunja bila waya wa umeme.' },
  'electric-breaker-xgt': { en: 'An 80V cordless breaker with 72.8 J impact energy for heavy concrete breaking where running a cable is impractical.', sw: 'Breaker ya betri ya 80V yenye nguvu ya pigo ya J 72.8 kwa kuvunja zege nzito pale kuvuta waya si rahisi.' },
  'demolition-hammer': { en: 'Corded demolition hammers from 900 W to 1 510 W for chiselling, breaking concrete and removing old foundations, with anti-vibration versions of the larger models.', sw: 'Demolition hammer za waya za W 900 hadi 1 510 kwa kuchonga, kuvunja zege na kuondoa misingi ya zamani, zikiwemo za kinga ya mtikisiko kwa modeli kubwa.' },
  'electric-breaker': { en: 'Heavy corded breakers of 1 850 W to 2 000 W with up to 72.8 J impact energy for breaking slabs and foundations.', sw: 'Breaker nzito za waya za W 1 850 hadi 2 000 zenye nguvu ya pigo hadi J 72.8 kwa kuvunja sakafu na misingi.' },
  // Power cutters
  'power-cutter-lxt': { en: 'A twin-battery 36V cutter with a 230 mm wheel for cutting concrete, pipe and steel on site without fuel or cables.', sw: 'Mashine ya kukata ya betri mbili za 36V yenye gurudumu la mm 230 kwa kukata zege, mabomba na chuma eneo la kazi bila mafuta wala waya.' },
  'power-cutter-xgt': { en: '80V cordless power cutters with 355 mm wheels, for wet or dry cutting of concrete and masonry.', sw: 'Power cutter za betri za 80V zenye magurudumu ya mm 355, kwa kukata zege na matofali kwa maji au bila maji.' },
  'power-cutter': { en: 'Petrol power cutters of 73 to 81 cm³ with 350 to 400 mm wheels, for cutting concrete, pipe and steel where there is no power at all.', sw: 'Power cutter za petroli za cm³ 73 hadi 81 zenye magurudumu ya mm 350 hadi 400, kwa kukata zege, mabomba na chuma mahali pasipo na umeme kabisa.' },
  // Wall chasers & tile cutters
  'cutter-cxt': { en: 'A compact 12V cordless cutter with an 85 mm wheel for tile, board and small cuts.', sw: 'Mashine ndogo ya kukata ya betri ya 12V yenye gurudumu la mm 85 kwa vigae, mbao za ukuta na mikato midogo.' },
  'dustless-cutter-lxt': { en: 'An 18V cordless 125 mm cutter with a dust shroud and wireless dust-extractor start, for cleaner cutting indoors.', sw: 'Mashine ya kukata ya betri ya 18V ya mm 125 yenye kifuniko cha vumbi na kuwasha kifyonza vumbi bila waya, kwa kukata kwa usafi ndani ya majengo.' },
  'tile-cutter': { en: 'A 1 300 W corded 110 mm cutter for tile, stone and masonry.', sw: 'Mashine ya kukata ya waya ya W 1 300 ya mm 110 kwa vigae, mawe na matofali.' },
  'angle-cutter': { en: 'A 2 400 W corded 305 mm cutter for deep cuts in concrete and stone.', sw: 'Mashine ya kukata ya waya ya W 2 400 ya mm 305 kwa mikato mirefu kwenye zege na mawe.' },
  'wall-chaser': { en: 'Corded wall chasers with twin blades for cutting neat channels for cable and conduit, 125 mm and 150 mm.', sw: 'Wall chaser za waya zenye blade mbili kwa kukata mifereji safi ya nyaya na mabomba ya umeme, mm 125 na mm 150.' },
  // Concrete planers & power scrapers
  'concrete-planer': { en: 'Corded 125 mm concrete planers for levelling and smoothing concrete with dust extraction.', sw: 'Concrete planer za waya za mm 125 kwa kusawazisha na kulainisha zege pamoja na kufyonza vumbi.' },
  'power-scraper': { en: 'A corded SDS-PLUS power scraper for removing tiles, scale and render.', sw: 'Power scraper ya waya ya SDS-PLUS kwa kuondoa vigae, ukoko na plasta.' },
  'power-scraper-lxt': { en: 'An 18V cordless SDS-PLUS power scraper with anti-vibration for chiselling and scraping.', sw: 'Power scraper ya betri ya 18V ya SDS-PLUS yenye kinga ya mtikisiko kwa kuchonga na kukwangua.' },
  // Angle grinders
  'angle-grinder-lxt': { en: '18V cordless angle grinders from 115 mm to twin-battery 230 mm, brushed and brushless, for cutting and grinding away from power.', sw: 'Angle grinder za betri za 18V kuanzia mm 115 hadi za betri mbili za mm 230, za brushed na brushless, kwa kukata na kusaga mbali na umeme.' },
  'angle-grinder-xgt': { en: '40V cordless angle grinders of 115 to 230 mm with corded-class power, with options for paddle or slide switch, brake, X-LOCK and wireless dust-extractor start.', sw: 'Angle grinder za betri za 40V za mm 115 hadi 230 zenye nguvu karibu na za waya, zikiwa na chaguo za swichi ya paddle au slide, breki, X-LOCK na kuwasha kifyonza vumbi bila waya.' },
  'angle-grinder': { en: 'Corded angle grinders from 100 mm to 230 mm, the workshop standard for cutting steel, grinding welds and preparing surfaces.', sw: 'Angle grinder za waya kuanzia mm 100 hadi 230, kiwango cha karakana kwa kukata chuma, kusaga vichomeo na kuandaa nyuso.' },
  // Die, straight & bench grinders
  'die-grinder': { en: 'Corded die grinders with 6 mm and 8 mm collets for deburring, porting and fine grinding in tight spaces.', sw: 'Die grinder za waya zenye collet za mm 6 na 8 kwa kuondoa makali, kusafisha matundu na kusaga kwa umakini mahali finyu.' },
  'die-grinder-lxt': { en: 'An 18V cordless die grinder with an 8 mm collet for precise grinding away from power.', sw: 'Die grinder ya betri ya 18V yenye collet ya mm 8 kwa kusaga kwa umakini mbali na umeme.' },
  'straight-grinder': { en: '750 W corded straight grinders for 125 mm and 150 mm wheels, for grinding inside pipes and on large castings.', sw: 'Straight grinder za waya za W 750 kwa magurudumu ya mm 125 na 150, kwa kusaga ndani ya mabomba na kwenye vyuma vikubwa vilivyoyeyushwa.' },
  'bench-grinder': { en: 'Corded bench grinders of 150 mm and 205 mm for sharpening chisels, drill steels and tools in the workshop.', sw: 'Bench grinder za waya za mm 150 na 205 kwa kunoa patasi, vyuma vya drill na zana karakana.' },
  // Sanders & polishers
  'angle-sander': { en: '180 mm corded angle sanders of 1 600 W and 2 200 W for heavy sanding of steel and concrete.', sw: 'Angle sander za waya za mm 180 za W 1 600 na 2 200 kwa kusanda kwa nguvu chuma na zege.' },
  'disc-sander': { en: 'Corded disc sanders of 150 mm and 180 mm for preparing steel and removing paint and rust.', sw: 'Disc sander za waya za mm 150 na 180 kwa kuandaa chuma na kuondoa rangi na kutu.' },
  'polisher': { en: 'Corded polishers of 150 mm and 180 mm with variable speed for finishing painted and metal surfaces.', sw: 'Polisher za waya za mm 150 na 180 zenye kasi inayobadilika kwa kumalizia nyuso zilizopakwa rangi na za chuma.' },
  'polisher-xgt': { en: 'A 40V cordless 180 mm polisher with variable speed.', sw: 'Polisher ya betri ya 40V ya mm 180 yenye kasi inayobadilika.' },
  'random-orbit-polisher-lxt': { en: 'An 18V cordless 150 mm random orbit polisher for finishing without swirl marks.', sw: 'Random orbit polisher ya betri ya 18V ya mm 150 kwa kumalizia bila alama za mizunguko.' },
  'sander-polisher': { en: 'A 700 W corded 180 mm sander-polisher with two speed ranges.', sw: 'Sander-polisher ya waya ya W 700 ya mm 180 yenye viwango viwili vya kasi.' },
  'sander-polisher-lxt': { en: 'An 18V cordless brushless sander-polisher for sanding and polishing.', sw: 'Sander-polisher ya betri ya 18V ya brushless kwa kusanda na kung’arisha.' },
  'sander-polisher-cxt': { en: 'A compact 12V cordless brushless sander-polisher for small surfaces.', sw: 'Sander-polisher ndogo ya betri ya 12V ya brushless kwa nyuso ndogo.' },
  // Metal cutters & cut-off saws
  'portable-cut-off': { en: 'Corded 355 mm and 405 mm abrasive cut-off saws for cutting steel sections, pipe and bar quickly.', sw: 'Cut-off saw za waya za mm 355 na 405 za gurudumu la kusaga kwa kukata vyuma vya umbo, mabomba na nondo haraka.' },
  'metal-cutter': { en: 'A 1 100 W corded 185 mm metal-cutting saw for clean, cool cuts in steel.', sw: 'Msumeno wa waya wa W 1 100 wa mm 185 wa kukata chuma kwa mikato safi isiyo na joto jingi.' },
  'metal-cutting-saw': { en: 'A 1 750 W corded 305 mm cold-cut saw for clean, accurate cuts in steel sections and pipe.', sw: 'Msumeno wa waya wa W 1 750 wa mm 305 wa kukata chuma bila joto kwa mikato safi na sahihi kwenye vyuma vya umbo na mabomba.' },
  'metal-cutter-lxt': { en: 'An 18V cordless 150 mm metal-cutting saw for steel sections and sheet away from power.', sw: 'Msumeno wa betri wa 18V wa mm 150 wa kukata vyuma vya umbo na mabati mbali na umeme.' },
  'metal-cutter-xgt': { en: 'A 40V cordless 185 mm brushless metal-cutting saw.', sw: 'Msumeno wa betri wa 40V wa mm 185 wa brushless wa kukata chuma.' },
  'compact-cut-off-lxt': { en: 'An 18V cordless 76 mm compact cut-off tool for bolts, small bar and cuts in tight spaces.', sw: 'Mashine ndogo ya kukata ya betri ya 18V ya mm 76 kwa bolti, nondo ndogo na mikato mahali finyu.' },
  'aluminium-groove-cutter': { en: 'A 1 300 W corded groove cutter for cutting grooves in aluminium composite panels.', sw: 'Mashine ya waya ya W 1 300 ya kukata mifereji kwenye paneli za aluminium.' },
  // Portable band saws
  'portable-band-saw': { en: 'A 710 W corded portable band saw for spark-free cutting of pipe and bar up to 120 mm.', sw: 'Band saw ya waya ya W 710 inayobebeka kwa kukata mabomba na nondo hadi mm 120 bila cheche.' },
  'portable-band-saw-lxt': { en: '18V cordless portable band saws for spark-free cutting of pipe, bar and bolts up to 120 mm.', sw: 'Band saw za betri za 18V zinazobebeka kwa kukata mabomba, nondo na bolti hadi mm 120 bila cheche.' },
  'portable-band-saw-xgt': { en: 'A 40V cordless portable band saw for spark-free cutting up to 127 mm.', sw: 'Band saw ya betri ya 40V inayobebeka kwa kukata hadi mm 127 bila cheche.' },
  // Shears, nibblers & hole punchers
  'metal-shear': { en: 'Corded metal shears for straight and curved cuts in steel sheet.', sw: 'Mashine za waya za kukata mabati kwa mikato iliyonyooka na iliyopinda kwenye karatasi za chuma.' },
  'metal-shear-lxt': { en: '18V cordless metal shears for cutting steel sheet up to 2.0 mm.', sw: 'Mashine za betri za 18V za kukata karatasi za chuma hadi mm 2.0.' },
  'cement-shear-lxt': { en: 'An 18V cordless shear for cutting fibre-cement board up to 13 mm.', sw: 'Mashine ya betri ya 18V ya kukata mbao za saruji (fibre-cement) hadi mm 13.' },
  'nibbler': { en: 'Corded nibblers for cutting shapes in steel sheet without distortion.', sw: 'Nibbler za waya kwa kukata maumbo kwenye karatasi za chuma bila kuzipinda.' },
  'nibbler-lxt': { en: 'An 18V cordless nibbler for shaped cuts in steel sheet.', sw: 'Nibbler ya betri ya 18V kwa mikato ya maumbo kwenye karatasi za chuma.' },
  'hole-puncher-lxt': { en: 'An 18V cordless hole puncher for clean 6 to 20 mm holes in steel plate and channel.', sw: 'Mashine ya betri ya 18V ya kutoboa matundu safi ya mm 6 hadi 20 kwenye bamba za chuma na chaneli.' },
  // Rod cutters
  'steel-rod-cutter-lxt': { en: '18V cordless rebar cutters for 3 to 25 mm bar, quieter and safer than an abrasive wheel.', sw: 'Mashine za betri za 18V za kukata nondo za mm 3 hadi 25, zenye kelele kidogo na salama kuliko gurudumu la kusaga.' },
  'threaded-rod-cutter-lxt': { en: 'An 18V cordless cutter for M6 to M10 threaded rod with a clean, burr-free cut.', sw: 'Mashine ya betri ya 18V ya kukata threaded rod ya M6 hadi M10 kwa mkato safi bila makali.' },
  'threaded-rod-cutter-cxt': { en: 'A compact 12V cordless cutter for M6 to M10 threaded rod.', sw: 'Mashine ndogo ya betri ya 12V ya kukata threaded rod ya M6 hadi M10.' },
}
