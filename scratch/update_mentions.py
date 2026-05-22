import os
import re

file_path = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB\mentions_legales.html"

new_main_content = """<main class="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        <div class="bg-white dark:bg-cyber-panel shadow-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-8 md:p-12">
            
            <!-- En-tête -->
            <div class="border-b border-gray-200 dark:border-gray-700 pb-6 mb-8">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mentions Légales</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">Dernière mise à jour : 21 Mai 2026</p>
            </div>

            <!-- Introduction -->
            <section class="mb-8">
                <p class="leading-relaxed text-gray-700 dark:text-gray-300">
                    Le site <strong>CYBERSCOP LAB</strong> (<a href="https://formation.bloginfluent.fr/vivre-de-son-blog" class="text-cyber-blue hover:underline">https://formation.bloginfluent.fr/vivre-de-son-blog</a>) est un blog personnel édité par Grace HOPPER et hébergé sur une infrastructure de type blog privé.
                </p>
            </section>

            <!-- 1. Éditeur du site -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">1. Éditeur du site</h2>
                <ul class="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                    <li><strong>Nom de l'éditeur :</strong> Grace HOPPER</li>
                    <li><strong>Statut :</strong> Blog personnel à titre individuel</li>
                    <li><strong>Contact :</strong> <a href="mailto:monblog@gmail.com" class="text-cyber-blue hover:underline">monblog@gmail.com</a></li>
                    <li><strong>Objet du site :</strong> CYBERSCOP LAB est un blog dédié à la cybersécurité, aux bonnes pratiques numériques et au développement de compétences pour les personnes souhaitant vivre de leur blog ou de leur activité en ligne.</li>
                </ul>
            </section>

            <!-- 2. Directeur de publication -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">2. Directeur de publication</h2>
                <p class="leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Le directeur de la publication est Grace HOPPER, responsable éditorial du contenu publié sur ce blog.
                </p>
            </section>

            <!-- 3. Hébergeur du site -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">3. Hébergeur du site</h2>
                <ul class="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                    <li><strong>Nom de l'hébergeur :</strong> Hostinger</li>
                    <li><strong>Adresse :</strong> 61 Lordou Vironos Street, 6023 Larnaca, Chypre</li>
                    <li><strong>Site web :</strong> <a href="https://www.hostinger.com" class="text-cyber-blue hover:underline" target="_blank" rel="noopener noreferrer">https://www.hostinger.com</a></li>
                </ul>
            </section>

            <!-- 4. Contenu du site -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">4. Contenu du site</h2>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Les contenus publiés sur CYBERSCOP LAB (articles, commentaires, ressources) sont rédigés à titre informatif.<br>
                    Ils ne constituent ni une consultation professionnelle ni une garantie absolue.
                </p>
                <p class="leading-relaxed text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    Grace Hopper s'efforce de maintenir les informations exactes et à jour, mais ne peut être tenue responsable en cas d'erreur ou d'omission.
                </p>
            </section>

            <!-- 5. Responsabilité et commentaires -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">5. Responsabilité et commentaires</h2>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Grace Hopper ne peut être tenue responsable du contenu des commentaires publiés par les visiteurs.
                </p>
                <p class="leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Néanmoins, tout commentaire contraire aux lois françaises (incitation à la haine, discrimination, diffamation, spam, etc.) peut être modéré ou supprimé sans préavis.
                </p>
            </section>

            <!-- 6. Droit applicable et litiges -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">6. Droit applicable et litiges</h2>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Le site et les mentions légales sont rédigés conformément au droit français et à la loi pour la confiance dans l'économie numérique (LCEN).<br>
                    En cas de différend relatif à l'utilisation du site, les parties s'efforceront de trouver une solution amiable.
                </p>
                <p class="leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Si besoin, le tribunal compétent sera celui du lieu de résidence de l'éditeur ou du lieu du préjudice, selon les règles de procédure en vigueur.
                </p>
            </section>

            <!-- 7. Protection des données et RGPD -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">7. Protection des données et RGPD</h2>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    La collecte et le traitement des données personnelles effectués sur ce site sont régis par la politique de confidentialité du blog, accessible via le lien suivant :<br>
                    👉 <a href="politique_confidentialite.html" class="text-cyber-blue hover:underline font-semibold">Consulter notre Politique de Confidentialité</a>
                </p>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Des cookies et autres traceurs sont utilisés conformément à la réglementation en vigueur.<br>
                    Une page dédiée à la gestion des cookies est accessible sur le blog pour accepter, refuser ou modifier vos préférences.
                </p>
            </section>

            <!-- 8. Liens vers des sites tiers -->
            <section class="mb-0">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">8. Liens vers des sites tiers</h2>
                <p class="leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    CYBERSCOP LAB peut contenir des liens vers des sites tiers.<br>
                    Ces liens sont fournis à titre informatif et Grace Hopper ne peut être tenue responsable du contenu ou des pratiques de confidentialité de ces sites externes.
                </p>
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

print("Updated mentions_legales.html with new text.")
