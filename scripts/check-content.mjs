import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const pages = resolve(root, 'src/pages');
const errors = [];
const files = readdirSync(pages).filter(file => file.endsWith('.mdx'));

for (const file of files) {
  const path = resolve(pages, file);
  const text = readFileSync(path, 'utf8');
  const metadata = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!metadata) {
    errors.push(`${file}: start the file with --- and preserve its layout/title metadata.`);
    continue;
  }
  const field = key => {
    const value = metadata[1].match(new RegExp(`^${key}:[ \\t]*(.*)$`, 'm'))?.[1].trim() ?? '';
    return value.replace(/^(['"])(.*)\1$/, '$2').trim();
  };
  const layout = field('layout');
  if (!layout || !existsSync(resolve(dirname(path), layout))) {
    errors.push(`${file}: add a valid layout, usually ../layouts/ContentLayout.astro.`);
  }
  if (!field('title')) errors.push(`${file}: add a non-empty title to the metadata.`);
  if (/^Claude finished the response\s*$/m.test(text)) {
    errors.push(`${file}: remove the pasted chat footer.`);
  }
}

if (errors.length) {
  console.error('Content pages need attention:\n' + errors.map(error => `  - ${error}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Checked layout and title metadata for ${files.length} MDX pages.`);
}
