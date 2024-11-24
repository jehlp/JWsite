from pathlib import Path
from spellchecker import SpellChecker
import re
from JWConstants import ansi
from JWUtils import get_md_files, get_config

def remove_code_blocks(content):
    return re.sub(r'`[^`]*`', '', re.sub(r'```[\s\S]*?```', '', content))

def extract_words(content):
    return [w for w in re.findall(r'\b[a-zA-Z]+\b', content) if len(w) >= 4]

def get_misspelled_words(words, jw_site_words):
    spell = SpellChecker()
    return spell.unknown(words) - jw_site_words

def get_suggestions(word):
    spell = SpellChecker()
    return list(spell.candidates(word) or [])[:3]

def print_misspelled_words(file, misspelled):
    print(f"{ansi.blue}In {file.parent.name}/{file.name}:{ansi.end}")
    for word in misspelled:
        suggestions = get_suggestions(word)
        if suggestions:
            suggest_text = f" → {', '.join(suggestions)}"
        else:
            suggest_text = f" → {ansi.yellow}no suggestions{ansi.green}"
        print(f"{ansi.red}- {word}{ansi.green}{suggest_text}{ansi.end}")

def check_spelling():
    root = Path(__file__).parent.parent
    config = get_config(root)
    md_files = get_md_files(root)
    jw_site_words = set(config.get('jw_site_words', []))
    for file in md_files:
        with open(file) as f:
            content = remove_code_blocks(f.read())
        words = extract_words(content)
        misspelled = get_misspelled_words(words, jw_site_words)
        if misspelled:
            print_misspelled_words(file, misspelled)

if __name__ == "__main__":
    check_spelling()