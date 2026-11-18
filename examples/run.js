// Minimal example: run the spain-salary-benchmark Actor and print one line per role x province.
// Usage: APIFY_TOKEN=... node run.js   (Node 18 or later, npm install apify-client)
import { ApifyClient } from 'apify-client';

const token = process.env.APIFY_TOKEN;
if (!token) {
    console.error('Set the APIFY_TOKEN environment variable first.');
    process.exit(1);
}

const client = new ApifyClient({ token });

const input = {
    "roles": ["programador", "contable"],
    "provinces": ["Madrid", "Barcelona"],
    "publishedWithinDays": 30,
};

// 1024 MB is enough for this Actor and keeps the start fee at its minimum.
const run = await client.actor('bibian/spain-salary-benchmark').call(input, { memory: 1024 });
const { items } = await client.dataset(run.defaultDatasetId).listItems();

console.log(`${items.length} rows`);
for (const row of items) {
    console.log(`${row.role} | ${row.province} | median ${row.salaryMedian ?? '-'} EUR (P25 ${row.salaryP25 ?? '-'}, P75 ${row.salaryP75 ?? '-'}) | ${row.postingsWithSalary} of ${row.postingsAnalyzed} postings publish a salary`);
}
