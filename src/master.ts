import * as cluster from 'cluster';
import * as os from 'os';
import { delay } from '@zcorky/delay';

import { startWorker, Options as WorkerOptions, RequestListener } from './worker';

export interface Options extends WorkerOptions {
  procs?: number;
}

let terminating = false;
// private terminating: boolean;
const canUseCpuRate = 0.75; // do not use all the cpu for safe.

export async function startMaster(requestListener: RequestListener, options: Options) {
  if (cluster.isMaster) {
    console.log(`[master][start] ${process.pid}`);
    const _cpuCount = canUserCpuCount(options);
    for (let i = 0; i < _cpuCount; i += 1) {
      cluster.fork();
    }

    listen();
    return this;
  } else {
    await startWorker(requestListener, options);
  }
}

function cpuCount() {
  return os.cpus().length;
}

function canUserCpuCount(options: Options) {
  return options && options.procs
    || Math.ceil(cpuCount() * canUseCpuRate);
}

function listen() {
  // @cluster master
  listenCluster();
  // @process master
  listenProcess();
}

function terminate() {
  if (terminating) return;

  terminating = true;

  cluster.removeListener('disconnect', onDisconnect);

  Object.keys(cluster.workers).forEach(id => {
    const worker = cluster.workers[id];
    console.log('[master][shutdown] worker: ', worker!.process.pid);
    // worker!.kill('SIGTERM');
    worker!.destroy();
  });

  // exit main with normal terminal
  process.exit(0);
}

function listenCluster() {
  cluster.on('online', worker => {
    console.log(`[worker][online] ${worker.process.pid}`);
  });

  cluster.on('disconnect', onDisconnect);

  cluster.on('exit', (worker: cluster.Worker, code: number, signal: string) => {
    // console.log(`[worker][exit] ${worker.process.pid}`);
    if (code !== 0) {
      cluster.removeListener('disconnect', onDisconnect);
    }
  })
}

function listenProcess() {
  process.on('SIGTERM', terminate);
  process.on('SIGINT', terminate);
}

async function onDisconnect(worker: cluster.Worker) {
  console.log(`[master][exception] worker ${worker.process.pid} diconnect`);
  console.log('[master][start] a new worker ...');
  await delay(300);
  cluster.fork();
}
