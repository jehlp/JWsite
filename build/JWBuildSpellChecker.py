from pathlib import Path
from spellchecker import SpellChecker
import re
from JWConstants import ansi, regex
from JWUtils import get_md_files, get_config

def remove_code_blocks(content):
    return re.sub(regex.inline_code, '', re.sub(regex.code_block, '', content))

def extract_words(content):
    return [word for word in re.findall(regex.word, content) if len(word) >= 4]

def print_file_header(file):
    print(f"\n{ansi.blue}In {file.parent.name}/{file.name}:{ansi.end}")

def get_base_word(word):
    return word[:-2] if word.endswith("'s") else word

def identify_proper_nouns(words):
    spell_checker = SpellChecker()
    proper_nouns = set()
    for word in words:
        base_word = get_base_word(word)
        if base_word[0].isupper() and base_word not in spell_checker.known([base_word]):
            proper_nouns.add(base_word)
    return proper_nouns

def find_unrecognized_words(words, jw_site_words):
    spell_checker = SpellChecker()
    original_case_map = {word.lower(): word for word in words}
    unrecognized_words = spell_checker.unknown([word.lower() for word in words])
    return {original_case_map[word] for word in unrecognized_words if original_case_map[word].lower() not in jw_site_words}

def filter_misspelled_words(invalid_words, proper_nouns):
    misspelled = set()
    for word in invalid_words:
        base_word = get_base_word(word)
        if base_word not in proper_nouns:
            misspelled.add(word)
    return misspelled

def print_proper_nouns(proper_nouns):
    if proper_nouns:
        print(f"{ansi.yellow}=====Proper Noun Warnings====={ansi.end}")
        for word in sorted(proper_nouns):
            print(f"{ansi.red}- {word}{ansi.end} is likely a proper noun, not checking validity")

def get_suggestions(word):
    spell_checker = SpellChecker()
    return list(spell_checker.candidates(word) or [])[:3]

def print_misspelled_words(misspelled):
    if misspelled:
        print(f"{ansi.yellow}=====Spelling Errors====={ansi.end}")
        for word in sorted(misspelled):
            suggestions = get_suggestions(word)
            suggestion_text = f" → {', '.join(suggestions)}" if suggestions else f" → {ansi.yellow}no suggestions{ansi.end}"
            print(f"{ansi.red}- {word}{ansi.green}{suggestion_text}{ansi.end}")

def categorize_invalid_words(file_words, jw_site_words):
    invalid_words = find_unrecognized_words(file_words, jw_site_words)
    proper_nouns = identify_proper_nouns(invalid_words)
    misspelled = filter_misspelled_words(invalid_words, proper_nouns)
    return proper_nouns, misspelled

def check_spelling():
    root = Path(__file__).parent.parent
    config = get_config(root)
    md_files = get_md_files(root)
    jw_site_words = set(config.get('jw_site_words', []))
    for file in md_files:
        with open(file) as file_handle:
            content = remove_code_blocks(file_handle.read())
            words = extract_words(content)
            proper_nouns, misspelled = categorize_invalid_words(words, jw_site_words)
            if proper_nouns or misspelled:
                print_file_header(file)
                print_proper_nouns(proper_nouns)
                print_misspelled_words(misspelled)

if __name__ == "__main__":
    check_spelling()