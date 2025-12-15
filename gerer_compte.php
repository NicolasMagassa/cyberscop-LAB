<?php include 'includes/header.php'; ?>

<!-- 
      BLOCK: MAIN CONTENT
      Layout: Sidebar à gauche (desktop) / Haut (mobile) + Contenu à droite
    -->
<main class="main-content flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">

    <div class="layout-grid md:flex md:space-x-8">

        <!-- 
              ELEMENT: SIDEBAR NAVIGATION 
              Role: Tablist pour l'accessibilité (navigation par onglets)
            -->
        <aside class="sidebar md:w-1/4 mb-6 md:mb-0">
            <div class="bg-white rounded-lg shadow-sm p-4 sticky top-6">
                <h2 class="sidebar__title text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4"
                    id="settings-heading">Paramètres</h2>

                <div class="sidebar__nav space-y-1" role="tablist" aria-labelledby="settings-heading">
                    <!-- Tab: Profil -->
                    <button onclick="switchTab('profile')" id="tab-btn-profile"
                        class="sidebar__nav-item w-full text-left px-4 py-2 rounded-md text-indigo-700 bg-indigo-50 font-medium flex items-center transition focus:ring-2 focus:ring-indigo-500"
                        role="tab" aria-selected="true" aria-controls="panel-profile">
                        <i class="fas fa-user-circle w-6" aria-hidden="true"></i>
                        <span>Informations personnelles</span>
                    </button>

                    <!-- Tab: Sécurité -->
                    <button onclick="switchTab('security')" id="tab-btn-security"
                        class="sidebar__nav-item w-full text-left px-4 py-2 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 flex items-center transition focus:ring-2 focus:ring-indigo-500"
                        role="tab" aria-selected="false" aria-controls="panel-security">
                        <i class="fas fa-lock w-6" aria-hidden="true"></i>
                        <span>Sécurité & Mot de passe</span>
                    </button>

                    <!-- Tab: Confidentialité -->
                    <button onclick="switchTab('privacy')" id="tab-btn-privacy"
                        class="sidebar__nav-item w-full text-left px-4 py-2 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 flex items-center transition focus:ring-2 focus:ring-indigo-500"
                        role="tab" aria-selected="false" aria-controls="panel-privacy">
                        <i class="fas fa-cookie-bite w-6" aria-hidden="true"></i>
                        <span>Confidentialité & Cookies</span>
                    </button>

                    <!-- Tab: Danger Zone -->
                    <button onclick="switchTab('danger')" id="tab-btn-danger"
                        class="sidebar__nav-item w-full text-left px-4 py-2 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center transition mt-4 border-t border-gray-100 pt-4 focus:ring-2 focus:ring-red-500"
                        role="tab" aria-selected="false" aria-controls="panel-danger">
                        <i class="fas fa-exclamation-triangle w-6" aria-hidden="true"></i>
                        <span>Suppression de compte</span>
                    </button>
                </div>
            </div>
        </aside>

        <!-- 
              ELEMENT: CONTENT AREA 
              Contient les panneaux (panels) correspondants aux onglets
            -->
        <div class="content-area md:w-3/4">

            <!-- COMPONENT: TOAST NOTIFICATION -->
            <!-- aria-live="polite" pour annoncer le changement aux lecteurs d'écran sans couper la parole -->
            <div id="toast"
                class="toast hidden fixed bottom-5 right-5 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 flex items-center transition-opacity duration-300"
                role="status" aria-live="polite">
                <i class="fas fa-check-circle mr-2" aria-hidden="true"></i>
                <span id="toast-message">Modifications enregistrées</span>
            </div>

            <!-- 
                  PANEL 1: PROFIL
                  Accessible Panel linked to tab-btn-profile
                -->
            <section id="panel-profile" class="panel bg-white rounded-lg shadow-sm p-6 fade-in" role="tabpanel"
                aria-labelledby="tab-btn-profile" tabindex="0">

                <h1 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Informations personnelles</h1>

                <form onsubmit="handleSave(event, 'Informations mises à jour !')" class="form">
                    <div class="form__grid grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Input Group: Username -->
                        <div class="form__group">
                            <label for="username" class="form__label block text-sm font-medium text-gray-700 mb-2">Nom
                                d'utilisateur</label>
                            <input type="text" id="username" name="username" value="JeanDupont"
                                class="form__input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100 cursor-not-allowed"
                                readonly aria-describedby="username-hint">
                            <p id="username-hint" class="form__hint text-xs text-gray-500 mt-1">Le nom d'utilisateur
                                n'est pas modifiable.</p>
                        </div>

                        <!-- Input Group: Email -->
                        <div class="form__group">
                            <label for="email"
                                class="form__label block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input type="email" id="email" name="email" value="jean.dupont@email.com"
                                class="form__input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required>
                        </div>

                        <!-- Input Group: Bio -->
                        <div class="form__group md:col-span-2">
                            <label for="bio" class="form__label block text-sm font-medium text-gray-700 mb-2">Bio /
                                Description</label>
                            <textarea id="bio" name="bio" rows="3"
                                class="form__textarea w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">Passionné par le web et la technologie.</textarea>
                        </div>
                    </div>

                    <div class="form__actions mt-6 flex justify-end">
                        <button type="submit"
                            class="btn btn--primary px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition">
                            Enregistrer les modifications
                        </button>
                    </div>
                </form>
            </section>

            <!-- 
                  PANEL 2: SÉCURITÉ
                -->
            <section id="panel-security" class="panel hidden bg-white rounded-lg shadow-sm p-6 fade-in" role="tabpanel"
                aria-labelledby="tab-btn-security" tabindex="0">

                <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Sécurité</h2>

                <!-- Feature: Change Password -->
                <div class="mb-10">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Modifier mon mot de passe</h3>
                    <form onsubmit="handleSave(event, 'Mot de passe modifié avec succès !')" class="form">
                        <div class="space-y-4 max-w-lg">
                            <div class="form__group">
                                <label for="current-password" class="block text-sm font-medium text-gray-700 mb-1">Mot
                                    de passe actuel</label>
                                <input type="password" id="current-password" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            </div>
                            <div class="form__group">
                                <label for="new-password" class="block text-sm font-medium text-gray-700 mb-1">Nouveau
                                    mot de
                                    passe</label>
                                <input type="password" id="new-password" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            </div>
                            <div class="form__group">
                                <label for="confirm-password"
                                    class="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de
                                    passe</label>
                                <input type="password" id="confirm-password" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            </div>
                        </div>
                        <div class="mt-4">
                            <button type="submit"
                                class="btn btn--secondary px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                                Mettre à jour le mot de passe
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Feature: 2FA Toggle -->
                <div class="border-t pt-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-medium text-gray-900" id="label-2fa">Double authentification
                                (2FA)</h3>
                            <p class="text-sm text-gray-500">Ajoute une couche de sécurité supplémentaire à votre
                                compte.</p>
                        </div>
                        <!-- Custom Toggle Component -->
                        <div
                            class="toggle relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle-2fa" id="toggle-2fa"
                                class="toggle__checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                aria-labelledby="label-2fa" />
                            <label for="toggle-2fa"
                                class="toggle__label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 
                  PANEL 3: CONFIDENTIALITÉ
                -->
            <section id="panel-privacy" class="panel hidden bg-white rounded-lg shadow-sm p-6 fade-in" role="tabpanel"
                aria-labelledby="tab-btn-privacy" tabindex="0">

                <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Confidentialité</h2>

                <div class="space-y-6">
                    <!-- Cookie Item: Essential -->
                    <div class="cookie-item flex items-start justify-between">
                        <div>
                            <h3 class="text-lg font-medium text-gray-900">Cookies Essentiels</h3>
                            <p class="text-sm text-gray-500">Nécessaires au fonctionnement du site (connexion,
                                panier).</p>
                        </div>
                        <span
                            class="status-badge text-sm text-green-600 font-bold px-3 py-1 bg-green-100 rounded-full">Toujours
                            actif</span>
                    </div>

                    <!-- Cookie Item: Analytics -->
                    <div class="cookie-item flex items-start justify-between border-t border-gray-100 pt-4">
                        <div>
                            <h3 class="text-lg font-medium text-gray-900" id="label-analytics">Cookies Analytiques
                            </h3>
                            <p class="text-sm text-gray-500">Nous aident à améliorer notre site en collectant des
                                informations anonymes.</p>
                        </div>
                        <div class="toggle relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" checked id="toggle-analytics"
                                class="toggle__checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                aria-labelledby="label-analytics" />
                            <label for="toggle-analytics"
                                class="toggle__label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                    </div>

                    <!-- Cookie Item: Marketing -->
                    <div class="cookie-item flex items-start justify-between border-t border-gray-100 pt-4">
                        <div>
                            <h3 class="text-lg font-medium text-gray-900" id="label-marketing">Cookies Marketing
                            </h3>
                            <p class="text-sm text-gray-500">Utilisés pour afficher des publicités pertinentes.</p>
                        </div>
                        <div class="toggle relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="toggle-marketing"
                                class="toggle__checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                aria-labelledby="label-marketing" />
                            <label for="toggle-marketing"
                                class="toggle__label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                    </div>

                    <div class="pt-4">
                        <button onclick="handleSave(null, 'Préférences cookies enregistrées')"
                            class="btn btn--primary px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                            Sauvegarder mes préférences
                        </button>
                    </div>
                </div>

                <!-- GDPR Data Export -->
                <div class="mt-10 border-t pt-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Exporter mes données</h3>
                    <p class="text-sm text-gray-500 mb-4">Téléchargez une copie de vos données personnelles (Format
                        JSON).</p>
                    <button
                        class="flex items-center text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none focus:underline">
                        <i class="fas fa-download mr-2" aria-hidden="true"></i> Télécharger mes données
                    </button>
                </div>
            </section>

            <!-- 
                  PANEL 4: DANGER ZONE
                -->
            <section id="panel-danger"
                class="panel hidden bg-white rounded-lg shadow-sm p-6 fade-in border border-red-100" role="tabpanel"
                aria-labelledby="tab-btn-danger" tabindex="0">

                <h2 class="text-2xl font-bold text-red-600 mb-6 border-b border-red-100 pb-2">Suppression de compte
                </h2>

                <p class="text-gray-600 mb-6">
                    La suppression de votre compte est irréversible. Toutes vos données, historique et préférences
                    seront définitivement effacés.
                </p>

                <div class="alert alert--danger bg-red-50 p-4 rounded-md border border-red-200 flex items-start"
                    role="alert">
                    <i class="fas fa-exclamation-triangle text-red-500 mt-1 mr-3 text-lg" aria-hidden="true"></i>
                    <div>
                        <h3 class="text-red-800 font-bold">Êtes-vous sûr ?</h3>
                        <p class="text-sm text-red-700 mt-1">
                            Une fois que vous supprimez votre compte, il n'y a pas de retour en arrière possible.
                            Soyez certain de votre choix.
                        </p>
                    </div>
                </div>

                <div class="mt-6">
                    <button onclick="openDeleteModal()"
                        class="btn btn--danger px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition shadow-sm">
                        Supprimer mon compte
                    </button>
                </div>
            </section>

        </div>
    </div>
</main>

<?php include 'includes/footer.php'; ?>