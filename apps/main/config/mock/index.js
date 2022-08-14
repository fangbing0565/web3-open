const path = require('path');
const fs = require('fs');

let DevMock = {};
if (fs.existsSync(path.join(__dirname, 'base.dev-mock.js'))) {
  DevMock = require('./base.dev-mock');
} else {
  fs.writeFileSync(
    path.join(__dirname, './base.dev-mock.js'),
    'module.exports = {}',
  );
}

const garfishAppListMockFilename = path.join(
  __dirname,
  '../../../../',
  'node_modules/.proxy/proxy-for-sub.json',
);

module.exports = {
  '/api/goofy/get-garfish-app-list': function (req, res) {
    if (fs.existsSync(garfishAppListMockFilename)) {
      res.end(fs.readFileSync(garfishAppListMockFilename));
    } else {
      res.end('{}');
    }
  },
  ...DevMock,
};
