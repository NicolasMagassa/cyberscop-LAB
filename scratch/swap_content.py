import os
import re

base_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"
mentions_file = os.path.join(base_dir, "mentions_legales.html")
politique_file = os.path.join(base_dir, "politique_confidentialité.html")

with open(mentions_file, "r", encoding="utf-8") as f:
    mentions_content = f.read()

# Extract the <main> block from mentions_legales
main_pattern = re.compile(r"<main.*?</main>", re.DOTALL)
privacy_main_block_match = main_pattern.search(mentions_content)

if privacy_main_block_match:
    privacy_main_block = privacy_main_block_match.group(0)
    
    # 1. Update politique_confidentialité.html
    with open(politique_file, "r", encoding="utf-8") as f:
        politique_content = f.read()
    
    new_politique_content = main_pattern.sub(privacy_main_block, politique_content)
    with open(politique_file, "w", encoding="utf-8") as f:
        f.write(new_politique_content)
    print("Updated politique_confidentialité.html with the correct content.")
    
    # 2. Revert mentions_legales.html to empty placeholder
    empty_mentions_main = """<main class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 class="text-4xl font-orbitron font-bold text-cyber-green mb-8">Mentions Légales</h1>
        <div class="bg-white dark:bg-cyber-panel border border-gray-200 dark:border-gray-800 rounded-md p-8 shadow-sm">
            <p class="text-gray-600 dark:text-gray-400 font-mono text-lg">En attente de contenu pour les mentions légales...</p>
        </div>
    </main>"""
    
    new_mentions_content = main_pattern.sub(empty_mentions_main, mentions_content)
    with open(mentions_file, "w", encoding="utf-8") as f:
        f.write(new_mentions_content)
    print("Reverted mentions_legales.html to placeholder.")

else:
    print("Could not find <main> block in mentions_legales.html")
