#!/usr/bin/env node
const shell = require('shelljs');
const { Command } = require('commander');
const { deploy } = require('./deploy');

const program = new Command();
program
  .name('i18n-ecom-open_builder')
  .description('CLI build open pc project')
  .version('0.0.1');

program
  .command('dev')
  .description('jupiter dev command with some custom')
  .option('--main', 'is Main app')
  .action(options => {
    const isMain = Boolean(options.main);
    if (isMain) {
      prepareForMain();
    }
    const optsFastRefresh = isMain ? '' : 'FAST_REFRESH=false';
    shell.exec(
      `export TAILWIND_MODE=watch && ROUTE_IP=10.225.130.44 ${optsFastRefresh} jupiter dev`,
    );
  });

program
  .command('prod')
  .description('jupiter build command with some custom')
  .option('--main', 'is Main app')
  .option('--analyze', 'is use analyze mode')
  .action(options => {
    const isMain = Boolean(options.main);
    const isAnalyze = Boolean(options.analyze);
    if (isMain) {
      prepareForMain();
    }
    const optsAnalyze = isAnalyze ? '--analyze' : '';
    shell.exec(`jupiter build ${optsAnalyze}`);
  });

program
  .command('deploy')
  .description('jupiter dev command with set some default settings')
  .option('--main', 'is Main app')
  .option('--regions [letters...]', 'specify regions')
  .action(options => {
    console.log(options);
    const isMain = Boolean(options.main);
    const { regions } = options;
    if (isMain) {
      prepareForMain();
    }
    let deployList = ['TTS'];
    if (regions) {
      // check regions
      regions.forEach(item => {
        if (!deployList.includes(item)) {
          // must in this deploy list
          throw Error(`regions must one of ${JSON.stringify(deployList)} `);
        }
      });
      deployList = regions;
    }
    deploy({ isMain, deployList });
  });
program.parse();

function prepareForMain() {
  // 暂时关闭，防止有文案更新，导致冲突
  shell.exec('installLocales');
  // shell.exec('installPricelib');
}
