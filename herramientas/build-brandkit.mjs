/** Package existing brand assets without redrawing, cropping or recoloring them. */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { files, inside, removeWorkdir, slash } from './brandkit/paths.mjs';
import { verifyKit } from './verify-brandkit.mjs';
import { symbolFiles } from './brandkit/simbolo.mjs';
import { characterGallery } from './brandkit/galeria-personaje.mjs';
import { characterExports } from './brandkit/exportaciones-personaje.mjs';
import { avatarFiles } from './brandkit/avatar.mjs';
import { designFiles } from './brandkit/design-files.mjs';
import { readRelease, statusOf } from './brandkit/release.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const currentKit = path.join(root, 'brandkit');
const release = await readRelease(currentKit);
let kit;
const provenance = new Map();
const transforms = new Map();
function target(relative) {
  return inside(kit, relative);
}
async function write(relative, data) {
  const dest = target(relative);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, data);
}
async function copy(source, relative, label) {
  const dest = target(relative);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  let bytes = await fs.readFile(source);
  if (/\.(md|txt|css|json|svg)$/i.test(source)) {
    bytes = Buffer.from(bytes.toString('utf8').replace(/\r\n/g, '\n'));
    transforms.set(relative, 'lf');
  }
  await fs.writeFile(dest, bytes);
  provenance.set(relative, label || `repository/${slash(path.relative(root, source))}`);
}

const originalNames = ['d54017bf-565f-49e0-8192-bd0f47bfc050.png','spritesmeli1.png','spritesmeli2.png',
  'Image Aug 19, 2026, 01_47_20 AM (1).png', ...[2,3,4,5].map(i => `Image Aug 19, 2026, 01_47_21 AM (${i}).png`)];
const documentNames = ['gatopago-rebranding-maestro-2026.md','gatopago-plan-marca-experiencia-2026.md','gatopago_nueva_narrativa_contexto_completo_2026-08-18.txt'];
const required = [
  ...documentNames.map(name=>path.join(root,'estrategia/vigente',name)),
  path.join(root,'herramientas/brandkit/catalogo.html'),
  ...originalNames.map(name=>path.join(currentKit,'06-originales',name)),
  ...['README.md','CONTROL-DE-CALIDAD.md','02-logos/modelo/simbolo.txt','02-logos/modelo/simbolo-16.txt','03-personaje/README.md','03-personaje/animaciones/manifest.json','04-tipografia/recursive/full.css','04-tipografia/recursive/LICENSE.txt','05-colores/tokens.json','08-imagenes/open-graph/og.png'].map(name=>path.join(currentKit,name)),
];
const missing = [];
for(const file of required) {
  try { if(!(await fs.stat(file)).isFile()) missing.push(file); } catch { missing.push(file); }
}
if(missing.length) throw new Error(`Preflight failed; kit was not modified. Missing files:\n${missing.join('\n')}`);
if((await fs.lstat(currentKit)).isSymbolicLink()) throw new Error('The canonical kit cannot be a symlink');
await files(currentKit); // Reject symbolic links before copying or replacing the directory.
await files(path.join(currentKit,'04-tipografia/recursive/files'));
const fontCssPreflight = await fs.readFile(path.join(currentKit,'04-tipografia/recursive/full.css'),'utf8');
for(const match of fontCssPreflight.matchAll(/url\(\.\/([^)]*)\)/g)) await fs.access(inside(path.join(currentKit,'04-tipografia/recursive'),match[1]));

async function fingerprint(dir) {
  const digest = crypto.createHash('sha256');
  for(const file of await files(dir)) {
    digest.update(slash(path.relative(dir,file))+'\0');
    digest.update(crypto.createHash('sha256').update(await fs.readFile(file)).digest());
  }
  return digest.digest('hex');
}
const lockPath = path.join(root,'.brandkit-build.lock');
const lock = await fs.open(lockPath,'wx');
let work, keepWork = false;
try {
const initialFingerprint = await fingerprint(currentKit);
work = await fs.mkdtemp(path.join(root,'.brandkit-work-'));
kit = path.join(work,'staged');
await fs.cp(currentKit,kit,{recursive:true});

// Symbol and web icons: generated from the approved pixel maps (02-logos/modelo).
for (const [relative, bytes] of Object.entries(await symbolFiles(
  await fs.readFile(target('02-logos/modelo/simbolo.txt'), 'utf8'), await fs.readFile(target('02-logos/modelo/simbolo-16.txt'), 'utf8')))) {
  await write(relative, bytes);
}
// Originals, the character brief and licensed font files are canonical in Git.
// descartado/ keeps retired work (the 2026-09 mascot); it is inventoried but never shipped in the delivery ZIP.
const character = JSON.parse(await fs.readFile(target('03-personaje/animaciones/manifest.json'), 'utf8'));
const exports = await characterExports(kit,character);
const avatar = await avatarFiles(await fs.readFile(target('02-logos/modelo/simbolo.txt'),'utf8'));
for(const [file,bytes] of Object.entries(avatar.files)) await write(file,bytes);
await write('03-personaje/galeria.html', characterGallery(character,exports,avatar.manifest));
await write('04-tipografia/uso.css', `@import url('./recursive/full.css');
.gp-linear { font-family: 'Recursive Variable', sans-serif; font-variation-settings: 'MONO' 0, 'CASL' 0, 'slnt' 0, 'CRSV' .5; }
.gp-casual { font-family: 'Recursive Variable', sans-serif; font-variation-settings: 'MONO' 0, 'CASL' 1, 'slnt' 0, 'CRSV' .5; }
.gp-mono { font-family: 'Recursive Variable', monospace; font-variation-settings: 'MONO' 1, 'CASL' 0, 'slnt' 0, 'CRSV' .5; font-variant-numeric: tabular-nums; }
`);

for (const name of documentNames) {
  await copy(path.join(root, 'estrategia/vigente', name), `07-referencias/documentos/${name}`);
}
const tokenDocument = JSON.parse(await fs.readFile(target('05-colores/tokens.json'),'utf8'));
const tokens = tokenDocument.tokens;
if (tokenDocument.schemaVersion !== 1 || !tokens || !Object.keys(tokens).length || Object.entries(tokens).some(([name,value])=>!/^--meli-[\w-]+$/.test(name) || typeof value !== 'string' || /[;{}\r\n]/.test(value))) {
  throw new Error('Invalid canonical design tokens');
}
const rootBlock = '\n' + Object.entries(tokens).map(([name,value])=>`  ${name}: ${value};`).join('\n') + '\n';
await write('05-colores/tokens.css', `/* Generado desde tokens.json; editar la fuente JSON. */\n:root {${rootBlock}}\n`);
const colors = Object.entries(tokens).filter(([,v]) => /^#[\da-f]{6}$/i.test(v)).map(([name,hex]) => ({name:name.replace('--meli-',''), hex:hex.toUpperCase(), rgb:[1,3,5].map(i => parseInt(hex.slice(i,i+2),16))}));
await write('05-colores/paleta.csv', 'token,hex,r,g,b\n' + colors.map(c => `${c.name},${c.hex},${c.rgb.join(',')}`).join('\n') + '\n');
await write('05-colores/gatopago.gpl', 'GIMP Palette\nName: GatoPago\nColumns: 4\n# sRGB\n' + colors.map(c => `${c.rgb.join(' ')} ${c.name}`).join('\n') + '\n');
const luminance = rgb => rgb.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((v,c,i)=>v+c*[.2126,.7152,.0722][i],0);
const color = n => colors.find(c=>c.name===n);
const pairs = [['ink','milk'],['ink','cat-fire'],['milk','ink'],['milk','cat-fire'],['cat-shadow','milk']];
const contrast = pairs.map(([fg,bg])=> { const a=luminance(color(fg).rgb), b=luminance(color(bg).rgb); const ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05); return {foreground:fg,background:bg,ratio:Number(ratio.toFixed(2)),normalTextAA:ratio>=4.5,largeTextAA:ratio>=3}; });
await write('05-colores/contraste.json', JSON.stringify(contrast,null,2)+'\n');
await write('05-colores/README.md', `# Paleta de GatoPago\n\nLa fuente editable es [tokens.json](./tokens.json). Se conservan los valores de la identidad existente, sin depender del código de un frontend. [tokens.css](./tokens.css), CSV, GPL y contraste se regeneran desde ese JSON. Los nombres internos \`--meli-*\` se mantienen por compatibilidad; no son nombres públicos de producto. Los colores semánticos identifican estados; no son acentos intercambiables.\n\n| Token | HEX | RGB |\n|---|---|---|\n${colors.map(c=>`| ${c.name} | ${c.hex} | ${c.rgb.join(', ')} |`).join('\n')}\n\n## Contraste calculado\n\n| Texto / fondo | Ratio | AA texto normal |\n|---|---:|---|\n${contrast.map(c=>`| ${c.foreground} / ${c.background} | ${c.ratio}:1 | ${c.normalTextAA?'Sí':'No'} |`).join('\n')}\n\nNo son colores Pantone ni una conversión CMYK aprobada para imprenta.\n`);

const template = (await fs.readFile(path.join(root, 'herramientas/brandkit/catalogo.html'), 'utf8')).replace(/\r\n/g,'\n');
const colorHtml = colors.map(c=>`<article class="swatch"><div style="background:${c.hex}"></div><h3>${c.name}</h3><code>${c.hex}</code><small>RGB ${c.rgb.join(' · ')}</small></article>`).join('');
await write('index.html', template.replace('<!-- COLORS -->',colorHtml).replace('<!-- STAT_COLORS -->', String(colors.length).padStart(2,'0')).replace('<!-- RELEASE -->',release.version));
for (const [name,bytes] of Object.entries(await designFiles(kit))) await write(name,bytes);

// Inventory every deliverable, including hashes and actual image metadata.
const inventory = [];
for (const file of await files(kit)) {
  const relative = slash(path.relative(kit,file));
  if (['manifest.json','CONTROL-DE-CALIDAD.md'].includes(relative)) continue;
  const buffer = await fs.readFile(file);
  const canonical = ['02-logos/modelo/','03-personaje/','04-tipografia/recursive/','05-colores/tokens.json','06-originales/','08-imagenes/open-graph/','descartado/'].some(prefix=>relative.startsWith(prefix));
  const row = {path:relative,bytes:buffer.length,sha256:crypto.createHash('sha256').update(buffer).digest('hex'),source:canonical?'brandkit canonical':provenance.get(relative)||'brandkit editorial / generated'};
  row.status = statusOf(relative,release);
  if(transforms.has(relative)) row.transform=transforms.get(relative);
  if (/\.(png|webp|jpg|svg)$/i.test(file)) {
    const m = await sharp(buffer,{animated:true}).metadata();
    row.image = {format:m.format,width:m.width,height:m.pageHeight||m.height,hasAlpha:m.hasAlpha,pages:m.pages||1};
  }
  inventory.push(row);
}
await write('manifest.json', JSON.stringify({schemaVersion:2,profile:'repository',brand:'GatoPago',edition:'2026-09-28',version:release.version,copyPolicy:'Raster images from other sources are copied byte-for-byte; derived text and SVG snapshots use LF. Canonical kit sources are versioned in Git. descartado/ holds retired work and is excluded from the delivery ZIP.',files:inventory},null,2)+'\n');
const result = await verifyKit(kit,{sourceRoot:root});
if(result.failures.length) throw new Error(`Staged kit failed validation:\n${result.failures.join('\n')}`);
if(initialFingerprint !== await fingerprint(currentKit)) throw new Error('Canonical kit changed during build; refusing replacement');
const previous = path.join(work,'previous');
await fs.rename(currentKit,previous);
try { await fs.rename(kit,currentKit); }
catch(error) {
  try { await fs.rename(previous,currentKit); }
  catch(rollbackError) { keepWork=true; throw new AggregateError([error,rollbackError],`Recovery copy retained at ${previous}`); }
  throw error;
}
console.log(JSON.stringify({kit:currentKit,...result,bytes:inventory.reduce((n,f)=>n+f.bytes,0)},null,2));
} catch (error) {
  console.error('Brandkit generation failed; the current kit is retained:', error.message);
  throw error;
} finally {
  await lock.close();
  await fs.unlink(lockPath);
  if(work && !keepWork) await removeWorkdir(root,work).catch(error=>console.warn(`Temporary directory retained at ${work}: ${error.message}`));
}
