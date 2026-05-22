import os
import re

file_path = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB\cookies.html"

new_main_content = """<main class="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        <div class="bg-white dark:bg-cyber-panel shadow-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-8 md:p-12">
            
            <!-- En-tête -->
            <div class="border-b border-gray-200 dark:border-gray-700 pb-6 mb-8">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Cookies : Gestion de vos préférences</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">Dernière mise à jour : 21 Mai 2026</p>
            </div>

            <!-- Introduction -->
            <section class="mb-8">
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300">
                    <strong>CYBERSCOP LAB</strong> utilise des cookies et autres traceurs pour assurer le bon fonctionnement du site et améliorer votre expérience de navigation, tout en respectant vos choix de confidentialité.
                </p>
                <p class="leading-relaxed text-gray-700 dark:text-gray-300 text-sm italic text-gray-500 dark:text-gray-400">
                    Lorsque vous visitez ce blog, une modale de consentement s'affiche dès que vous commencez à faire défiler la page. Elle vous permet d'accepter, de refuser ou de gérer les cookies directement depuis votre navigateur.
                </p>
            </section>

            <!-- 1. À quoi servent les cookies sur ce blog ? -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">1. À quoi servent les cookies sur ce blog ?</h2>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Les cookies utilisés sur CYBERSCOP LAB ont différentes finalités :
                </p>
                <ul class="list-disc pl-6 space-y-4 text-gray-700 dark:text-gray-300 text-sm">
                    <li>
                        <strong>Cookies strictement nécessaires</strong><br>
                        Ces cookies sont indispensables au bon fonctionnement technique du site (par exemple : mémorisation de votre choix de consentement, navigation de base, etc.).<br>
                        Ils sont activés automatiquement et ne peuvent pas être refusés sans empêcher l'utilisation normale du blog.
                    </li>
                    <li>
                        <strong>Cookies de fonctionnalité</strong><br>
                        Ils permettent de retenir certaines de vos préférences (par exemple éviter de ressaisir votre nom lors d'un prochain commentaire).<br>
                        Leur utilisation peut être acceptée ou refusée dans la modale de gestion.
                    </li>
                    <li>
                        <strong>Cookies d'analyse (le cas échéant)</strong><br>
                        Si des outils d'analyse internes sont utilisés à l'avenir, ils enregistreront de manière anonyme ou pseudo‑anonyme vos données de navigation (type de navigateur, pays de connexion, pages consultées, etc.) afin d'améliorer le contenu et l'expérience du blog.<br>
                        Leur activation repose sur votre consentement explicite et peut être modifiée à tout moment.<br>
                        Aucune donnée nominative n'est collectée par ces cookies sans votre accord préalable.
                    </li>
                </ul>
            </section>

            <!-- 2. Consentement et gestion des cookies -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">2. Consentement et gestion des cookies</h2>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Lors de votre première visite, une modale de consentement apparaît en bas de page dès que vous faites défiler le site, si aucun choix n'a encore été enregistré dans votre navigateur.<br>
                    Cette modale vous propose trois options :
                </p>
                <ul class="list-disc pl-6 space-y-3 mb-4 text-gray-700 dark:text-gray-300 text-sm">
                    <li>
                        <strong>Accepter Tout :</strong><br>
                        Enregistre votre accord pour tous les types de cookies autorisés sur le site et ferme la fenêtre.
                    </li>
                    <li>
                        <strong>Refuser Tout :</strong><br>
                        Enregistre le refus des cookies non‑strictement nécessaires et ferme la fenêtre.
                    </li>
                    <li>
                        <strong>Gérer :</strong><br>
                        Ouvre une modale détaillée directement sur la même page, où vous pouvez cocher ou décocher chaque catégorie de cookies (par exemple “Strictement nécessaires”, “Fonctionnels”, “Analytiques”, etc.).
                    </li>
                </ul>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    Vos choix sont conservés dans la mémoire de votre navigateur (localStorage) pour une durée maximale de 6 mois, conformément aux recommandations de référence en matière de cookies.
                </p>
                <p class="leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Vous pouvez revenir à cette gestion à tout moment en :
                </p>
                <ul class="list-disc pl-6 space-y-1 mt-2 text-gray-700 dark:text-gray-300 text-sm">
                    <li>soit rechargeant la page (si vous avez encore la modale de bannière active),</li>
                    <li>soit en utilisant le bouton “cookies” situé en bas de page, qui ouvre à nouveau la modale détaillée.</li>
                </ul>
            </section>

            <!-- 3. Durée de conservation des cookies de consentement -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">3. Durée de conservation des cookies de consentement</h2>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Les cookies de consentement sont conservés :
                </p>
                <ul class="list-disc pl-6 space-y-2 mb-3 text-gray-700 dark:text-gray-300 text-sm">
                    <li>dans la mémoire locale de votre navigateur (localStorage),</li>
                    <li>pour une durée maximale de 6 mois, au bout de laquelle vous pourrez être à nouveau invité à choisir vos préférences si vous revenez sur le site.</li>
                </ul>
                <p class="leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Cette durée est conforme aux recommandations de référence en matière de consentement aux cookies.
                </p>
            </section>

            <!-- 4. Vos droits RGPD -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">4. Vos droits RGPD</h2>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Conformément au Règlement Général sur la Protection des Données (RGPD), vous avez le droit de :
                </p>
                <ul class="list-disc pl-6 space-y-2 mb-4 text-gray-700 dark:text-gray-300 text-sm">
                    <li>retirer votre consentement pour les cookies ou tout autre traitement fondé sur le consentement,</li>
                    <li>modifier vos préférences de cookies à tout moment via la modale détaillée,</li>
                    <li>exercer vos autres droits (accès, rectification, suppression, etc.) en vous adressant à l'adresse suivante : <a href="mailto:monblog@gmail.com" class="text-cyber-blue hover:underline">monblog@gmail.com</a></li>
                </ul>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Vous pouvez également introduire une réclamation auprès de l'autorité de contrôle compétente (en France, la CNIL) si vous estimez que vos droits ne sont pas respectés.
                </p>
                <p class="leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Plus d'informations sur : <a href="https://www.cnil.fr" class="text-cyber-blue hover:underline" target="_blank" rel="noopener noreferrer">https://www.cnil.fr</a>.
                </p>
            </section>
            
            <!-- 5. Contact pour vos questions sur les cookies -->
            <section class="mb-0">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">5. Contact pour vos questions sur les cookies</h2>
                <p class="mb-4 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Pour toute question concernant l'utilisation des cookies sur CYBERSCOP LAB ou pour assistance dans la gestion de vos préférences, vous pouvez me contacter à l'adresse :
                </p>
                <div class="flex items-center text-gray-700 dark:text-gray-300">
                    <svg class="w-5 h-5 mr-3 text-cyber-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span>Par email : <a href="mailto:monblog@gmail.com" class="text-cyber-blue hover:underline font-medium">monblog@gmail.com</a></span>
                </div>
            </section>

        </div>
    </main>"""

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace <main> block
main_pattern = re.compile(r"<main.*?</main>", re.DOTALL)
content = main_pattern.sub(new_main_content, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated cookies.html with new text.")
