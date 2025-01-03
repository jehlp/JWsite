from pathlib import Path
import re
import os
from openai import OpenAI
from JWConstants import ansi, regex

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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
    except Exception as exception:
        print(f"{ansi.red}Error generating comment: {exception}{ansi.end}")
        return ""

def add_comment_to_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as file_handle:
            content = file_handle.read()      
        if bool(re.match(regex.file_comment, content, re.DOTALL)):
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
            f"{'\n'.join(formatted_lines)}\n"
            " */\n\n"
        )
        content = file_comment + content
        with open(file_path, "w", encoding="utf-8") as file_handle:
            file_handle.write(content)
        print(f"{ansi.green}Processed: {file_name}{ansi.end}")
    except Exception as exception:
        print(f"{ansi.red}Error processing {file_path}: {exception}{ansi.end}")

def summarize_files():
    root = Path(__file__).parent.parent
    js_dir = root / "assets" / "js"
    for js_file in Path(js_dir).rglob("*.js"):
        add_comment_to_file(js_file)

if __name__ == "__main__":
    summarize_files()