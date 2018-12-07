import * as net from 'net';
import * as http from 'http';
import * as cluster from 'cluster';

export interface Options {
  port: number;
  host: string;
  callback: Function;
}

export interface RequestListener {
  (request: http.IncomingMessage, response: http.ServerResponse): void;
}

let server: http.Server | null;
let closing: boolean;

function createServer(requestListener: RequestListener) {
  if (server) {
    return server;
  }

  server = http.createServer();
  server.on('request', requestListener);
  server.maxHeadersCount = 1000;
  server.timeout = 120000;
  return server;
}

export async function startWorker(requestListener: RequestListener, options: Options) {
  const startTime = getStartTime();
  server = createServer(requestListener);
  server.listen(options.port, options.host, async (err: Error) => {
    if (err) throw err;

    console.log(
      '%s listening on port %s, started in %sms',
      'server',
      (server!.address() as net.AddressInfo).port,
      startTime(),
    );

    // monitor process
    await listenProcess();
    // notify listen callback
    await options.callback();
  });
}

export async function closeWorker(code: number) {
  if (closing) return;
  closing = true;

  cluster.worker.disconnect();

  if (server) {
    // @server close and reset
    server.close(() => {
      // close server successfully
      server = null;
    })
  }
}

async function listenProcess() {
  process.on('SIGTERM', () => {
    closeWorker(0);
  });

  process.on('uncaughtException', err => {
    closeWorker(1);

    console.error('[worker]: ', err.stack);
  });
}

/**
 * miniseconds
 */
function getStartTime() {
  const startTime = process.hrtime();
  return () => {
    const timeSinceStart = process.hrtime(startTime);
    const [seconds, nanoSeconds] = timeSinceStart;
    return seconds * 1e3 + nanoSeconds / 1e6;
  };
}
