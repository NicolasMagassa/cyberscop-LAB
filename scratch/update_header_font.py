import os
import glob

workspace_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"
html_files = glob.glob(os.path.join(workspace_dir, "*.html"))

old_class = '<div class="mr-6 flex items-baseline space-x-6 font-mono text-sm font-bold">'
new_class = '<div class="mr-6 flex items-baseline space-x-6 font-orbitron text-sm font-bold">'

for file_path in html_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    if old_class in content:
        content = content.replace(old_class, new_class)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated font in {os.path.basename(file_path)}")
