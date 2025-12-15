<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- SEO : Meta description pour les moteurs de recherche -->
    <meta name="description"
        content="Gérez votre compte utilisateur, modifiez vos informations personnelles, votre mot de passe et vos préférences de confidentialité en toute sécurité.">
    <title>Gérer mon compte</title>

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/assets/images/favicon.png">

    <!-- FRAMEWORK CSS : Tailwind CSS (Chargé via CDN pour la démo) -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- ICONES : FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        /* * ANIMATIONS & UTILITAIRES 
         * BEM naming convention used for custom classes where applicable
         */

        /* Block: Fade Effect */
        .fade-in {
            animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Block: Toggle Switch (Custom styles not covered by default Tailwind utilities) */
        .toggle__checkbox:checked {
            right: 0;
            border-color: #4F46E5;
        }

        .toggle__checkbox:checked+.toggle__label {
            background-color: #4F46E5;
        }

        /* Accessibility: Focus visible outline improvement */
        *:focus-visible {
            outline: 2px solid #4F46E5;
            outline-offset: 2px;
        }
    </style>
</head>

<body class="bg-gray-50 text-gray-800 font-sans min-h-screen flex flex-col">

    <!-- 
      BLOCK: HEADER 
    -->
    <nav class="site-header bg-white shadow-md z-50 relative" role="navigation" aria-label="Menu principal">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <!-- Logo -->
                <div class="site-header__logo flex items-center">
                    <a href="#" class="text-xl font-bold text-indigo-600 focus:outline-none"
                        aria-label="Retour à l'accueil">MonSite</a>
                </div>

                <!-- User Menu -->
                <div class="site-header__user flex items-center">
                    <!-- Dropdown Component -->
                    <div class="dropdown relative group ml-4">
                        <button
                            class="dropdown__trigger flex items-center space-x-2 text-gray-700 hover:text-indigo-600 focus:outline-none py-4"
                            aria-haspopup="true" aria-expanded="false">
                            <img src="https://ui-avatars.com/api/?name=Jean+Dupont&background=random" alt=""
                                class="h-8 w-8 rounded-full" aria-hidden="true">
                            <span class="font-medium hidden md:block">Jean Dupont</span>
                            <i class="fas fa-chevron-down text-xs transition-transform group-hover:rotate-180"
                                aria-hidden="true"></i>
                            <span class="sr-only">Ouvrir le menu utilisateur</span>
                        </button>

                        <!-- Dropdown Menu Content -->
                        <div class="dropdown__menu absolute right-0 top-full w-56 bg-white border border-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50"
                            role="menu">
                            <div class="py-1">
                                <a href="#"
                                    class="dropdown__item block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                                    role="menuitem">
                                    <i class="fas fa-user mr-2" aria-hidden="true"></i> Mon Profil
                                </a>
                                <a href="gerer_compte.php"
                                    class="dropdown__item block px-4 py-2 text-sm text-indigo-700 bg-indigo-50 font-semibold"
                                    role="menuitem" aria-current="page">
                                    <i class="fas fa-cog mr-2" aria-hidden="true"></i> Gérer mon compte
                                </a>
                                <div class="border-t border-gray-100 my-1" role="separator"></div>
                                <a href="#" class="dropdown__item block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    role="menuitem">
                                    <i class="fas fa-sign-out-alt mr-2" aria-hidden="true"></i> Déconnexion
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    <!-- END BLOCK: HEADER -->