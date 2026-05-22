import os
import glob
import re

workspace_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"

# 1. Update main.js
js_path = os.path.join(workspace_dir, "assets", "js", "main.js")
with open(js_path, "r", encoding="utf-8") as f:
    js_content = f.read()

# Add isBannerDismissed
if "const isBannerDismissed" not in js_content:
    js_content = js_content.replace(
        "const hasConsent = localStorage.getItem('cyberScopeCookieConsent');",
        "const hasConsent = localStorage.getItem('cyberScopeCookieConsent');\nconst isBannerDismissed = sessionStorage.getItem('cookieBannerDismissed');"
    )

# Add dismissCookieBanner
if "function dismissCookieBanner" not in js_content:
    js_content = js_content.replace(
        "function hideCookieModal() {",
        "function dismissCookieBanner() {\n    sessionStorage.setItem('cookieBannerDismissed', 'true');\n    hideCookieModal();\n}\n\nfunction hideCookieModal() {"
    )

# Update showCookieModal
if "!hasConsent && !isBannerDismissed && cookieModal" not in js_content:
    js_content = js_content.replace(
        "if (!hasConsent && cookieModal) {",
        "if (!hasConsent && !isBannerDismissed && cookieModal) {"
    )

# Update scroll listener condition
if "if (!hasConsent && !isBannerDismissed) {" not in js_content:
    js_content = js_content.replace(
        "if (!hasConsent) {",
        "if (!hasConsent && !isBannerDismissed) {"
    )

with open(js_path, "w", encoding="utf-8") as f:
    f.write(js_content)
print("Updated main.js")

# 2. Update HTML files
html_files = glob.glob(os.path.join(workspace_dir, "*.html"))
for file_path in html_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # We only want to replace the onclick for the close button inside the banner, not the "Refuser Tout" button.
    # The close button HTML is:
    # <button onclick="declineCookies()" class="absolute top-1 right-1 text-gray-500 hover:text-black transition-colors p-2 rounded-full">
    # Replace it with the new function and class
    
    old_btn = r'<button onclick="declineCookies()" class="absolute top-1 right-1 text-gray-500 hover:text-black transition-colors p-2 rounded-full">'
    new_btn = r'<button onclick="dismissCookieBanner()" class="cookie-banner-close absolute top-1 right-1 text-gray-500 hover:text-black transition-colors p-2 rounded-full">'
    
    if old_btn in content:
        content = content.replace(old_btn, new_btn)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {os.path.basename(file_path)}")

print("Done updating cookie close logic.")
