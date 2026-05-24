import os
import glob

workspace_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"
html_files = glob.glob(os.path.join(workspace_dir, "*.html"))

for file_path in html_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # We need to replace the exact HTML snippet for the footer link
    # Old: <li><a href="equipe.html" class="hover:text-cyber-pink transition-colors">Équipe</a></li>
    # New: <li><a href="qui_suis_je.html" class="hover:text-cyber-pink transition-colors">Qui suis-je ?</a></li>
    old_link = '<li><a href="equipe.html" class="hover:text-cyber-pink transition-colors">Équipe</a></li>'
    new_link = '<li><a href="qui_suis_je.html" class="hover:text-cyber-pink transition-colors">Qui suis-je ?</a></li>'
    
    if old_link in content:
        content = content.replace(old_link, new_link)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated footer in {os.path.basename(file_path)}")

# Now rename the file
old_file = os.path.join(workspace_dir, "equipe.html")
new_file = os.path.join(workspace_dir, "qui_suis_je.html")

if os.path.exists(old_file):
    os.rename(old_file, new_file)
    print("Renamed equipe.html to qui_suis_je.html")
    
    # Update the title inside qui_suis_je.html
    with open(new_file, "r", encoding="utf-8") as f:
        content = f.read()
    
    content = content.replace('>Equipe</h1>', '>Qui suis-je ?</h1>')
    content = content.replace('>Équipe</h1>', '>Qui suis-je ?</h1>')
    
    with open(new_file, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated title inside qui_suis_je.html")
