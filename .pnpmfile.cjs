function readPackage(pkg, _context) {
  // Override the manifest of foo@1.x after downloading it from the registry
  // fix @samverschueren/stream-to-observable bug
  if (pkg.name === '@samverschueren/stream-to-observable') {
    pkg.dependencies = {
      ...pkg.dependencies,
      'any-observable': '^0.5.1',
    };
  }
  if (pkg.name === '@i18n-ecom/eslint-config') {
    pkg.devDependencies = {
      ...pkg.devDependencies,
      ...pkg.peerDependencies
    };
  }

  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
