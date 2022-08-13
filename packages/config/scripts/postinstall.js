const shell = require('shelljs');
const pkg = require('@i18n-ecom/whistle.rules_watcher/package.json');

const whistleWatcher = `@i18n-ecom/whistle.rules_watcher@${pkg.version}`; // you can update here
if (
  process.env.TASK_FROM !== 'scm' &&
  shell.exec(`npm list -g | grep -c  ${whistleWatcher}`)[0] !== '1'
) {
  shell.exec(`npm install -g ${whistleWatcher} --no-shrinkwrap`);
}
