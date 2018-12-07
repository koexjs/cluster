#!/usr/bin/env node

import { statSync } from 'fs';
import { resolve } from 'path';
import * as commander from 'commander';

const env = process.env;

function makeSureFileExists() {
  const filename = commander.args[0];
  const resolvedFilename = resolve(filename);
  const requirename = require.resolve(resolvedFilename);

  try {
    statSync(requirename);
  } catch (err) {
    console.error('resolved %s to %s then %s', filename, resolvedFilename, requirename);
    console.error('however, %s does not exist', requirename);
    process.exit(1)
  }
}

function getApp(filename: string) {
  const resolvedFilename = resolve(filename);
  const requirename = require.resolve(resolvedFilename);
  const module = require(requirename);
  return module.default || module;
}

function setProcessTitle() {
  if (commander.title) {
    process.title = commander.title;
  }
}

function startCluster() {
  const startMaster = require('../lib/master').startMaster;

  const filename = commander.args[0];
  const app = getApp(filename);
  // console.log('instances: ', commander.instances);

  return startMaster(
    app.callback() as any,
    {
      procs: commander.instances || 0,
      port: parseInt(commander.port) || parseInt(env.PORT!) || 5300,
      host: commander.host || env.HOST || '0.0.0.0',
      callback: () => null,
    },
  );
}

commander
  .usage('<app>')
  .option('-p, --port <str>', 'server port, default 5300')
  .option('-h, --hot <str>', 'server host, default 0.0.0.0')
  .option('-t, --title <str>', 'title of the process')
  .option('-i, --instances <int>', 'number of the instances to user', parseInt)
  .option('-s, --startsecs <int>', 'number of seconds which children needs to'
    + ' stay running to be considered a successfully start [1]', parseInt, 1)
  .parse(process.argv);

// Make sure
makeSureFileExists();

// Set title
setProcessTitle();

// start server
startCluster();
