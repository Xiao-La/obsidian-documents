#!/usr/bin/env python3
"""Build the single-file Obsidian plugin from src/.

The plugin is split into four plain scripts that share one module scope:
  core.js    — AST, LaTeX parser, serializer
  render.js  — flat renderer (AST -> DOM)
  builder.js — visual builder modal
  main.js    — plugin entry (commands, code block processor, settings)

Run from this directory:  python3 build.py
"""

import os
import shutil
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "src")

HEADER = """/*
 * Pseudocode Suite — generated bundle. Edit files in src/ and run build.py.
 */

const {
  Plugin,
  Modal,
  Menu,
  Notice,
  MarkdownRenderer,
  MarkdownRenderChild,
  Component,
  MarkdownView,
  TFile,
  PluginSettingTab,
  Setting,
  setIcon,
} = require('obsidian');

"""

ORDER = ["core.js", "render.js", "builder.js", "main.js"]


def main():
    parts = [HEADER]
    for name in ORDER:
        path = os.path.join(SRC, name)
        with open(path, encoding="utf-8") as handle:
            parts.append(handle.read().rstrip() + "\n\n")

    with open(os.path.join(HERE, "main.js"), "w", encoding="utf-8") as handle:
        handle.write("".join(parts))

    with open(os.path.join(SRC, "styles.css"), encoding="utf-8") as handle:
        styles = handle.read()
    with open(os.path.join(HERE, "styles.css"), "w", encoding="utf-8") as handle:
        handle.write(styles)

    # Catch syntax errors before Obsidian does.
    node = shutil.which("node")
    if node:
        subprocess.run([node, "--check", os.path.join(HERE, "main.js")], check=True)

    print("built main.js and styles.css")


if __name__ == "__main__":
    main()
