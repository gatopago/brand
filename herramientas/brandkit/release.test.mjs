import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { unzipSync } from 'fflate';
import sharp from 'sharp';
import { readRelease, statusOf, approvedAssets } from './release.mjs';
import { inside, removeWorkdir } from './paths.mjs';
import { verifyKit } from '../verify-brandkit.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const kit=path.join(root,'brandkit');
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');

test('release policy separates baseline, reviews, references and retired work',async()=>{
  const release=await readRelease(kit);
  assert.equal(release.version,'1.0.0-rc.1');
  assert.equal(release.approval.newAssetsApproved,false);
  for(const [name,status] of Object.entries({'02-logos/simbolo/gatopago.svg':'approved-baseline','02-logos/horizontal/gatopago-claro.svg':'review','03-personaje/qa/review.png':'review','09-componentes/index.html':'review','10-plantillas/index.html':'review','06-originales/spritesmeli1.png':'reference','07-referencias/README.md':'reference','descartado/example.svg':'retired','01-manual/identidad-y-voz.md':'internal'})) assert.equal(statusOf(name,release),status);
  const rows=approvedAssets((await JSON.parse(await fs.readFile(path.join(kit,'manifest.json'),'utf8'))).files,release);
  assert.ok(rows.length>10);
  assert.ok(rows.every(row=>!row.path.endsWith('.md')));
  assert.ok(rows.some(row=>row.path==='04-tipografia/recursive/LICENSE.txt'));
  // A forged status in an inventory must not bypass the policy.
  assert.deepEqual(approvedAssets([{path:'03-personaje/qa/example.png',status:'approved-baseline'}],release),[]);
});

test('wordmarks are outlined from the licensed local font, not live text',async()=>{
  const source=JSON.parse(await fs.readFile(path.join(kit,'02-logos/horizontal/trazabilidad.json'),'utf8'));
  const bytes=await fs.readFile(path.join(kit,'04-tipografia/recursive/files/recursive-latin-full-normal.woff2'));
  assert.equal(JSON.stringify(source).includes(sha(bytes)),true);
  for(const name of ['gatopago-claro','gatopago-oscuro','gatopago-mono-ink','gatopago-mono-milk']) {
    const svg=await fs.readFile(path.join(kit,'02-logos/horizontal',name+'.svg'),'utf8');
    assert.doesNotMatch(svg,/<text\b/);
    assert.match(svg,/<path\b/);
    assert.match(svg,/GatoPago/);
    const meta=await sharp(path.join(kit,'02-logos/horizontal',name+'.png')).metadata();
    assert.equal(meta.hasAlpha,true);
    assert.equal(meta.height,192);
  }
});

test('external delivery is independently readable and excludes all review material',async()=>{
  const result=spawnSync(process.execPath,[path.join(root,'herramientas/package-brandkit.mjs'),'--external'],{cwd:root,encoding:'utf8',maxBuffer:3_000_000});
  assert.equal(result.status,0,result.stderr+'\n'+result.stdout);
  const report=JSON.parse(result.stdout);
  const archive=await fs.readFile(report.zip);
  const entries=unzipSync(archive);
  const release=await readRelease(kit);
  const work=await fs.mkdtemp(path.join(root,'.brandkit-work-'));
  try {
    for(const [name,bytes] of Object.entries(entries)) {
      const local=name.slice('brandkit/'.length);
      assert.equal(name.startsWith('brandkit/'),true);
      if(!['manifest.json','README.md','index.html'].includes(local)) assert.equal(statusOf(local,release),'approved-baseline',local);
      assert.doesNotMatch(name,/(?:qa|raw-problem-sequences|03-personaje|06-originales|07-referencias|09-componentes|10-plantillas|descartado)\//);
      const dest=inside(work,name);
      await fs.mkdir(path.dirname(dest),{recursive:true});
      await fs.writeFile(dest,bytes);
    }
    assert.deepEqual((await verifyKit(path.join(work,'brandkit'))).failures,[]);
    const repeat=spawnSync(process.execPath,[path.join(root,'herramientas/package-brandkit.mjs'),'--external'],{cwd:root,encoding:'utf8'});
    assert.equal(repeat.status,0,repeat.stderr);
    assert.equal(sha(await fs.readFile(report.zip)),sha(archive));
    // Tampering with hashes alone cannot add a reviewed character to the external kit.
    const dest=path.join(work,'brandkit');
    const manifestPath=path.join(dest,'manifest.json');
    const manifest=JSON.parse(await fs.readFile(manifestPath,'utf8'));
    const name='03-personaje/rejected.txt', bytes=Buffer.from('not approved');
    await fs.mkdir(path.dirname(inside(dest,name)),{recursive:true});
    await fs.writeFile(inside(dest,name),bytes);
    manifest.files.push({path:name,bytes:bytes.length,sha256:sha(bytes),source:'generated',status:'approved-baseline'});
    await fs.writeFile(manifestPath,JSON.stringify(manifest));
    assert.ok((await verifyKit(dest)).failures.some(s=>s.includes('Unapproved external asset')));
  } finally { await removeWorkdir(root,work); }
});

