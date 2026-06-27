import os

workspace_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"
veille_path = os.path.join(workspace_dir, "veille.html")
target_path = os.path.join(workspace_dir, "grc.html")

with open(veille_path, "r", encoding="utf-8") as f:
    html = f.read()

# 1. Title
html = html.replace("<title>Veille Cyber | CyberScope Lab</title>", "<title>Gouvernance, Risques & Conformité (GRC) | CyberScope Lab</title>")

# 2. Desktop Navigation active state
veille_desktop_active = '<a href="veille.html" class="text-cyber-blue dark:text-cyber-neonBlue font-extrabold border-b-2 border-cyber-blue dark:border-cyber-neonBlue transition-colors">/VEILLE</a>'
veille_desktop_inactive = '<a href="veille.html" class="text-gray-600 dark:text-gray-400 hover:text-cyber-blue dark:hover:text-cyber-neonBlue transition-colors">/VEILLE</a>'

grc_desktop_inactive = '<a href="grc.html" class="text-gray-600 dark:text-gray-400 hover:text-cyber-blue dark:hover:text-cyber-neonBlue transition-colors">/GRC</a>'
grc_desktop_active = '<a href="grc.html" class="text-cyber-blue dark:text-cyber-neonBlue font-extrabold border-b-2 border-cyber-blue dark:border-cyber-neonBlue transition-colors">/GRC</a>'

html = html.replace(veille_desktop_active, veille_desktop_inactive)
html = html.replace(grc_desktop_inactive, grc_desktop_active)

# 3. Mobile Navigation active state
veille_mobile_active = '<a href="veille.html" class="text-cyber-blue dark:text-cyber-neonBlue block px-3 py-2 text-base font-extrabold">/VEILLE</a>'
veille_mobile_inactive = '<a href="veille.html" class="text-gray-600 dark:text-gray-300 hover:text-cyber-blue block px-3 py-2 text-base font-medium">/VEILLE</a>'

grc_mobile_inactive = '<a href="grc.html" class="text-gray-600 dark:text-gray-300 hover:text-cyber-blue block px-3 py-2 text-base font-medium">/GRC</a>'
grc_mobile_active = '<a href="grc.html" class="text-cyber-blue dark:text-cyber-neonBlue block px-3 py-2 text-base font-extrabold">/GRC</a>'

html = html.replace(veille_mobile_active, veille_mobile_inactive)
html = html.replace(grc_mobile_inactive, grc_mobile_active)

# 4. Page Header in <main>
old_header = """        <!-- Page Header -->
        <div class="border-b border-gray-200 dark:border-gray-800 pb-6 mb-10">
            <h1 class="text-4xl font-orbitron font-extrabold tracking-wider text-gray-900 dark:text-white uppercase flex items-center">
                <i data-lucide="rss" class="w-8 h-8 mr-3 text-cyber-pink animate-pulse"></i>
                /VEILLE <span class="text-cyber-pink">TECHNOLOGIQUE</span>
            </h1>
            <p class="text-gray-500 dark:text-gray-400 mt-2 font-mono text-sm leading-relaxed">
                > Flux en temps réel d'actualités technologiques, de rapports de menaces, d'analyses de failles et d'innovations de sécurité.
            </p>
        </div>"""

new_header = """        <!-- Page Header -->
        <div class="border-b border-gray-200 dark:border-gray-800 pb-6 mb-10">
            <h1 class="text-4xl font-orbitron font-extrabold tracking-wider text-gray-900 dark:text-white uppercase flex items-center">
                <i data-lucide="shield" class="w-8 h-8 mr-3 text-cyber-green animate-pulse"></i>
                /GOUVERNANCE <span class="text-cyber-green">RISQUES & CONFORMITÉ</span>
            </h1>
            <p class="text-gray-500 dark:text-gray-400 mt-2 font-mono text-sm leading-relaxed">
                > Politiques de sécurité, gestion des risques (EBIOS RM, ISO 27001) et audits de conformité réglementaire (RGPD).
            </p>
        </div>"""

html = html.replace(old_header, new_header)

# 5. Loader
html = html.replace('id="veille-loader"', 'id="grc-loader"')
html = html.replace('border-cyber-pink', 'border-cyber-green')
html = html.replace('> RÉCUPÉRATION DES FLUX DE VEILLE...', '> RÉCUPÉRATION DU FLUX GRC...')

# 6. Container
html = html.replace('id="veille-articles-list"', 'id="grc-articles-list"')

# 7. Script tag
html = html.replace('<script src="assets/JS/veille.js"></script>', '<script src="assets/JS/grc.js"></script>')

with open(target_path, "w", encoding="utf-8") as f:
    f.write(html)

print("Created grc.html successfully.")
