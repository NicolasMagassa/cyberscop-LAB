<!-- FOOTER DEMO -->
<footer class="site-footer bg-white border-t mt-auto py-6" role="contentinfo">
    <div class="container mx-auto px-4 text-center text-gray-500 text-sm">
        &copy; 2023 MonSite. Tous droits réservés.
    </div>
</footer>


<!-- 
      MODAL COMPONENT
      Accessible Modal Dialog for account deletion confirmation
    -->
<div id="deleteModal"
    class="modal fixed inset-0 bg-gray-600 bg-opacity-50 hidden overflow-y-auto h-full w-full z-50 flex items-center justify-center"
    role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-desc">

    <div class="modal__content relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <i class="fas fa-times text-red-600" aria-hidden="true"></i>
            </div>

            <h3 id="modal-title" class="text-lg leading-6 font-medium text-gray-900 mt-4">Supprimer le compte ?</h3>

            <div class="mt-2 px-7 py-3">
                <p id="modal-desc" class="text-sm text-gray-500">
                    Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.
                </p>
                <label for="confirm-delete-pass" class="sr-only">Mot de passe de confirmation</label>
                <input type="password" id="confirm-delete-pass" placeholder="Entrez votre mot de passe pour confirmer"
                    class="mt-4 w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
            </div>

            <div class="items-center px-4 py-3">
                <button id="ok-btn"
                    class="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300">
                    Confirmer la suppression
                </button>
                <button onclick="closeDeleteModal()"
                    class="mt-3 px-4 py-2 bg-white text-gray-700 text-base font-medium rounded-md w-full shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300">
                    Annuler
                </button>
            </div>
        </div>
    </div>
</div>

<!-- SCRIPTS JS -->
<script>
    /**
     * Navigation par onglets (Tabs)
     * Gère l'affichage des sections et l'accessibilité (ARIA)
     * @param {string} tabId - L'identifiant de la section à afficher (ex: 'profile')
     */
    function switchTab(tabId) {
        // 1. Masquer tous les panneaux
        const panels = document.querySelectorAll('.panel');
        panels.forEach(panel => {
            panel.classList.add('hidden');
        });

        // 2. Réinitialiser les états ARIA et les styles des boutons
        const buttons = document.querySelectorAll('.sidebar__nav-item');
        buttons.forEach(btn => {
            btn.setAttribute('aria-selected', 'false');
            btn.classList.remove('text-indigo-700', 'bg-indigo-50', 'font-medium');
            btn.classList.add('text-gray-600', 'hover:bg-gray-50');

            // Exception pour garder le bouton "Danger" en rouge si inactif
            if (btn.id === 'tab-btn-danger') {
                btn.classList.remove('text-gray-600');
                btn.classList.add('text-red-600');
            }
        });

        // 3. Afficher le panneau cible
        const targetPanel = document.getElementById('panel-' + tabId);
        targetPanel.classList.remove('hidden');

        // 4. Activer le bouton cible
        const activeBtn = document.getElementById('tab-btn-' + tabId);
        activeBtn.setAttribute('aria-selected', 'true');
        activeBtn.classList.remove('text-gray-600', 'hover:bg-gray-50');

        // Appliquer le style actif selon le type d'onglet
        if (tabId === 'danger') {
            activeBtn.classList.add('bg-red-50', 'text-red-700', 'font-medium');
        } else {
            activeBtn.classList.add('text-indigo-700', 'bg-indigo-50', 'font-medium');
        }
    }

    /**
     * Gestion des formulaires (Simulation)
     * Affiche un toast de confirmation
     */
    function handleSave(event, message) {
        if (event) event.preventDefault();

        const toast = document.getElementById('toast');
        document.getElementById('toast-message').innerText = message;

        // Affichage avec transition
        toast.classList.remove('hidden');
        toast.classList.add('opacity-100');

        // Disparition auto après 3s
        setTimeout(() => {
            toast.classList.remove('opacity-100');
            toast.classList.add('opacity-0');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 300);
        }, 3000);
    }

    /**
     * Logique de la Modale (Suppression)
     */
    function openDeleteModal() {
        const modal = document.getElementById('deleteModal');
        modal.classList.remove('hidden');
        // Focus trap: mettre le focus sur l'input pour l'accessibilité
        setTimeout(() => {
            document.getElementById('confirm-delete-pass').focus();
        }, 100);
    }

    function closeDeleteModal() {
        document.getElementById('deleteModal').classList.add('hidden');
        // Retourner le focus au bouton qui a ouvert la modale
        document.querySelector('[onclick="openDeleteModal()"]').focus();
    }

    // Fermeture au clic extérieur (Overlay)
    window.onclick = function (event) {
        const modal = document.getElementById('deleteModal');
        if (event.target == modal) {
            closeDeleteModal();
        }
    }

    // Fermeture avec la touche ESC (Accessibilité clavier)
    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape" && !document.getElementById('deleteModal').classList.contains('hidden')) {
            closeDeleteModal();
        }
    });
</script>
</body>

</html>