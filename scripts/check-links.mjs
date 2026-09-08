import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'parse5';

// Check rendered HTML, including navigation and links emitted by MDX components.
const output = path.resolve('dist');
const origin = 'https://docs.anehud.com';
const pages = new Map();
const failures = new Set();
async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}
function visit(node, callback) {
  callback(node);
  for (const child of node.childNodes ?? []) visit(child, callback);
}
function routeFor(file) {
  const relative = path.relative(output, file).split(path.sep).join('/');
  return '/' + relative.replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '');
}
function normalize(route) {
  return route.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
}
try {
  for (const file of await walk(output)) {
    if (!file.endsWith('.html')) continue;
    const ids = new Set();
    const links = [];
    visit(parse(await readFile(file, 'utf8')), (node) => {
      const attributes = Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
      if (attributes.id) ids.add(attributes.id);
      if (node.tagName === 'a' && attributes.name) ids.add(attributes.name);
      for (const name of ['href', 'src', 'poster']) {
        if (attributes[name]) links.push(attributes[name]);
      }
    });
    pages.set(normalize(routeFor(file)), { ids, links });
  }
  const expected = JSON.parse(await readFile(new URL('./migrated-routes.json', import.meta.url), 'utf8'));
  for (const { route, source } of expected) {
    if (!pages.has(normalize(route))) failures.add(`Missing migrated page: ${route} (from ${source})`);
  }
  let checked = 0;
  for (const [route, page] of pages) {
    for (const link of page.links) {
      let url;
      try { url = new URL(link, origin + route); }
      catch { failures.add(`${route}: invalid URL ${link}`); continue; }
      if (url.origin !== origin) continue;
      checked++;
      const pathname = decodeURIComponent(url.pathname);
      const target = pages.get(normalize(pathname));
      if (target) {
        const fragment = decodeURIComponent(url.hash.slice(1));
        if (fragment && !fragment.startsWith(':~:text=') && !target.ids.has(fragment)) {
          failures.add(`${route}: missing anchor ${link}`);
        }
        continue;
      }
      const asset = path.resolve(output, '.' + pathname);
      if (!asset.startsWith(output + path.sep) || !(await stat(asset).catch(() => null))?.isFile()) {
        failures.add(`${route}: missing page or asset ${link}`);
      }
    }
  }
  if (failures.size) {
    console.error([...failures].join('\n'));
    process.exitCode = 1;
  } else {
    console.log(`Checked ${pages.size} HTML pages and ${checked} local links/assets; all ${expected.length} migrated routes exist.`);
  }
} catch (error) {
  console.error('Link check failed. Run npm run build first.', error);
  process.exitCode = 1;
}
