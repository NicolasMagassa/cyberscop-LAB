import os

file_path = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB\mentions_legales.html"

replacements = {
    "text-gray-750": "text-gray-700",
    "text-gray-755": "text-gray-700",
    "text-gray-850": "text-gray-800",
    "text-gray-650": "text-gray-600",
    "text-gray-950": "text-gray-900",
    "text-slate-700": "text-gray-700"
}

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

for old_str, new_str in replacements.items():
    content = content.replace(old_str, new_str)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed visibility classes in mentions_legales.html")
