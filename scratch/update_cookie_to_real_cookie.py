import os
import glob

workspace_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"

# 1. Update main.js
js_path = os.path.join(workspace_dir, "assets", "js", "main.js")
with open(js_path, "r", encoding="utf-8") as f:
    js_content = f.read()

# JS replacements
cookie_logic = """
function getCookieConsent(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function setCookieConsent(value) {
    // 6 months in seconds
    const maxAge = 6 * 30 * 24 * 60 * 60;
    document.cookie = `cyberScopeCookieConsent=${value}; max-age=${maxAge}; path=/; Secure; SameSite=Strict`;
}

const hasConsent = getCookieConsent('cyberScopeCookieConsent');
"""

# Replace the hasConsent declaration
if "const hasConsent = localStorage.getItem('cyberScopeCookieConsent');" in js_content:
    js_content = js_content.replace(
        "const hasConsent = localStorage.getItem('cyberScopeCookieConsent');",
        cookie_logic.strip()
    )

# Replace acceptCookies
if "localStorage.setItem('cyberScopeCookieConsent', 'true');" in js_content:
    js_content = js_content.replace(
        "localStorage.setItem('cyberScopeCookieConsent', 'true');",
        "setCookieConsent('accepted');"
    )

# Replace declineCookies
if "localStorage.setItem('cyberScopeCookieConsent', 'false');" in js_content:
    js_content = js_content.replace(
        "localStorage.setItem('cyberScopeCookieConsent', 'false');",
        "setCookieConsent('refused');"
    )

with open(js_path, "w", encoding="utf-8") as f:
    f.write(js_content)
print("Updated main.js")

# 2. Update HTML files
html_files = glob.glob(os.path.join(workspace_dir, "*.html"))
for file_path in html_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Update first Refuser Tout button (in small banner)
    old_btn1 = r'<button onclick="declineCookies()" class="flex-1 text-center py-2 bg-cyber-darkerBlue text-white font-bold hover:bg-cyber-red hover:text-white transition-colors rounded-l-lg">'
    new_btn1 = r'<button onclick="declineCookies()" class="cookie-refuse-all flex-1 text-center py-2 bg-cyber-darkerBlue text-white font-bold hover:bg-cyber-red hover:text-white transition-colors rounded-l-lg">'
    
    if old_btn1 in content:
        content = content.replace(old_btn1, new_btn1)
        
    # Update second Refuser Tout button (in preferences modal)
    old_btn2 = r'<button onclick="declineCookiesAndClosePreferences()" class="px-4 py-2 bg-cyber-darkerBlue text-white font-bold hover:bg-cyber-red hover:text-white transition-colors rounded-lg text-sm uppercase">Refuser Tout</button>'
    new_btn2 = r'<button onclick="declineCookiesAndClosePreferences()" class="cookie-refuse-all px-4 py-2 bg-cyber-darkerBlue text-white font-bold hover:bg-cyber-red hover:text-white transition-colors rounded-lg text-sm uppercase">Refuser Tout</button>'
    
    if old_btn2 in content:
        content = content.replace(old_btn2, new_btn2)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Updated {os.path.basename(file_path)}")

print("Done updating cookie storage to real cookies.")
