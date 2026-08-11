#!/usr/bin/env python3
"""Generate thin standalone HTML entry points for every configured demo."""

from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "catalog" / "demo-configs.js"
OUTPUTS = {"content": "content", "pedagogy": "pedagogy", "example": "worked-examples"}


def main() -> None:
    text = CONFIG.read_text(encoding="utf-8")
    records = re.findall(
        r'^\s*"([a-z0-9-]+)": \{kind:"(content|pedagogy|example)",role:"([A-Z]+)",subject:"([^"]+)",title:"([^"]+)"',
        text,
        re.MULTILINE,
    )
    if len(records) != 48:
        raise SystemExit(f"expected 48 demo configs, found {len(records)}")

    for record_id, kind, role, subject, title in records:
        directory = ROOT / "demos" / OUTPUTS[kind]
        directory.mkdir(parents=True, exist_ok=True)
        html = f'''<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="{subject} {title} interactive EduOS teaching object">
  <title>{title} · EduOS Demo</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="../../assets/demo.css">
</head>
<body data-demo-id="{record_id}">
  <main id="demo-root"></main>
  <script src="../../catalog/demo-configs.js"></script>
  <script src="../../assets/demo-engine.js"></script>
</body>
</html>
'''
        (directory / f"{record_id}.html").write_text(html, encoding="utf-8")

    print(f"Generated {len(records)} standalone demo pages.")


if __name__ == "__main__":
    main()

