from pathlib import Path
import re, yaml
from datetime import datetime
from JWConstants import ansi

def check_dates():
    root = Path(__file__).parent.parent
    with open(root / "build/config.yaml") as f: config = yaml.safe_load(f)
    md_files = [f for d in config['jw_markdown_dirs'] for f in (root / d).rglob("*.md")]

    for file in md_files:
        match = re.search(r'(\d{4}-\d{2}-\d{2})', file.name)
        if not match: print(f"{ansi.yellow}Skipping {file}{ansi.end} - No date found in filename"); continue
        try: file_date = datetime.strptime(match.group(1), "%Y-%m-%d").date()
        except ValueError: print(f"{ansi.red}Invalid date format in filename: {file}{ansi.end}"); continue
        last_modified = datetime.fromtimestamp(file.stat().st_mtime).date()
        if file_date != last_modified: print(f"{ansi.yellow}{ansi.bold}Warning:{ansi.end} {file.relative_to(root)} - Date mismatch {ansi.red}{file_date}{ansi.end} / {ansi.yellow}{last_modified}{ansi.end}")
        else: print(f"{ansi.green}{file.relative_to(root)} - Dates match{ansi.end}")

if __name__ == "__main__": check_dates()
