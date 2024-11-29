from pathlib import Path
import re
import requests
from JWConstants import ansi, regex
from JWUtils import get_md_files

def parse_hyperlink(hyperlink):
    if isinstance(hyperlink, tuple):
        return hyperlink
    match = re.search(regex.hyperlink, hyperlink)
    return match.groups() if match else None

def extract_hyperlinks(content):
    return re.findall(regex.hyperlink, content)

def validate_url(url):
    return bool(re.match(regex.url, url))

def validate_hyperlink(file, hyperlink):
    hyperlink_parts = parse_hyperlink(hyperlink)
    if not hyperlink_parts:
        print(f"{ansi.yellow}{ansi.bold}Warning: {ansi.end}{file} - Malformed hyperlink")
        return False
    link_text, url = hyperlink_parts
    if not url:
        print(f"{ansi.yellow}{ansi.bold}Warning: {ansi.end}{file} - Missing URL in hyperlink")
        return False
    if not validate_url(url):
        print(f"{ansi.yellow}{ansi.bold}Warning: {ansi.end}{file} - Invalid URL: {ansi.red}{url}{ansi.end}")
        return False
    return True

def check_hyperlink(file, hyperlink, root):
    link_text, url = parse_hyperlink(hyperlink)
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
        with open(file, 'r') as file_handle:
            content = file_handle.read()
            hyperlinks = extract_hyperlinks(content)
            for hyperlink in hyperlinks:
                if validate_hyperlink(file, hyperlink):
                    check_hyperlink(file, hyperlink, root)

if __name__ == "__main__":
    check_hyperlinks()