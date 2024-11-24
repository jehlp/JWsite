from pathlib import Path
import re
from datetime import datetime
from JWConstants import ansi
from JWUtils import get_md_files

def extract_date_from_filename(filename):
    match = re.search(r'(\d{4}-\d{2}-\d{2})', filename)
    if not match:
        return None
    try:
        return datetime.strptime(match.group(1), "%Y-%m-%d").date()
    except ValueError:
        return None

def get_last_modified_date(file):
    return datetime.fromtimestamp(file.stat().st_mtime).date()

def check_date_match(file, root):
    file_date = extract_date_from_filename(file.name)
    if not file_date:
        print(f"{ansi.yellow}Skipping {file}{ansi.end} - No valid date found in filename")
        return
    last_modified = get_last_modified_date(file)
    if file_date != last_modified:
        print(f"{ansi.yellow}{ansi.bold}Warning:{ansi.end} {file.relative_to(root)} - Date mismatch")
        print(f"  File date: {ansi.red}{file_date}{ansi.end}")
        print(f"  Last modified: {ansi.yellow}{last_modified}{ansi.end}")
    else:
        print(f"{ansi.green}{file.relative_to(root)} - Dates match{ansi.end}")

def check_dates():
    root = Path(__file__).parent.parent
    md_files = get_md_files(root)
    for file in md_files:
        check_date_match(file, root)

if __name__ == "__main__":
    check_dates()