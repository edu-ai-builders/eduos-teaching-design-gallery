#!/usr/bin/env python3
"""Validate local references and catalog coverage for the static review site."""

from __future__ import annotations

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SUBJECTS = (
    "history",
    "chinese",
    "civics",
    "mathematics",
    "physics",
    "chemistry",
    "biology",
    "geography",
)

GOLD_ARTIFACTS = (
    "gold/history/history-teaching-studio.html",
    "gold/history/red-cliffs-decision-room.html",
    "gold/history/source-detective.html",
    "gold/history/causal-explanation-builder.html",
    "gold/biology/thermoregulation-feedback-lab.html",
    "gold/biology/competing-genetics-models.html",
    "gold/biology/experiment-design-bench.html",
)


class ReferenceParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.references: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        for key in ("href", "src"):
            value = values.get(key)
            if value and not value.startswith(("http:", "https:", "data:", "#", "mailto:")):
                self.references.append(value.split("#", 1)[0])


def main() -> int:
    errors: list[str] = []
    html_files = (
        [ROOT / "index.html", ROOT / "inspector.html"]
        + [ROOT / "subjects" / f"{subject}.html" for subject in SUBJECTS]
        + [ROOT / artifact for artifact in GOLD_ARTIFACTS]
    )

    for path in html_files:
        if not path.exists():
            errors.append(f"missing HTML: {path.relative_to(ROOT)}")
            continue
        parser = ReferenceParser()
        parser.feed(path.read_text(encoding="utf-8"))
        for reference in parser.references:
            resolved = (path.parent / reference).resolve()
            if not resolved.exists():
                errors.append(f"broken reference in {path.relative_to(ROOT)}: {reference}")

    for subject in SUBJECTS:
        path = ROOT / "subjects" / f"{subject}.html"
        if path.exists() and f'data-subject="{subject}"' not in path.read_text(encoding="utf-8"):
            errors.append(f"wrong or missing data-subject in {path.name}")

    demo_config_path = ROOT / "catalog" / "demo-configs.js"
    demo_config_text = demo_config_path.read_text(encoding="utf-8") if demo_config_path.exists() else ""
    demo_records = re.findall(
        r'^\s*"([a-z0-9-]+)": \{kind:"(content|pedagogy|example)"',
        demo_config_text,
        re.MULTILINE,
    )
    demo_ids = {record_id for record_id, _ in demo_records}
    if len(demo_records) != 48:
        errors.append(f"expected 48 demo configs, found {len(demo_records)}")
    demo_directories = {"content": "content", "pedagogy": "pedagogy", "example": "worked-examples"}
    for record_id, kind in demo_records:
        page = ROOT / "demos" / demo_directories[kind] / f"{record_id}.html"
        if not page.exists():
            errors.append(f"missing standalone demo page: {page.relative_to(ROOT)}")
            continue
        parser = ReferenceParser()
        parser.feed(page.read_text(encoding="utf-8"))
        for reference in parser.references:
            resolved = (page.parent / reference).resolve()
            if not resolved.exists():
                errors.append(f"broken demo reference in {page.relative_to(ROOT)}: {reference}")

    manifest_path = ROOT / "catalog" / "manifest.json"
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(f"invalid manifest: {exc}")
        manifest = {"families": {}}

    seen_ids: set[str] = set()
    counts: dict[str, int] = {}
    for family, config in manifest.get("families", {}).items():
        path = ROOT / "catalog" / config["path"]
        if not path.exists():
            errors.append(f"missing catalog: {config['path']}")
            continue
        text = path.read_text(encoding="utf-8")
        ids = re.findall(r'\bid:"([a-z0-9-]+)"', text)
        subjects = re.findall(r'\bsubject:"([a-z]+)"', text)
        counts[family] = len(ids)
        if len(ids) != config["expected_records"]:
            errors.append(f"{family}: expected {config['expected_records']} records, found {len(ids)}")
        unknown_subjects = set(subjects) - set(SUBJECTS)
        if unknown_subjects:
            errors.append(f"{family}: unknown subjects {sorted(unknown_subjects)}")
        for record_id in ids:
            if record_id in seen_ids:
                errors.append(f"duplicate catalog id: {record_id}")
            seen_ids.add(record_id)
            if family in {"content", "pedagogy", "worked_examples"} and record_id not in demo_ids:
                errors.append(f"catalog record has no demo config: {record_id}")

    all_catalog_text = "\n".join(
        path.read_text(encoding="utf-8")
        for path in (ROOT / "catalog").glob("*/records.js")
    )
    for subject in SUBJECTS:
        for family in ("content", "pedagogy", "skill", "example"):
            pattern = rf'type:"{family}"[^\n]*subject:"{subject}"|subject:"{subject}"[^\n]*type:"{family}"'
            if not re.search(pattern, all_catalog_text):
                errors.append(f"no {family} record for {subject}")

    if errors:
        print("Site validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"Validated {len(html_files)} hub/subject/gold HTML files, {len(demo_records)} legacy standalone demos, {sum(counts.values())} catalog records, and all local references.")
    print("Catalog counts:", json.dumps(counts, ensure_ascii=False, sort_keys=True))
    return 0


if __name__ == "__main__":
    sys.exit(main())
