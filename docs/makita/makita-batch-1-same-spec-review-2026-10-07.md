# Makita batch 1: models with the same spec line (review, 7 October 2026)

**Question:** several Makita models show identical specs but different model numbers. Are these errors, repeats or older models?

**Answer:** none are duplicate listings. In 27 cases, 63 different models share the same headline spec line (power, size, speed or impact energy) because Makita sells feature variants of one tool. The differences are in features the headline does not show. We also found two errors in makita.co.tz's own data, two pairs Makita does not explain, and two older-generation models.

**Method:** grouped all 257 models by main product and normalised spec line; read the full description of each of the 63 models on makita.co.tz; checked unexplained pairs against Makita sites and leaflets in other markets. Every model's note is in the `difference_from_similar_models` column of [makita-batch-1-models-2026-10-07.csv](makita-batch-1-models-2026-10-07.csv).

## What separates same-spec models

| Difference | Examples |
|---|---|
| Anti-vibration (AVT) added | HM1101C → HM1111C · HM1203C → HM1213C · HM1307C → HM1317C · HR4501C → HR4511C · HR5202C → HR5212C |
| Quick-change chuck | HR3011FCWJ → HR3012FCWJ · DHR280 → DHR281 · HR3200C (with) vs HR3210C (without) |
| Wireless dust-extractor start (AWS) | DGA700 → DGA701 · DHR281 → DHR283 · HR003G → HR002G · GA028G, GA029G, GA040G, GA041G |
| Modes, dust collection | HR2600 (2 modes) · HR2630 (3 modes) · HR2631F (3 modes + AVT) · HR2661 (AVT + HEPA dust collection + quick-change chuck) |
| Motor type | DGA452 / DGA456 brushed · DGA454 / DGA455 / DGA458 brushless |
| Switch type and brake | Paddle vs slide switch: GD0600 / GD0602, GA4594 vs GA4591 / GA4592, GA5094 vs GA5091, GA5095 vs GA5092, GA046G / GA047G vs GA040G / GA041G; electronic brake on GA012G, GA013G and the GA02xG models |
| Trigger and body | GA5010 standard trigger · GA5011 large trigger, slightly longer body |
| Convenience features or kit | LW1400 tool-less wheel change vs LW1401 basic · PC5001C includes an aluminium support |

**How to show this on our pages:** keep every model, and add a short "What's different" note beside each one in the product table, so a buyer can tell, for example, HM1101C from HM1111C at a glance.

## Errors in makita.co.tz data

| Model | Listing says | Correct (Makita description and other Makita markets) |
|---|---|---|
| GA6010 | 125 mm | **150 mm** wheel |
| GA9020 | 2 200 W | **2 000 W** motor |

Two smaller inconsistencies: **GA012G**'s title says paddle switch but its text says slide switch, and **HR3200C**'s spec line says 5,5 J while its text says 5,1 J.

**Applied 7 October:** GA6010 corrected to 150 mm in our data. GA9020 removed (older model, below). Ask Makita Tanzania to confirm the GA6010 correction.

## Older-generation models

- **GA7020** (180 mm) and **GA9020** (230 mm) are the older generation. GA7062 / GA7063 and GA9062 are their newer replacements, with a more compact body and, on the R versions, soft start and anti-restart.
- **HR2611F** looks like the older AVT hammer next to HR2631F.

**Applied 7 October:** GA7020 and GA9020 removed from our data on the owner's instruction (2 models; 255 remain). HR2611F is kept until Makita Tanzania confirms whether it is still supplied.

## Not explained by Makita

- **GA4591 vs GA4592:** both 1 900 W, 115 mm, slide switch; the listings give no difference.
- **DGA455 vs DGA458:** both 18V brushless, 115 mm, paddle switch; the listings give no difference.

Ask Makita Tanzania. Until then, list each pair together with the note "variant; confirm with us".

## Sources

makita.co.tz product listings (read 7 October 2026). Switch and feature differences confirmed from Makita regional sites and leaflets: [GD0600 / GD0602](https://www.howetools.co.uk/makita-gd0602-110v-die-grinder-50mm-max-dia-wheel), [GA5010 / GA5011](https://makita.com.vn/?p=30757), [DGA700 / DGA701](https://makita.com.vn/uploads/2021/08/dga901-dga900-dga701-dga700-eng-1.pdf), [LW1400 / LW1401](https://makita.com.vn/uploads/2021/09/lw1401_lw1400-eng-1.pdf), [GA6010 150 mm](https://makita.com.vn/?p=30908), [GA7020 / GA9020 generation](https://makita.com.co/sites/default/files/ga9020_7020_view.pdf), [GA9020 2 000 W](https://www.toolstop.co.uk/makita-ga9020-9in-230mm-angle-grinder-p1495), [GA459x switch types](https://katalog.makita.cz/priloha.php?ak=2508819).
