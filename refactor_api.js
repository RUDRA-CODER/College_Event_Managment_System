const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('src');

files.forEach(file => {
    if (file.includes('services\\api.ts')) return; // Skip api.ts itself
    
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('http://localhost:5000/api')) {
        // Count how many depths to go back to src/services/api
        // file is like src\app\admin\profile\page.tsx
        // split by \ and count
        const parts = file.split(path.sep);
        const depth = parts.length - 2; // -1 for src, -1 for filename
        let importPath = '@/services/api';
        
        let modified = false;
        
        // Add import if not exists
        if (!content.includes('API_BASE')) {
            const importStmt = `import { API_BASE } from '${importPath}';\n`;
            // Find the last import
            const lastImportIndex = content.lastIndexOf('import ');
            if (lastImportIndex !== -1) {
                const endOfLastImport = content.indexOf('\n', lastImportIndex);
                content = content.substring(0, endOfLastImport + 1) + importStmt + content.substring(endOfLastImport + 1);
            } else {
                content = importStmt + content;
            }
            modified = true;
        }

        // Replace strings
        if (content.includes("'http://localhost:5000/api")) {
            content = content.replace(/'http:\/\/localhost:5000\/api/g, "`${API_BASE}");
            // need to fix the closing quote if it was a single quote and now it's a template literal
            // Actually it's easier to regex: 'http://localhost:5000/api/...' -> `${API_BASE}/...`
            content = content.replace(/'http:\/\/localhost:5000\/api([^']*)'/g, "`${API_BASE}$1`");
            modified = true;
        }
        
        // Replace template literals: `http://localhost:5000/api/...` -> `${API_BASE}/...`
        if (content.includes("`http://localhost:5000/api")) {
            content = content.replace(/`http:\/\/localhost:5000\/api/g, "`${API_BASE}");
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(file, content);
            console.log(`Updated ${file}`);
        }
    }
});
