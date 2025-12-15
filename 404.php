<?php
// Force le code erreur 404 pour le SEO
http_response_code(404);
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description"
        content="Page non trouvée - Erreur 404. La page que vous recherchez n'existe pas ou a été déplacée.">
    <title>Page Non Trouvée - 404</title>

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/assets/images/favicon.png">

    <!-- Police externe uniquement -->
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&display=swap" rel="stylesheet">

    <style>
        /* =========================================
           RESET & BASE
           ========================================= */
        :root {
            --color-bg: #0f172a;
            --color-text-main: #ffffff;
            --color-text-muted: #94a3b8;
            --color-primary: #2563eb;
            --color-primary-hover: #1d4ed8;
            --font-main: 'Space Grotesk', sans-serif;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: var(--font-main);
            background-color: var(--color-bg);
            color: var(--color-text-main);
            overflow: hidden;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* =========================================
           BLOCK: STAR-FIELD (Contexte)
           ========================================= */
        .star-field {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        }

        /* Element: Star */
        .star-field__star {
            position: absolute;
            background: white;
            border-radius: 50%;
            opacity: 0;
            animation: twinkle var(--duration) ease-in-out infinite;
            animation-delay: var(--delay);
        }

        /* =========================================
           BLOCK: ERROR-PAGE (Conteneur Principal)
           ========================================= */
        .error-page {
            position: relative;
            z-index: 10;
            width: 100%;
            max-width: 1200px;
            padding: 0 20px;
            display: flex;
            flex-direction: column-reverse;
            /* Mobile first : texte en bas */
            align-items: center;
            justify-content: center;
            gap: 3rem;
        }

        /* Modifier pour grands écrans */
        @media (min-width: 1024px) {
            .error-page {
                flex-direction: row;
                justify-content: space-between;
            }
        }

        /* =========================================
           BLOCK: CONTENT (Section Texte)
           ========================================= */
        .content {
            text-align: center;
            max-width: 500px;
        }

        @media (min-width: 1024px) {
            .content {
                text-align: left;
            }
        }

        .content__label {
            color: #60a5fa;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
            display: block;
        }

        .content__title {
            font-size: 3rem;
            line-height: 1.1;
            font-weight: 700;
            margin: 0 0 1.5rem 0;
            background: linear-gradient(to right, #60a5fa, #9333ea);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        @media (min-width: 1024px) {
            .content__title {
                font-size: 4.5rem;
            }
        }

        .content__description {
            color: var(--color-text-muted);
            font-size: 1.125rem;
            line-height: 1.6;
            margin-bottom: 2rem;
        }

        /* =========================================
           BLOCK: BTN (Boutons)
           ========================================= */
        .btn-group {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }

        @media (min-width: 1024px) {
            .btn-group {
                justify-content: flex-start;
            }
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.75rem 2rem;
            border-radius: 9999px;
            font-weight: 500;
            text-decoration: none;
            transition: all 0.3s ease;
            cursor: pointer;
            border: 1px solid transparent;
        }

        /* Modifier: Primary */
        .btn--primary {
            background-color: var(--color-primary);
            color: white;
            box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
        }

        .btn--primary:hover {
            background-color: var(--color-primary-hover);
            transform: translateY(-2px);
        }

        /* =========================================
           BLOCK: VISUAL (Illustration)
           ========================================= */
        .visual {
            position: relative;
            width: 100%;
            max-width: 450px;
        }

        .visual__backdrop {
            position: absolute;
            inset: 0;
            background-color: rgba(59, 130, 246, 0.2);
            filter: blur(40px);
            border-radius: 50%;
            z-index: -1;
        }

        .visual__svg {
            width: 100%;
            height: auto;
            /* Animation définie plus bas */
            animation: float 6s ease-in-out infinite;
        }

        /* =========================================
           ANIMATIONS
           ========================================= */
        @keyframes float {
            0% {
                transform: translateY(0px) rotate(0deg);
            }

            50% {
                transform: translateY(-20px) rotate(5deg);
            }

            100% {
                transform: translateY(0px) rotate(0deg);
            }
        }

        @keyframes twinkle {
            0% {
                opacity: 0;
                transform: scale(0.5);
            }

            50% {
                opacity: 0.8;
                transform: scale(1.2);
            }

            100% {
                opacity: 0;
                transform: scale(0.5);
            }
        }
    </style>
</head>

<body>

    <!-- Block: star-field -->
    <div id="stars-container" class="star-field"></div>

    <!-- Block: error-page (Utilisation de <main> pour la sémantique) -->
    <main class="error-page">

        <!-- Element: Content (Utilisation de <section> pour découper le contenu) -->
        <section class="error-page__content content">
            <span class="content__label">Erreur 404</span>
            <h1 class="content__title">Houston, on a un problème.</h1>
            <p class="content__description">
                La page que vous recherchez semble avoir dérivé dans le vide intersidéral.
                Elle a peut-être été déplacée ou n'a jamais existé.
            </p>

            <div class="btn-group">
                <!-- Block: btn avec Modifier: primary -->
                <a href="/" class="btn btn--primary">
                    Retour à la base
                </a>
            </div>
        </section>

        <!-- Element: Visual (Utilisation de <aside> car c'est une illustration) -->
        <aside class="error-page__visual visual">
            <div class="visual__backdrop"></div>
            <!-- SVG Astronaute -->
            <svg class="visual__svg" aria-hidden="true" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                <circle cx="250" cy="200" r="120" fill="#f8fafc" />
                <path d="M170 200 Q250 280 330 200" fill="#38bdf8" opacity="0.9" />
                <ellipse cx="250" cy="190" rx="100" ry="80" fill="#0f172a" />
                <ellipse cx="220" cy="170" rx="30" ry="15" fill="white" opacity="0.2" transform="rotate(-20 220 170)" />
                <path d="M160 300 Q140 450 160 500 L340 500 Q360 450 340 300 Z" fill="#e2e8f0" />
                <path d="M160 300 Q250 350 340 300" fill="#cbd5e1" />
                <path d="M150 320 Q80 350 60 280" stroke="#e2e8f0" stroke-width="40" stroke-linecap="round"
                    fill="none" />
                <circle cx="60" cy="280" r="25" fill="#cbd5e1" />
                <path d="M350 320 Q420 350 440 280" stroke="#e2e8f0" stroke-width="40" stroke-linecap="round"
                    fill="none" />
                <circle cx="440" cy="280" r="25" fill="#cbd5e1" />
                <rect x="210" y="350" width="80" height="60" rx="10" fill="#cbd5e1" />
                <circle cx="230" cy="380" r="5" fill="#ef4444" />
                <circle cx="250" cy="380" r="5" fill="#fbbf24" />
                <circle cx="270" cy="380" r="5" fill="#22c55e" />
                <path d="M250 100 Q300 50 450 50" stroke="#64748b" stroke-width="4" fill="none"
                    stroke-dasharray="10 10" />
            </svg>
        </aside>

    </main>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const container = document.getElementById('stars-container');
            const starCount = 100;
            // Création des étoiles avec la classe BEM correspondante
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.classList.add('star-field__star'); // Classe BEM

                const x = Math.random() * 100;
                const y = Math.random() * 100;
                const size = Math.random() * 3 + 1;
                const duration = Math.random() * 3 + 2;
                const delay = Math.random() * 5;

                star.style.left = `${x}%`;
                star.style.top = `${y}%`;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.setProperty('--duration', `${duration}s`);
                star.style.setProperty('--delay', `${delay}s`);

                container.appendChild(star);
            }
        });
    </script>
</body>

</html>