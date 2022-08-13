const path = require('path');
const fs = require('fs');

const isUseLerna = rootDirectory => {
  if (fs.existsSync(path.join(rootDirectory, 'lerna.json'))) {
    return true;
  }
  return false;
};

const isUseYarnWorkspaces = rootDirectory => {
  if (!fs.existsSync(path.join(rootDirectory, 'package.json'))) {
    return false;
  }

  const json = JSON.parse(
    fs.readFileSync(path.join(rootDirectory, 'package.json'), 'utf8'),
  );
  if (json.hasOwnProperty('workspaces') && json.workspaces.packages) {
    return true;
  }
  return false;
};

const isUsePnpmWorkspaces = rootDirectory => {
  if (fs.existsSync(path.join(rootDirectory, 'pnpm-workspace.yaml'))) {
    return true;
  }
  return false;
};

const isMonorepo = rootDirectory => {
  if (
    isUsePnpmWorkspaces(rootDirectory) ||
    isUseLerna(rootDirectory) ||
    isUseYarnWorkspaces(rootDirectory)
  ) {
    return true;
  }
  return false;
};

exports.findMonorepoRoot = (appDirectory, maxDepth = 5) => {
  let inMonorepo = false;

  for (let depth = 0; depth < maxDepth; depth++) {
    if (isMonorepo(appDirectory)) {
      inMonorepo = true;
      break;
    }
    appDirectory = path.dirname(appDirectory);
  }

  return inMonorepo ? appDirectory : undefined;
};
