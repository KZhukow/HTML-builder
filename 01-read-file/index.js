const { stdout } = process;
const path = require('path');
const fs = require('fs');

const fileName = 'text.txt';
const pathToFile = path.join(__dirname, fileName);
let data = '';

const readableStream = fs.createReadStream(pathToFile, 'utf-8');

readableStream.on('data', (chunk) => data += chunk);
readableStream.on('end', () => stdout.write(data));
