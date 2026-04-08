# IOAI Training Grounds — Syllabus & Book Developer Guide

This guide explains how the **IOAI Training Grounds** syllabus is organized, how the book structure works, and what a future developer (or agent) should know to maintain and extend the curriculum.

---

## High-Level Structure

The curriculum is organized as a **book** in the repository. It is divided into:

- **Parts** (major sections) — e.g., foundational skills, neural networks, CV, NLP
- **Chapters** within each part — each chapter focuses on a topic
- **Pages** inside chapters — each page is a lesson (Read or Practice)

The canonical content lives in `book/`.

### Folder structure example

```
book/
├── part1_foundational_skills_classical_ml/
│   ├── chapter1_python_programming_fundamentals/
│   │   ├── page1_your_first_python_program.md (Read)
│   │   ├── page2_hello_world_challenge.md (Practice)
│   │   ...
│   ├── chapter2_numpy_for_data_handling/
│   │   └── ...
│   ...
└── part4_natural_language_processing/
    └── chapter9_teaching_computers_to_read/
        └── ...
```

### Page types

- **Read pages**: concept explanations, diagrams, intuition
- **Practice pages**: code exercises with a Python code block and hidden tests

Practice pages include a `check_...()` function so the runner can validate student solutions.

---

## Solutions & Student Mode

To support both learners and validation/CI, the repository includes:

### solutions/ folder

A parallel folder structure containing solved versions of every practice page.
Each solution file mirrors its practice sibling but includes a `## Solution` section with a complete, working answer.

Example:
```
solutions/part1_foundational_skills_classical_ml/chapter1_python_programming_fundamentals/page4_variable_practice_solution.md
```

### Course Runner (course_runner.py)

This script can:

- List all practice lessons (`--list`)
- Run an individual lesson (`--run <index|path>`)
- Run the whole suite (`--run-all`)
- Run in **student mode** (`--student`) to execute only the practice code blocks and report failures

#### Key behaviors
- By default, the runner prefers running the `## Solution` section (if present) so tests pass reliably.
- In student mode, it runs only the practice section (ignores solutions) and returns a failure summary.
- It captures stdout (`_stdout`) so check functions can validate printed output.

---

## How to Add a New Lesson

1. Create a new markdown file in the appropriate chapter folder under `book/`.
2. Follow the existing format:
   - Provide context and explanation
   - Add a `### Initial Code` block with starter code
   - Include hidden tests with a `check_...()` function (required for runner validation)
3. If it’s a practice lesson, create a corresponding solution file under `solutions/`.
   - Use `scripts/generate_solutions.py` to auto-generate solutions when possible.

### Naming conventions

- Pages: `page<NN>_descriptive_title.md`
- Practice pages should include `practice` in the filename.
- Solution pages append `_solution` before `.md`.

---

## Regenerating Solutions

To regenerate the `solutions/` folder after updating practice pages:

```bash
python3 scripts/generate_solutions.py
```

This script scans `book/` for `*practice*.md` files and creates/updates corresponding solution files.

---

## How the Runner Validates Exercises

### Expected structure in practice pages

- A `### Initial Code` code block with starter code.
- A `check_...()` function (helper) that returns a boolean (or tuple of booleans).
- The runner executes code blocks and calls `check_...()`.

### Helpful patterns for check functions

- Use `_stdout` (captured output) to validate prints.
- Return a single boolean or tuple of booleans for multiple checks.

Example:
```python
# Don't change the code below - it's for testing

def check_example():
    return result == expected
```

---

## Best Practices for Future Developers

- **Consistent formatting**: keep each lesson structured.
- **Small lessons**: keep each page focused on a single concept or task.
- **Ensure check_...() exists** on every practice page.
- **Keep solutions/ in sync**: regenerate solutions after editing.

---

## Project Layout (Quick Reference)

```
book/          # lesson content (Read + Practice)
solutions/     # solved versions (auto-generated)
scripts/       # helper scripts (e.g., generate_solutions.py)
course_runner.py  # CLI runner for validating/teaching
README.md      # high-level overview
SYLLABUS_DEVELOPER_GUIDE.md  # (this file)
```

---

If you want, I can also add:
- A **lesson template** file to standardize new pages
- A **CI check** that runs the runner in student mode and fails if any practice page is missing `check_...()`
- A **web view generator** that converts the book into a mini static site (Markdown → HTML)
