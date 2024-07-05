/* eslint-disable no-undef */
/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';

const findTokens = (srcDir, ext) => {
  const tokens = new Set();
  const SrcFullPath = path.join(import.meta.dirname, '../', srcDir);
  const paths = fs.readdirSync(SrcFullPath, { recursive: true });
  for (const relPath of paths) {
    const absPath = path.join(SrcFullPath, relPath);
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
  return tokens;
};

const updateTranslates = (locale, fileFullPath, tokens) => {
  let data = {};
  try {
    const content = fs.readFileSync(fileFullPath, 'utf-8');
    data = JSON.parse(content);
  } catch {
    // ignore error
  }

  if (!data.translation) {
    data.translation = {};
  }

  const unknownTokens = [];
  const addedTokens = [];
  const noTranslatedTokens = [];
  const translation = { ...data.translation };

  for (const token of Object.keys(translation)) {
    if (!tokens.has(token)) {
      unknownTokens.push(token);
    }
    if (translation[token] === '' && translation[token] === token && locale !== 'en') {
      noTranslatedTokens.push(token);
    }
  }

  for (const token of tokens) {
    if (translation[token] === undefined) {
      addedTokens.push(token);
      translation[token] = token;
    }
  }

  const isUnknownTokens = unknownTokens.length > 0;
  const isAddedTokens = addedTokens.length > 0;
  const isNoTranslatedTokens = noTranslatedTokens.length > 0;

  if (isUnknownTokens || isAddedTokens || isNoTranslatedTokens) {
    const separator = '-'.repeat(80);
    console.log(separator);
    console.log(`File: ${fileFullPath}`);
    console.log(separator);
    if (isUnknownTokens) {
      console.log(`Unknown tokens: ${unknownTokens.join(', ')}`);
    }
    if (isAddedTokens) {
      console.log(`Added tokens: ${addedTokens.join(', ')}`);
    }
    if (isNoTranslatedTokens) {
      console.log(`No translated tokens: ${noTranslatedTokens.join(', ')}`);
    }
  }

  if (isAddedTokens) {
    data.translation = Object.keys(translation)
      .sort()
      .reduce((accum, key) => {
        accum[key] = translation[key];
        return accum;
      }, {});

    fs.writeFileSync(fileFullPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  }
};

const main = ({ locales, srcDir, ext, transDir }) => {
  const tokens = findTokens(srcDir, ext);
  for (const locale of locales) {
    const fullPath = path.resolve(transDir, `${locale}.json`);
    updateTranslates(locale, fullPath, tokens);
  }
};

main({ locales: ['en', 'ru'], srcDir: './src', ext: ['.tsx'], transDir: './src/locales' });
