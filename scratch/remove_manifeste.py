import os
import glob
import re

workspace_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"
html_files = glob.glob(os.path.join(workspace_dir, "*.html"))

for file_path in html_files:
    if os.path.basename(file_path).lower() == "manifeste.html":
        continue
        
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # The line looks like:
    # <li><a href="manifeste.html" class="hover:text-cyber-pink transition-colors">Manifeste</a></li>
    
    # We will use regex to remove it and its leading whitespace/newline
    new_content = re.sub(r'\s*<li><a href="manifeste\.html" class="hover:text-cyber-pink transition-colors">Manifeste</a></li>', '', content)

    if new_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Removed Manifeste link from {os.path.basename(file_path)}")

print("Done removing Manifeste link.")
