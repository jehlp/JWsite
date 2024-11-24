#!/usr/bin/env python3
import os, venv, subprocess, shutil
from pathlib import Path
from JWConstants import ansi

root = Path(__file__).parent.parent
venv_dir = root / "build" / "venv"
requirements = ["pyyaml", "pyspellchecker"]
build_dir = root / "build"
if not venv_dir.exists(): venv.create(venv_dir, with_pip=True)
pip = venv_dir / "bin" / "pip"
python = venv_dir / "bin" / "python"
os.chdir(root)
subprocess.run([pip, "install", "--disable-pip-version-check", "-q"] + requirements)
separator = f"{ansi.cyan}" + "=" * shutil.get_terminal_size().columns + f"{ansi.end}"
for script in sorted(build_dir.glob("JWBuild*.py")):
    print(f"{separator}\n{ansi.white}{ansi.bold}{ansi.underline}Running {script.name}{ansi.end}")
    result = subprocess.run([python, str(script)], capture_output=True, text=True)
    output = result.stdout.strip() or f"{ansi.yellow}{ansi.bold}Everything OK{ansi.end}"
    print(output)
print(separator)