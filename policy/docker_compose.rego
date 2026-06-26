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

# Règle 4 : Isolation réseau - Interdire d'exposer directement un port de base de données (ex: 5432, 3306, 27017, 6379) sur l'hôte
# Les communications avec la base de données doivent rester internes au réseau privé des conteneurs
deny[msg] {
    some service_name
    service := input.services[service_name]
    port_mapping := service.ports[_]
    parts := split(port_mapping, ":")
    host_port := to_number(parts[0])
    
    # Liste des ports de bases de données courants à bloquer
    db_ports := {5432, 3306, 27017, 6379} # Postgres, MySQL, MongoDB, Redis
    db_ports[host_port]
    
    msg := sprintf("Conformité GRC - Le service '%v' expose le port de base de données '%v' sur l'hôte. C'est interdit, la communication doit rester interne au réseau de conteneurs.", [service_name, host_port])
}

