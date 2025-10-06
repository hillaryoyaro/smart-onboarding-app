#!/usr/bin/env python
import os
import sys
from pathlib import Path

def main():
    # ensure project root is on sys.path (so `config` package is importable)
    BASE_DIR = Path(__file__).resolve().parent
    if str(BASE_DIR) not in sys.path:
        sys.path.append(str(BASE_DIR))

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)

if __name__ == "__main__":
    main()
