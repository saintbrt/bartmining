# Bart Mining

Marketing website and internal **GoldPass** data platform for Bart Mining — a principal-led mining consultancy and equipment supplier based in Dar es Salaam, Tanzania, operating across East & Southern Africa.

**Live Site:** [bartmining.com](https://www.bartmining.com)

---

## About

This repository contains the full web platform for Bart Mining, featuring:

- A modern public marketing website
- A powerful internal tool called **GoldPass** — used by geologists for drillhole data validation, cleaning, analysis, and export

---

## Tech Stack

| Layer          | Technology                    |
|----------------|-------------------------------|
| Framework      | Next.js 15 (App Router)       |
| Language       | TypeScript 5                  |
| Styling        | Tailwind CSS v3               |
| Auth & Database| Supabase                      |
| Email          | Resend                        |
| Hosting        | Vercel                        |

---

## Project Structure

```bash
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage
│   ├── about/, services/, products/, sustainability/, contact/
│   ├── insights/                 # Article hub + [slug] pages
│   ├── admin/                    # GoldPass internal dashboard (protected)
│   ├── api/contact/              # Contact form endpoint
│   └── globals.css
├── components/
│   ├── goldpass/                 # GoldPass UI components
│   ├── insights/, sections/, layout/, ui/
├── content/insights/             # Article content
├── data/                         # Static data (services, equipment, insights, etc.)
└── middleware.ts                 # Auth protection

GoldPass — Drill Data Intelligence Platform
GoldPass is Bart Mining’s internal web-based system for managing, validating, cleaning, analyzing, and exporting mineral exploration drilling data. It enforces industry best practices through a structured 5-stage workflow.
Core Workflow (25 Functions)
1. Validation & QC (Functions 01–11)
Ensures data integrity before any processing:

01 findMissingHoleIDs — Detects rows with missing or empty hole IDs
02 checkFromToErrors — Flags intervals where from_depth ≥ to_depth
03 findIntervalOverlaps — Identifies overlapping depth intervals in the same hole
04 findIntervalGaps — Detects unexpected gaps in downhole logging
05 findDuplicateIntervals — Finds exact duplicate depth intervals
06 findNegativeGrades — Flags negative grade values
07 findCoordinateOutliers — Detects unrealistic collar coordinates
08 findUndrilled — Identifies planned holes with no downhole data
09 findOrphanAssays — Flags assays without matching collar records
10 findNullPlaceholders — Detects -999, "N/A", "NULL" etc.
11 checkCollarCompleteness — Ensures all required collar fields are present

2. Cleaning & Transform (Functions 12–14)
Prepares data for analysis:

12 standardiseHoleIDs — Normalizes hole ID formats (casing, delimiters, whitespace)
13 removeUndrilled — Removes planned but uncompleted drillholes
14 resolveUnitConflicts — Converts ppb to ppm and standardizes units

3. Comparison & Relationships (Functions 15–20)
Handles multi-file operations:

15 compareFiles — Audits structure and compatibility between files
16 findDuplicatesAcrossFiles — Detects duplicates across different data sources
17 findMissingRows — Finds keys present in one file but missing in another
18 reconcileColumns — Maps varying column names to canonical schema
19 mergeFiles — Joins tables using standardized keys
20 diffFiles — Compares versions and highlights added/modified/removed records

4 & 5. Analysis & Export (Functions 21–25)
Generates actionable insights and deliverables:

21 buildCollarOutput — Creates summary with maximum gold grade and peak interval per hole + coordinates
22 findBestIntercept — Computes length-weighted best mineralized intervals above cutoff (allows internal waste)
23 findCorrelation — Correlates grades with lithology/alteration units
24 rankByGrade — Ranks drillholes by peak grade for target prioritization
25 exportCollarOutput — Exports results as CSV, Excel, or Shapefile (with versioned filenames)


Public Website Pages

/ — Homepage
/about — Company & founder story
/services — Full project lifecycle services
/products — Mining equipment catalog
/sustainability — ESG commitments
/contact — Contact form
/insights — Searchable knowledge hub
/insights/[slug] — Individual articles


Getting Started
Prerequisites

Node.js 18+
Supabase project
Resend API key

Installation
Bashgit clone <your-repo-url>
cd bart-mining
npm install
Create .env.local file with your Supabase and Resend credentials.
Bashnpm run dev

Content Management

Articles: Add file in src/content/insights/ and metadata in src/data/insights.ts
Services / Equipment: Edit arrays in src/data/


Deployment
Deployed on Vercel. Pushes to main trigger automatic production deployment.
Admin routes (/admin/*) are protected by Supabase authentication via middleware.ts.

Proprietary software Bart Mining © 2026
