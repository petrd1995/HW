import http from 'http';
import fs from 'fs/promises';

const filePath = './counter.txt';

async function readCounterFromFile() {
  try {
    const data = await fs.readFile(filePath);
    return parseInt(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(filePath, '0');
      return 0;
    } else {
      throw err;
    }
  }
}

async function updateCounter(operation) {
  let counter = await readCounterFromFile();
  counter = operation === 'increase' ? counter + 1 : counter - 1;
  await fs.writeFile(filePath, counter.toString());
  return 'OK';
}

const server = http.createServer(async (req, res) => {
  const operation = req.url.slice(1);
  if (operation === 'increase') {
    res.statusCode = 200;
    res.end(await updateCounter(operation));
  } else if (operation === 'decrease') {
    res.statusCode = 200;
    res.end(await updateCounter(operation));
  } else if (operation === 'read') {
    res.statusCode = 200;
    res.end((await readCounterFromFile()).toString());
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});