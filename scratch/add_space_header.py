import os
import glob

workspace_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"
html_files = glob.glob(os.path.join(workspace_dir, "*.html"))

target = 'CYBERSCOPE<span class="text-cyber-green">LAB</span>'
replacement = 'CYBERSCOPE <span class="text-cyber-green">LAB</span>'

for file_path in html_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    if target in content:
        new_content = content.replace(target, replacement)
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        
        print(f"Added space in {os.path.basename(file_path)}")

print("Done updating header logo spacing.")
