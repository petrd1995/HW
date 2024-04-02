import fs from 'fs/promises';

const data = await fs.readFile('instrukce.txt', 'utf-8');

const createFiles = async (n) => {
  const files = [];
  for (let i = 1; i <= n; i++) {
    files.push(fs.writeFile(`${i}.txt`, `Soubor ${i}`));
  }
  await Promise.all(files);
}

createFiles(parseInt(data));
