from pathlib import Path
from spellchecker import SpellChecker
import re, yaml
from JWConstants import ansi

def check_spelling():
    spell = SpellChecker()
    root = Path(__file__).parent.parent
    with open(root / "build/config.yaml") as f: config = yaml.safe_load(f)
    md_files = [f for d in config['jw_markdown_dirs'] for f in (root / d).rglob("*.md")]
    jw_site_words = set(config.get('jw_site_words', []))
    
    for file in md_files:
        with open(file) as f: content = re.sub(r'`[^`]*`', '', re.sub(r'```[\s\S]*?```', '', f.read()))
        words = [w for w in re.findall(r'\b[a-zA-Z]+\b', content) if len(w) >= 4]
        misspelled = spell.unknown(words) - jw_site_words
        if misspelled:
            print(f"{ansi.blue}In {file.parent.name}/{file.name}:{ansi.end}")
            for word in misspelled:
                suggestions = list(spell.candidates(word) or [])[:3]
                suggest_text = f" → {', '.join(suggestions)}" if suggestions else f" → {ansi.yellow}no suggestions{ansi.green}"
                print(f"{ansi.red}- {word}{ansi.green}{suggest_text}{ansi.end}")

if __name__ == "__main__": check_spelling()
