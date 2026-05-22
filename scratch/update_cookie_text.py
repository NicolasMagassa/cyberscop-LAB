import os
import glob
import re

workspace_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"
html_files = glob.glob(os.path.join(workspace_dir, "*.html"))

target_p_modal1 = r"Nous utilisons des cookies pour assurer le bon fonctionnement de notre site et pour personnaliser votre exp\u00e9rience\."
target_h4_modal2 = r"D\u00e9cidez comment nos partenaires utilisent vos donn\u00e9es"
target_p_modal2 = r"Choisissez comment les services tiers peuvent collecter et utiliser vos donn\u00e9es\.\.\."

replacement_text = "Les seules catégories de cookies utilisées sur ce blog sont les cookies strictement nécessaires au fonctionnement du site. Aucun cookie d'analyse, de publicité ou de suivi tiers n'est utilisé pour le moment."

for file_path in html_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # 1. Replace the paragraph in the small cookie banner
    # Look for the exact string, handling potential encoding issues manually by literal matching
    content = content.replace("Nous utilisons des cookies pour assurer le bon fonctionnement de notre site et pour personnaliser votre expérience.", replacement_text)
    
    # 2. Replace the detailed modal title
    content = content.replace("Décidez comment nos partenaires utilisent vos données", "Informations sur les cookies")
    
    # 3. Replace the detailed modal description
    content = content.replace("Choisissez comment les services tiers peuvent collecter et utiliser vos données...", replacement_text)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
        
    print(f"Updated texts in {os.path.basename(file_path)}")

print("Done updating cookie modal text.")
