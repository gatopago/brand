import path from 'node:path';
import fs from 'node:fs/promises';

export function argument(name, fallback) {
  const flag = process.argv.indexOf(name);
  if (flag < 0) return fallback;
  const value = process.argv[flag + 1];
  if (!value || value.startsWith('--')) throw new Error(`Missing value for ${name}`);
  return value;
}

export const slash = value => value.split(path.sep).join('/');
export function inside(root, relative) {
  const resolved = path.resolve(root, relative);
  if (!resolved.startsWith(path.resolve(root) + path.sep)) throw new Error(`Path outside ${root}: ${relative}`);
  return resolved;
}

export async function files(dir) {
  const result = [];
  for (const item of await fs.readdir(dir, { withFileTypes: true })) {
    if (item.name === '__pycache__' || item.name === '.DS_Store') continue;
    const name = path.join(dir, item.name);
    if (item.isSymbolicLink()) throw new Error(`Symlinks are not allowed in the kit: ${name}`);
    if (item.isDirectory()) result.push(...await files(name));
    else if (item.isFile()) result.push(name);
  }
  return result.sort();
}

/** Only remove a uniquely named work directory created by these build tools. */
export async function removeWorkdir(root, dir) {
  const resolved = inside(root, dir);
  if (path.dirname(resolved) !== path.resolve(root) || !path.basename(resolved).startsWith('.brandkit-work-')) {
    throw new Error(`Refusing cleanup outside a brandkit work directory: ${dir}`);
  }
  if ((await fs.lstat(resolved)).isSymbolicLink()) throw new Error('Refusing symlink cleanup');
  await fs.rm(resolved, { recursive: true, maxRetries: 5, retryDelay: 150 });
}
