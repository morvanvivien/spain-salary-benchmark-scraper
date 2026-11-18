"""Minimal example: run the spain-salary-benchmark Actor and print one line per role x province.

Usage: APIFY_TOKEN=... python run.py   (pip install apify-client)
"""
import os
import sys

from apify_client import ApifyClient

token = os.environ.get("APIFY_TOKEN")
if not token:
    sys.exit("Set the APIFY_TOKEN environment variable first.")

client = ApifyClient(token)

run_input = {
    "roles": ["programador", "contable"],
    "provinces": ["Madrid", "Barcelona"],
    "publishedWithinDays": 30,
}

# 1024 MB is enough for this Actor and keeps the start fee at its minimum.
run = client.actor("bibian/spain-salary-benchmark").call(run_input=run_input, memory_mbytes=1024)

count = 0
for row in client.dataset(run.default_dataset_id).iterate_items():
    count += 1
    print(
        f"{row['role']} | {row['province']} | median {row.get('salaryMedian')} EUR "
        f"(P25 {row.get('salaryP25')}, P75 {row.get('salaryP75')}) | "
        f"{row['postingsWithSalary']} of {row['postingsAnalyzed']} postings publish a salary"
    )
print(f"{count} rows")
