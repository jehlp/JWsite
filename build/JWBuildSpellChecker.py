from pathlib import Path
from spellchecker import SpellChecker
import re
from JWConstants import ansi
from JWUtils import get_md_files, get_config

def remove_code_blocks(content):
    return re.sub(r'`[^`]*`', '', re.sub(r'```[\s\S]*?```', '', content))

def extract_words(content):
    return [word for word in re.findall(r"\b[a-zA-Z']+\b", content) if len(word) >= 4]

def print_file_header(file):
    print(f"\n{ansi.blue}In {file.parent.name}/{file.name}:{ansi.end}")

def identify_proper_nouns(words, spell_checker):
    return {word for word in words if word[0].isupper() and word not in spell_checker.known([word])}

def print_proper_nouns(proper_nouns):
    if proper_nouns:
        print(f"{ansi.yellow}=====Proper Noun Warnings====={ansi.end}")
        for word in sorted(proper_nouns):
            print(f"{ansi.red}- {word}{ansi.end} is likely a proper noun, not checking validity")

def get_suggestions(word):
    spell = SpellChecker()
    return list(spell.candidates(word) or [])[:3]

def print_misspelled_words(misspelled):
   if misspelled:
        print(f"{ansi.yellow}=====Spelling Errors====={ansi.end}")
        for word in sorted(misspelled):
            suggestions = get_suggestions(word)
            suggest_text = f" → {', '.join(suggestions)}" if suggestions else f" → {ansi.yellow}no suggestions{ansi.end}"
            print(f"{ansi.red}- {word}{ansi.green}{suggest_text}{ansi.end}")

def analyze_file_words(words, jw_site_words):
    spell = SpellChecker()
    case_map = {word.lower(): word for word in words}
    unknown = {case_map[word] for word in spell.unknown([word.lower() for word in words]) if case_map[word].lower() not in jw_site_words}
    proper_nouns = identify_proper_nouns(unknown, spell)
    return proper_nouns, unknown - proper_nouns

def check_spelling():
    root = Path(__file__).parent.parent
    config = get_config(root)
    md_files = get_md_files(root)
    jw_site_words = set(config.get('jw_site_words', []))
    for file in md_files:
        with open(file) as f:
            content = remove_code_blocks(f.read())
            words = extract_words(content)
            proper_nouns, misspelled = analyze_file_words(words, jw_site_words)
            if proper_nouns or misspelled:
                print_file_header(file)
                print_proper_nouns(proper_nouns)
                print_misspelled_words(misspelled)

if __name__ == "__main__":
    check_spelling()