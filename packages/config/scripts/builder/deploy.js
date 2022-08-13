const path = require('path');
const shelljs = require('shelljs');
const { findMonorepoRoot } = require('../../utils/monorepo');

const { CUSTOM_DEVELOP_ENV = 'LOCAL', PWD } = process.env;
let projectRoot = findMonorepoRoot(PWD);
if (!projectRoot) {
  projectRoot = PWD;
}
const OUTPUT_PATH = path.resolve(projectRoot, './output');
const OUTPUT_RESOURCE_PATH = path.resolve(projectRoot, './output_resource');

const DIST_PATH = path.resolve(PWD, './dist');
const packageJson = require(path.resolve(PWD, './package.json'));
const { name } = packageJson;
shelljs.set('-e');

exports.deploy = function ({
  isMain = false,
  deployList, // cb will use keep unihan
} = {}) {
  // eslint-disable-next-line no-console
  console.log(`TTSPC-BUILD Start ${name} in ${CUSTOM_DEVELOP_ENV}`);
  shelljs.rm('-rf', OUTPUT_PATH);
  shelljs.rm('-rf', OUTPUT_RESOURCE_PATH);
  if (deployList.includes('TTS')) {
    const LOG_TAG = 'TTSPC-BUILD TTS_LOCAL';
    // eslint-disable-next-line no-console
    console.log(`${LOG_TAG} building...`);
    shelljs.exec(
      `jupiter build`,
      {
        async: true,
        silent: true,
        env: {
          ...process.env,
          CUSTOM_BUILD_APP: 'TTS',
        },
      },
      (code, stdout, stderr) => {
        // eslint-disable-next-line no-console
        console.log(
          `\n----- ${LOG_TAG} finish Log ----- START\n`,
          stdout,
          stderr,
        );

        const dist = `${DIST_PATH}/TTS/normal`;
        const outputRes = `${OUTPUT_RESOURCE_PATH}/TTS/normal`;
        const output = `${OUTPUT_PATH}/TTS/normal`;

        shelljs.mkdir('-p', [output, outputRes]);
        shelljs.cp('-r', `${dist}/*`, outputRes);
        shelljs.cp('-r', isMain ? `${dist}/html` : `${dist}/*.js`, output);

        // eslint-disable-next-line no-console
        console.log(`----- ${LOG_TAG} finish Log ----- END`);
      },
    );
  }
};
