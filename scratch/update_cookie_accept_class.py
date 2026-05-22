import os
import glob

workspace_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"
html_files = glob.glob(os.path.join(workspace_dir, "*.html"))

for file_path in html_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # 1. Update the button calling acceptCookies() in the small banner
    old_btn1 = r'<button onclick="acceptCookies()" class="flex-1 text-center py-2 bg-cyber-darkerBlue text-white font-bold hover:bg-cyber-red hover:text-white transition-colors rounded-r-lg">'
    new_btn1 = r'<button onclick="acceptCookies()" class="cookie-accept-all flex-1 text-center py-2 bg-cyber-darkerBlue text-white font-bold hover:bg-cyber-red hover:text-white transition-colors rounded-r-lg">'
    if old_btn1 in content:
        content = content.replace(old_btn1, new_btn1)
        
    # 2. Update the button calling savePreferencesAndClose() in the large modal
    old_btn2 = r'<button onclick="savePreferencesAndClose()" class="px-4 py-2 bg-cyber-darkerBlue text-white font-bold hover:bg-cyber-red hover:text-white transition-colors rounded-lg text-sm uppercase">Accepter et Sauvegarder</button>'
    new_btn2 = r'<button onclick="savePreferencesAndClose()" class="cookie-accept-all px-4 py-2 bg-cyber-darkerBlue text-white font-bold hover:bg-cyber-red hover:text-white transition-colors rounded-lg text-sm uppercase">Accepter et Sauvegarder</button>'
    if old_btn2 in content:
        content = content.replace(old_btn2, new_btn2)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    
    print(f"Updated {os.path.basename(file_path)}")

print("Done updating the HTML classes for accept buttons.")
