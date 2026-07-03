import os
import json
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from xml.dom import minidom

# Configuration
SITEMAP_PATH = os.path.join(os.path.dirname(__file__), "..", "sitemap.xml")
BASE_URL = "https://nicolasmagassa.github.io/cyberscop-LAB"
STRAPI_API_URL = "http://localhost:1337/api"

# Endpoints mapping to type parameter in frontend URL
CONTENT_TYPES = {
    "veilles": "veille",
    "reglementations": "reglementation",
    "ias": "ia",
    "grcs": "grc",
    "recherches": "recherches",
    "briefings": "briefing"
}

# Fallback mock IDs in case Strapi is offline
MOCK_ARTICLES = [
    {"type": "veille", "id": 1},
    {"type": "veille", "id": 2},
    {"type": "veille", "id": 3},
    {"type": "reglementation", "id": 1},
    {"type": "reglementation", "id": 2},
    {"type": "ia", "id": 1},
    {"type": "grc", "id": 1},
    {"type": "recherches", "id": 1},
    {"type": "briefing", "id": 1},
    {"type": "briefing", "id": 2}
]

def fetch_articles_from_strapi():
    """Fetch article IDs from Strapi APIs. Returns list of dicts with type and id."""
    articles = []
    print("Tentative de récupération des articles depuis Strapi...")
    
    for endpoint, type_param in CONTENT_TYPES.items():
        url = f"{STRAPI_API_URL}/{endpoint}"
        try:
            req = urllib.request.Request(
                url, 
                headers={'User-Agent': 'SitemapGenerator/1.0'}
            )
            with urllib.request.urlopen(req, timeout=3) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode())
                    items = data.get("data", [])
                    for item in items:
                        # Strapi v4/v5 format handles both item.id and attributes.documentId
                        # We use the standard numeric ID as requested by the frontend URL parameters
                        item_id = item.get("id")
                        if item_id:
                            articles.append({"type": type_param, "id": item_id})
                    print(f"  [OK] {len(items)} articles récupérés pour le type '{type_param}'")
        except urllib.error.URLError as e:
            print(f"  [Erreur/Offline] Impossible d'interroger {url} : {e}")
            raise ConnectionError("Strapi est inaccessible")
        except Exception as e:
            print(f"  [Erreur] Erreur lors du parsing de {url} : {e}")
            raise e
            
    return articles

def generate_sitemap():
    # 1. Obtenir les articles dynamiques (Strapi ou Mock)
    try:
        articles = fetch_articles_from_strapi()
        print(f"Total articles dynamiques récupérés de Strapi : {len(articles)}")
    except (ConnectionError, Exception):
        print("-> Repli sur les données mockées locales pour générer le sitemap.")
        articles = MOCK_ARTICLES

    # 2. Définir le namespace XML
    ET.register_namespace('', "http://www.sitemaps.org/schemas/sitemap/0.9")
    
    # Page statiques fixes de base
    static_urls = [
        {"path": "index.html", "priority": "1.00"},
        {"path": "qui_suis_je.html", "priority": "0.80"},
        {"path": "contact.html", "priority": "0.80"},
        {"path": "veille.html", "priority": "0.90"},
        {"path": "ReglementationDevSecOps.html", "priority": "0.90"},
        {"path": "ia.html", "priority": "0.90"},
        {"path": "grc.html", "priority": "0.90"},
        {"path": "recherches.html", "priority": "0.90"},
        {"path": "CGU.html", "priority": "0.30"},
        {"path": "mentions_legales.html", "priority": "0.30"},
        {"path": "cookies.html", "priority": "0.30"},
        {"path": "politique_confidentialite.html", "priority": "0.30"}
    ]

    # Création de l'arborescence XML
    root = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")

    # Ajouter les pages statiques
    for page in static_urls:
        url_elem = ET.SubElement(root, "url")
        loc_elem = ET.SubElement(url_elem, "loc")
        loc_elem.text = f"{BASE_URL}/{page['path']}"
        priority_elem = ET.SubElement(url_elem, "priority")
        priority_elem.text = page["priority"]

    # Ajouter les articles dynamiques
    for article in articles:
        url_elem = ET.SubElement(root, "url")
        loc_elem = ET.SubElement(url_elem, "loc")
        loc_elem.text = f"{BASE_URL}/article.html?type={article['type']}&id={article['id']}"
        priority_elem = ET.SubElement(url_elem, "priority")
        priority_elem.text = "0.70"

    # Formater en XML bien indenté
    xml_string = ET.tostring(root, encoding='utf-8')
    reparsed = minidom.parseString(xml_string)
    pretty_xml = reparsed.toprettyxml(indent="  ")

    # Supprimer les lignes vides générées par minidom
    clean_xml = "\n".join([line for line in pretty_xml.splitlines() if line.strip()])

    # Écrire dans le sitemap.xml
    with open(SITEMAP_PATH, "w", encoding="utf-8") as f:
        f.write(clean_xml)

    print(f"\n[Succès] Fichier sitemap.xml mis à jour avec {len(static_urls)} pages statiques et {len(articles)} pages d'articles.")

if __name__ == "__main__":
    generate_sitemap()
