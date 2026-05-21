const fs = require('fs');
const path = require('path');

const cssPath = 'src/index.css';
const content = fs.readFileSync(cssPath, 'utf8');

const themeRegex = /@theme\s*{([^}]+)}/;
const match = content.match(themeRegex);

if (!match) {
  console.log("No theme block found");
  process.exit(1);
}

const themeBlock = match[1];
const lines = themeBlock.split('\n');
const colors = [];

const NEW_LIGHT_COLORS = {
  surface: '#ffffff',
  background: '#f8fafc',
  'on-surface': '#0f172a',
  'on-background': '#0f172a',
  primary: '#2563eb',
  'primary-container': '#dbeafe',
  'on-primary': '#ffffff',
  'surface-container': '#f1f5f9',
  'surface-container-low': '#f8fafc',
  'surface-container-lowest': '#ffffff',
  'surface-container-high': '#e2e8f0',
  'surface-container-highest': '#cbd5e1',
  'surface-variant': '#e2e8f0',
  'on-surface-variant': '#475569',
  outline: '#94a3b8',
  'outline-variant': '#cbd5e1'
};

for (const line of lines) {
  const t = line.trim();
  if (t.startsWith('--color-')) {
    const parts = t.split(':');
    const name = parts[0].trim().replace('--color-', '');
    const val = parts[1].replace(';', '').trim();
    colors.push({ name, darkVal: val });
  }
}

let rootBlock = ':root {\n';
let darkBlock = '.dark {\n';
let newThemeBlock = '@theme {\n';

for (const c of colors) {
  let lightVal = NEW_LIGHT_COLORS[c.name];
  if (!lightVal) {
    if (c.darkVal === '#dde2f8') lightVal = '#0f172a';
    else if (c.darkVal === '#0d1322') lightVal = '#ffffff';
    else lightVal = c.darkVal;
  }
  
  rootBlock += `  --theme-${c.name}: ${lightVal};\n`;
  darkBlock += `  --theme-${c.name}: ${c.darkVal};\n`;
  newThemeBlock += `  --color-${c.name}: var(--theme-${c.name});\n`;
}

rootBlock += '}\n';
darkBlock += '}\n';
newThemeBlock += '\n' + lines.filter(l => !l.trim().startsWith('--color-')).join('\n') + '\n}';

const finalContent = content.replace(themeRegex, rootBlock + '\n' + darkBlock + '\n' + newThemeBlock);
fs.writeFileSync(cssPath, finalContent);
console.log("Updated index.css");
