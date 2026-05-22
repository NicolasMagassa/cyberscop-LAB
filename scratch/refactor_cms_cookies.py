import os

workspace_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"
js_path = os.path.join(workspace_dir, "assets", "js", "main.js")

with open(js_path, "r", encoding="utf-8") as f:
    js_content = f.read()

# Replace hardcoded cookie logic with CMS-ready config
old_cookie_logic = """
function getCookieConsent(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

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

new_cookie_logic = """
// Configuration globale pour les cookies (facilement surchargeable par un CMS)
window.AppCookieConfig = window.AppCookieConfig || {
    consentName: 'consent_state',
    prefsName: 'consent_prefs',
    maxAge: 6 * 30 * 24 * 60 * 60, // 6 mois
    path: '/',
    sameSite: 'Strict'
};

function getCookieConsent(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
}

function setCookieConsent(value, prefsObj) {
    const config = window.AppCookieConfig;
    const isSecure = window.location.protocol === 'https:' ? 'Secure;' : '';
    
    // Cookie d'état global
    document.cookie = `${config.consentName}=${value}; max-age=${config.maxAge}; path=${config.path}; ${isSecure} SameSite=${config.sameSite}`;
    
    // Cookie des préférences détaillées
    if (prefsObj) {
        const prefsStr = encodeURIComponent(JSON.stringify(prefsObj));
        document.cookie = `${config.prefsName}=${prefsStr}; max-age=${config.maxAge}; path=${config.path}; ${isSecure} SameSite=${config.sameSite}`;
    }
}
"""

if old_cookie_logic.strip() in js_content:
    js_content = js_content.replace(old_cookie_logic.strip(), new_cookie_logic.strip())

# Also update the hasConsent variable name from hardcoded 'cyberScopeCookieConsent' to AppCookieConfig
if "const hasConsent = getCookieConsent('cyberScopeCookieConsent');" in js_content:
    js_content = js_content.replace(
        "const hasConsent = getCookieConsent('cyberScopeCookieConsent');",
        "const hasConsent = getCookieConsent(window.AppCookieConfig.consentName);"
    )

with open(js_path, "w", encoding="utf-8") as f:
    f.write(js_content)

print("Updated main.js with CMS-ready cookie logic.")
