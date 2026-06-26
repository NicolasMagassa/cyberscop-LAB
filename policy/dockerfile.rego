package main

# Règle 1 : Interdire l'exécution en tant que root (obligation d'avoir une instruction USER)
deny[msg] {
    input[i].Cmd == "from"
    not has_user_instruction
    msg := "Conformité GRC - Le Dockerfile ne contient pas d'instruction 'USER'. L'exécution en root est interdite par sécurité."
}

# Règle 2 : Interdire l'utilisation d'images de base avec le tag ':latest' (instabilité et dérive de configuration)
deny[msg] {
    input[i].Cmd == "from"
    val := input[i].Value[_]
    contains(val, ":latest")
    msg := sprintf("Conformité GRC - L'image de base '%v' utilise le tag ':latest'. Vous devez spécifier une version fixe pour la reproductibilité.", [val])
}

# Fonction utilitaire pour vérifier si l'instruction USER est déclarée dans les étapes
has_user_instruction {
    input[j].Cmd == "user"
}
