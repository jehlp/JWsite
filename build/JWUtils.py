import yaml

def get_config(root):
    config_path = root / "build/config.yaml"
    with open(config_path) as f:
        return yaml.safe_load(f)

def get_md_files(root):
    config = get_config(root)
    md_dirs = config.get('jw_markdown_dirs', [])
    return [file for md_dir in md_dirs for file in (root / md_dir).rglob("*.md")]