#!/usr/bin/env node
const path = require('path');
const shelljs = require('shelljs');

const starlingCli = path.resolve(__dirname, '../node_modules/.bin/starling');
const cwd = path.resolve(__dirname, '../jupiter/ini-settings/locales');
shelljs.exec(`${starlingCli} download`, { cwd });
