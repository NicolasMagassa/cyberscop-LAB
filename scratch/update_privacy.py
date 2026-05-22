import os
import re

file_path = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB\politique_confidentialite.html"

new_main_content = """<main class="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        <div class="bg-white dark:bg-cyber-panel shadow-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-8 md:p-12">
            
            <!-- En-tête -->
            <div class="border-b border-gray-200 dark:border-gray-700 pb-6 mb-8">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Politique de Confidentialité</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">Dernière mise à jour : 21 Mai 2026</p>
            </div>

            <!-- Introduction -->
            <section class="mb-8">
                <p class="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                    Bienvenue sur <strong>CYBERSCOP LAB</strong> (accessible depuis l'adresse <a href="https://formation.bloginfluent.fr/vivre-de-son-blog" class="text-cyber-blue hover:underline">https://formation.bloginfluent.fr/vivre-de-son-blog</a>). 
                    Le respect de votre vie privée est une priorité absolue. Cette politique de confidentialité explique de manière transparente quelles données personnelles sont collectées lors de votre visite, pourquoi elles le sont, comment elles sont protégées et quels droits vous avez sur ces données.
                </p>
                <p class="leading-relaxed text-gray-700 dark:text-gray-300 text-sm text-gray-500 dark:text-gray-400 italic">
                    En naviguant sur ce blog, vous acceptez les pratiques décrites dans cette politique.
                </p>
            </section>

            <!-- 1. Responsable de traitement -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">1. Responsable de traitement</h2>
                <div class="space-y-3 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    <p>
                        Le responsable de traitement est Grace Hopper, éditrice personnelle du blog CYBERSCOP LAB.
                    </p>
                    <p>
                        Pour toute question ou exercice de vos droits, vous pouvez me contacter à l'adresse suivante :<br>
                        📧 <a href="mailto:monblog@gmail.com" class="text-cyber-blue hover:underline">monblog@gmail.com</a>
                    </p>
                </div>
            </section>

            <!-- 2. Données collectées -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">2. Données collectées</h2>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300">
                    Ce blog est conçu pour collecter le strict minimum d'informations nécessaires :
                </p>
                <ul class="list-disc pl-6 space-y-4 text-gray-700 dark:text-gray-300 text-sm">
                    <li>
                        <strong>Commentaires :</strong><br>
                        Lorsque vous laissez un commentaire sous un article, les données inscrites dans le formulaire (pseudonyme / nom, adresse e‑mail), ainsi que votre adresse IP et l'agent utilisateur de votre navigateur sont collectés afin de détecter et limiter les commentaires indésirables (spam).<br>
                        Vos adresses e‑mail ne sont jamais publiées ni vendues.
                    </li>
                    <li>
                        <strong>Formulaire de contact :</strong><br>
                        Si vous utilisez le formulaire de contact, seule votre adresse e‑mail (et éventuellement votre prénom / pseudo) est conservée. Cette donnée est utilisée uniquement pour vous répondre.<br>
                        Pour l'instant, aucune newsletter n'est mise en place ; cette fonctionnalité pourra être ajoutée ultérieurement, auquel cas une mention explicite sera ajoutée dans cette politique.
                    </li>
                    <li>
                        <strong>Données de navigation (Cookies) :</strong><br>
                        Ce blog utilise des cookies et autres traceurs pour assurer le bon fonctionnement technique et propositionnel du site (par exemple pour retenir vos préférences ou votre consentement).<br>
                        Aucun outil de statistiques externe (comme Google Analytics) n'est pour le moment utilisé. Les données de navigation sont collectées au minimum et de manière fonctionnelle, sans tracking publicitaire ni analyse poussée.
                    </li>
                </ul>
            </section>

            <!-- 3. Finalités du traitement -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">3. Finalités du traitement</h2>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300">
                    Les données collectées sont utilisées uniquement pour :
                </p>
                <ul class="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                    <li>Publier et gérer vos commentaires sous les articles.</li>
                    <li>Vous répondre si vous utilisez le formulaire de contact.</li>
                    <li>Assurer le bon fonctionnement du site (par exemple mémorisation de vos préférences ou de votre consentement aux cookies).</li>
                </ul>
                <p class="mt-3 leading-relaxed text-gray-700 dark:text-gray-300 font-medium">
                    Aucune revente, échange ou partage de vos données personnelles avec des tiers n'est effectué, sauf si cela est strictement nécessaire pour le bon fonctionnement technique (sous‑traitants, voir section 6).
                </p>
            </section>

            <!-- 4. Cookies et gestion du consentement -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">4. Cookies et gestion du consentement</h2>
                <p class="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                    Un cookie est un petit fichier texte déposé sur votre navigateur lors de votre visite.<br>
                    Sur ce blog, les cookies peuvent :
                </p>
                <ul class="list-disc pl-6 space-y-2 mb-4 text-gray-700 dark:text-gray-300 text-sm">
                    <li>Assurer le bon fonctionnement de certaines fonctionnalités techniques.</li>
                    <li>Mémoriser vos préférences (par exemple éviter de ressaisir votre nom lors d'un prochain commentaire).</li>
                </ul>
                
                <h3 class="font-semibold text-gray-900 dark:text-white mt-4 mb-2">Consentement et modale</h3>
                <ul class="list-disc pl-6 space-y-2 mb-4 text-gray-700 dark:text-gray-300 text-sm">
                    <li>Une modale de consentement cookies apparaît dès que vous faites défiler la page.</li>
                    <li>Cette modale vous permet d'accepter ou de refuser certains types de cookies par finalité.</li>
                    <li>Vous pourrez également accéder à une page du blog dédiée à la gestion des cookies, où vous pourrez modifier ou retirer vos choix à tout moment.</li>
                </ul>

                <h3 class="font-semibold text-gray-900 dark:text-white mt-4 mb-2">Droit de refuser / supprimer</h3>
                <ul class="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                    <li>Vous pouvez configurer votre navigateur (Chrome, Firefox, Safari, Edge, etc.) pour refuser ou supprimer les cookies.</li>
                    <li>Ces paramétrages ne perturbent pas votre lecture sur le blog, mais peuvent limiter certaines fonctionnalités (par exemple le souvenir automatique de votre pseudonyme).</li>
                </ul>
            </section>

            <!-- 5. Durée de conservation des données -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">5. Durée de conservation des données</h2>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300">
                    Les données sont conservées uniquement aussi longtemps que nécessaire :
                </p>
                <ul class="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                    <li>Les données liées aux commentaires (nom/pseudo, e‑mail, IP) sont conservées tant que l'article est en ligne, sauf demande expresse de suppression.</li>
                    <li>Les cookies de consentement sont enregistrés le temps de votre navigation et, si vous êtes revenu, pendant une durée cohérente (généralement jusqu'à 6 mois), conformément aux recommandations de référence en matière de cookies.</li>
                    <li>Les données recueillies via le formulaire de contact (email) sont conservées aussi longtemps que nécessaire pour répondre à votre demande, puis supprimées dans un délai raisonnable.</li>
                </ul>
            </section>

            <!-- 6. Sous-traitants -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">6. Sous-traitants</h2>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300">
                    Certaines données sont traitées par des sous-traitants pour des raisons techniques, notamment :
                </p>
                <ul class="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                    <li><strong>Hébergeur :</strong> Hostinger (serveurs situés à 61 Lordou Vironos Street, 6023 Larnaca, Chypre).</li>
                </ul>
                <p class="mt-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Ces sous-traitants agissent uniquement selon mes instructions et respectent les obligations de confidentialité et de sécurité prévues par le RGPD.
                </p>
            </section>

            <!-- 7. Vos droits RGPD -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">7. Vos droits RGPD</h2>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300">
                    Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants sur vos données personnelles :
                </p>
                <ul class="list-disc pl-6 space-y-2 mb-4 text-gray-700 dark:text-gray-300 text-sm">
                    <li>Droit d'accès.</li>
                    <li>Droit de rectification.</li>
                    <li>Droit de suppression (sous réserve de certaines obligations légales).</li>
                    <li>Droit de limitation du traitement.</li>
                    <li>Droit d'opposition au traitement, y compris pour des fins de prospection ou de mesure d'audience.</li>
                    <li>Droit à la portabilité des données (dans la mesure où cela est techniquement possible et prévu par le RGPD).</li>
                </ul>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Vous disposez également du droit de retirer votre consentement pour les cookies ou tout autre traitement fondé sur le consentement, à tout moment, sans porter atteinte à la licéité du traitement effectué sur la base de ce consentement antérieur.
                </p>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    Vous pouvez aussi introduire une réclamation auprès de l'autorité de contrôle compétente (en France, la CNIL) si vous estimez que vos droits ne sont pas respectés. Les informations pratiques sont accessibles sur le site officiel de la CNIL : <a href="https://www.cnil.fr" class="text-cyber-blue hover:underline">https://www.cnil.fr</a>.
                </p>
                <p class="leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Pour exercer l'un de ces droits, il vous suffit de me contacter par email à : <br>
                    📧 <a href="mailto:monblog@gmail.com" class="text-cyber-blue hover:underline">monblog@gmail.com</a><br><br>
                    Je m'engage à traiter votre demande dans les meilleurs délais, dans les limites prévues par la réglementation.
                </p>
            </section>

            <!-- 8. Sécurité des données -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">8. Sécurité des données</h2>
                <p class="leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Les données collectées sont stockées sur des serveurs sécurisés et accessibles uniquement aux personnes strictement nécessaires au fonctionnement du blog.<br>
                    Des mesures techniques et organisationnelles appropriées sont mises en place pour protéger vos données contre tout accès, modification, destruction ou divulgation non autorisée.
                </p>
            </section>

            <!-- 9. Modifications de cette Politique -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">9. Modifications de cette Politique</h2>
                <p class="leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Cette politique de confidentialité peut être mise à jour à tout moment si des changements surviennent dans la façon dont les données sont collectées ou utilisées.<br>
                    Toute nouvelle version sera publiée sur cette page avec la date de mise à jour indiquée en haut.
                </p>
            </section>

            <!-- 10. Contact pour questions ou droits -->
            <section class="mb-0">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">10. Contact pour questions ou droits</h2>
                <p class="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                    Pour toute question relative à cette politique de confidentialité, à la gestion de vos cookies ou pour exercer vos droits, vous pouvez me contacter par email à :
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

print("Updated politique_confidentialite.html with new text.")
