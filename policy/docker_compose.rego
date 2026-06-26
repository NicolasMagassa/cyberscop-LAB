package main

# Règle 1 : Chaque service de l'architecture doit spécifier une politique de redémarrage (restart)
deny[msg] {
    some service_name
    service := input.services[service_name]
    not service.restart
    msg := sprintf("Conformité GRC - Le service '%v' doit déclarer une politique de redémarrage ('restart')", [service_name])
}

# Règle 2 : Le service backend (Strapi) doit obligatoirement utiliser un fichier d'environnement (env_file)
# Cela évite les secrets en dur dans docker-compose.yml qui fuiteraient sur Git (sécurisation de la supply chain)
deny[msg] {
    some service_name
    service := input.services[service_name]
    service_name == "backend"
    not service.env_file
    msg := "Conformité GRC - Le service backend (Strapi) doit charger ses secrets via un fichier d'environnement ('env_file')"
}

# Règle 3 : Le service frontend doit écouter sur un port sécurisé non privilégié (> 1024)
deny[msg] {
    some service_name
    service := input.services[service_name]
    service_name == "frontend"
    port_mapping := service.ports[_]
    parts := split(port_mapping, ":")
    host_port := to_number(parts[0])
    host_port < 1024
    msg := sprintf("Conformité GRC - Le port exposé '%v' du frontend doit être supérieur à 1024 pour autoriser l'exécution non-root", [host_port])
}
