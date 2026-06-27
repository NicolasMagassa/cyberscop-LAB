import os

workspace_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"
veille_path = os.path.join(workspace_dir, "veille.html")
target_path = os.path.join(workspace_dir, "ia.html")

with open(veille_path, "r", encoding="utf-8") as f:
    html = f.read()

# 1. Title
html = html.replace("<title>Veille Cyber | CyberScope Lab</title>", "<title>Sécurité de l'IA | CyberScope Lab</title>")

# 2. Desktop Navigation active state
veille_desktop_active = '<a href="veille.html" class="text-cyber-blue dark:text-cyber-neonBlue font-extrabold border-b-2 border-cyber-blue dark:border-cyber-neonBlue transition-colors">/VEILLE</a>'
veille_desktop_inactive = '<a href="veille.html" class="text-gray-600 dark:text-gray-400 hover:text-cyber-blue dark:hover:text-cyber-neonBlue transition-colors">/VEILLE</a>'

ia_desktop_inactive = '<a href="ia.html" class="text-gray-600 dark:text-gray-400 hover:text-cyber-blue dark:hover:text-cyber-neonBlue transition-colors">/IA</a>'
ia_desktop_active = '<a href="ia.html" class="text-cyber-blue dark:text-cyber-neonBlue font-extrabold border-b-2 border-cyber-blue dark:border-cyber-neonBlue transition-colors">/IA</a>'

html = html.replace(veille_desktop_active, veille_desktop_inactive)
html = html.replace(ia_desktop_inactive, ia_desktop_active)

# 3. Mobile Navigation active state
veille_mobile_active = '<a href="veille.html" class="text-cyber-blue dark:text-cyber-neonBlue block px-3 py-2 text-base font-extrabold">/VEILLE</a>'
veille_mobile_inactive = '<a href="veille.html" class="text-gray-600 dark:text-gray-300 hover:text-cyber-blue block px-3 py-2 text-base font-medium">/VEILLE</a>'

ia_mobile_inactive = '<a href="ia.html" class="text-gray-600 dark:text-gray-300 hover:text-cyber-blue block px-3 py-2 text-base font-medium">/IA</a>'
ia_mobile_active = '<a href="ia.html" class="text-cyber-blue dark:text-cyber-neonBlue block px-3 py-2 text-base font-extrabold">/IA</a>'

html = html.replace(veille_mobile_active, veille_mobile_inactive)
html = html.replace(ia_mobile_inactive, ia_mobile_active)

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
                <i data-lucide="brain-circuit" class="w-8 h-8 mr-3 text-cyber-purple animate-pulse"></i>
                /SÉCURITÉ <span class="text-cyber-purple">DE L'IA</span>
            </h1>
            <p class="text-gray-500 dark:text-gray-400 mt-2 font-mono text-sm leading-relaxed">
                > Recherches sur la sécurité de l'IA, l'audit des grands modèles de langage (LLM) et la défense contre les attaques adverses.
            </p>
        </div>"""

html = html.replace(old_header, new_header)

# 5. Loader
html = html.replace('id="veille-loader"', 'id="ia-loader"')
html = html.replace('border-cyber-pink', 'border-cyber-purple')
html = html.replace('> RÉCUPÉRATION DES FLUX DE VEILLE...', '> RÉCUPÉRATION DU FLUX IA SÉCURITÉ...')

# 6. Container
html = html.replace('id="veille-articles-list"', 'id="ia-articles-list"')

# 7. Script tag
html = html.replace('<script src="assets/JS/veille.js"></script>', '<script src="assets/JS/ia.js"></script>')

with open(target_path, "w", encoding="utf-8") as f:
    f.write(html)

print("Created ia.html successfully.")
