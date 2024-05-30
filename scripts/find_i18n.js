import fs from 'node:fs';
import path from 'node:path';

const main = ({ locales, srcDir, ext, transDir }) => {
  const tokens = new Set();
  const source = path.resolve(srcDir);
  const paths = fs.readdirSync(source, { recursive: true });

  for (const relPath of paths) {
    const absPath = path.join(source, relPath);
    const stat = fs.statSync(absPath);
    if (stat.isFile() && ext.some((it) => relPath.endsWith(it))) {
      const content = fs.readFileSync(absPath, 'utf-8');
      const matches = content.matchAll(/\Wt\((['"])([^"']+)\1\)/g);
      for (const match of matches) {
        const key = match[2];
        tokens.add(key);
      }
    }
  }

  for (const locale of locales) {
    let data = {};
    const jsonFile = path.resolve(transDir, `${locale}.json`);
    try {
      const content = fs.readFileSync(jsonFile, 'utf-8');
      data = JSON.parse(content);
    } catch (err) {
      // ignore error
    }

    if (!data.translation) {
      data.translation = {};
    }

    const jsonData = data.translation;

    let showHeader = false;
    for (const key of Object.keys(jsonData)) {
      if (!tokens.has(key)) {
        if (!showHeader) {
          console.log(`Unknown tokens in file: ${jsonFile}`);
          showHeader = true;
        }
        console.log(`"${key}"`);
      }
    }

    let addedCount = 0;

    for (const key of tokens) {
      if (!jsonData[key]) {
        jsonData[key] = key;
        addedCount++;
      }
    }

    if (addedCount > 0) {
      fs.writeFileSync(jsonFile, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`Change file "${jsonFile}" - ${addedCount} added`);
    }
  }
};

main({ locales: ['en', 'ru'], srcDir: './src', ext: ['.tsx'], transDir: './src/locales' });
