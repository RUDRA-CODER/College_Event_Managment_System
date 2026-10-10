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
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Fix the mismatched backtick and single quote: `${API_BASE}/admin/coordinators' -> `${API_BASE}/admin/coordinators`
    // Regex: /`\$\{API_BASE\}([^'`]*)'/g -> "`${API_BASE}$1`"
    
    // There are some places like `${API_BASE}' which should be `${API_BASE}`
    if (/`\$\{API_BASE\}([^'`]*)'/.test(content)) {
        content = content.replace(/`\$\{API_BASE\}([^'`]*)'/g, '`${API_BASE}$1`');
        modified = true;
    }
    
    // Fix cases where maybe there was a backtick to start with that got messed up?
    // Let's check if there are any ```${API_BASE}
    
    if (modified) {
        fs.writeFileSync(file, content);
        console.log(`Fixed ${file}`);
    }
});
