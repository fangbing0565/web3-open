var dependencies =  require('../../package.json').dependencies;

if (dependencies) {
  console.log('::add-message level=warning::Bad dependencies install! Please use "pnpm add xxx --filter subapp!');
  console.log(`::add-message level=error::${JSON.stringify(dependencies)}`);
}
