import os

workspace_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"
index_path = os.path.join(workspace_dir, "index.html")

with open(index_path, "r", encoding="utf-8") as f:
    content = f.read()

old_img = '<img src="assets/img/logo-cyber.png" alt="CyberScope Lab Logo" class="h-32 md:h-48 lg:h-56 w-auto object-contain rounded-xl drop-shadow-[0_0_20px_rgba(0,170,44,0.8)] mx-auto">'
new_img = '<img src="assets/img/logo-cyber.png" alt="CyberScope Lab Logo" class="h-48 md:h-72 w-full object-cover object-center [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)] opacity-80 scale-110 hover:scale-125 transition-transform duration-700 ease-in-out">'

if old_img in content:
    content = content.replace(old_img, new_img)
    with open(index_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated logo classes for blending and enlarging")
else:
    print("WARNING: Old img tag not found!")
