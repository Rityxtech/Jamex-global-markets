import os, glob

pages_dir = r'c:\Web Projects\Undeployed\Jamex Global Markets\src\pages'
files = glob.glob(os.path.join(pages_dir, '*.tsx'))

import_stmt = "import BottomNav from '../components/BottomNav';\n"

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<nav className="md:hidden fixed bottom-0' in content:
        # We need to find the start of the nav and the end of the nav
        start_idx = content.find('<nav className="md:hidden fixed bottom-0')
        end_idx = content.find('</nav>', start_idx) + 6
        
        # Replace the nav block with <BottomNav />
        new_content = content[:start_idx] + '<BottomNav />\n            ' + content[end_idx:]
        
        # Remove any preceding comments before the nav block
        # Look for {/* Mobile Bottom NavBar ... */}
        mobile_nav_comment_idx = new_content.rfind('{/* Mobile Bottom Nav', 0, start_idx)
        if mobile_nav_comment_idx != -1 and new_content[mobile_nav_comment_idx:start_idx].strip().startswith('{/* Mobile Bottom'):
            # The comment is right above the nav
            new_content = new_content[:mobile_nav_comment_idx] + new_content[start_idx:]
            
        # Also clean up the BottomNav injection spacing
        new_content = new_content.replace('{/* Mobile Bottom NavBar */}\n            <BottomNav />', '<BottomNav />')
        
        # Add the import statement if not exists
        if 'import BottomNav' not in new_content:
            # Find the last import statement
            last_import_idx = new_content.rfind('import ')
            end_of_last_import = new_content.find('\n', last_import_idx) + 1
            new_content = new_content[:end_of_last_import] + import_stmt + new_content[end_of_last_import:]
            
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {file}')
