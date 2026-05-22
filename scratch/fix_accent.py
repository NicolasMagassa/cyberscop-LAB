import os
import glob

base_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"

# 1. Rename the file if it exists with an accent or mangled char
for filename in os.listdir(base_dir):
    if filename.startswith("politique_confidentialit") and filename.endswith(".html") and filename != "politique_confidentialite.html":
        old_path = os.path.join(base_dir, filename)
        new_path = os.path.join(base_dir, "politique_confidentialite.html")
        os.rename(old_path, new_path)
        print(f"Renamed {filename} to politique_confidentialite.html")

# 2. Update the links in all HTML files
html_files = glob.glob(os.path.join(base_dir, "*.html"))

for file_path in html_files:
    with open(file_path, "r", encoding="utf-8", errors='ignore') as f:
        content = f.read()
    
    # We replace any variation of the href that might have the accent
    new_content = content.replace('href="politique_confidentialité.html"', 'href="politique_confidentialite.html"')
    
    if new_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated link in {os.path.basename(file_path)}")

print("Done fixing accents.")
