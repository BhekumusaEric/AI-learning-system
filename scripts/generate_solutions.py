"""Generate solution markdown files for practice lessons.

This script scans `book/` for practice markdown files and creates a parallel
set of solution files under `solutions/`.

Each solution file contains the original lesson content plus a `## Solution`
section showing the completed code.

Run:
    python scripts/generate_solutions.py
"""

import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BOOK_ROOT = ROOT / "book"
SOLUTIONS_ROOT = ROOT / "solutions"

# Mapping from placeholder patterns to solution lines.
PLACEHOLDER_REPLACEMENTS = {
    "my_name =": 'my_name = "Your Name"',
    "my_age =": "my_age = 25",
    "pi_approx =": "pi_approx = 3.14",
    "is_fun =": "is_fun = True",
    "name_score =": "name_score = df[[\"Name\", \"Score\"]]",
    "older_students =": "older_students = df[df['Age'] > 16]",
    "passed_students =": "passed_students = df[df['Passed'] == True]",
    "array_1d =": "array_1d = np.array([1, 2, 3])",
    "array_2d =": "array_2d = np.array([[1, 2], [3, 4]])",
    "shape_1d =": "shape_1d = array_1d.shape",
    "shape_2d =": "shape_2d = array_2d.shape",
    "kmeans =": "kmeans = KMeans(n_clusters=5, random_state=42)",
    "cluster_labels =": "cluster_labels = kmeans.labels_",
    "cluster_centers =": "cluster_centers = kmeans.cluster_centers_",
}


def _fill_placeholders(code: str) -> str:
    """Replace common placeholder lines with a solution."""
    lines = code.splitlines()
    out_lines = []
    inserted_fit = False

    for line in lines:
        stripped = line.strip()
        replaced = False

        for placeholder, replacement in PLACEHOLDER_REPLACEMENTS.items():
            if stripped.startswith(placeholder) and stripped == placeholder:
                out_lines.append(replacement)
                replaced = True
                break

        if replaced:
            continue

        # Special-case: if we have a KMeans model and there is a comment about fit,
        # insert the fit call right after the model is created.
        if "kmeans =" in line and "KMeans" in line and not inserted_fit:
            out_lines.append(line)
            out_lines.append("kmeans.fit(customers)")
            inserted_fit = True
            continue

        out_lines.append(line)

    return "\n".join(out_lines)


def _extract_initial_code_block(md: str) -> str:
    """Get the first python code block after '### Initial Code'."""
    # Find the section start
    match = re.search(r"### Initial Code\s*```python\n", md)
    if not match:
        return ""

    start = match.end()
    end_match = re.search(r"\n```", md[start:])
    if not end_match:
        return ""

    end = start + end_match.start()
    return md[start:end].rstrip("\n")


def generate_solution(source_path: Path, dest_path: Path):
    content = source_path.read_text(encoding="utf-8")

    if "## Solution" in content:
        # Already has solution section, just copy it.
        dest_path.write_text(content, encoding="utf-8")
        return

    initial_code = _extract_initial_code_block(content)
    if not initial_code:
        solution_code = "# No initial code block found."
    else:
        solution_code = _fill_placeholders(initial_code)

    # Append the solution section at the end
    solution_section = (
        "\n\n## Solution\n\n"
        "Below is one possible correct implementation for the practice exercise.\n\n"
        "```python\n"
        f"{solution_code}\n"
        "```\n"
    )

    dest_path.write_text(content + solution_section, encoding="utf-8")


def main():
    practice_files = sorted(BOOK_ROOT.rglob("*practice*.md"))

    if not practice_files:
        print("No practice files found under book/.")
        return

    for src in practice_files:
        rel = src.relative_to(BOOK_ROOT)
        dest = SOLUTIONS_ROOT / rel
        dest = dest.with_name(dest.stem + "_solution" + dest.suffix)
        dest.parent.mkdir(parents=True, exist_ok=True)
        generate_solution(src, dest)
        print(f"Created solution: {dest}")


if __name__ == "__main__":
    main()
