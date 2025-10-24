/* Run from repo root:
   node ./scripts/normalize-components-imports.js
   then: npm --workspace=Replax/frontend run build
*/
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const repo = path.resolve(__dirname, '..');
const frontend = path.join(repo, 'frontend');
const comps = path.join(frontend, 'components');

if (!fs.existsSync(frontend) || !fs.existsSync(comps)) {
  console.error('frontend/components not found:', frontend, comps);
  process.exit(1);
}

const exts = ['js','jsx','ts','tsx'];
const files = glob.sync(`${frontend}/**/*.{${exts.join(',')}}`, { ignore: ['**/node_modules/**','**/.next/**','**/dist/**'] });
const folders = fs.readdirSync(comps).filter(n => fs.statSync(path.join(comps,n)).isDirectory());
const folderMap = {};
folders.forEach(f => folderMap[f.toLowerCase()] = f);

const modified = [], changes = [], deleted = [];

function posix(p){ return p.split(path.sep).join('/'); }

files.forEach(file => {
  if (file.startsWith(posix(comps) + '/')) return; // skip components internals
  let src = fs.readFileSync(file, 'utf8');
  let out = src;

  // match imports referencing components folder in many variants
  out = out.replace(/from\s+(['"])(\.+\/+components\/[^'"]+)['"]/g, (m, q, imp) => {
    // imp examples: ../../components/Header/Header.jsx, ../components/header, ../../components/Header/index.jsx
    const parts = imp.split('/');
    const i = parts.findIndex(p=>p.toLowerCase()==='components');
    if (i === -1 || !parts[i+1]) return m;
    const compRaw = parts[i+1];
    const compFolder = folderMap[compRaw.toLowerCase()];
    if (!compFolder) return m;
    // compute relative path from file dir to frontend/components
    const rel = posix(path.relative(path.dirname(file), comps));
    const relPath = rel === '' ? './components' : (rel.startsWith('.') ? rel : './' + rel);
    const newPath = `${relPath}/${compFolder}`;
    changes.push({ file: path.relative(repo,file), from: imp, to: newPath });
    return `from ${q}${newPath}${q}`;
  });

  if (out !== src) {
    fs.writeFileSync(file, out, 'utf8');
    modified.push(path.relative(repo,file));
  }
});

// remove duplicates under components root like Header.jsx Footer.jsx
['Header','Footer'].forEach(base=>{
  exts.forEach(ext=>{
    const p1 = path.join(comps, `${base}.${ext}`);
    const p2 = path.join(comps, `${base.toLowerCase()}.${ext}`);
    [p1,p2].forEach(p=>{ if (fs.existsSync(p)){ fs.unlinkSync(p); deleted.push(path.relative(repo,p)); }});
  });
});

// remove frontend/package-lock.json to avoid multiple lockfile warning
const lock = path.join(frontend,'package-lock.json');
if (fs.existsSync(lock)){ fs.unlinkSync(lock); deleted.push(path.relative(repo,lock)); }

console.log('Modified files:', modified.length); modified.forEach(f=>console.log(' M',f));
console.log('Replacements:', changes.length); changes.slice(0,200).forEach(c=>console.log(' R',c.file, c.from, '->', c.to));
if (deleted.length){ console.log('Deleted files:', deleted.length); deleted.forEach(d=>console.log(' D', d)); }
console.log('\nRun: npm --workspace=Replax/frontend run build');
