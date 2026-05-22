import os
import glob

workspace_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"
html_files = glob.glob(os.path.join(workspace_dir, "*.html"))

for file_path in html_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    if "Terminer et Sauvegarder" in content:
        new_content = content.replace("Terminer et Sauvegarder", "Accepter et Sauvegarder")
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
            
        print(f"Updated {os.path.basename(file_path)}")

print("Done updating the button text.")
