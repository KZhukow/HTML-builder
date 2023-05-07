const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;

const fileName = 'text.txt';
const pathToFile = path.join(__dirname, fileName);

fs.writeFile(pathToFile, '', (err) => { if (err) throw err; });

stdout.write(`File ${fileName} is create. Please enter text\n`);
stdout.write('Enter "exit" or press Ctrl+C to exit\n\n');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    stdout.write('\nFile is ready\nGood bye');
    exit();
  }
  fs.appendFile(pathToFile, data, (err) => { if (err) throw err; });
});

process.on('SIGINT', () => {
  stdout.write('\nFile is ready\nGood bye');
  exit();
});
