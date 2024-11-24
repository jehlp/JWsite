from pathlib import Path
import yaml

def get_md_files(root):
    with open(root / "build/config.yaml") as f:
        config = yaml.safe_load(f)
    return [f for d in config['jw_markdown_dirs'] for f in (root / d).rglob("*.md")]