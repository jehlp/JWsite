from pathlib import Path
import re
from datetime import datetime
from JWConstants import ansi, regex
from JWUtils import get_md_files

def extract_date_from_filename(filename):
    date_match = re.search(regex.filename_date, filename)
    if not date_match:
        return None
    try:
        return datetime.strptime(date_match.group(1), "%Y-%m-%d").date()
    except ValueError:
        return None

def get_last_modified_date(file):
    return datetime.fromtimestamp(file.stat().st_mtime).date()

def check_date_match(file, root):
    filename_date = extract_date_from_filename(file.name)
    if not filename_date:
        print(f"{ansi.yellow}Skipping {file}{ansi.end} - No valid date found in filename")
        return
    last_modified_date = get_last_modified_date(file)
    if filename_date != last_modified_date:
        print(f"{ansi.yellow}{ansi.bold}Warning:{ansi.end} {file.relative_to(root)} - Date mismatch")
        print(f"  File date: {ansi.red}{filename_date}{ansi.end}")
        print(f"  Last modified: {ansi.yellow}{last_modified_date}{ansi.end}")
    else:
        print(f"{ansi.green}{file.relative_to(root)} - Dates match{ansi.end}")

def check_dates():
    root = Path(__file__).parent.parent
    md_files = get_md_files(root)
    for file in md_files:
        check_date_match(file, root)

if __name__ == "__main__":
    check_dates()