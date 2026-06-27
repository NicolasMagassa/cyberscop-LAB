import os
import glob

workspace_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"
html_files = glob.glob(os.path.join(workspace_dir, "*.html"))

target_desktop = '<a href="#" class="text-gray-600 dark:text-gray-400 hover:text-cyber-blue dark:hover:text-cyber-neonBlue transition-colors">/RECHERCHES & ANALYSES</a>'
replacement_desktop = '<a href="recherches.html" class="text-gray-600 dark:text-gray-400 hover:text-cyber-blue dark:hover:text-cyber-neonBlue transition-colors">/RECHERCHES & ANALYSES</a>'

target_mobile = '<a href="#" class="text-gray-600 dark:text-gray-300 hover:text-cyber-blue block px-3 py-2 text-base font-medium">/RECHERCHES & ANALYSES</a>'
replacement_mobile = '<a href="recherches.html" class="text-gray-600 dark:text-gray-300 hover:text-cyber-blue block px-3 py-2 text-base font-medium">/RECHERCHES & ANALYSES</a>'

for file_path in html_files:
    if os.path.basename(file_path) == "recherches.html":
        continue
        
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    modified = False
    if target_desktop in content:
        content = content.replace(target_desktop, replacement_desktop)
        modified = True
    if target_mobile in content:
        content = content.replace(target_mobile, replacement_mobile)
        modified = True
        
    if modified:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated Recherches link in {os.path.basename(file_path)}")

print("Done updating Recherches navigation menu links.")
