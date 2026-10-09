/** Read-only integrity checks for the packaged brandkit. */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { argument, files, inside, slash } from './brandkit/paths.mjs';
import { PALETTE } from './brandkit/pixmap.mjs';
import { readRelease, statusOf } from './brandkit/release.mjs';

// Do not retain native file handles to a staged kit during replacement on Windows.
sharp.cache(false);

export async function verifyKit(kit, { sourceRoot = null } = {}) {
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const inventory = JSON.parse(await fs.readFile(path.join(kit, 'manifest.json'), 'utf8'));
const failures = [];
let copies = 0, links = 0;
const assert = (condition, message) => { if (!condition) failures.push(message); };
async function checkLink(owner, link) {
  if (!link || /^(#|https?:|mailto:|data:)/.test(link)) return;
  if (/'\+|\+'/.test(link)) return; // built in a page script (e.g. href="'+s.frame+'"), not a file path
  const name = decodeURIComponent(link.split('#')[0].split('?')[0]);
  if (!name) return;
  const resolved = path.resolve(path.dirname(owner), name);
  assert(resolved.startsWith(kit + path.sep), `Link outside kit: ${owner}: ${link}`);
  try { await fs.access(resolved); } catch { failures.push(`Missing target: ${path.relative(kit,owner)} -> ${link}`); }
  links++;
}
for (const row of inventory.files) {
  const file = inside(kit, row.path);
  const bytes = await fs.readFile(file);
  assert(hash(bytes) === row.sha256, `Hash mismatch: ${row.path}`);
  assert(bytes.length === row.bytes, `Size mismatch: ${row.path}`);
  const source = sourceRoot && row.source.startsWith('repository/') ? inside(sourceRoot,row.source.slice(11)) : null;
  if (source) {
    let original = await fs.readFile(source);
    if (row.transform === 'lf') original = Buffer.from(original.toString('utf8').replace(/\r\n/g,'\n'));
    assert(hash(bytes) === hash(original), `Copy differs from source: ${row.path}`); copies++;
  }
  if (row.path.endsWith('.html')) {
    for (const m of bytes.toString().matchAll(/(?:href|src|data-static|data-animated)="([^"]+)"/g)) await checkLink(file,m[1]);
  }
  if (row.path.endsWith('.md')) {
    const markdown = bytes.toString().replace(/```[\s\S]*?```/g,'');
    for (const m of markdown.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) await checkLink(file,m[1]);
  }
  if (row.path.startsWith('04-tipografia/') && row.path.endsWith('.css')) {
    for (const m of bytes.toString().matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) await checkLink(file,m[1]);
  }
}
const indexed = inventory.files.map(row => row.path);
assert(new Set(indexed).size===indexed.length,'Duplicate inventory paths');
const actual = (await files(kit)).map(file=>slash(path.relative(kit,file))).filter(file=>file!=='manifest.json');
assert(JSON.stringify(actual.sort())===JSON.stringify([...indexed].sort()),'Inventory does not cover the exact file set');
if(inventory.profile==='approved-delivery') {
  const policy=inventory.releasePolicy;
  assert(policy?.schemaVersion===1 && policy.version===inventory.version,'External release policy');
  for(const row of inventory.files) {
    if(['README.md','index.html'].includes(row.path)) continue;
    assert(policy && statusOf(row.path,policy)==='approved-baseline' && !row.path.endsWith('.md'),`Unapproved external asset: ${row.path}`);
  }
  for(const required of ['02-logos/simbolo/gatopago.svg','05-colores/tokens.json','04-tipografia/recursive/LICENSE.txt']) assert(indexed.includes(required),`External asset missing: ${required}`);
  return {files:indexed.length,profile:inventory.profile,identicalSourceCopies:copies,localLinksChecked:links,validationScope:'Inventory, hashes, release policy and local links; pixel validation performed on source repository before packaging.',failures};
}
assert(['repository','delivery',undefined].includes(inventory.profile),'Unknown inventory profile');
const release=await readRelease(kit);
assert(release.version===inventory.version,'Release version differs from inventory; rebuild the kit');
for(const row of inventory.files) assert(row.status===statusOf(row.path,release),`Release status mismatch: ${row.path}`);
// Review crops have their own contract: frame references, canvas and timing, not a closed pixel palette.
const characterDir = path.join(kit,'03-personaje');
const motion = JSON.parse(await fs.readFile(path.join(characterDir,'animaciones/manifest.json'),'utf8'));
assert(motion.status==='candidate','Character must remain marked as candidate until artistic approval');
assert(motion.statics.length===14,'Expected 14 character statics');
assert(motion.animations.length===20,'Expected 20 character animations');
assert(new Set(motion.statics.map(s=>s.id)).size===14,'Duplicate static IDs');
assert(new Set(motion.animations.map(a=>a.id)).size===20,'Duplicate animation IDs');
for (const source of motion.sourceSheets) {
  assert(hash(await fs.readFile(inside(path.join(kit,'06-originales'),source.file)))===source.sha256,`Character original changed: ${source.file}`);
}
for (const s of motion.statics) {
  const file = inside(characterDir,s.file);
  await checkLink(path.join(characterDir,'galeria.html'),s.file);
  const m = await sharp(file).metadata();
  assert(m.width===s.width && m.height===s.height,`Static dimensions: ${s.id}`);
}
let characterFrames = 0;
for (const a of motion.animations) {
  const base = path.join(characterDir,'animaciones');
  const owner = path.join(base,'manifest.json');
  assert(['loop','once'].includes(a.playback),`Playback mode: ${a.id}`);
  const unique = [...new Set(a.sequence.map(f=>f.frame))];
  assert(unique.length===a.frames,`Unique frame count: ${a.id}`);
  assert(a.sequence.every(f=>Number.isInteger(f.ms) && f.ms>=50),`Frame duration: ${a.id}`);
  assert(a.sequence.reduce((n,f)=>n+f.ms,0)===a.totalMs,`Total duration: ${a.id}`);
  await checkLink(owner,a.preview);
  const m = await sharp(inside(base,a.preview),{animated:true}).metadata();
  assert(m.width===a.canvas.width && m.pageHeight===a.canvas.height,`Preview canvas: ${a.id}`);
  assert(m.pages===a.sequence.length,`Preview step count: ${a.id}`);
  assert(JSON.stringify(m.delay)===JSON.stringify(a.sequence.map(f=>f.ms)),`Preview timing: ${a.id}`);
  assert(m.loop===0,`Gallery previews must loop: ${a.id}`);
  for (const frame of unique) {
    characterFrames++;
    await checkLink(owner,frame);
    const f = await sharp(inside(base,frame)).metadata();
    assert(f.width===a.canvas.width && f.height===a.canvas.height,`Frame canvas: ${a.id}/${frame}`);
  }
  const delivered = (await files(path.join(base,'fotogramas',a.id))).map(f=>slash(path.relative(base,f)));
  assert(JSON.stringify(delivered.sort())===JSON.stringify(unique.sort()),`Frame file set: ${a.id}`);
}
const hd = JSON.parse(await fs.readFile(path.join(characterDir,'exportaciones.json'),'utf8'));
assert(hd.files.length===221,'Expected 221 HD and contact-sheet exports');
assert(hd.resampling==='nearest' && hd.longEdgeMinimum===2048,'HD enlargement policy');
for(const row of hd.files) {
  const file = inside(characterDir,row.file);
  await checkLink(path.join(characterDir,'exportaciones.json'),row.file);
  const bytes = await fs.readFile(file);
  assert(hash(bytes)===row.sha256 && bytes.length===row.bytes,`HD export hash: ${row.file}`);
  const m = await sharp(bytes,{animated:true}).metadata();
  assert(m.width===row.width && (m.pageHeight||m.height)===row.height,`HD dimensions: ${row.file}`);
  if(row.source) {
    await checkLink(path.join(characterDir,'exportaciones.json'),row.source);
    const source = await sharp(inside(characterDir,row.source),{animated:true}).metadata();
    assert(Number.isInteger(row.scale) && row.scale>=1,`HD integer scale: ${row.file}`);
    assert(row.width===source.width*row.scale && row.height===(source.pageHeight||source.height)*row.scale,`HD source aspect ratio: ${row.file}`);
    assert(Math.max(row.width,row.height)>=2048,`HD minimum size: ${row.file}`);
    if(row.format==='webp') assert(m.pages===source.pages && JSON.stringify(m.delay)===JSON.stringify(source.delay) && m.loop===source.loop,`HD animation timing: ${row.file}`);
  }
}
// Pixel art checks for the symbol and the favicons: every pixel is a palette colour or fully transparent.
const charOf = new Map(PALETTE.map(c=>[c.rgb.join(','),c.ch]));
async function rawOf(file) { const {data,info} = await sharp(await fs.readFile(file)).ensureAlpha().raw().toBuffer({resolveWithObject:true}); return {data,w:info.width,h:info.height}; }
/** Every pixel is a palette colour at full opacity, or fully transparent. Returns the character grid. */
function gridOf({data,w,h}, label) {
  const rows=[];
  for (let y=0;y<h;y++){let r='';for(let x=0;x<w;x++){const i=(y*w+x)*4;if(data[i+3]===0){r+='.';continue;}const ch=charOf.get(`${data[i]},${data[i+1]},${data[i+2]}`);if(!ch||data[i+3]!==255){failures.push(`Off-palette or semi-transparent pixel: ${label} (${x},${y})`);return rows;}r+=ch;}rows.push(r);}
  return rows;
}
// Symbol and web icons must be exact renders of the approved maps in 02-logos/modelo.
const readMap = async name => (await fs.readFile(path.join(kit,'02-logos/modelo',name),'utf8')).replace(/\r/g,'').split('\n').filter(l=>l.length);
const symbol = await readMap('simbolo.txt'), symbol16 = await readMap('simbolo-16.txt');
/** Sample the centre of each k×k block of a rendered image back into a character grid. */
function downsample(img, k, x0 = 0, y0 = 0, w = Math.floor(img.w / k), h = Math.floor(img.h / k)) {
  const data = Buffer.alloc(w * h * 4);
  for (let y=0;y<h;y++) for (let x=0;x<w;x++) { const s=((y0+y*k+(k>>1))*img.w+(x0+x*k+(k>>1)))*4, d=(y*w+x)*4; img.data.copy(data,d,s,s+4); }
  return {data,w,h};
}
const iconDir = path.join(kit,'02-logos/iconos-web');
const same = (grid, map, label) => assert(JSON.stringify(grid)===JSON.stringify(map), `Icon differs from its map: ${label}`);
same(gridOf(downsample(await rawOf(path.join(kit,'02-logos/simbolo/gatopago.png')),8),'simbolo png'), symbol, 'simbolo/gatopago.png');
same(gridOf(await rawOf(path.join(iconDir,'favicon-16x16.png')),'favicon-16'), symbol16, 'favicon-16x16.png');
same(gridOf(downsample(await rawOf(path.join(iconDir,'favicon-48x48.png')),3),'favicon-48'), symbol16, 'favicon-48x48.png');
const f32 = await rawOf(path.join(iconDir,'favicon-32x32.png'));
assert(f32.w===32 && f32.h===32, 'favicon-32x32.png size');
same(gridOf(downsample(f32,1,Math.floor((32-symbol[0].length)/2),Math.floor((32-symbol.length)/2),symbol[0].length,symbol.length),'favicon-32'), symbol, 'favicon-32x32.png');
const apple = await rawOf(path.join(iconDir,'apple-touch-icon.png'));
assert(apple.w===180 && apple.h===180, 'apple-touch-icon size');
let transparent=0; for (let i=3;i<apple.data.length;i+=4) if (apple.data[i]!==255) transparent++;
assert(transparent===0, 'apple-touch-icon must be opaque (iOS paints transparency black)');
same(gridOf(downsample(apple,4,Math.floor((180-symbol[0].length*4)/2),Math.floor((180-symbol.length*4)/2),symbol[0].length,symbol.length),'apple-touch').map(r=>r.replace(/w/g,'.')), symbol, 'apple-touch-icon.png');
const avatarDir = path.join(kit,'08-imagenes/avatar');
const avatar = JSON.parse(await fs.readFile(path.join(avatarDir,'manifest.json'),'utf8'));
assert(avatar.background==='#FFF8F0' && avatar.variants.length===7,'Avatar background and variants');
for(const v of avatar.variants) {
  const img = await rawOf(inside(avatarDir,v.file));
  assert(img.w===v.size && img.h===v.size,`Avatar size: ${v.file}`);
  assert(v.scale===Math.floor(v.size/45),'Avatar integer scale');
  same(gridOf(downsample(img,v.scale,v.left,v.top,symbol[0].length,symbol.length),v.file).map(r=>r.replace(/w/g,'.')),symbol,v.file);
  for(let i=0;i<img.data.length;i+=4) {
    if(img.data[i+3]!==255) { failures.push(`Avatar transparency: ${v.file}`); break; }
    const x=(i/4)%img.w, y=Math.floor(i/4/img.w);
    if(img.data[i]===255 && img.data[i+1]===248 && img.data[i+2]===240) continue;
    assert((x-(img.w-1)/2)**2+(y-(img.h-1)/2)**2<(img.w/2)**2,`Avatar artwork outside circular crop: ${v.file}`);
  }
  if(v.size===180) assert(img.data.equals(apple.data),'180 avatar must equal the apple-touch-icon');
}
const icoBytes = await fs.readFile(path.join(iconDir,'favicon.ico'));
const icoCount = icoBytes.readUInt16LE(4), icoSizes = [];
for (let i=0;i<icoCount;i++) { const e=6+16*i, size=icoBytes[e]||256, len=icoBytes.readUInt32LE(e+8), off=icoBytes.readUInt32LE(e+12);
  icoSizes.push(size);
  const png = icoBytes.subarray(off,off+len);
  const expected = size===16 ? 'favicon-16x16.png' : size===32 ? 'favicon-32x32.png' : 'favicon-48x48.png';
  assert(hash(png)===hash(await fs.readFile(path.join(iconDir,expected))), `favicon.ico ${size}px differs from ${expected}`); }
assert(JSON.stringify(icoSizes)==='[16,32,48]', `favicon.ico sizes ${icoSizes}`);
return {files:inventory.files.length,profile:inventory.profile || 'repository',identicalSourceCopies:copies,localLinksChecked:links,characterStatus:motion.status,statics:motion.statics.length,animations:motion.animations.length,characterFrames,failures};
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
    const result = await verifyKit(path.resolve(argument('--kit', path.join(root,'brandkit'))), {
      sourceRoot: process.argv.includes('--sources') ? root : null
    });
    console.log(JSON.stringify(result,null,2));
    if(result.failures.length) process.exitCode=1;
  } catch(error) { console.error(error.message); process.exitCode=1; }
}
