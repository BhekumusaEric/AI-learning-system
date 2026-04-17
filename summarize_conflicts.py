import subprocess
import re

files_cmd = subprocess.run(["git", "diff", "--name-only", "--diff-filter=U"], capture_output=True, text=True)
files = files_cmd.stdout.strip().split('\n')

for f in files:
    if not f.strip(): continue
    try:
        with open(f, 'r') as file:
            content = file.read()
            matches = re.finditer(r'<<<<<<< HEAD\n(.*?)\n=======\n(.*?)\n>>>>>>> main', content, re.DOTALL)
            print(f"=== {f} ===")
            for m in matches:
                print("HEAD:")
                print(m.group(1)[:200] + ("..." if len(m.group(1)) > 200 else ""))
                print("---")
                print("MAIN:")
                print(m.group(2)[:200] + ("..." if len(m.group(2)) > 200 else ""))
                print("-" * 40)
    except Exception as e:
        print(f"Failed to read {f}: {e}")
