#!/usr/bin/env python3
"""Build the single-file Obsidian plugin from src/.

All src/ files are plain scripts sharing one module scope, concatenated in
ORDER. The engine (font … templates, edit) has no Obsidian dependency and is
loaded directly by the Node tests in tests/.

Run from this directory:  python3 build.py
"""

import os
import shutil
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "src")

HEADER = """/*
 * Figure Suite — generated bundle. Edit files in src/ and run build.py.
 */

const {
  Plugin,
  Modal,
  FuzzySuggestModal,
  Notice,
  MarkdownView,
  TFile,
  PluginSettingTab,
  Setting,
  setIcon,
  normalizePath,
  getLinkpath,
} = require('obsidian');

"""

ORDER = [
    "font.js", "mathtext.js", "svg.js", "parse.js", "blocks.js", "tree.js",
    "graph.js", "compose.js", "edit.js", "templates.js", "export.js", "panel.js", "main.js",
]


def main():
    parts = [HEADER]
    for name in ORDER:
        with open(os.path.join(SRC, name), encoding="utf-8") as handle:
            parts.append(handle.read().rstrip() + "\n\n")
    with open(os.path.join(HERE, "main.js"), "w", encoding="utf-8") as handle:
        handle.write("".join(parts))
    shutil.copyfile(os.path.join(SRC, "styles.css"), os.path.join(HERE, "styles.css"))
    node = shutil.which("node")
    if node:
        subprocess.run([node, "--check", os.path.join(HERE, "main.js")], check=True)
    print("built main.js and styles.css")


if __name__ == "__main__":
    main()
