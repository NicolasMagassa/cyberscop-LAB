import os

workspace_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"
contact_html_path = os.path.join(workspace_dir, "contact.html")
contact_js_path = os.path.join(workspace_dir, "assets", "js", "contact.js")

# 1. Read contact.html
with open(contact_html_path, "r", encoding="utf-8") as f:
    html_content = f.read()

# 2. Extract <main> content
start_main = html_content.find('<main class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">')
end_main = html_content.find('</main>', start_main) + len('</main>')

new_main_content = """<main class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div class="mb-10">
            <h1 class="text-4xl font-orbitron font-bold text-cyber-green mb-4 flex items-center">
                <i data-lucide="mail" class="mr-3 w-8 h-8"></i> Contact
            </h1>
            <p class="text-gray-600 dark:text-gray-400 text-lg max-w-3xl">
                Que ce soit pour une <span class="text-cyber-blue font-bold">collaboration</span>, une question sur un de mes articles, une proposition professionnelle ou un simple échange entre experts, n'hésitez pas à me contacter via le formulaire ci-dessous.
            </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <!-- Formulaire -->
            <div class="lg:col-span-2">
                <div class="bg-white dark:bg-cyber-panel border border-gray-200 dark:border-gray-800 rounded-md p-6 sm:p-8 shadow-sm relative overflow-hidden group hover:border-cyber-blue transition-colors duration-500">
                    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-blue to-cyber-green opacity-80"></div>
                    
                    <form id="contactForm" class="space-y-6" novalidate>
                        <!-- Nom -->
                        <div>
                            <label for="name" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nom <span class="text-cyber-pink">*</span></label>
                            <input type="text" id="name" name="name" required aria-required="true"
                                class="w-full bg-gray-50 dark:bg-cyber-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded focus:border-cyber-blue focus:outline-none focus:ring-1 focus:ring-cyber-blue transition-colors"
                                placeholder="Votre nom ou pseudonyme">
                            <p id="name-error" class="text-cyber-pink text-xs mt-1 hidden" aria-live="polite">Ce champ est requis.</p>
                        </div>

                        <!-- Email -->
                        <div>
                            <label for="email" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email <span class="text-cyber-pink">*</span></label>
                            <input type="email" id="email" name="email" required aria-required="true"
                                class="w-full bg-gray-50 dark:bg-cyber-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded focus:border-cyber-blue focus:outline-none focus:ring-1 focus:ring-cyber-blue transition-colors"
                                placeholder="votre.email@exemple.com">
                            <p id="email-error" class="text-cyber-pink text-xs mt-1 hidden" aria-live="polite">Veuillez entrer une adresse email valide.</p>
                        </div>

                        <!-- Sujet -->
                        <div>
                            <label for="subject" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Sujet <span class="text-cyber-pink">*</span></label>
                            <div class="relative">
                                <select id="subject" name="subject" required aria-required="true"
                                    class="w-full bg-gray-50 dark:bg-cyber-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded appearance-none focus:border-cyber-blue focus:outline-none focus:ring-1 focus:ring-cyber-blue transition-colors">
                                    <option value="" disabled selected>Sélectionnez un motif</option>
                                    <option value="proposition">Proposition professionnelle (Recrutement/Freelance)</option>
                                    <option value="collaboration">Collaboration / Partenariat</option>
                                    <option value="question">Question sur un article / Tutoriel</option>
                                    <option value="autre">Autre</option>
                                </select>
                                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                    <i data-lucide="chevron-down" class="w-4 h-4"></i>
                                </div>
                            </div>
                            <p id="subject-error" class="text-cyber-pink text-xs mt-1 hidden" aria-live="polite">Veuillez sélectionner un motif.</p>
                        </div>

                        <!-- Message -->
                        <div>
                            <label for="message" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Message <span class="text-cyber-pink">*</span></label>
                            <textarea id="message" name="message" rows="5" required aria-required="true"
                                class="w-full bg-gray-50 dark:bg-cyber-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded focus:border-cyber-blue focus:outline-none focus:ring-1 focus:ring-cyber-blue transition-colors resize-y"
                                placeholder="Détaillez votre message ici..."></textarea>
                            <p id="message-error" class="text-cyber-pink text-xs mt-1 hidden" aria-live="polite">Ce champ est requis.</p>
                        </div>

                        <!-- Mentions Légales -->
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            <i data-lucide="info" class="w-3 h-3 inline mr-1"></i>
                            Les données renseignées ne sont utilisées que dans le but exclusif de répondre à votre message. Pour plus d'informations, consultez notre <a href="politique_confidentialite.html" class="text-cyber-blue hover:underline">Politique de Confidentialité</a>.
                        </div>

                        <!-- Submit -->
                        <div class="pt-2">
                            <button type="submit" id="submitBtn" class="group relative w-full flex justify-center py-3 px-4 border border-transparent font-bold rounded-md text-white bg-cyber-darkerBlue hover:bg-cyber-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyber-blue transition-all uppercase text-sm shadow-md overflow-hidden">
                                <span class="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
                                <span class="flex items-center">
                                    <i data-lucide="send" class="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform"></i>
                                    Envoyer le message
                                </span>
                            </button>
                        </div>
                        
                        <div id="form-feedback" class="hidden p-4 rounded-md border text-sm mt-4 font-mono font-bold" role="alert" aria-live="assertive"></div>
                    </form>
                </div>
            </div>

            <!-- Sidebar Info -->
            <div class="lg:col-span-1 space-y-6">
                <!-- Direct Contact -->
                <div class="bg-gray-100 dark:bg-cyber-panel border border-gray-200 dark:border-gray-800 rounded-md p-6 shadow-sm relative overflow-hidden group hover:border-cyber-green transition-colors duration-500">
                    <div class="absolute top-0 right-0 w-16 h-16 bg-cyber-green opacity-10 rounded-bl-full"></div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                        Contact Direct
                    </h3>
                    <div class="space-y-4">
                        <div class="flex items-start">
                            <div class="flex-shrink-0 mt-1">
                                <i data-lucide="mail" class="w-5 h-5 text-cyber-blue group-hover:text-cyber-green transition-colors"></i>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm font-bold text-gray-900 dark:text-white">Email</p>
                                <a href="mailto:monblog@gmail.com" class="text-gray-600 dark:text-gray-400 hover:text-cyber-blue font-mono text-sm break-all transition-colors">
                                    monblog@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Réseaux -->
                <div class="bg-gray-100 dark:bg-cyber-panel border border-gray-200 dark:border-gray-800 rounded-md p-6 shadow-sm group hover:border-cyber-pink transition-colors duration-500">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                        Réseaux
                    </h3>
                    <div class="space-y-4">
                        <a href="#" class="flex items-center group/social">
                            <div class="w-10 h-10 rounded bg-white dark:bg-cyber-dark border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover/social:text-[#0077b5] group-hover/social:border-[#0077b5] transition-all">
                                <i data-lucide="linkedin" class="w-5 h-5"></i>
                            </div>
                            <span class="ml-3 text-sm font-bold text-gray-700 dark:text-gray-300 group-hover/social:text-[#0077b5] transition-colors">LinkedIn</span>
                        </a>
                        <a href="#" class="flex items-center group/social">
                            <div class="w-10 h-10 rounded bg-white dark:bg-cyber-dark border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover/social:text-cyber-green group-hover/social:border-cyber-green transition-all">
                                <i data-lucide="github" class="w-5 h-5"></i>
                            </div>
                            <span class="ml-3 text-sm font-bold text-gray-700 dark:text-gray-300 group-hover/social:text-cyber-green transition-colors">GitHub</span>
                        </a>
                    </div>
                </div>
                
                <!-- PGP Key -->
                <div class="bg-gray-900 text-gray-300 p-6 rounded-md shadow-sm border border-gray-800 relative overflow-hidden font-mono text-xs hover:border-cyber-blue transition-colors duration-500">
                    <h3 class="text-cyber-green font-bold mb-2 flex items-center text-sm">
                        <i data-lucide="key" class="w-4 h-4 mr-2"></i> PGP Public Key
                    </h3>
                    <p class="opacity-70 mb-2">Pour des communications chiffrées :</p>
                    <div class="bg-black p-3 rounded border border-gray-700 overflow-x-auto relative group">
                        <button class="absolute top-2 right-2 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" title="Copier">
                            <i data-lucide="copy" class="w-3 h-3"></i>
                        </button>
                        <code class="text-[10px] whitespace-pre text-gray-400 block select-all">
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP

[Clé PGP fictive à remplacer]
mQINBF...
-----END PGP PUBLIC KEY BLOCK-----
                        </code>
                    </div>
                </div>
            </div>
        </div>
    </main>"""

html_content = html_content[:start_main] + new_main_content + html_content[end_main:]

# 3. Add JS script link at the end
old_js_link = '<script src="assets/js/main.js"></script>'
new_js_link = '<script src="assets/js/main.js"></script>\n    <script src="assets/js/contact.js"></script>'

html_content = html_content.replace(old_js_link, new_js_link)

with open(contact_html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

# 4. Create contact.js
js_content = """document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const feedbackDiv = document.getElementById('form-feedback');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Reset errors
        document.querySelectorAll('[id$="-error"]').forEach(el => el.classList.add('hidden'));
        [nameInput, emailInput, subjectInput, messageInput].forEach(el => {
            el.classList.remove('border-cyber-pink', 'ring-cyber-pink');
            el.setAttribute('aria-invalid', 'false');
        });

        // Validation Name
        if (!nameInput.value.trim()) {
            showError(nameInput, 'name-error');
            isValid = false;
        }

        // Validation Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
            showError(emailInput, 'email-error');
            isValid = false;
        }

        // Validation Subject
        if (!subjectInput.value) {
            showError(subjectInput, 'subject-error');
            isValid = false;
        }

        // Validation Message
        if (!messageInput.value.trim()) {
            showError(messageInput, 'message-error');
            isValid = false;
        }

        if (isValid) {
            // Simulation d'envoi
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 mr-2 animate-spin inline"></i> Envoi en cours...';
            if (window.lucide) window.lucide.createIcons();

            setTimeout(() => {
                // Succès
                form.reset();
                feedbackDiv.classList.remove('hidden', 'bg-red-50', 'text-red-600', 'border-red-200');
                feedbackDiv.classList.add('bg-green-50', 'dark:bg-green-900/20', 'text-green-700', 'dark:text-green-400', 'border-green-200', 'dark:border-green-800');
                feedbackDiv.innerHTML = '<i data-lucide="check-circle" class="w-5 h-5 inline mr-2"></i> Votre message a été envoyé avec succès. Je vous répondrai dans les plus brefs délais.';
                if (window.lucide) window.lucide.createIcons();
                
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                submitBtn.innerHTML = originalText;
                if (window.lucide) window.lucide.createIcons();
                
                // Cacher le message après 8 secondes
                setTimeout(() => {
                    feedbackDiv.classList.add('hidden');
                }, 8000);
            }, 1500);
        }
    });

    function showError(inputElement, errorId) {
        inputElement.classList.add('border-cyber-pink', 'focus:ring-cyber-pink');
        inputElement.setAttribute('aria-invalid', 'true');
        document.getElementById(errorId).classList.remove('hidden');
    }
});
"""

with open(contact_js_path, "w", encoding="utf-8") as f:
    f.write(js_content)

print("contact.html modified and contact.js created.")
