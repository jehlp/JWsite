from pathlib import Path
import re
import requests
from JWConstants import ansi
from JWUtils import get_md_files

def extract_hyperlinks(content):
    return re.findall(r'\[.*?\]\(.*?\)', content)

def validate_hyperlink(file, hyperlink):
    text, url = re.search(r'\[(.*?)\]\((.*?)\)', hyperlink).groups()
    if not url:
        print(f"{ansi.yellow}{ansi.bold}Warning: {ansi.end}{file} - Missing URL in hyperlink")
        return False
    if not re.match(r'^https?://\S+$', url):
        print(f"{ansi.yellow}{ansi.bold}Warning: {ansi.end}{file} - Invalid URL: {ansi.red}{url}{ansi.end}")
        return False
    return True

def check_hyperlink(file, link, root):
    link_text, url = re.search(r'\[(.*?)\]\((.*?)\)', link).groups()
    try:
        response = requests.head(url)
        if response.status_code >= 400:
            print(f"{ansi.red}{file.relative_to(root)} - Inactive link: {link_text} ({url}){ansi.end}")
    except requests.exceptions.RequestException:
        print(f"{ansi.red}{file.relative_to(root)} - Error checking link: {link_text} ({url}){ansi.end}")

def check_hyperlinks():
    root = Path(__file__).parent.parent
    md_files = get_md_files(root)
    for file in md_files:
        with open(file, 'r') as f:
            content = f.read()
        hyperlinks = extract_hyperlinks(content)
        for link in hyperlinks:
            if validate_hyperlink(file, link):
                check_hyperlink(file, link, root)

if __name__ == "__main__":
    check_hyperlinks()