# Plant Planner

Local tool for plant projects: costs, expenses, schedule, cashflow, an animated
process flow, and the client proposal exported to PDF.

Not part of the website. `projects/` is excluded from the site's `tsconfig`
and from Vercel (`.vercelignore`), and nothing in `src/` imports it.

## Run it

```bash
cd projects/plant-planner
npm install      # first time only
npm run dev      # http://localhost:5181
```

## Project files are private

Each project is one JSON file in `data/`, for example `data/mbeya-gold-plant.json`.
It holds supplier costs and the commission rate. **The repo is public, so
`data/` is gitignored.** Back the files up somewhere private: a private repo,
or Drive. Edits save to the file automatically (top right shows "Saved").

To start a new project, copy an existing file to `data/<new-slug>.json` and
edit it in the tool. A project picker appears once there's more than one file.

## Tabs

| Tab | What it does |
|-----|--------------|
| Overview | Totals for every option side by side, plus the commercial levers (commission, reserve, contingency, services markup). |
| Budget | Equipment lines (supplier FOB in, client price out), execution quantities and allowances, team allocation by month, shared rates. |
| Expenses | Ledger of committed and paid costs, compared with the budget by category. Exports CSV. |
| Schedule | Task durations and what each task waits on. Calculates weeks to first gold. |
| Cashflow | Money out against client receipts by month. You can change the month each payment lands in. |
| Plant | Process flow diagram. **Show ore flow** walks through the plant one step at a time. |
| Proposal | The client document. Turn on **Edit text** to change wording, pick options and sections, then **Export PDF**. |

## The proposal never sees internal figures

`views/Proposal.tsx` builds a client-only object (client prices, specs,
schedule, production) and renders only from that. Supplier costs, commission,
reserve and margin aren't passed in, so they can't end up in the PDF. Printing
from any other tab prints a notice instead of the page.

## Cost model

`src/model.ts` is a port of `Mbeya_Gold_Plant_Project_Budget.xlsx`. At import
it matched the workbook exactly: equipment, execution totals, margins, import
VAT, the category breakdown, schedule weeks and the monthly cashflow.
