from pathlib import Path
import re
import os
from openai import OpenAI
from JWConstants import ansi, regex

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def has_comment_above(content, target):
    if target == "file":
        return bool(re.match(regex.file_comment, content, re.DOTALL))
    return False

def generate_comment(prompt):
    system_prompt = """You will describe what the JavaScript file does in 2-6 distinct lines.
    IMPORTANT: Use a triple pipe ||| between each line.
    Each line must be a separate thought, not one continuous sentence.
    Each line must be under 120 characters.
    
    Example:
    Validates and sanitizes form input data|||Sends validated data to backend API|||Updates UI with response status"""
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            max_tokens=2000,
            temperature=0.3
        )
        lines = [line.strip() for line in response.choices[0].message.content.split('|||') if line.strip()]
        return '\n'.join(lines)
    except Exception as e:
        print(f"{ansi.red}Error generating comment: {e}{ansi.end}")
        return ""

def process_js_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            content = file.read()      
        if has_comment_above(content, "file"):
            print(f"{ansi.yellow}Skipping {file_path} - already has comment{ansi.end}")
            return      
        file_name = Path(file_path).name
        description = generate_comment(f"{file_name}\n\nContent:\n{content}")
        if not description:
            return      
        formatted_lines = [f" * {line.strip()}" for line in description.split('\n') if line.strip()]
        file_comment = (
            "/**\n"
            f" * File: {file_name}\n"
            f"{chr(10).join(formatted_lines)}\n"
            " */\n\n"
        )
        content = file_comment + content
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(content)
        print(f"{ansi.green}Processed: {file_name}{ansi.end}")
    except Exception as e:
        print(f"{ansi.red}Error processing {file_path}: {e}{ansi.end}")

def process_js_files():
    root = Path(__file__).parent.parent
    js_dir = root / "assets" / "js"
    for js_file in Path(js_dir).rglob("*.js"):
        process_js_file(js_file)

if __name__ == "__main__":
    process_js_files()