# Build a Zero-Maintenance Paid Media Reporting Semantic Layer in Excel & Google Sheets

![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![Platform: Browser + Excel](https://img.shields.io/badge/Platform-Browser%20%2B%20Excel-green.svg)
![Tool Type: Decision Support](https://img.shields.io/badge/Tool-Analytics%20Decision%20Support-orange.svg)

**Build a reusable paid media reporting engine that converts one raw Supermetrics export into unlimited client dashboards, without additional queries, software installation, or spreadsheet maintenance.**

> ## **No signup. No installation. Free.**
>
> 🌐 **Open in Browser** → HTML interactive version *(coming soon)*
>
> 📥 **Download Excel** → Excel workbook release *(coming soon)*
>
> Available in both browser and Excel formats.

---

## Screenshots

### Browser Version

<!-- screenshot: browser version -->

*Interactive executive dashboard showing client-level ROAS, spend allocation, performance trends, and anomaly alerts from a single unified data source.*

### Excel Version

<!-- screenshot: excel version -->

*Excel semantic layer architecture displaying raw imports, standardized dimensions, metric engines, validation controls, and executive reporting outputs.*

---

## What It Helps You Track

* Marketing spend, revenue, and ROAS across multiple clients from a single source of truth.
* Performance differences between brand campaigns and acquisition campaigns.
* Campaign naming inconsistencies that silently fragment reporting accuracy.
* Platform-level performance comparisons after eliminating vendor naming variations.
* New client onboarding impact without rebuilding reporting infrastructure.
* Reporting discrepancies between legacy dashboards and reconstructed analytical models.

---

# Why I Built This

Most marketing reporting systems fail for the same reason: they optimize report production rather than analytical consistency.

In many agencies, every new client creates another dashboard, another Supermetrics query, another collection of custom formulas, and another reporting workflow. Eventually, nobody knows whether performance differences reflect business reality or spreadsheet architecture.

A common example:

| Situation                        | Traditional Reporting                    |
| -------------------------------- | ---------------------------------------- |
| Client A launches on Google Ads  | New query created                        |
| Client B launches on Meta Ads    | Another query created                    |
| Client C requires channel splits | Additional tabs and formulas             |
| Agency adds 20 clients           | Hundreds of queries and duplicated logic |

The operational problem isn't dashboard creation.

The operational problem is **query explosion and semantic drift**.

For example, I observed agencies where:

* "Google Ads"
* "googleads"
* "AdWords"
* "Google PPC"

were treated as four separate media channels.

The result:

```
Reported ROAS:
Google Ads      = 4.1
AdWords         = 2.3
Google PPC      = 3.6

Decision:
Increase spend on Google Ads.
Reduce AdWords budget.
```

After semantic normalization:

```
Unified Google Ads ROAS:
3.1
```

The recommendation completely changed.

This workbook productizes a repeatable analytical framework:

> **Collect once → standardize once → calculate once → report infinitely.**

Instead of building another dashboard, it builds a reusable decision model.

---

## Common Paid Media Reporting Problems This Solves

| Problem                      | Without This Tool                               | With This Tool                                 |
| ---------------------------- | ----------------------------------------------- | ---------------------------------------------- |
| Supermetrics query explosion | Query count grows linearly with clients         | One raw export powers all reporting            |
| Channel naming inconsistency | ROAS calculations become fragmented             | Semantic mapping creates one canonical source  |
| Client onboarding overhead   | New dashboards require hours of setup           | New clients require one configuration row      |
| Formula maintenance          | Hundreds of duplicated formulas drift over time | Central metric engine calculates once          |
| Reporting migration risk     | Legacy and rebuilt reports cannot be reconciled | Validation layer performs automated QA         |
| Knowledge transfer failure   | New analysts cannot maintain historical models  | Architecture remains transparent and auditable |

---

## Who This Is For

This framework is designed for:

* Paid media agencies managing multiple brands.
* Marketing analysts using Supermetrics exports.
* Performance marketing consultants maintaining client reporting.
* Fractional CMOs requiring cross-client performance visibility.
* Small marketing teams needing warehouse-like analytical consistency without implementing a warehouse.

This framework is not designed for:

* Enterprise BI replacement projects.
* Real-time attribution systems.
* CDP implementations.
* Marketing automation platforms.

No spreadsheet expertise is required to consume the outputs. Open the browser version or Excel version and begin analyzing immediately.

---

## About

I build lightweight analytical systems for situations where there are too many moving parts to reliably hold in your head.

The question I typically start with is:

> **What information needs to exist in one place for the next decision to be made confidently?**

This paid media semantic layer is one example of that approach: transforming fragmented operational reporting into a reusable decision-support framework without requiring a data warehouse or enterprise software stack.

---

## Technical Details

<details>
<summary><strong>For technical reviewers, Excel practitioners, and collaborators</strong></summary>

---

### Workbook Architecture

The workbook follows a lightweight star-schema architecture implemented entirely within Excel tables and dynamic arrays. 

```text
Raw_Supermetrics_Data
            │
            ▼
Config_Setup
            │
            ▼
Data_Standardization
            │
            ▼
Metric_Calculation_Engine
        │            │
        ▼            ▼
Validation     Executive_Dashboard
```

| Layer          | Worksheet                 | Purpose                           |
| -------------- | ------------------------- | --------------------------------- |
| Configuration  | Config_Setup              | Semantic mappings and KPI targets |
| Raw Data       | Raw_Supermetrics_Data     | Single imported fact table        |
| Semantic Layer | Data_Standardization      | Canonical business dimensions     |
| Calculation    | Metric_Calculation_Engine | Dynamic metric aggregation        |
| Validation     | Validation_Module         | Legacy reconciliation             |
| Presentation   | Executive_Dashboard       | Executive reporting               |
| Presentation   | Client_Performance        | Client reporting                  |
| Operations     | Admin_Dashboard           | Monitoring and diagnostics        |

---

### Three Traps That Catch Even Experienced Marketing Analysts

---

#### Trap 1 — Platform Fragmentation Creates Fake Performance Differences

A budget reallocation decision was made.

The decision relied on separate ROAS calculations produced by inconsistent channel naming.

| Raw Platform | ROAS |
| ------------ | ---- |
| googleads    | 4.2  |
| AdWords      | 2.5  |
| Google PPC   | 3.4  |

Management concluded:

> Increase Google Ads budget and reduce AdWords spend.

The reasoning is incorrect because the categories represent the same advertising platform.

Corrected approach:

| Standard Platform | ROAS |
| ----------------- | ---- |
| Google Ads        | 3.2  |

Corrected decision outcome:

> Maintain budget allocation and optimize campaign structure instead.

<details>
<summary>Formula implementation</summary>

```excel
=XLOOKUP(
[@Source],
tbl_PlatformRules[Raw_Platform],
tbl_PlatformRules[Standard_Platform],
"Other"
)
```

</details>

---

#### Trap 2 — Campaign Naming Variations Hide Customer Economics

A client profitability decision was made.

The decision assumed that campaign names reliably identified clients.

Example:

```text
Nike_UK_Brand
NIKE_Generic
Nike Europe
耐克_Brand
```

Reported result:

```
Four separate clients.
```

Actual result:

```
One client.
```

The analytical failure occurred because naming conventions were assumed rather than validated.

Corrected approach:

| Campaign      | Standard Client |
| ------------- | --------------- |
| Nike_UK_Brand | Nike            |
| NIKE_Generic  | Nike            |
| Nike Europe   | Nike            |
| 耐克_Brand      | Nike            |

Corrected decision outcome:

> Budget allocation decisions become client-level rather than campaign-level.

<details>
<summary>Formula implementation</summary>

```excel
=IFERROR(
XLOOKUP(
TRUE,
ISNUMBER(
SEARCH(
tbl_ClientRules[Client_Keyword],
[@Campaign_Name]
)),
tbl_ClientRules[Standard_Client],
"Unmapped"),
"Unmapped")
```

</details>

---

#### Trap 3 — Dashboard Migration Without Validation Destroys Trust

A reporting rebuild was completed.

The rebuilt dashboard showed:

```
Spend = $1,248,220
```

The legacy dashboard showed:

```
Spend = $1,248,065
```

Management concluded:

> The rebuilt model is unreliable.

The reasoning is incorrect because no systematic variance analysis was performed.

Corrected approach:

| Client | Legacy | New    | Variance |
| ------ | ------ | ------ | -------- |
| Nike   | 125000 | 125000 | 0        |
| Adidas | 89000  | 89000  | 0        |
| Puma   | 65400  | 65400  | 0        |

Corrected decision outcome:

> Validation becomes objective rather than political.

<details>
<summary>Formula implementation</summary>

```excel
=IF(
ABS(B5#-C5#)<0.05,
"✅ Consistent",
"❌ Mismatch"
)
```

</details>

---

### Example Scenario

A performance agency manages 18 clients.

Current reporting architecture:

* 126 Supermetrics queries
* 54 reporting tabs
* 14 duplicated dashboard templates
* 7 different ROAS definitions

After migration:

| Metric                | Before    | After       |
| --------------------- | --------- | ----------- |
| Supermetrics queries  | 126       | 1           |
| Client onboarding     | 2 hours   | 10 seconds  |
| Dashboard maintenance | Weekly    | Zero        |
| Formula duplication   | Thousands | Centralized |
| Validation effort     | Manual    | Automated   |

Raw imported data:

| Client | Spend   | Revenue |
| ------ | ------- | ------- |
| Nike   | 145,000 | 532,000 |
| Adidas | 89,000  | 278,000 |
| Puma   | 42,000  | 91,000  |

Calculated outputs:

| Client | ROAS | CPA  | CTR  |
| ------ | ---- | ---- | ---- |
| Nike   | 3.67 | 41.3 | 3.9% |
| Adidas | 3.12 | 52.7 | 2.8% |
| Puma   | 2.17 | 74.1 | 1.7% |

Analytical interpretation:

* Nike exceeds target efficiency.
* Adidas remains within acceptable variance.
* Puma exhibits acquisition inefficiency.

Recommended decision:

* Increase Nike budget allocation.
* Maintain Adidas spend.
* Audit Puma campaign structure before further investment.

---

### Formula Reference

<details>
<summary>Semantic Layer Formulas</summary>

```excel
Customer Matching:
XLOOKUP(TRUE,ISNUMBER(SEARCH(...)))

Platform Mapping:
XLOOKUP(Source,...)

Campaign Classification:
IF(SEARCH("Brand"),"Brand","Generic")
```

</details>

<details>
<summary>Metric Engine Formulas</summary>

```excel
=SORT(UNIQUE(Client))

=SUMIFS(
tbl_StandardFact[Spend],
tbl_StandardFact[Standard_Client],
A5#
)

=IFERROR(
Revenue/Spend,
0
)
```

</details>

<details>
<summary>Dashboard Formulas</summary>

```excel
=LET(
total_spend,
...
)

=IF(
B2="All",
SUM(...),
SUMIFS(...)
)
```

</details>

---

### Validation Rules

| Field                   | Rule                        | Error Behavior       |
| ----------------------- | --------------------------- | -------------------- |
| Client Mapping          | Must exist in mapping table | Returns "Unmapped"   |
| Platform Mapping        | Must exist in mapping table | Returns "Other"      |
| CTR                     | Impressions > 0             | Returns 0            |
| ROAS                    | Spend > 0                   | Returns 0            |
| CPA                     | Conversions > 0             | Returns 0            |
| Validation Variance     | Difference < $0.05          | Returns "Consistent" |
| Dashboard Filter        | Must exist in client list   | Validation error     |
| Campaign Classification | Missing pattern             | Defaults to Generic  |

</details>

---

## Other Tools in This Series

* **Cross-Border VAT Compliance Console** — Multi-jurisdiction VAT reconciliation and filing support.
* **DTC Inventory Governance Dashboard** — Inventory planning and replenishment decision framework.
* **Project Cost Allocation Engine** — Labor utilization and profitability analysis.
* **CRM-to-Accounting Automation Framework** — Operational finance workflow standardization.
* **Multi-Currency Trade Analytics Model** — Cross-border financial decision support.

More tools available via GitHub profile and release library.

---

## License

This project is licensed under the **Apache License 2.0**.

You are free to use, modify, distribute, and adapt this work under the terms of the Apache License 2.0.
