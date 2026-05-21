import os

file_path = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB\mentions_legales.html"

replacements = {
    "bg-white shadow-sm border border-gray-200": "bg-white dark:bg-cyber-panel shadow-sm border border-gray-200 dark:border-gray-700",
    "border-b border-gray-200 pb-6 mb-8": "border-b border-gray-200 dark:border-gray-700 pb-6 mb-8",
    "text-gray-900": "text-gray-900 dark:text-white",
    "text-gray-700": "text-gray-700 dark:text-gray-300",
    "text-gray-600": "text-gray-600 dark:text-gray-400",
    "text-gray-500": "text-gray-500 dark:text-gray-400",
    "border-blue-500": "border-cyber-blue",
    "text-blue-600": "text-cyber-blue",
    "bg-gray-50": "bg-gray-50 dark:bg-gray-800"
}

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Only apply replacements inside the <main> block to avoid breaking header/footer if they have similar classes
start_main = content.find("<main")
end_main = content.find("</main>") + 7

if start_main != -1 and end_main != -1:
    main_content = content[start_main:end_main]
    
    for old_str, new_str in replacements.items():
        main_content = main_content.replace(old_str, new_str)
        
    content = content[:start_main] + main_content + content[end_main:]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed dark mode classes in mentions_legales.html")
