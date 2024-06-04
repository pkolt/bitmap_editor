import fs from 'node:fs';
import path from 'node:path';

const createDirIfNotExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    // eslint-disable-next-line no-console, no-undef
    console.log(`Create dir: ${dirPath}`);
  }
}

const main = ({ srcDir, dstFile, publicDir }) => {
  const srcDirPath = path.resolve(srcDir);
  const dstFilePath = path.resolve(dstFile);
  const publicDirPath = path.resolve(publicDir);

  createDirIfNotExists(publicDirPath);

  const paths = fs.readdirSync(srcDirPath);

  for (const p of paths) {
    const dstFile = path.join(publicDirPath, p);
    if (!fs.existsSync(dstFile)) {
      const srcFile = path.join(srcDir, p);
      fs.copyFileSync(srcFile, dstFile);
      // eslint-disable-next-line no-console, no-undef
      console.log(`Copy file: ${p}`);
    }
  }

  createDirIfNotExists(path.dirname(dstFilePath));

  fs.writeFileSync(dstFilePath, JSON.stringify(paths, null, 2), 'utf-8');
};

main({
  srcDir: './node_modules/bootstrap-icons/icons',
  dstFile: './public/images/bootstrap-icons/data.json',
  publicDir: './public/images/bootstrap-icons/icons',
});
