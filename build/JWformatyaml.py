from pathlib import Path
import yaml
from JWconst import ansi

def get_sections(content): return [line.split(':')[0] for line in content.split('\n') if line and not line.startswith(' ')]

def format_dict(d):
    if isinstance(d, dict): return {k: format_dict(d[k]) for k in sorted(d.keys())}
    if isinstance(d, list): return sorted(d) if all(isinstance(x, str) for x in d) else [format_dict(x) for x in d]
    return d

def dump_with_spaces(data, file):
    yaml_str = yaml.dump(data, sort_keys=False, indent=2, allow_unicode=True)
    sections = yaml_str.split('\n')
    result = []
    prev_indent = 0
    for line in sections:
        curr_indent = len(line) - len(line.lstrip())
        if curr_indent == 0 and prev_indent == 0 and result and result[-1] != '' and not line.startswith('-'):
            result.append('')
        result.append(line)
        prev_indent = curr_indent
    new_content = '\n'.join(result).rstrip('\n')
    current_content = file.read()
    changes = []
    if new_content.count('\n\n') != current_content.count('\n\n'): changes.append("modified newlines")
    if get_sections(new_content) != get_sections(current_content): changes.append("alphabetized sections")
    return (new_content != current_content, new_content, changes)

def format_yaml():
    root = Path(__file__).parent.parent
    yaml_files = list(root.rglob("*.yaml")) + list(root.rglob("*.yml"))
    for file in yaml_files:
        with open(file) as f:
            data = yaml.safe_load(f)
            formatted = format_dict(data)
        with open(file) as f:
            needs_format, new_content, changes = dump_with_spaces(formatted, f)
        status = f"{ansi.yellow}reformatted ({', '.join(changes)}){ansi.end}" if changes else f"{ansi.green}no issues{ansi.end}"
        print(f"{ansi.blue}Formatting {file.relative_to(root)}{ansi.end} - {status}")
        if needs_format:
            with open(file, 'w') as f: f.write(new_content)

if __name__ == "__main__": format_yaml()