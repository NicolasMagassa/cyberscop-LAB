import os
import re
import glob

workspace_dir = r"c:\Users\user\Desktop\developpeur\BLOG PERSO\cyberscop LAB"
index_path = os.path.join(workspace_dir, "index.html")

# 1. Read index.html and extract the modal chunk
with open(index_path, "r", encoding="utf-8") as f:
    index_content = f.read()

# Use regex to extract everything from <!-- Cookie Modal --> up to just before <script src="assets/js/main.js">
# The match will include <!-- Cookie Modal -->
match = re.search(r"(    <!-- Cookie Modal -->.*?)(?=    <script src=\"assets/js/main.js\">)", index_content, re.DOTALL | re.IGNORECASE)

if not match:
    print("Could not find the Cookie Modal block in index.html")
    exit(1)

modal_chunk = match.group(1)
print("Extracted modal chunk (length: {})".format(len(modal_chunk)))

# 2. Iterate through all html files
html_files = glob.glob(os.path.join(workspace_dir, "*.html"))

for file_path in html_files:
    # Skip index.html since it already has it
    if os.path.basename(file_path).lower() == "index.html":
        continue
        
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Check if the modal is already present
    if "<!-- Cookie Modal -->" in content:
        print(f"Modals already present in {os.path.basename(file_path)}, skipping.")
        continue
        
    # Inject before the script tag
    script_pattern = re.compile(r"(\s*<script src=\"assets/js/main\.js\"></script>)", re.IGNORECASE)
    
    # Check if the script tag exists
    if not script_pattern.search(content):
        print(f"Warning: main.js script tag not found in {os.path.basename(file_path)}!")
        continue
        
    # Perform injection
    new_content = script_pattern.sub(r"\n" + modal_chunk + r"\1", content)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
        
    print(f"Injected modals into {os.path.basename(file_path)}")

print("Done injecting modals into all pages.")
