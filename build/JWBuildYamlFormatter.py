from pathlib import Path
import yaml
from JWConstants import ansi

def get_sections(content):
    return [line.split(':')[0] for line in content.splitlines() if line and not line.startswith(' ')]

def format_yaml_structure(data):
    if isinstance(data, dict):
        return {key: format_yaml_structure(data[key]) for key in sorted(data)}
    elif isinstance(data, list):
        if all(isinstance(item, str) for item in data):
            return sorted(data)
        else:
            return [format_yaml_structure(x) for x in data]
    else:
        return data

def compare_and_format_yaml(data, file):
    yaml_str = yaml.dump(data, sort_keys=False, indent=2, allow_unicode=True, width=120)
    new_content = '\n'.join(line for line in yaml_str.splitlines() if line.strip())
    current_content = file.read()
    changes = []
    if new_content.count('\n') != current_content.count('\n'):
        changes.append("modified newlines")
    if get_sections(new_content) != get_sections(current_content):
        changes.append("alphabetized sections")
    return (new_content != current_content, new_content, changes)

def format_yaml():
    root = Path(__file__).parent.parent
    yaml_files = list(root.rglob("*.yaml")) + list(root.rglob("*.yml"))
    for file in yaml_files:
        with open(file) as f:
            data = yaml.safe_load(f)
        with open(file) as f:
            needs_format, new_content, changes = compare_and_format_yaml(format_yaml_structure(data), f)
        status = f"{ansi.yellow}reformatted ({', '.join(changes)}){ansi.end}" if changes else f"{ansi.green}no issues{ansi.end}"
        print(f"{ansi.blue}Formatting {file.relative_to(root)}{ansi.end} - {status}")
        if needs_format:
            with open(file, 'w') as f:
                f.write(new_content)

if __name__ == "__main__":
    format_yaml()