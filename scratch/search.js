/* eslint-disable */
const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.next') {
        searchDir(fullPath);
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json') || file.endsWith('.js')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('saumyadeepch.vercel.app')) {
          console.log(`Found in: ${fullPath}`);
          // Print matching line numbers and contents
          const lines = content.split('\n');
          lines.forEach((line, idx) => {
            if (line.includes('saumyadeepch.vercel.app')) {
              console.log(`  L${idx + 1}: ${line.trim()}`);
            }
          });
        }
      }
    }
  }
}

searchDir(path.join(__dirname, '..'));
