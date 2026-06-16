import os
import glob

workspace_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"
html_files = glob.glob(os.path.join(workspace_dir, "*.html"))

old_icon = '<i data-lucide="shield-check" class="h-8 w-8 text-cyber-green group-hover:scale-110 transition-transform duration-300 relative z-10"></i>'
new_icon = '<i data-lucide="flask-conical" class="h-8 w-8 text-cyber-blue group-hover:scale-110 transition-transform duration-300 relative z-10"></i>'

for file_path in html_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    if old_icon in content:
        content = content.replace(old_icon, new_icon)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated icon in {os.path.basename(file_path)}")
