import os
import glob

base_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"
html_files = glob.glob(os.path.join(base_dir, "*.html"))

replacements = {
    'href="#" class="hover:text-cyber-pink transition-colors">Mentions Légales</a>': 'href="mentions_legales.html" class="hover:text-cyber-pink transition-colors">Mentions Légales</a>',
    'href="#" class="hover:text-cyber-pink transition-colors">Politique de Confidentialité</a>': 'href="politique_confidentialité.html" class="hover:text-cyber-pink transition-colors">Politique de Confidentialité</a>',
    'href="#" class="hover:text-cyber-pink transition-colors">Cookies</a>': 'href="cookies.html" class="hover:text-cyber-pink transition-colors">Cookies</a>',
    'href="#" class="hover:text-cyber-pink transition-colors">CGU</a>': 'href="CGU.html" class="hover:text-cyber-pink transition-colors">CGU</a>',
    'href="#" class="hover:text-cyber-pink transition-colors">Équipe</a>': 'href="equipe.html" class="hover:text-cyber-pink transition-colors">Équipe</a>',
    'href="#" class="hover:text-cyber-pink transition-colors">Contact</a>': 'href="contact.html" class="hover:text-cyber-pink transition-colors">Contact</a>',
    'href="#" class="hover:text-cyber-pink transition-colors">Manifeste</a>': 'href="manifeste.html" class="hover:text-cyber-pink transition-colors">Manifeste</a>'
}

for file_path in html_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    new_content = content
    for old_str, new_str in replacements.items():
        new_content = new_content.replace(old_str, new_str)
    
    if new_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated links in {os.path.basename(file_path)}")

print("Done fixing links.")
