import os

workspace_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"
file_path = os.path.join(workspace_dir, "qui_suis_je.html")

with open(file_path, "r", encoding="utf-8") as f:
    html_content = f.read()

start_main = html_content.find('<main class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">')
end_main = html_content.find('</main>', start_main) + len('</main>')

new_main_content = """<main class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div class="mb-10">
            <h1 class="text-4xl font-orbitron font-bold text-cyber-green mb-4 flex items-center">
                <i data-lucide="user" class="mr-3 w-8 h-8"></i> Qui suis-je ?
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
                Le blog <span class="text-cyber-blue font-bold">CYBERSCOPE LAB</span> est un projet porté par une seule personne.
                C'est un blog personnel utilisé comme outil de travail et de développement de compétences en cybersécurité, audit, et gouvernance.
                Il n’est pas (pour le moment) un support commercial ni une entreprise.
            </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Content -->
            <div class="lg:col-span-2 space-y-8">
                <!-- Grace Hopper -->
                <section class="bg-white dark:bg-cyber-panel border border-gray-200 dark:border-gray-800 rounded-md p-6 sm:p-8 shadow-sm relative overflow-hidden group hover:border-cyber-green transition-colors duration-500">
                    <div class="absolute top-0 left-0 w-1 h-full bg-cyber-green opacity-80"></div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-orbitron">Grace Hopper</h2>
                    <div class="text-gray-600 dark:text-gray-300 space-y-4">
                        <p>Grace Hopper est le créateur·trice du blog, responsable de :</p>
                        <ul class="list-disc pl-5 space-y-2 text-sm font-mono text-gray-700 dark:text-gray-400">
                            <li>la rédaction des articles,</li>
                            <li>la mise en œuvre des bonnes pratiques de cybersécurité sur le site,</li>
                            <li>la gestion technique et la sécurité des données publiques.</li>
                        </ul>
                        <p>Je travaille dans le secteur privé en France, où j’applique des compétences en cybersécurité, analyse de risques et gestion des systèmes d’information.</p>
                        <p>CYBERSCOPE LAB me permet de consolider mes compétences, de les documenter de manière structurée et de les partager de façon pédagogique. Je tiens compte également des avis en commentaires pour améliorer la présentation des techniques et/ou partager d’autres angles de vue pour améliorer et/ou enrichir le contenu.</p>
                    </div>
                </section>

                <!-- Pourquoi un blog -->
                <section class="bg-white dark:bg-cyber-panel border border-gray-200 dark:border-gray-800 rounded-md p-6 sm:p-8 shadow-sm relative overflow-hidden group hover:border-cyber-blue transition-colors duration-500">
                    <div class="absolute top-0 left-0 w-1 h-full bg-cyber-blue opacity-80"></div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-orbitron">Pourquoi un blog comme outil de travail ?</h2>
                    <p class="text-gray-600 dark:text-gray-300 mb-4">Ce blog a deux objectifs :</p>
                    
                    <div class="space-y-6">
                        <div>
                            <h3 class="text-lg font-bold text-cyber-blue mb-2 flex items-center">
                                <i data-lucide="terminal" class="w-5 h-5 mr-2"></i> Fonction d’outil de travail
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300 text-sm">
                                Il sert de laboratoire réel pour tester des bonnes pratiques, documenter des méthodologies et structurer un portfolio de compétences en cybersécurité.
                            </p>
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-cyber-pink mb-2 flex items-center">
                                <i data-lucide="presentation" class="w-5 h-5 mr-2"></i> Fonction de démonstration
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300 text-sm">
                                Il permet de montrer aux recruteurs, partenaires et clients potentiels une vision vivante de mes compétences, sans rentrer dans les détails sensibles liés à mon activité professionnelle actuelle. Ainsi toute donnée inscrite dans un cadre méthodologique est fictive et ne sert que d’exemple d’application dans des contextes précis.
                            </p>
                        </div>
                    </div>
                </section>

                <!-- Engagement et transparence -->
                <section class="bg-white dark:bg-cyber-panel border border-gray-200 dark:border-gray-800 rounded-md p-6 sm:p-8 shadow-sm relative overflow-hidden group hover:border-[#FFB000] transition-colors duration-500">
                    <div class="absolute top-0 left-0 w-1 h-full bg-[#FFB000] opacity-80"></div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-orbitron">Engagement et transparence</h2>
                    <p class="text-gray-600 dark:text-gray-300 mb-4">
                        Même si CYBERSCOPE LAB est un site personnel, je m’efforce de respecter les meilleures pratiques en matière de :
                    </p>
                    <ul class="list-disc pl-5 space-y-2 text-sm font-mono text-gray-700 dark:text-gray-400 mb-6">
                        <li>RGPD et protection des données (voir la page Politique de confidentialité et Cookies),</li>
                        <li>Sécurité des systèmes,</li>
                        <li>Qualité et précision des informations publiées,</li>
                        <li>Sécurité applicative.</li>
                    </ul>
                </section>
            </div>

            <!-- Sidebar Contact -->
            <div class="lg:col-span-1">
                <div class="bg-gray-100 dark:bg-cyber-panel border border-gray-200 dark:border-gray-800 rounded-md p-6 shadow-sm sticky top-28 group hover:border-cyber-green transition-colors duration-500">
                    <div class="w-16 h-16 bg-cyber-green/10 rounded-full flex items-center justify-center mb-6 border border-cyber-green/30">
                        <i data-lucide="mail" class="w-8 h-8 text-cyber-green"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        Si vous souhaitez discuter de collaboration, de recrutement ou de contenu, vous pouvez me contacter à l’adresse suivante :
                    </p>
                    <a href="mailto:monblog@gmail.com" class="inline-flex items-center space-x-2 text-cyber-blue hover:text-white hover:bg-cyber-blue border border-cyber-blue px-4 py-2 rounded transition-all font-mono text-sm w-full justify-center">
                        <i data-lucide="send" class="w-4 h-4 mr-2"></i>
                        <span>monblog@gmail.com</span>
                    </a>
                    
                    <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                        <a href="contact.html" class="text-sm text-gray-500 hover:text-cyber-pink transition-colors flex items-center justify-center">
                            <i data-lucide="arrow-right" class="w-4 h-4 mr-2"></i> Formulaire de contact
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </main>"""

html_content = html_content[:start_main] + new_main_content + html_content[end_main:]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print("qui_suis_je.html has been successfully populated with the content.")
