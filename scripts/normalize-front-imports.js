/* Normalizes Header/Footer (and other index-based) imports to use folder import:
   import Header from '../../components/Header';
   import Footer from '../../components/Footer';
   - Updates imports across frontend sources
   - Removes duplicate component files at components/ root (Header.jsx, Footer.jsx, ...)
   - Removes frontend/package-lock.json
   - Prints a summary of changes
Run from repo root:
  node scripts/normalize-front-imports.js
*/
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const repoRoot = path.resolve(__dirname, '..');
const frontend = path.join(repoRoot, 'frontend');
const componentsDir = path.join(frontend, 'components');

if (!fs.existsSync(frontend) || !fs.existsSync(componentsDir)) {
  console.error('Frontend or components folder not found. Expected:', frontend, componentsDir);
  process.exit(1);
}

const exts = ['js','jsx','ts','tsx'];
const filePattern = `${frontend}/**/*.{${exts.join(',')}}`;
const ignore = ['**/node_modules/**','**/.next/**','**/dist/**','**/public/**'];

const componentFolders = fs.readdirSync(componentsDir)
  .filter(name => fs.existsSync(path.join(componentsDir, name)) && fs.statSync(path.join(componentsDir, name)).isDirectory())
  .map(name => name);

// Build mapping of normalized component name -> desired import path
// Desired import path per instructions: '../../components/CompName'
const compMap = {};
componentFolders.forEach(name => {
  const Comp = name; // preserve folder name casing
  compMap[Comp.toLowerCase()] = `../../components/${Comp}`;
});

const modifiedFiles = [];
const replacements = [];
const deletedFiles = [];

// Helper: create regex to match import paths that reference the component in many variants
function makeRegexForComp(comp) {
  const cLower = comp.toLowerCase();
  // match patterns like ../components/header, ../../components/Header/Header, ../components/Header/Header.jsx, etc.
  // capture the whole "from '...'" segment for safe replacement
  return new RegExp(`from\\s+['"](?:\\.\\.\\/)+components\\/(?:${comp}|${cLower})(?:\\/${comp}|\\/${cLower})?(?:\\.[jt]sx?)?['"]`, 'g');
}

// Process files
const files = glob.sync(filePattern, { ignore });
files.forEach(file => {
  // skip files inside components folder (we don't want to change component internal imports here)
  if (file.startsWith(componentsDir + path.sep)) return;

  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  // For each known component folder, replace any import variant with "../../components/Comp"
  Object.keys(compMap).forEach(lower => {
    const target = compMap[lower];
    const compFolder = componentFolders.find(f => f.toLowerCase() === lower);
    if (!compFolder) return;
    const regex = makeRegexForComp(compFolder);
    content = content.replace(regex, `from '${target}'`);
    // Also replace absolute-ish occurrences like "components/Header" -> "../../components/Header"
    const absRegex = new RegExp(`from\\s+['"]components\\/(?:${compFolder}|${lower})(?:\\/[\\w\\.\\-]+)?['"]`, 'g');
    content = content.replace(absRegex, `from '${target}'`);
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedFiles.push(path.relative(repoRoot, file));
    // collect replacement examples (first few)
    const lines = content.split('\n').filter(l => /from\s+['"].*components\/(Header|Footer|header|footer|[A-Za-z]+)['"]/.test(l));
    lines.slice(0,5).forEach(l => replacements.push({ file: path.relative(repoRoot, file), line: l.trim() }));
  }
});

// Remove duplicate component files at components root (Header.jsx, Footer.jsx, etc.)
const possibleDupExts = ['js','jsx','ts','tsx'];
componentFolders.forEach(folder => {
  possibleDupExts.forEach(ext => {
    const dupPath = path.join(componentsDir, `${folder}.${ext}`);
    if (fs.existsSync(dupPath) && fs.statSync(dupPath).isFile()) {
      fs.unlinkSync(dupPath);
      deletedFiles.push(path.relative(repoRoot, dupPath));
    }
  });
});

// Also delete any Header.jsx / Footer.jsx with different casing at root
['Header','Footer'].forEach(base => {
  possibleDupExts.forEach(ext => {
    const p1 = path.join(componentsDir, `${base}.${ext}`);
    const p2 = path.join(componentsDir, `${base.toLowerCase()}.${ext}`);
    [p1,p2].forEach(p => {
      if (fs.existsSync(p) && fs.statSync(p).isFile()) {
        fs.unlinkSync(p);
        deletedFiles.push(path.relative(repoRoot, p));
      }
    });
  });
});

// Remove frontend/package-lock.json if exists
const lockfile = path.join(frontend, 'package-lock.json');
if (fs.existsSync(lockfile)) {
  fs.unlinkSync(lockfile);
  deletedFiles.push(path.relative(repoRoot, lockfile));
}

// Print summary
console.log('--- Normalization summary ---');
console.log('Component folders found:', componentFolders.join(', ') || '(none)');
console.log('');
console.log('Modified files:', modifiedFiles.length);
modifiedFiles.forEach(f => console.log(' M', f));
console.log('');
console.log('Sample updated import lines (up to 20):');
replacements.slice(0,20).forEach(r => {
  console.log(' R', r.file, ':', r.line);
});
console.log('');
if (deletedFiles.length) {
  console.log('Deleted files:');
  deletedFiles.forEach(d => console.log(' D', d));
} else {
  console.log('No duplicate component files or frontend package-lock.json found to delete.');
}

console.log('\nNow run from repo root to verify build:');
console.log('  npm --workspace=Replax/frontend run build');
