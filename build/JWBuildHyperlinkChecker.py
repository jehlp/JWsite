from pathlib import Path
import re, yaml, requests
from JWConstants import ansi

def check_hyperlinks():
    root = Path(__file__).parent.parent
    with open(root / "build/config.yaml") as f: config = yaml.safe_load(f)
    md_files = [f for d in config['jw_markdown_dirs'] for f in (root / d).rglob("*.md")]

    for file in md_files:
        with open(file, 'r') as f: content = f.read()
        hyperlinks = re.findall(r'\[.*?\]\(.*?\)', content)
        for link in hyperlinks:
            text, url = re.search(r'\[(.*?)\]\((.*?)\)', link).groups()
            if not url: print(f"{ansi.yellow}{ansi.bold}Warning: {ansi.end}{file} - Missing URL in hyperlink"); continue
            if not re.match(r'^https?://\S+$', url): print(f"{ansi.yellow}{ansi.bold}Warning: {ansi.end}{file} - Invalid URL: {ansi.red}{url}{ansi.end}"); continue
            try: 
                if requests.head(url).status_code >= 400: print(f"{ansi.red}{file.relative_to(root)} - Inactive: {text} ({url}){ansi.end}")
            except requests.exceptions.RequestException: 
                print(f"{ansi.red}{file.relative_to(root)} - Error checking: {text} ({url}){ansi.end}")

if __name__ == "__main__": check_hyperlinks()