import os
import glob
import re

workspace_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"

# 1. Update main.js
js_path = os.path.join(workspace_dir, "assets", "js", "main.js")
with open(js_path, "r", encoding="utf-8") as f:
    js_content = f.read()

# Update setCookieConsent to handle JSON preferences
cookie_logic_old = """
function setCookieConsent(value) {
    // 6 months in seconds
    const maxAge = 6 * 30 * 24 * 60 * 60;
    document.cookie = `cyberScopeCookieConsent=${value}; max-age=${maxAge}; path=/; Secure; SameSite=Strict`;
}
"""

cookie_logic_new = """
function setCookieConsent(value, prefsObj) {
    // 6 months in seconds
    const maxAge = 6 * 30 * 24 * 60 * 60;
    document.cookie = `cyberScopeCookieConsent=${value}; max-age=${maxAge}; path=/; Secure; SameSite=Strict`;
    
    if (prefsObj) {
        const prefsStr = encodeURIComponent(JSON.stringify(prefsObj));
        document.cookie = `cyberScopeCookiePrefs=${prefsStr}; max-age=${maxAge}; path=/; Secure; SameSite=Strict`;
    }
}
"""
if cookie_logic_old.strip() in js_content:
    js_content = js_content.replace(cookie_logic_old.strip(), cookie_logic_new.strip())

js_content = js_content.replace("setCookieConsent('accepted');", "setCookieConsent('accepted', { necessary: true, functional: true, analytics: true });")
js_content = js_content.replace("setCookieConsent('refused');", "setCookieConsent('refused', { necessary: true, functional: false, analytics: false });")

# Replace savePreferencesAndClose with saveSpecificPreferences
js_content = js_content.replace(
    "function savePreferencesAndClose() {\n    setCookieConsent('accepted', { necessary: true, functional: true, analytics: true });\n    closePreferencesModal();\n}",
    "function saveSpecificPreferences() {\n    const functional = document.getElementById('cookie-functional') ? document.getElementById('cookie-functional').checked : false;\n    const analytics = document.getElementById('cookie-analytics') ? document.getElementById('cookie-analytics').checked : false;\n    setCookieConsent('custom', { necessary: true, functional: functional, analytics: analytics });\n    closePreferencesModal();\n}"
)
js_content = js_content.replace(
    "function savePreferencesAndClose() {\n    setCookieConsent('accepted');\n    closePreferencesModal();\n}",
    "function saveSpecificPreferences() {\n    const functional = document.getElementById('cookie-functional') ? document.getElementById('cookie-functional').checked : false;\n    const analytics = document.getElementById('cookie-analytics') ? document.getElementById('cookie-analytics').checked : false;\n    setCookieConsent('custom', { necessary: true, functional: functional, analytics: analytics });\n    closePreferencesModal();\n}"
)

# If it still didn't replace because I had already modified it to have the object, let's just do a regex replace
js_content = re.sub(
    r"function savePreferencesAndClose\(\) \{.*?\n\}",
    "function saveSpecificPreferences() {\n    const functional = document.getElementById('cookie-functional') ? document.getElementById('cookie-functional').checked : false;\n    const analytics = document.getElementById('cookie-analytics') ? document.getElementById('cookie-analytics').checked : false;\n    setCookieConsent('custom', { necessary: true, functional: functional, analytics: analytics });\n    closePreferencesModal();\n}",
    js_content,
    flags=re.DOTALL
)

with open(js_path, "w", encoding="utf-8") as f:
    f.write(js_content)
print("Updated main.js")

# 2. Update HTML files
html_files = glob.glob(os.path.join(workspace_dir, "*.html"))

new_checkboxes_html = """
                <div class="border border-gray-200 p-4 rounded-md bg-gray-50/50 mt-4">
                    <h4 class="text-lg font-bold text-gray-900 mb-2 flex items-center">
                        <i data-lucide="settings" class="w-5 h-5 mr-2 text-cyber-blue"></i> Cookies de fonctionnalité
                    </h4>
                    <p class="text-sm text-gray-600 mb-4">Permettent d'améliorer votre confort de navigation et de mémoriser vos choix.</p>
                    <div class="flex items-center justify-between py-3 border-t border-gray-200">
                        <div class="text-sm font-mono"><span class="font-bold">Préférences</span></div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="cookie-functional" class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyber-blue"></div>
                        </label>
                    </div>
                </div>

                <div class="border border-gray-200 p-4 rounded-md bg-gray-50/50 mt-4">
                    <h4 class="text-lg font-bold text-gray-900 mb-2 flex items-center">
                        <i data-lucide="bar-chart-2" class="w-5 h-5 mr-2 text-cyber-blue"></i> Cookies d'analyse
                    </h4>
                    <p class="text-sm text-gray-600 mb-4">Permettent de mesurer l'audience et d'améliorer les performances du site.</p>
                    <div class="flex items-center justify-between py-3 border-t border-gray-200">
                        <div class="text-sm font-mono"><span class="font-bold">Statistiques</span></div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="cookie-analytics" class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyber-blue"></div>
                        </label>
                    </div>
                </div>
"""

for file_path in html_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update Gérer button
    old_gerer = r'<button onclick="showPreferencesModal()" class="flex-1 text-center py-2 bg-cyber-darkerBlue text-white font-bold hover:bg-cyber-red hover:text-white transition-colors border-x border-gray-900/50 mx-1">'
    new_gerer = r'<button onclick="showPreferencesModal()" class="cookie-manage flex-1 text-center py-2 bg-cyber-darkerBlue text-white font-bold hover:bg-cyber-red hover:text-white transition-colors border-x border-gray-900/50 mx-1">'
    content = content.replace(old_gerer, new_gerer)
    
    old_gerer2 = r'<button onclick="showPreferencesModal()" class="cookie-manage flex-1 text-center py-2 bg-cyber-darkerBlue text-white font-bold hover:bg-cyber-red hover:text-white transition-colors border-x border-gray-900/50 mx-1">Gérer</button>'
    new_gerer2 = r'<button onclick="showPreferencesModal()" class="cookie-manage flex-1 text-center py-2 bg-cyber-darkerBlue text-white font-bold hover:bg-cyber-red hover:text-white transition-colors border-x border-gray-900/50 mx-1">Gérer</button>'
    if '<button onclick="showPreferencesModal()" class="flex-1 text-center py-2 bg-cyber-darkerBlue text-white font-bold hover:bg-cyber-red hover:text-white transition-colors border-x border-gray-900/50 mx-1">\n                            Gérer\n                        </button>' in content:
        content = content.replace('<button onclick="showPreferencesModal()" class="flex-1 text-center py-2 bg-cyber-darkerBlue text-white font-bold hover:bg-cyber-red hover:text-white transition-colors border-x border-gray-900/50 mx-1">\n                            Gérer\n                        </button>', '<button onclick="showPreferencesModal()" class="cookie-manage flex-1 text-center py-2 bg-cyber-darkerBlue text-white font-bold hover:bg-cyber-red hover:text-white transition-colors border-x border-gray-900/50 mx-1">\n                            Gérer\n                        </button>')

    # 2. Update Save button
    old_save = r'<button onclick="savePreferencesAndClose()" class="cookie-accept-all px-4 py-2 bg-cyber-darkerBlue text-white font-bold hover:bg-cyber-red hover:text-white transition-colors rounded-lg text-sm uppercase">Accepter et Sauvegarder</button>'
    new_save = r'<button onclick="saveSpecificPreferences()" class="cookie-save px-4 py-2 bg-cyber-darkerBlue text-white font-bold hover:bg-cyber-red hover:text-white transition-colors rounded-lg text-sm uppercase">Enregistrer mes choix</button>'
    content = content.replace(old_save, new_save)
    
    # 3. Add checkboxes
    # We find the end of the strictly necessary block and insert our new blocks
    target_insert_point = r"""<i data-lucide="lock" class="w-3 h-3 ml-2 text-gray-400"></i>
                        </label>
                    </div>
                </div>"""
                
    if target_insert_point in content and "cookie-functional" not in content:
        content = content.replace(target_insert_point, target_insert_point + new_checkboxes_html)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Done updating HTML files with advanced cookie logic.")
