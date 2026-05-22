import os
import re

file_path = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB\CGU.html"

new_main_content = """<main class="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        <div class="bg-white dark:bg-cyber-panel shadow-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-8 md:p-12">
            
            <!-- En-tête -->
            <div class="border-b border-gray-200 dark:border-gray-700 pb-6 mb-8">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Conditions Générales d'Utilisation</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">Dernière mise à jour : 21 Mai 2026</p>
            </div>

            <!-- Introduction -->
            <section class="mb-8">
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300">
                    Le site <strong>CYBERSCOP LAB</strong> (<a href="https://formation.bloginfluent.fr/vivre-de-son-blog" class="text-cyber-blue hover:underline">https://formation.bloginfluent.fr/vivre-de-son-blog</a>) est un blog personnel édité par Grace Hopper.
                </p>
                <p class="leading-relaxed text-gray-700 dark:text-gray-300 text-sm italic text-gray-500 dark:text-gray-400">
                    En consultant ce site, vous acceptez sans réserve les présentes Conditions Générales d'Utilisation, qui sont applicables à tout visiteur.
                </p>
            </section>

            <!-- 1. Objet du site -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">1. Objet du site</h2>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    CYBERSCOP LAB est un blog à vocation informative et pédagogique, dédié à la cybersécurité, aux bonnes pratiques numériques et au développement de compétences.<br>
                    Il ne constitue ni une offre de service, ni une consultation professionnelle payante, ni un contrat entre vous et l'éditeur.
                </p>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Les contenus publiés (articles, tutoriels, ressources, commentaires) sont fournis à titre indicatif et non contractuel.
                </p>
                <p class="leading-relaxed text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    Grace Hopper ne peut être tenue responsable de l'usage que vous faites de ces informations, notamment si vous les appliquez dans un contexte sensible ou professionnel sans vérification complémentaire.
                </p>
            </section>

            <!-- 2. Contenu du site -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">2. Contenu du site</h2>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Grace Hopper s'efforce de maintenir les informations exactes, à jour et cohérentes avec les bonnes pratiques connues à la date de publication.<br>
                    Toutefois, les contenus peuvent contenir des erreurs, omissions ou simplifications.
                </p>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    L'éditeur décline toute responsabilité en cas de conséquence directe ou indirecte liée à l'utilisation ou à l'interprétation des informations publiées sur le blog.
                </p>
                <p class="leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    L'éditeur se réserve le droit de modifier, mettre à jour ou retirer tout contenu du site à tout moment, sans préavis.
                </p>
            </section>

            <!-- 3. Commentaires et contributions des visiteurs -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">3. Commentaires et contributions des visiteurs</h2>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Les commentaires laissés sur le blog sont soumis aux règles suivantes :
                </p>
                <ul class="list-disc pl-6 space-y-2 mb-4 text-gray-700 dark:text-gray-300 text-sm">
                    <li>Les commentaires doivent être respectueux, sans attaque personnelle, discrimination, haine, diffamation, spam ou contenu illégal.</li>
                    <li>Tout commentaire contraire à ces règles pourra être modéré, modifié ou supprimé sans préavis.</li>
                </ul>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    En publiant un commentaire, vous déclarez accepter que celui-ci reste visible sur le site tant que l'article est en ligne, sauf demande de suppression formulée à l'adresse <a href="mailto:monblog@gmail.com" class="text-cyber-blue hover:underline">monblog@gmail.com</a>.
                </p>
                <p class="leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Grace Hopper ne peut être tenue responsable du contenu des commentaires publiés par les visiteurs, et décline toute responsabilité civile ou pénale liée à de tels contenus.
                </p>
            </section>

            <!-- 4. Limitation de responsabilité -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">4. Limitation de responsabilité</h2>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    CYBERSCOP LAB est fourni “en l'état”.<br>
                    L'éditeur n'offre aucune garantie, expresse ou implicite, concernant :
                </p>
                <ul class="list-disc pl-6 space-y-2 mb-4 text-gray-700 dark:text-gray-300 text-sm">
                    <li>l'exactitude, l'exhaustivité ou l'actualité des contenus,</li>
                    <li>la disponibilité ou la performance technique du site,</li>
                    <li>les conséquences techniques d'une mauvaise application des conseils donnés.</li>
                </ul>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Vous utilisez le site et appliquez les informations qui y figurent à vos propres risques.
                </p>
                <p class="leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Grace Hopper ne peut être tenue responsable de tout dommage direct ou indirect découlant de l'utilisation du blog ou de l'une de ses fonctionnalités.
                </p>
            </section>

            <!-- 5. Propriété intellectuelle -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">5. Propriété intellectuelle</h2>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    L'ensemble des contenus publiés sur CYBERSCOP LAB (textes, images, infographies, etc.) est protégé par le droit d'auteur, sauf mention explicite de licence ouverte.<br>
                    Toute reproduction, représentation, diffusion ou exploitation de ces contenus, même partielle, sans autorisation écrite préalable de l'éditeur est interdite.
                </p>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Vous pouvez, dans le cadre d'un usage strictement personnel ou éducatif, partager un lien vers les articles, en citant clairement le site et son auteur.
                </p>
                <p class="leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Pour toute demande de réutilisation professionnelle ou commerciale (intégration dans un support externe, format PDF, etc.), veuillez contacter l'éditeur à l'adresse : <a href="mailto:monblog@gmail.com" class="text-cyber-blue hover:underline">monblog@gmail.com</a>.
                </p>
            </section>

            <!-- 6. Cookies et données personnelles -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">6. Cookies et données personnelles</h2>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Les données collectées lors de votre visite (commentaires, cookies, formulaire de contact) sont régies par la politique de confidentialité du blog, accessible via le lien suivant :<br>
                    👉 <a href="politique_confidentialite.html" class="text-cyber-blue hover:underline font-semibold">Consulter notre Politique de Confidentialité</a>
                </p>
                <p class="leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Vous reconnaissez avoir pris connaissance de cette politique et des règles en matière de cookies et de gestion de vos données personnelles avant d'utiliser le site.
                </p>
            </section>

            <!-- 7. Droit applicable et litiges -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">7. Droit applicable et litiges</h2>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Les présentes CGU sont rédigées en langue française et sont soumises au droit français.<br>
                    En cas de différend lié à l'utilisation du site, les parties s'engagent à rechercher en priorité une solution amiable.
                </p>
                <p class="leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    À défaut, tout litige sera soumis, au choix de l'éditeur, au tribunal compétent du lieu de résidence de Grace Hopper ou du lieu du préjudice, selon les règles de compétence territoriale françaises.
                </p>
            </section>

            <!-- 8. Liens vers d'autres sites -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">8. Liens vers d'autres sites</h2>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    CYBERSCOP LAB peut contenir des liens vers des sites externes (ressources, tutos, outils, etc.).<br>
                    Grace Hopper ne contrôle pas ces sites et ne peut être tenue responsable de leur contenu, de leurs pratiques de confidentialité ou de leurs éventuelles violations de droits.
                </p>
                <p class="leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    L'accès à ces sites s'effectue sous votre propre responsabilité.
                </p>
            </section>
            
            <!-- 9. Indépendance des contenus et environnements de test -->
            <section class="mb-0">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 border-l-4 border-cyber-blue pl-3">9. Indépendance des contenus et environnements de test</h2>
                <p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
                    Les exemples, configurations, scripts et procédures présentés sur CYBERSCOP LAB sont donnés à titre illustratif et pédagogique. Ils ne reflètent pas nécessairement les pratiques de mon employeur ou d'organisations publiques, ni l'état de systèmes réels.
                </p>
                <p class="leading-relaxed text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    Ces contenus doivent être reproduits uniquement dans des environnements de test ou de lab, en pleine connaissance des risques. Grace Hopper décline toute responsabilité en cas de conséquence liée à une mauvaise application de ces exemples sur des systèmes de production.
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

print("Updated CGU.html with new text.")
