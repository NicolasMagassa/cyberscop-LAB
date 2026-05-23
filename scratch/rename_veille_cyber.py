import os

workspace_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"
index_path = os.path.join(workspace_dir, "index.html")

with open(index_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("Veille cyber", "Veille cyber : les menaces sous un autre prisme")

with open(index_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated section titles in index.html")
