import os
import re
import shutil

workspace_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"
img_dir = os.path.join(workspace_dir, "assets", "img")
os.makedirs(img_dir, exist_ok=True)

# 1. Copy the image
source_img = r"C:\Users\user\.gemini\antigravity\brain\1cc4dd16-3560-43af-beb3-a052ec31d405\logo_cyber_1_1779553847116.png"
dest_img = os.path.join(img_dir, "logo-cyber.png")

shutil.copy2(source_img, dest_img)
print(f"Copied image to {dest_img}")

# 2. Replace the SVG in index.html
index_path = os.path.join(workspace_dir, "index.html")

with open(index_path, "r", encoding="utf-8") as f:
    content = f.read()

# Define the exact SVG block we want to replace
old_svg_block = """<svg class="h-24 md:h-32 w-auto object-contain drop-shadow-[0_0_15px_rgba(0,170,44,0.6)] filter brightness-110 contrast-125" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.5">
                            <path d="M4 19V6C4 5.44772 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6V19" stroke="#00AA2C" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M4 15L8 11L12 15L16 11L20 15" stroke="#00FFFF" stroke-linecap="round" stroke-linejoin="round"/>
                            <circle cx="8" cy="11" r="1.5" fill="#FF00FF"/>
                            <circle cx="16" cy="11" r="1.5" fill="#FF00FF"/>
                            <circle cx="4" cy="15" r="1.5" fill="#00AA2C"/>
                            <circle cx="12" cy="15" r="1.5" fill="#00AA2C"/>
                            <circle cx="20" cy="15" r="1.5" fill="#00AA2C"/>
                        </svg>"""

new_img_tag = '<img src="assets/img/logo-cyber.png" alt="CyberScope Lab Logo" class="h-24 md:h-32 w-auto object-contain rounded-lg drop-shadow-[0_0_15px_rgba(0,170,44,0.6)]">'

if old_svg_block in content:
    content = content.replace(old_svg_block, new_img_tag)
    with open(index_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Replaced SVG with image tag in index.html")
else:
    print("WARNING: Could not find the SVG block in index.html")
