
const { IS_DEV } = require('../buildEnv');
const { execSync } = require('child_process');
const os = require('os');
const platform = os.platform();

const KillProcessPortPid = port => {
  if (platform === 'win32') {
    const order = `netstat -aon | findstr ${port}`;
    try {
      const stdout = execSync(order);
      const portInfo = stdout.toString().trim().split(/\s+/);
      const pId = portInfo[portInfo.length - 1];
      const processStdout = execSync(`tasklist | findstr ${pId}`);
      const [pName] = processStdout.toString().trim().split(/\s+/);
      if (pId) {
        console.log(`Something is already running on port ${port}. Try to kill the process`);
        process.kill(pId, 'SIGHUP')
      }
    } catch (error) {
      console.log('Attempt to terminate process failed');
    }
  } else {
    const order = `lsof -i :${port}`;
    try {
      const stdout = execSync(order);
      const [pName, pId] = stdout
        .toString()
        .trim()
        .split(/\n/)[1]
        .split(/\s+/);
        if (pId) {
          console.log(`Something is already running on port ${port}. Try to kill the process`);
          process.kill(pId, 'SIGHUP')
        }
    } catch (error) {
      console.log('Attempt to terminate process failed');
    }
  }
}

function initPort (port) {
  const { JUPITER_IS_LSOF } = process.env
  if (IS_DEV && JUPITER_IS_LSOF ==='true') {
    KillProcessPortPid(port);
  }
}
module.exports = initPort;
