# Bart Mining

Marketing website and internal **GoldPass** drill data platform for **Bart Mining**, a principal-led mining consultancy and equipment supplier based in **Dar es Salaam, Tanzania**, operating across **East and Southern Africa**.

**🌐 Live Website:** https://www.bartmining.com

---

# Overview

This repository contains the complete Bart Mining web platform, including:

* Modern public-facing corporate website
* Internal **GoldPass** data intelligence platform
* Knowledge hub and article management system
* Contact and lead generation system
* Secure administrator dashboard

GoldPass is designed specifically for geologists and exploration teams to validate, clean, analyze, compare, and export drilling datasets while enforcing industry best practices.

---

# Tech Stack

| Layer          | Technology              |
| -------------- | ----------------------- |
| Framework      | Next.js 15 (App Router) |
| Language       | TypeScript 5            |
| Styling        | Tailwind CSS v3         |
| Authentication | Supabase Auth           |
| Database       | Supabase                |
| Email          | Resend                  |
| Hosting        | Vercel                  |

---

# Project Structure

```text
src/
├── app/
│   ├── page.tsx
│   ├── about/
│   ├── services/
│   ├── products/
│   ├── sustainability/
│   ├── contact/
│   ├── insights/
│   │   └── [slug]/
│   ├── admin/
│   ├── api/
│   │   └── contact/
│   └── globals.css
│
├── components/
│   ├── goldpass/
│   ├── insights/
│   ├── layout/
│   ├── sections/
│   └── ui/
│
├── content/
│   └── insights/
│
├── data/
│
└── middleware.ts
```

---

# Public Website

The marketing website includes:

| Route              | Description                        |
| ------------------ | ---------------------------------- |
| `/`                | Homepage                           |
| `/about`           | Company overview and founder story |
| `/services`        | Mining consulting services         |
| `/products`        | Equipment catalogue                |
| `/sustainability`  | ESG commitments                    |
| `/contact`         | Contact form                       |
| `/insights`        | Knowledge hub                      |
| `/insights/[slug]` | Individual articles                |

---

# GoldPass

GoldPass is Bart Mining's proprietary web-based drill data intelligence platform built for mineral exploration workflows.

It enables users to:

* Validate drilling datasets
* Clean inconsistent records
* Compare multiple files
* Perform exploration analysis
* Export standardized outputs

The system currently implements **25 core functions** across five workflow stages.

---

# 1. Validation & Quality Control

Ensures drilling data integrity before processing.

| Function | Description               |
| -------- | ------------------------- |
| 01       | `findMissingHoleIDs`      |
| 02       | `checkFromToErrors`       |
| 03       | `findIntervalOverlaps`    |
| 04       | `findIntervalGaps`        |
| 05       | `findDuplicateIntervals`  |
| 06       | `findNegativeGrades`      |
| 07       | `findCoordinateOutliers`  |
| 08       | `findUndrilled`           |
| 09       | `findOrphanAssays`        |
| 10       | `findNullPlaceholders`    |
| 11       | `checkCollarCompleteness` |

---

# 2. Cleaning & Transformation

Prepares exploration data for downstream analysis.

| Function | Description            |
| -------- | ---------------------- |
| 12       | `standardiseHoleIDs`   |
| 13       | `removeUndrilled`      |
| 14       | `resolveUnitConflicts` |

---

# 3. File Comparison & Relationships

Performs reconciliation across multiple datasets.

| Function | Description                 |
| -------- | --------------------------- |
| 15       | `compareFiles`              |
| 16       | `findDuplicatesAcrossFiles` |
| 17       | `findMissingRows`           |
| 18       | `reconcileColumns`          |
| 19       | `mergeFiles`                |
| 20       | `diffFiles`                 |

---

# 4. Analysis

Generates exploration insights.

| Function | Description         |
| -------- | ------------------- |
| 21       | `buildCollarOutput` |
| 22       | `findBestIntercept` |
| 23       | `findCorrelation`   |
| 24       | `rankByGrade`       |

---

# 5. Export

Produces standardized deliverables.

| Function | Description          |
| -------- | -------------------- |
| 25       | `exportCollarOutput` |

Supported export formats include:

* CSV
* Excel
* Shapefile

---

# Getting Started

## Prerequisites

* Node.js 18+
* npm
* Supabase project
* Resend API key

---

## Installation

```bash
git clone <repository-url>

cd bart-mining

npm install
```

Create a `.env.local` file containing the required Supabase and Resend environment variables.

Start the development server:

```bash
npm run dev
```

---

# Content Management

## Insights

Add new articles inside:

```text
src/content/insights/
```

Register metadata inside:

```text
src/data/insights.ts
```

## Services & Equipment

Update the corresponding arrays located under:

```text
src/data/
```

---

# Authentication

Administrative routes under:

```text
/administration/*
```

(or `/admin/*` depending on deployment)

are protected using **Supabase Authentication** through `middleware.ts`.

---

# Deployment

The project is deployed on **Vercel**.

Every push to the `main` branch automatically triggers a production deployment.

---

# License

This repository contains proprietary software and is not licensed for public redistribution or reuse.

**Copyright © 2026 Bart Mining. All rights reserved.**
