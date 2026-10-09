/** Build a deterministic delivery ZIP of the kit (internal) or of the approved baseline (external). */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { zipSync } from 'fflate';
import { verifyKit } from './verify-brandkit.mjs';
import { files, inside, removeWorkdir, slash } from './brandkit/paths.mjs';
import { readRelease, approvedAssets, externalReadme, externalCatalog } from './brandkit/release.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const kit = path.join(root,'brandkit');
const checked = await verifyKit(kit);
if(checked.failures.length) throw new Error(`Run brandkit:build first:\n${checked.failures.join('\n')}`);
const manifest = JSON.parse(await fs.readFile(path.join(kit,'manifest.json'),'utf8'));
const release=await readRelease(kit);
const external=process.argv.includes('--external');
const excluded = external ? ['unapproved-assets','internal-documents','originals','references'] : [];
const included = external ? approvedAssets(manifest.files,release) : manifest.files;
const work = await fs.mkdtemp(path.join(root,'.brandkit-work-'));
try {
  const delivery = path.join(work,'delivery');
  await fs.mkdir(delivery);
  for(const row of included) {
    const dest = inside(delivery,row.path);
    await fs.mkdir(path.dirname(dest),{recursive:true});
    await fs.copyFile(inside(kit,row.path),dest);
  }
  if(external) {
    for(const [name,content] of [['README.md',externalReadme(release.version)],['index.html',externalCatalog(release.version)]]) {
      const bytes=Buffer.from(content);
      await fs.writeFile(inside(delivery,name),bytes);
      included.push({path:name,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),source:'generated/external-delivery',status:'delivery-document'});
    }
  }
  const deliveryManifest = {...manifest,profile:external?'approved-delivery':'delivery',excludedAreas:excluded,files:included,...(external?{releasePolicy:release}:{})};
  await fs.writeFile(path.join(delivery,'manifest.json'),JSON.stringify(deliveryManifest,null,2)+'\n');
  const result = await verifyKit(delivery);
  if(result.failures.length) throw new Error(result.failures.join('\n'));
  const entries = Object.create(null);
  for(const file of await files(delivery)) {
    const name = 'brandkit/'+slash(path.relative(delivery,file));
    entries[name] = [new Uint8Array(await fs.readFile(file)), {mtime:new Date(2026,0,1,0,0,0),level:6}];
  }
  const bytes = zipSync(entries);
  const output = path.join(root,'output');
  await fs.mkdir(output,{recursive:true});
  const filename = `gatopago-brandkit-${external?'externo':'interno'}-${release.version}.zip`;
  if(!/^gatopago-brandkit-(interno|externo)-\d+\.\d+\.\d+(?:-rc\.\d+)?\.zip$/.test(filename)) throw new Error('Invalid package version');
  const destination = inside(output,filename);
  const temporary = inside(output,filename+'.'+crypto.randomUUID()+'.tmp');
  try {
    await fs.writeFile(temporary,bytes,{flag:'wx'});
    await fs.rename(temporary,destination);
  } finally { await fs.rm(temporary,{force:true}); }
  console.log(JSON.stringify({zip:destination,files:Object.keys(entries).length,excludedAreas:excluded,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),validation:result},null,2));
} finally { await removeWorkdir(root,work).catch(error=>console.warn(`Temporary directory retained at ${work}: ${error.message}`)); }
