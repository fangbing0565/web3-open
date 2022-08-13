const fs = require('fs');
const path = require('path');
const readline = require('readline');
const shelljs = require('shelljs');

const buildResult = shelljs.exec('npm run build');

if (buildResult.code !== 0) {
  shelljs.echo('Error: build commit failed');
  shelljs.exit(1);
}

const pkgPath = path.resolve(__dirname, 'package.json');

const pkgContent = fs.readFileSync(pkgPath, 'utf-8');

const pkgJSON = JSON.parse(pkgContent);

const sourceMain = pkgJSON.main;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  `current version is ${pkgJSON.version} new version is: `,
  answer => {
    pkgJSON.main = './dist/js/modern/index.js';
    pkgJSON.types = './dist/types';
    pkgJSON.version = answer;
    rl.close();

    fs.writeFileSync(pkgPath, JSON.stringify(pkgJSON, null, 2), {
      encoding: 'utf-8',
    });

    const publishResult = shelljs.exec('npm publish');

    if (publishResult.code !== 0) {
      shelljs.echo('Error: publish commit failed');
      shelljs.exit(1);
    }

    delete pkgJSON.types;
    pkgJSON.main = sourceMain;
    fs.writeFileSync(pkgPath, JSON.stringify(pkgJSON, 'null', 2), {
      encoding: 'utf-8',
    });
  },
);
