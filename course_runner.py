"""Course runner for the IOAI syllabus.

This script discovers practice lessons under `book/` and can run their hidden tests.

Usage examples:
  python course_runner.py --list
  python course_runner.py --run book/part1.../page4_variable_practice.md
  python course_runner.py --run-all
"""

import argparse
import glob
import os
import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

BOOK_ROOT = Path(__file__).resolve().parent / "book"
SOLUTIONS_ROOT = Path(__file__).resolve().parent / "solutions"


def discover_practice_lessons() -> List[Path]:
    """Return a sorted list of practice lesson markdown files from the book."""
    return sorted(Path(BOOK_ROOT).rglob("*practice*.md"))


def get_solution_path(practice_path: Path) -> Path:
    """Return the expected solution file path for a given practice file."""
    rel = practice_path.relative_to(BOOK_ROOT)
    return SOLUTIONS_ROOT / rel.with_name(rel.stem + "_solution" + rel.suffix)


def _extract_python_blocks(md: str) -> List[str]:
    """Extract all python code blocks from a markdown file."""
    return re.findall(r"```python\n(.*?)\n```", md, flags=re.DOTALL)


def _run_lesson(path: Path, use_solution: bool = True) -> Tuple[bool, str]:
    """Run the hidden tests in a lesson markdown file.

    When `use_solution` is True, this prefers the `## Solution` section when present.
    When False (student mode), it runs only the practice blocks and ignores solution content.

    Returns (passed, message).
    """
    md = path.read_text(encoding="utf-8")

    if use_solution and "## Solution" in md:
        _, solution_md = md.split("## Solution", 1)
        md_to_run = solution_md
    else:
        # In student mode we ignore any solution section so learners can see failures.
        md_to_run = md.split("## Solution", 1)[0] if "## Solution" in md else md

    code_blocks = _extract_python_blocks(md_to_run)

    if not code_blocks:
        return False, "No python code block found."

    # Execute all code blocks in a single namespace so helper functions can be shared.
    # Capture stdout so check functions can validate printed output.
    ns: Dict[str, Any] = {}

    import sys
    import io

    buf = io.StringIO()
    old_stdout = sys.stdout
    try:
        sys.stdout = buf
        for code in code_blocks:
            exec(code, ns)
    except Exception as e:
        return False, f"Error executing code: {e!r}"
    finally:
        sys.stdout = old_stdout

    # Make captured output available to check functions.
    ns["_stdout"] = buf.getvalue()

    # Find a check function
    check_funcs = [name for name in ns if name.startswith("check_") and callable(ns[name])]
    if not check_funcs:
        return False, "No check_* function found in lesson."

    # Prefer the first check function, but list all if multiple.
    results = []
    messages: List[str] = []
    for fn_name in check_funcs:
        try:
            out = ns[fn_name]()
        except Exception as e:
            results.append(False)
            messages.append(f"{fn_name} raised {type(e).__name__}: {e}")
            continue

        if isinstance(out, bool):
            results.append(out)
            messages.append(f"{fn_name} returned {out}")
        elif isinstance(out, (tuple, list)):
            passed = all(bool(x) for x in out)
            results.append(passed)
            messages.append(f"{fn_name} returned {out}")
        else:
            results.append(False)
            messages.append(f"{fn_name} returned unexpected type {type(out).__name__}")

    passed = all(results)
    return passed, "; ".join(messages)


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(description="Run IOAI syllabus practice tests.")
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--list", action="store_true", help="List available practice lessons")
    group.add_argument("--run", type=str, help="Run a single lesson by path or index")
    group.add_argument("--run-all", action="store_true", help="Run all practice lessons")

    parser.add_argument(
        "--student",
        action="store_true",
        help="Run practice blocks only (student mode) and report which lessons fail.",
    )

    args = parser.parse_args(argv)
    lessons = discover_practice_lessons()

    # Build a list of (practice_path, solution_path or None)
    lesson_pairs: List[Tuple[Path, Optional[Path]]] = []
    for lesson in lessons:
        sol = get_solution_path(lesson)
        lesson_pairs.append((lesson, sol if sol.exists() else None))

    if args.list:
        for i, (lesson, sol) in enumerate(lesson_pairs, start=1):
            note = " (solution available)" if sol else ""
            print(f"[{i:02d}] {lesson}{note}")
        return 0

    if args.run:
        target = args.run

        # If the argument is a number, treat it as an index into the lesson list
        if target.isdigit():
            idx = int(target) - 1
            if idx < 0 or idx >= len(lesson_pairs):
                print(f"Index out of range: {target}")
                return 1
            lesson, sol = lesson_pairs[idx]
            lesson_to_run = lesson if args.student else (sol or lesson)
        else:
            lesson_path = Path(target)
            if not lesson_path.is_absolute():
                lesson_path = Path.cwd() / lesson_path

            # If the user asks for a practice file, prefer the solution if available
            if BOOK_ROOT in lesson_path.parents:
                sol = get_solution_path(lesson_path)
                lesson_to_run = sol if sol.exists() else lesson_path
            else:
                lesson_to_run = lesson_path

        if not lesson_to_run.exists():
            print(f"Lesson not found: {lesson_to_run}")
            return 1

        passed, msg = _run_lesson(lesson_to_run, use_solution=not args.student)
        status = "PASS" if passed else "FAIL"
        print(f"{status}: {lesson_to_run}\n  {msg}")
        return 0 if passed else 1

    if args.run_all:
        overall = True
        failed_lessons: List[Tuple[Path, str]] = []

        for lesson, sol in lesson_pairs:
            lesson_to_run = lesson if args.student else (sol or lesson)
            passed, msg = _run_lesson(lesson_to_run, use_solution=not args.student)
            status = "PASS" if passed else "FAIL"
            print(f"{status}: {lesson_to_run}\n  {msg}\n")
            if not passed:
                overall = False
                failed_lessons.append((lesson_to_run, msg))

        if failed_lessons:
            print("Summary: The following lessons failed:")
            for fail_path, fail_msg in failed_lessons:
                print(f"  - {fail_path}: {fail_msg}")
            print(f"\nTotal failures: {len(failed_lessons)}")

        return 0 if overall else 1

    parser.print_help()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
