import os
import shutil

workspace_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"
img_dir = os.path.join(workspace_dir, "assets", "img")
dest_img = os.path.join(img_dir, "logo-cyber.png")

# 1. Copy the image
source_img = r"C:\Users\user\.gemini\antigravity\brain\1cc4dd16-3560-43af-beb3-a052ec31d405\logo_books_1_1779554249876.png"

# Verify if file exists, if not maybe try the other one but we know it does
if os.path.exists(source_img):
    shutil.copy2(source_img, dest_img)
    print(f"Overwritten image {dest_img}")
else:
    print("WARNING: Source image not found!")

# 2. Update index.html to enlarge the image
index_path = os.path.join(workspace_dir, "index.html")

with open(index_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace "h-24 md:h-32" with "h-32 md:h-48 w-full max-w-sm mx-auto" to make it substantially larger
old_class = 'class="h-24 md:h-32 w-auto object-contain rounded-lg drop-shadow-[0_0_15px_rgba(0,170,44,0.6)]"'
new_class = 'class="h-32 md:h-48 lg:h-56 w-auto object-contain rounded-xl drop-shadow-[0_0_20px_rgba(0,170,44,0.8)] mx-auto"'

if old_class in content:
    content = content.replace(old_class, new_class)
    with open(index_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Enlarged the logo in index.html")
else:
    print("WARNING: Could not find the old class string in index.html")
