#!/usr/bin/env python3
import os, venv, subprocess
from pathlib import Path

root = Path(__file__).parent.parent
venv_dir = root / "build" / "venv"
requirements = ["pyyaml", "pyspellchecker"]

if not venv_dir.exists(): venv.create(venv_dir, with_pip=True)

pip = venv_dir / "bin" / "pip"
python = venv_dir / "bin" / "python"

os.chdir(root)
subprocess.run([pip, "install", "--disable-pip-version-check", "-q"] + requirements)
subprocess.run([python, "build/JWformatyaml.py"])
subprocess.run([python, "build/JWspellcheck.py"])