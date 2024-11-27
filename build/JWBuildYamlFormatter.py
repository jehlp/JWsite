from pathlib import Path
import yaml
from JWConstants import ansi

def get_sections(content):
    return [section_line.split(':')[0] for section_line in content.splitlines() if section_line and not section_line.startswith(' ')]

def format_yaml_structure(yaml_data):
    if isinstance(yaml_data, dict):
        return {key: format_yaml_structure(yaml_data[key]) for key in sorted(yaml_data)}
    elif isinstance(yaml_data, list):
        if all(isinstance(item, str) for item in yaml_data):
            return sorted(yaml_data)
        else:
            return [format_yaml_structure(item) for item in yaml_data]
    else:
        return yaml_data

def compare_and_format_yaml(data, file):
    yaml_str = yaml.dump(data, sort_keys=False, indent=2, allow_unicode=True, width=120)
    formatted_content = '\n'.join(line for line in yaml_str.splitlines() if line.strip())
    original_content = file.read()
    formatting_changes = []
    if formatted_content.count('\n') != original_content.count('\n'):
        formatting_changes.append("modified newlines")
    if get_sections(formatted_content) != get_sections(original_content):
        formatting_changes.append("alphabetized sections")
    return (formatted_content != original_content, formatted_content, formatting_changes)

def format_yaml():
    root = Path(__file__).parent.parent
    yaml_files = [file for file in list(root.rglob("*.yaml")) + list(root.rglob("*.yml")) if '_site' not in file.parts]
    for file in yaml_files:
        with open(file) as file_handle:
            data = yaml.safe_load(file_handle)
        with open(file) as file_handle:
            needs_format, new_content, changes = compare_and_format_yaml(format_yaml_structure(data), file_handle)
        status = f"{ansi.yellow}reformatted ({', '.join(changes)}){ansi.end}" if changes else f"{ansi.green}no issues{ansi.end}"
        print(f"{ansi.blue}Formatting {file.relative_to(root)}{ansi.end} - {status}")
        if needs_format:
            with open(file, 'w') as file_handle:
                file_handle.write(new_content)

if __name__ == "__main__":
    format_yaml()