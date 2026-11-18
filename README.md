# How to Get Salary Data for Spain by Job Role and Province: Spain Salary Benchmark API

> **Run it now, no code: [spain-salary-benchmark on the Apify Store](https://apify.com/bibian/spain-salary-benchmark)** &nbsp;|&nbsp; $0.05 per report row &nbsp;|&nbsp; no login, no browser required

What does a programmer, an accountant or a sales rep earn in Madrid, in Barcelona, in all of Spain? Spain has no public salary API, and the job boards only show salaries one posting at a time. This guide shows how to get the answer as numbers instead: median, quartiles and average yearly salary for any job role, overall and province by province, computed live from the postings currently on [Infoempleo](https://www.infoempleo.com), with the contract mix, the experience asked, the remote share and the companies hiring the most. It uses a free-to-try Apify Actor, from the console or from code, with no login.

Searches this page answers: Spain salary benchmark, salary by job role in Spain, average salary Spain by province, median salary Madrid vs Barcelona, Spanish salary data API, Infoempleo salary scraper, how much does a programmer earn in Spain.

## What you get from the Spain salary benchmark

- One row per role, plus one row per role and province you ask for, each with `salaryMin`, `salaryP25`, `salaryMedian`, `salaryP75`, `salaryMax` and `salaryAvg`, in EUR per year.
- How solid each number is: `postingsAnalyzed` (postings behind the row) and `postingsWithSalary` (how many of them publish a salary). A median over 3 postings looks like what it is.
- The shape of the market behind the salary: share of permanent, fixed-term, internship and freelance contracts, share by years of experience asked, share of postings that mention remote work.
- `topCompanies`, the companies (including staffing agencies) with the most postings for that role, and up to 5 `sampleUrls` so you can check the numbers against real postings.
- Recomputed on every run from the postings that are live now, not from a stale snapshot.

Export the dataset as JSON, CSV or Excel, or read it through the Apify API. A real sample (five rows from a live run on 18 November 2026, no personal data) is in [`sample-output.json`](sample-output.json).

## Output fields

| Field | What it is |
|---|---|
| `role`, `province`, `periodDays` | What the row covers: the searched role, the province (`"España"` for the whole country) and the lookback window in days |
| `postingsAnalyzed`, `postingsWithSalary`, `postingsSalaryIgnored` | Postings that match this role and province, how many publish a believable salary, and how many printed a salary that was discarded as implausible |
| `salaryMin`, `salaryP25`, `salaryMedian`, `salaryP75`, `salaryMax`, `salaryAvg` | Yearly salary statistics in EUR as Infoempleo prints them (Spanish job ads normally quote gross); `null` when no posting in the row publishes a salary. A posting counts at the middle of its range |
| `currency`, `salaryPeriod` | Always `EUR` and `year` |
| `contractShares` | Share (0 to 1) of postings by contract: `permanent`, `fixed-term`, `permanent-seasonal`, `internship`, `training`, `freelance`, `unspecified` |
| `experienceShares` | Share of postings by experience asked: `none`, `1-2 years`, `3-4 years`, `5+ years`, `unspecified` |
| `remoteShare` | Share (0 to 1) of postings that mention remote work |
| `topCompanies` | Up to 5 companies with the most postings in the row (companies only, never a person) |
| `sampleUrls` | Up to 5 posting URLs behind the numbers, when `includeSamples` is on |
| `computedAt` | When the row was computed, ISO 8601 |

Three real rows from the sample run:

| Role | Province | Postings with salary | Median | P25 | P75 |
|---|---|---|---|---|---|
| contable | España | 40 of 110 | €28,750 | €21,000 | €31,500 |
| contable | Madrid | 16 of 24 | €25,500 | €20,750 | €29,625 |
| ingeniero | Barcelona | 3 of 12 | €28,000 | €27,750 | €31,500 |

The last row is there on purpose: with 3 salaries behind it, read it as a hint, not as a benchmark.

## Use cases

- **Check an offer or negotiate a raise.** Compare a salary to the live median and to the 25th and 75th percentile for the same role.
- **Compare provinces.** Madrid, Barcelona and Sevilla for the same role, side by side, in one dataset.
- **Track a market over time.** Schedule a weekly run and keep the medians: you get a salary index per role without storing thousands of postings.
- **Feed a recruiting or HR tool.** Pay bands per role and province through the API, with the number of postings each band rests on.
- **See who is hiring.** `topCompanies` names the employers and agencies posting the most for a role.

## Input

| Field | What it does |
|---|---|
| `roles` | Job titles to benchmark, written the way Spanish employers write them: `programador`, `enfermera`, `data engineer`. Required. Only postings whose title matches the role are counted. |
| `provinces` | One extra row per role and province, for example `Madrid`, `Barcelona`, `Sevilla` (accents and capitals do not matter). Empty means only the whole-of-Spain row, which is always included. |
| `publishedWithinDays` | Only postings published in the last N days are analyzed (1 to 365, default 30). |
| `maxPostingsPerRole` | Cost and time guard: how many matching postings are read per role (default 300, up to 1000). Province rows come from the same postings. |
| `includeSamples` | Add up to 5 posting URLs to each row (default on). |
| `maxItems` | The run stops once this many rows are saved (default 200). |

Ready-to-copy inputs.

Two roles in three provinces:

```json
{
  "roles": ["programador", "enfermera"],
  "provinces": ["Madrid", "Barcelona", "Sevilla"]
}
```

A broad role over a longer window, with more postings read for better province rows:

```json
{
  "roles": ["comercial"],
  "provinces": ["Madrid", "Barcelona", "Valencia"],
  "publishedWithinDays": 90,
  "maxPostingsPerRole": 1000
}
```

A weekly salary index for one role, whole of Spain only:

```json
{
  "roles": ["contable"],
  "publishedWithinDays": 30,
  "includeSamples": false
}
```

## Three ways to use it

### 1. Apify console, no code

1. Open [the Actor page](https://apify.com/bibian/spain-salary-benchmark) and click **Try for free** (a free Apify account is enough). The form is already filled with five roles and two provinces.
2. Replace the roles with yours (in Spanish, as employers write them), pick the provinces, then click **Start**.
3. When the run finishes, open the **Output** tab, then **Export** as CSV, Excel or JSON.
4. For a weekly index, open **Schedules**, create a weekly schedule for the Actor and keep each run's dataset.

### 2. Apify API with JavaScript

```bash
npm install apify-client
export APIFY_TOKEN="your token from Apify console, Settings, Integrations"
node examples/run.js
```

```js
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const run = await client.actor('bibian/spain-salary-benchmark').call({
    roles: ['programador', 'contable'],
    provinces: ['Madrid', 'Barcelona'],
}, { memory: 1024 });

const { items } = await client.dataset(run.defaultDatasetId).listItems();
for (const row of items) {
    console.log(`${row.role} | ${row.province} | median ${row.salaryMedian ?? '-'} EUR | ${row.postingsWithSalary} of ${row.postingsAnalyzed} postings publish a salary`);
}
```

The complete file is [`examples/run.js`](examples/run.js) (ES module, Node 18 or later). The `memory: 1024` option runs the Actor with 1 GB, which is enough and keeps the start fee at its minimum.

### 3. Apify API with Python

```bash
pip install apify-client
export APIFY_TOKEN="your token from Apify console, Settings, Integrations"
python examples/run.py
```

```python
import os
from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run = client.actor("bibian/spain-salary-benchmark").call(
    run_input={"roles": ["programador", "contable"], "provinces": ["Madrid", "Barcelona"]},
    memory_mbytes=1024,
)

for row in client.dataset(run.default_dataset_id).iterate_items():
    print(f"{row['role']} | {row['province']} | median {row.get('salaryMedian')} EUR | {row['postingsWithSalary']} of {row['postingsAnalyzed']} postings publish a salary")
```

The complete file is [`examples/run.py`](examples/run.py). Never put your token in the code: read it from the `APIFY_TOKEN` environment variable as above.

## Pricing

Pay per result: **$0.05 per report row** ($50 per 1,000 rows), plus a start fee of $0.0025 per GB of run memory (so $0.0025 at the 1 GB the examples ask for), with no monthly subscription. These are the free-plan prices; paid Apify plans get lower ones. A row is one role, or one role in one province, so a run with 2 roles and 3 provinces saves 8 rows and costs about $0.40. Apify's free plan includes monthly credits, enough to try it. Prices are those shown on the [Store page](https://apify.com/bibian/spain-salary-benchmark) when this guide was written (18 November 2026); the Store page is the reference.

## Limits and honest notes

- **Only some postings publish a salary.** Roughly one posting in six to one in three on Infoempleo does, so `postingsWithSalary` is always smaller than `postingsAnalyzed`. Read it before trusting a row, and expect thin data for small provinces.
- **Only postings whose title contains every word of the role are counted.** Infoempleo's search also returns loosely related offers, which would distort the numbers. Gender and plural endings are accepted (`enfermera` finds "Enfermero/a"), but `administrativo` does not find "Administrador".
- **Salaries are as the site prints them.** They are yearly EUR figures and the site does not say gross or net; Spanish job ads normally quote gross. Obvious typos are ignored (below €6,000 a year, above €400,000, or a range wider than 4 times) and counted in `postingsSalaryIgnored`.
- **A posting open in several provinces counts in each of them;** a posting with no province counts in the whole-of-Spain row only.
- **A row is still returned when nothing matches** (`postingsAnalyzed: 0`, salary fields `null`), so you see that the combination has no current data instead of a missing row.
- **Infoempleo prints an exact age only up to 100 days.** A posting shown as "more than 100 days" old is never counted.
- **If Infoempleo blocks the run or changes its page layout,** the run fails or ends as a partial result instead of returning empty rows.
- The dataset holds statistics, company names and public posting URLs only. No recruiter or candidate name is read or stored.
- This is an unofficial tool, not affiliated with Infoempleo. Check the site terms and the data protection rules that apply to your use, for example the GDPR.

## FAQ

**Does it need a browser, cookies or a proxy on my side?**  
No. The Actor reads publicly visible pages only.

**Can I get the individual postings instead of the statistics?**  
Yes: [Infoempleo Jobs Scraper](https://apify.com/bibian/infoempleo-jobs-scraper) returns every posting this Actor aggregates, and [Spain Jobs Scraper](https://apify.com/bibian/spain-jobs-scraper) covers four Spanish job boards in one run.

**Which language should the roles be in?**  
Spanish, as employers write them (`programador`, `enfermera`, `contable`, `comercial`). English terms common in Spanish ads, such as `data engineer`, work too.

**Is the median a full-time equivalent?**  
No. It is the median of the salaries as printed in the postings, each counted at the middle of its range, with no adjustment for working hours.

**How current are the numbers?**  
Each run reads the postings live on Infoempleo at that moment, inside the `publishedWithinDays` window you choose, and `computedAt` tells you when.

## Related Actors

- [Infoempleo Jobs Scraper](https://apify.com/bibian/infoempleo-jobs-scraper): every Infoempleo posting, one row each.
- [Spain Jobs Scraper](https://apify.com/bibian/spain-jobs-scraper): four Spanish job boards in one run.

## Feedback

Need another source, percentile or field? Open an issue in the Issues tab of the Actor on Apify and say what you need: requests are read, and the most asked ones are built next.
