import os
import re

base_dir = r'd:\projets\projets pour entreprise\Alliance One\AllianceFrontend\src\modules\education\pages'

for root, _, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find the import from '../components'
            match = re.search(r'import\s+{([^}]+)}\s+from\s+[\'\"].\./components[\'\"]', content)
            if match:
                imports = [i.strip() for i in match.group(1).split(',')]
                types = []
                values = []
                for imp in imports:
                    if imp in ['Column', 'TableAction', 'WizardStep']:
                        types.append(imp)
                    else:
                        values.append(imp)
                
                if types:
                    values_str = ', '.join(values)
                    types_str = ', '.join(types)
                    if values_str:
                        new_import = f"import {{ {values_str} }} from '../components';\nimport type {{ {types_str} }} from '../components';"
                    else:
                        new_import = f"import type {{ {types_str} }} from '../components';"
                    
                    new_content = content[:match.start()] + new_import + content[match.end():]
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f'Fixed {filepath}')

